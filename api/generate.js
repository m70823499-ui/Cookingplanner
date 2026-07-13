/* Vercel serverless function: POST /api/generate  { prompt } -> { text }
   Genera la receta desde el servidor, sin exponer ninguna clave al navegador.

   Soporta dos proveedores; usa el primero que esté configurado:
   1) Google Gemini  -> variable GEMINI_API_KEY   (tiene capa GRATUITA)
   2) Anthropic       -> variable ANTHROPIC_API_KEY (de pago)

   Configura una de esas dos en Environment Variables del proyecto en Vercel.
   Si NINGUNA está configurada (o el proveedor falla), esta función devuelve un
   error y el navegador cae automáticamente en el recetario integrado (gratis),
   así que la app nunca se queda sin receta. */

'use strict';

var ANTHROPIC_MODEL = process.env.COOKING_MODEL || 'claude-opus-4-8';
var ANTHROPIC_ENDPOINT = 'https://api.anthropic.com/v1/messages';
var GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

function readBody(req) {
  // Vercel usually pre-parses JSON bodies, but fall back to reading the stream.
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  return new Promise(function (resolve) {
    var raw = '';
    req.on('data', function (c) { raw += c; });
    req.on('end', function () { try { resolve(JSON.parse(raw || '{}')); } catch (e) { resolve({}); } });
    req.on('error', function () { resolve({}); });
  });
}

// --- Google Gemini (free tier) ---
async function callGemini(key, prompt) {
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
    encodeURIComponent(GEMINI_MODEL) + ':generateContent?key=' + encodeURIComponent(key);
  var upstream = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      // Pide JSON directo: la receta viene como objeto sin markdown alrededor.
      generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 2048 }
    })
  });
  var data = await upstream.json();
  if (!upstream.ok) {
    var gmsg = (data && data.error && data.error.message) || ('Error de Gemini (' + upstream.status + ').');
    var e = new Error(gmsg); e.httpStatus = 502; throw e;
  }
  var cand = (data.candidates && data.candidates[0]) || null;
  var parts = (cand && cand.content && cand.content.parts) || [];
  var text = parts.map(function (p) { return p.text || ''; }).join('');
  return text;
}

// --- Anthropic (paid) ---
async function callAnthropic(key, prompt) {
  var upstream = await fetch(ANTHROPIC_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1600,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  var data = await upstream.json();
  if (!upstream.ok) {
    var amsg = (data && data.error && data.error.message) || ('Error de la API (' + upstream.status + ').');
    var e = new Error(amsg); e.httpStatus = 502; throw e;
  }
  var block = (data.content || []).find(function (b) { return b.type === 'text'; });
  return block ? block.text : '';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido.' });
    return;
  }

  var geminiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim();
  var anthropicKey = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim();
  if (!geminiKey && !anthropicKey) {
    // Sin proveedor configurado: el cliente usará el recetario integrado.
    res.status(500).json({ error: 'No hay proveedor de IA configurado (GEMINI_API_KEY o ANTHROPIC_API_KEY).' });
    return;
  }

  var body = await readBody(req);
  var prompt = body && body.prompt;
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Falta el prompt.' });
    return;
  }

  try {
    // Se prefiere Gemini por su capa gratuita; si no está, se usa Anthropic.
    var text = geminiKey ? await callGemini(geminiKey, prompt) : await callAnthropic(anthropicKey, prompt);
    res.status(200).json({ text: text });
  } catch (e) {
    res.status(e && e.httpStatus ? e.httpStatus : 502).json({ error: (e && e.message) || 'No se pudo contactar al proveedor de IA.' });
  }
};
