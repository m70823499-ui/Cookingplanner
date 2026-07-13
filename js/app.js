/* Cooking Planner Personal — Fase 1 app.
   Vanilla-JS port of the handoff prototype (Cooking Planner.dc.html). Same
   state machine, same flows: onboarding -> generate -> interactive recipe
   (adjustable servings, per-step timers) -> log to history. Preferences and
   history persist in localStorage; recipes are generated via the app backend
   (CookingAPI -> /api/generate), so no API key is ever handled in the browser. */
(function () {
  'use strict';

  // ------------------------- config data -------------------------
  var FORMATS = [
    { value: 'pasta', label: 'Pasta', icon: 'wheat' },
    { value: 'sopas', label: 'Sopas', icon: 'utensils' },
    { value: 'mariscos', label: 'Mariscos', icon: 'shrimp' },
    { value: 'arroces', label: 'Arroces', icon: 'leaf' },
    { value: 'comfort food', label: 'Comfort food', icon: 'heart' }
  ];
  var CUISINES = [
    { value: 'italiana', label: 'Italiana', icon: 'wheat' },
    { value: 'mexicana', label: 'Mexicana', icon: 'sparkles' },
    { value: 'asiática', label: 'Asiática', icon: 'fish' },
    { value: 'mediterránea', label: 'Mediterránea', icon: 'leaf' },
    { value: 'americana', label: 'Americana', icon: 'flame' }
  ];
  var SKILLS = [
    { value: 'principiante', label: 'Principiante' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' }
  ];
  var ICON_WHITELIST = ['carrot', 'egg', 'wheat', 'milk', 'shrimp', 'drumstick', 'beef', 'onion', 'leaf', 'cookie', 'candy', 'chef-hat', 'utensils', 'fish', 'flame', 'heart', 'circle-dot'];

  // Optional per-session "time available" filter (minutes; 0 = no limit).
  var TIME_OPTIONS = [
    { label: 'Sin apuro', min: 0 },
    { label: '20 min', min: 20 },
    { label: '30 min', min: 30 },
    { label: '45 min', min: 45 }
  ];
  var MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  var PREFS_KEY = 'cookingPlanner.prefs.v1';
  var HISTORY_KEY = 'cookingPlanner.history.v1';
  var SAVED_KEY = 'cookingPlanner.saved.v1';

  // ------------------------- helpers -------------------------
  function blankDraft() {
    return { spicy: false, fruit: false, formats: [], cuisines: [], skill: 'principiante' };
  }
  function loadJSON(key, fallback) {
    try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch (e) { return fallback; }
  }
  function fmtSeconds(sec) {
    var s = Math.max(0, Math.round(sec));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return (m < 10 ? '0' + m : m) + ':' + (r < 10 ? '0' + r : r);
  }
  function scaledQty(amount, unit, servings, baseServings) {
    var base = baseServings > 0 ? baseServings : 1;
    var scaled = (Number(amount) || 0) * (servings / base);
    var rounded = Math.round(scaled * 4) / 4;
    var trimmed = (Math.round(rounded * 100) / 100).toString();
    return unit ? (trimmed + ' ' + unit) : trimmed;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ------------------------- component builders (HTML strings) -------------------------
  function icon(name, size, color, style) {
    var inner = window.CP_ICONS[name] || window.CP_ICONS['circle-dot'];
    return '<svg role="img" aria-label="' + esc(name) + '" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="' + (color || 'currentColor') +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;display:block;' +
      (style || '') + '">' + inner + '</svg>';
  }
  var BTN_ICON = { sm: 15, md: 17, lg: 19 };
  function button(opts) {
    var size = opts.size || 'md';
    var variant = opts.variant || 'primary';
    var cls = 'cp-btn cp-btn--' + size + ' cp-btn--' + variant + (opts.cls ? ' ' + opts.cls : '');
    var attrs = 'class="' + cls + '"';
    if (opts.action) attrs += ' data-action="' + opts.action + '"';
    if (opts.data) { for (var k in opts.data) attrs += ' data-' + k + '="' + esc(opts.data[k]) + '"'; }
    if (opts.disabled) attrs += ' disabled';
    if (opts.style) attrs += ' style="' + opts.style + '"';
    var ic = opts.icon ? icon(opts.icon, BTN_ICON[size], 'currentColor') : '';
    return '<button ' + attrs + '>' + ic + '<span>' + esc(opts.label) + '</span></button>';
  }
  function iconButton(opts) {
    var size = opts.size || 38;
    var active = !!opts.active;
    var cls = 'cp-iconbtn' + (active ? ' cp-iconbtn--active' : '');
    var attrs = 'class="' + cls + '" aria-label="' + esc(opts.label || opts.name) + '"';
    attrs += ' style="width:' + size + 'px;height:' + size + 'px;' + (opts.hidden ? 'visibility:hidden;' : '') + (opts.style || '') + '"';
    if (opts.action) attrs += ' data-action="' + opts.action + '"';
    if (opts.data) { for (var k in opts.data) attrs += ' data-' + k + '="' + esc(opts.data[k]) + '"'; }
    var col = active ? 'var(--accent-primary)' : 'var(--text-secondary)';
    return '<button ' + attrs + '>' + icon(opts.name, Math.round(size * 0.46), col) + '</button>';
  }
  function badge(opts) {
    var tone = opts.tone || 'neutral';
    var col = ({ neutral: 'var(--text-secondary)', accent: 'var(--accent-primary-hover)', success: 'var(--success)', dark: 'var(--text-on-dark)' })[tone];
    var ic = opts.icon ? icon(opts.icon, 13, col) : '';
    return '<span class="cp-badge cp-badge--' + tone + '">' + ic + esc(opts.label) + '</span>';
  }
  function tag(opts) {
    var cls = 'cp-tag' + (opts.selected ? ' cp-tag--selected' : '');
    var attrs = 'class="' + cls + '"';
    if (opts.action) attrs += ' data-action="' + opts.action + '"';
    if (opts.data) { for (var k in opts.data) attrs += ' data-' + k + '="' + esc(opts.data[k]) + '"'; }
    var ic = opts.icon ? icon(opts.icon, 14, 'currentColor') : '';
    return '<span ' + attrs + '>' + ic + esc(opts.label) + '</span>';
  }

  // ------------------------- state -------------------------
  var state = {
    view: 'onboarding',        // onboarding | editPrefs | home | recipe | history
    prefs: null,
    draft: blankDraft(),
    onboardingError: false,
    history: [],
    recipe: null,
    baseServings: 2,
    servings: 2,
    status: 'idle',            // idle | loading | ready | error
    checked: {},
    timers: {},
    logOpen: false,
    ratingDraft: 0,
    saved: [],                // recipes saved for later (separate from cooking history)
    recipeSource: 'fresh',    // 'fresh' | 'history' | 'saved' — where the shown recipe came from
    craving: '',              // optional per-session "I want something specific" request
    timeLimit: null,          // optional per-session available minutes (null = no limit)
    justCopied: false,        // transient "ingredients copied" feedback
    statsMonth: '',           // 'YYYY-MM' currently shown in the monthly stats
    confirmDelete: null       // { type: 'history', idx } while a delete confirmation is open
  };

  function setState(partial) { Object.assign(state, partial); render(); }
  function persistPrefs(p) { try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch (e) {} }
  function persistHistory(h) { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch (e) {} }
  function persistSaved(s) { try { localStorage.setItem(SAVED_KEY, JSON.stringify(s)); } catch (e) {} }

  // ------------------------- draft field toggles -------------------------
  function toggleFormat(v) {
    var has = state.draft.formats.indexOf(v) !== -1;
    state.draft.formats = has ? state.draft.formats.filter(function (x) { return x !== v; }) : state.draft.formats.concat([v]);
    setState({ onboardingError: false });
  }
  function toggleCuisine(v) {
    var has = state.draft.cuisines.indexOf(v) !== -1;
    state.draft.cuisines = has ? state.draft.cuisines.filter(function (x) { return x !== v; }) : state.draft.cuisines.concat([v]);
    setState({ onboardingError: false });
  }
  function setSkill(v) { state.draft.skill = v; setState({}); }
  function setSpicy(v) { state.draft.spicy = v; setState({}); }
  function setFruit(v) { state.draft.fruit = v; setState({}); }
  function validDraft(d) { return d.formats.length > 0 && d.cuisines.length > 0; }

  function saveForm() {
    if (!validDraft(state.draft)) { setState({ onboardingError: true }); return; }
    var prefs = JSON.parse(JSON.stringify(state.draft));
    persistPrefs(prefs);
    setState({ prefs: prefs, view: 'home', onboardingError: false });
  }
  function openEditPrefs() { setState({ draft: JSON.parse(JSON.stringify(state.prefs)), view: 'editPrefs', onboardingError: false }); }
  function cancelEditPrefs() { setState({ draft: JSON.parse(JSON.stringify(state.prefs)), view: 'home', onboardingError: false }); }
  function goHome() { setState({ view: 'home', craving: '', timeLimit: null }); }
  function setTimeLimit(min) { setState({ timeLimit: min > 0 ? min : null }); }
  function goHistory() { setState({ view: 'history' }); }

  // ------------------------- recipe generation -------------------------
  function startGenerate() {
    var el = document.querySelector('[data-craving]');
    var craving = (el ? el.value : (state.craving || '')).trim();
    setState({ view: 'recipe', status: 'loading', recipe: null, checked: {}, timers: {}, servings: state.baseServings || 2, recipeSource: 'fresh', craving: craving, justCopied: false });
    generateRecipe(false);
  }
  function regenerate() { setState({ status: 'loading', recipe: null, checked: {}, timers: {}, recipeSource: 'fresh' }); generateRecipe(false); }
  function manualRetry() { setState({ status: 'loading' }); generateRecipe(false); }

  function buildPrompt() {
    var p = state.prefs || blankDraft();
    var craving = (state.craving || '').trim();
    var lines = [
      'Genera UNA receta casera en español neutro, en formato JSON estricto (sin markdown, sin comentarios, sin texto fuera del JSON).',
      'Preferencias fijas del usuario (respétalas siempre):',
      '- Picante: ' + (p.spicy ? 'sí, puede llevar picante' : 'NO, nada de picante') + '.',
      '- Fruta en la receta: ' + (p.fruit ? 'permitida' : 'NO incluir fruta como ingrediente') + '.',
      '- Formatos favoritos: ' + p.formats.join(', ') + '.',
      '- Cocinas favoritas: ' + p.cuisines.join(', ') + '.',
      '- Nivel de habilidad: ' + p.skill + ' (pasos claros, trucos prácticos, sin jerga de chef si es principiante).'
    ];
    if (craving) {
      lines.push('Pedido puntual del usuario para HOY: "' + craving + '". Tiene PRIORIDAD sobre la elección de formato y cocina: respétalo aunque implique un formato o una cocina fuera de las favoritas. De todas formas, respeta SIEMPRE lo de picante, fruta y nivel de habilidad.');
      lines.push('Si el pedido puntual no define un formato o una cocina concretos, elige uno de cada lista de favoritas.');
    } else {
      lines.push('Elige un formato y una cocina de esas listas para esta receta puntual.');
    }
    if (state.timeLimit) {
      lines.push('Tiempo disponible: el usuario dispone de unos ' + state.timeLimit + ' minutos en total (preparación + cocción). La receta DEBE caber en ese tiempo y el campo timeMinutes debe ser menor o igual a ' + state.timeLimit + '.');
    }
    lines.push('CALIDAD DE LOS PASOS (lo más importante): la persona es principiante y debe poder cocinar el plato SIN conocimientos previos. Cada "description" tiene que ser clara, completa y autocontenida:');
    lines.push('- Explica CÓMO se hace cada acción, no solo qué hacer. Ejemplos: cómo cortar (forma y tamaño concreto, p. ej. "corta la cebolla en cubos pequeños de ~0,5 cm"); a qué fuego (bajo/medio/alto); cuánto tiempo aproximado; y qué señal buscar (p. ej. "sofríe a fuego medio 5–7 min hasta que esté transparente y suelte aroma, sin que se dore").');
    lines.push('- Incluye cantidades, temperaturas y tiempos concretos cuando importen, y algún truco práctico. Prohibido dejar pasos vagos como "cocina la cebolla" o "sofríe la cebolla" sin explicar el cómo.');
    lines.push('- Si un paso tiene varias acciones, descríbelas en orden dentro de esa misma description. Nada de jerga de chef sin explicar.');
    lines.push('- Usa TODOS los pasos que hagan falta para que quede bien explicado (normalmente entre 5 y 12). Prioriza claridad y completitud por encima de tener pocos pasos.');
    lines.push('Devuelve exactamente este JSON (tipos exactos, sin campos extra):');
    lines.push('{"title": string, "difficulty": "Fácil"|"Intermedio"|"Avanzado", "calories": number, "timeMinutes": number, "baseServings": number, "tags": [string, string], ' +
      '"technique": string (la técnica clave a dominar en esta receta, en 2 a 5 palabras, ej. "risotto cremoso", "sofrito", "masa de pizza"), ' +
      '"ingredients": [{"icon": string (uno de: ' + ICON_WHITELIST.join(',') + '), "label": string, "amount": number, "unit": string}], ' +
      '"steps": [{"title": string (nombre corto del paso), "description": string (instrucción detallada, clara y autocontenida: el cómo, el fuego, el tiempo y la señal a buscar; sin jerga), "waitSeconds": number (0 si el paso no implica espera ni cocción; si implica, poné los segundos reales de esa espera/cocción)}]}');
    lines.push('De 5 a 9 ingredientes y de 5 a 12 pasos, cada paso claro y completo. baseServings entre 2 y 4. Usa español neutro (sin voseo, sin modismos regionales).');
    return lines.join('\n');
  }
  function parseRecipe(text) {
    var clean = (text || '').trim();
    var fence = clean.match(/\{[\s\S]*\}/);
    if (fence) clean = fence[0];
    var data = JSON.parse(clean);
    if (!data.title || !Array.isArray(data.ingredients) || !Array.isArray(data.steps)) throw new Error('shape');
    return data;
  }
  async function generateRecipe(isRetry) {
    try {
      var text = await window.CookingAPI.complete(buildPrompt());
      var data = parseRecipe(text);
      var baseServings = Math.max(1, Math.round(data.baseServings) || 2);
      setState({ recipe: data, baseServings: baseServings, servings: baseServings, status: 'ready', checked: {}, timers: {} });
    } catch (e) {
      if (!isRetry) { generateRecipe(true); return; }
      setState({ status: 'error', errorMsg: (e && e.message) || '' });
    }
  }

  function decServings() { setState({ servings: Math.max(1, state.servings - 1) }); }
  function incServings() { setState({ servings: state.servings + 1 }); }
  function toggleIngredient(i) { state.checked[i] = !state.checked[i]; setState({}); }
  function toggleTimer(i, seconds) {
    var cur = state.timers[i];
    if (!cur) { state.timers[i] = { remaining: seconds, running: true }; }
    else if (cur.remaining <= 0) { state.timers[i] = { remaining: seconds, running: true }; }
    else { state.timers[i] = { remaining: cur.remaining, running: !cur.running }; }
    setState({});
  }

  // ------------------------- log to history -------------------------
  function openLog() { setState({ logOpen: true, ratingDraft: 0 }); }
  function closeLog() { setState({ logOpen: false }); }
  function setRating(n) { setState({ ratingDraft: n }); }
  function saveLog() {
    var noteEl = document.querySelector('[data-note]');
    var note = noteEl ? noteEl.value : '';
    if (state.ratingDraft < 1 || !state.recipe) return;
    var key = normTitle(state.recipe.title);
    var isRepeat = state.history.some(function (h) { return normTitle(h.title) === key; });
    var entry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      title: state.recipe.title,
      rating: state.ratingDraft,
      note: (note || '').trim(),
      isRepeat: isRepeat,
      recipe: JSON.parse(JSON.stringify(state.recipe))  // full recipe, so it can be re-opened later
    };
    var nextHistory = [entry].concat(state.history);
    persistHistory(nextHistory);
    setState({ history: nextHistory, logOpen: false, view: 'home', craving: '', timeLimit: null });
  }

  // Delete a cooked entry from history (behind a confirmation).
  function askRemoveHistory(idx) { setState({ confirmDelete: { type: 'history', idx: idx } }); }
  function cancelConfirm() { setState({ confirmDelete: null }); }
  function doConfirmedDelete() {
    var c = state.confirmDelete;
    if (c && c.type === 'history') {
      var next = state.history.slice();
      next.splice(c.idx, 1);
      persistHistory(next);
      setState({ history: next, confirmDelete: null });
      return;
    }
    setState({ confirmDelete: null });
  }

  // Open a recipe object in the interactive view (adjustable servings + timers).
  function openRecipeObject(recipe, source) {
    var base = Math.max(1, Math.round(recipe.baseServings) || 2);
    setState({ recipe: recipe, baseServings: base, servings: base, status: 'ready', checked: {}, timers: {}, view: 'recipe', recipeSource: source, justCopied: false });
  }

  // --- shopping list: copy the (scaled) ingredients to the clipboard ---
  function ingredientsText() {
    var r = state.recipe;
    if (!r) return '';
    var lines = r.ingredients.map(function (ing) {
      return '- ' + scaledQty(ing.amount, ing.unit, state.servings, state.baseServings) + ' ' + ing.label;
    });
    return r.title + ' (' + state.servings + (state.servings === 1 ? ' porción' : ' porciones') + ')\n\n' + lines.join('\n');
  }
  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    } catch (e) {}
  }
  function copyIngredients() {
    var text = ingredientsText();
    if (!text) return;
    var done = function () {
      setState({ justCopied: true });
      setTimeout(function () { if (state.justCopied) setState({ justCopied: false }); }, 1600);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else { fallbackCopy(text); done(); }
    } catch (e) { fallbackCopy(text); done(); }
  }

  // --- technique video: a YouTube search link that never goes stale ---
  function techniqueURL(recipe) {
    var q = (recipe.technique && String(recipe.technique).trim()) ? ('cómo hacer ' + recipe.technique) : (recipe.title + ' receta paso a paso');
    return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
  }

  // --- monthly stats over the cooking history ---
  function addMonth(ym, delta) {
    var y = parseInt(ym.slice(0, 4), 10);
    var m = parseInt(ym.slice(5, 7), 10) - 1 + delta;
    y += Math.floor(m / 12); m = ((m % 12) + 12) % 12;
    return y + '-' + (m + 1 < 10 ? '0' : '') + (m + 1);
  }
  function monthLabel(ym) { return MESES[parseInt(ym.slice(5, 7), 10) - 1] + ' ' + ym.slice(0, 4); }
  function currentMonth() { return new Date().toISOString().slice(0, 7); }
  function statsFor(ym) {
    var rows = state.history.filter(function (h) { return (h.date || '').slice(0, 7) === ym; });
    var nuevas = rows.filter(function (h) { return !h.isRepeat; }).length;
    var repetidas = rows.length - nuevas;
    var avg = rows.length ? (rows.reduce(function (a, h) { return a + (h.rating || 0); }, 0) / rows.length) : 0;
    return { total: rows.length, nuevas: nuevas, repetidas: repetidas, avg: avg };
  }
  function statsPrev() { setState({ statsMonth: addMonth(state.statsMonth, -1) }); }
  function statsNext() { if (state.statsMonth < currentMonth()) setState({ statsMonth: addMonth(state.statsMonth, 1) }); }
  function openHistoryRecipe(idx) { var h = state.history[idx]; if (h && h.recipe) openRecipeObject(h.recipe, 'history'); }
  function openSavedRecipe(idx) { var s = state.saved[idx]; if (s && s.recipe) openRecipeObject(s.recipe, 'saved'); }

  // ------------------------- saved for later (bookmark) -------------------------
  // Accent- and punctuation-insensitive so "Lasaña" == "lasana", "Tacos al Pastor!" == "tacos al pastor".
  function normTitle(t) {
    return (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function isRecipeSaved(recipe) {
    return !!recipe && state.saved.some(function (s) { return normTitle(s.recipe.title) === normTitle(recipe.title); });
  }
  function toggleSaveCurrent() {
    if (!state.recipe) return;
    var t = normTitle(state.recipe.title);
    var exists = state.saved.some(function (s) { return normTitle(s.recipe.title) === t; });
    var next = exists
      ? state.saved.filter(function (s) { return normTitle(s.recipe.title) !== t; })
      : [{ id: Date.now(), savedDate: new Date().toISOString().slice(0, 10), recipe: JSON.parse(JSON.stringify(state.recipe)) }].concat(state.saved);
    persistSaved(next);
    setState({ saved: next });
  }
  function removeSaved(idx) { var next = state.saved.slice(); next.splice(idx, 1); persistSaved(next); setState({ saved: next }); }
  function goSaved() { setState({ view: 'saved' }); }

  // ------------------------- timers tick -------------------------
  function tick() {
    var changed = false;
    Object.keys(state.timers).forEach(function (k) {
      var t = state.timers[k];
      if (t.running && t.remaining > 0) {
        t.remaining -= 1;
        if (t.remaining <= 0) t.running = false;
        changed = true;
      }
    });
    // Re-render only while actually viewing a recipe (timers only show there)
    // and the log modal isn't open — avoids wiping the saved-search box / note field.
    if (changed && state.view === 'recipe' && !state.logOpen) render();
  }

  // ------------------------- action dispatch -------------------------
  var ACTIONS = {
    'go-home': goHome,
    'go-history': goHistory,
    'open-prefs': openEditPrefs,
    'save-form': saveForm,
    'cancel-prefs': cancelEditPrefs,
    'set-spicy': function (el) { setSpicy(el.getAttribute('data-val') === 'true'); },
    'set-fruit': function (el) { setFruit(el.getAttribute('data-val') === 'true'); },
    'toggle-format': function (el) { toggleFormat(el.getAttribute('data-val')); },
    'toggle-cuisine': function (el) { toggleCuisine(el.getAttribute('data-val')); },
    'set-skill': function (el) { setSkill(el.getAttribute('data-val')); },
    'start-generate': startGenerate,
    'regenerate': regenerate,
    'manual-retry': manualRetry,
    'dec-servings': decServings,
    'inc-servings': incServings,
    'toggle-ing': function (el) { toggleIngredient(Number(el.getAttribute('data-idx'))); },
    'toggle-timer': function (el) { toggleTimer(Number(el.getAttribute('data-idx')), Number(el.getAttribute('data-secs')) || 0); },
    'open-log': openLog,
    'close-log': closeLog,
    'set-rating': function (el) { setRating(Number(el.getAttribute('data-val'))); },
    'save-log': saveLog,
    'go-saved': goSaved,
    'toggle-save': toggleSaveCurrent,
    'view-history': function (el) { openHistoryRecipe(Number(el.getAttribute('data-idx'))); },
    'view-saved': function (el) { openSavedRecipe(Number(el.getAttribute('data-idx'))); },
    'remove-saved': function (el) { removeSaved(Number(el.getAttribute('data-idx'))); },
    'ask-remove-history': function (el) { askRemoveHistory(Number(el.getAttribute('data-idx'))); },
    'cancel-confirm': cancelConfirm,
    'confirm-delete': doConfirmedDelete,
    'set-time': function (el) { setTimeLimit(Number(el.getAttribute('data-min')) || 0); },
    'copy-ingredients': copyIngredients,
    'stats-prev': statsPrev,
    'stats-next': statsNext
  };

  function onClick(e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var fn = ACTIONS[el.getAttribute('data-action')];
    if (fn) { e.preventDefault(); fn(el); }
  }

  // Live filter for the saved-recipes search — filters in-DOM (no re-render,
  // so the input keeps focus while typing).
  function onInput(e) {
    var el = e.target;
    if (!el || !el.matches) return;
    // Keep the craving text in state (no re-render) so re-rendering the home
    // screen (e.g. picking a time chip) doesn't wipe what the user typed.
    if (el.matches('[data-craving]')) { state.craving = el.value; return; }
    if (!el.matches('[data-saved-search]')) return;
    var q = el.value.trim().toLowerCase();
    var cards = document.querySelectorAll('[data-savedcard]');
    var anyVisible = false;
    cards.forEach(function (c) {
      var show = !q || (c.getAttribute('data-hay') || '').indexOf(q) !== -1;
      c.style.display = show ? '' : 'none';
      if (show) anyVisible = true;
    });
    var empty = document.querySelector('[data-saved-empty]');
    if (empty) empty.style.display = anyVisible ? 'none' : 'block';
  }

  // ------------------------- views -------------------------
  function topBar(view) {
    var isHome = view === 'home', isRecipe = view === 'recipe', isHistory = view === 'history', isEditPrefs = view === 'editPrefs', isSaved = view === 'saved';
    if (!(isHome || isRecipe || isHistory || isEditPrefs || isSaved)) return '';
    var backAction = 'go-home';
    if (isRecipe && state.recipeSource === 'history') backAction = 'go-history';
    else if (isRecipe && state.recipeSource === 'saved') backAction = 'go-saved';
    return '<div class="cp-topbar">' +
      iconButton({ name: 'arrow-left', label: 'Volver', action: backAction, hidden: isHome }) +
      '<div class="cp-brand">' + icon('chef-hat', 20, 'var(--accent-primary)') +
      '<span class="cp-brand__name">Cooking Planner</span></div>' +
      iconButton({ name: 'bookmark', label: 'Guardadas', active: isSaved, action: 'go-saved' }) +
      iconButton({ name: 'list', label: 'Historial', active: isHistory, action: 'go-history' }) +
      iconButton({ name: 'settings', label: 'Preferencias', active: isEditPrefs, action: 'open-prefs' }) +
      '</div>';
  }

  function formView(isEditPrefs) {
    var d = state.draft;
    var eyebrow = isEditPrefs ? 'Editar preferencias' : 'Antes de empezar';
    var title = isEditPrefs ? 'Tus preferencias' : 'Cuéntanos qué te gusta cocinar';
    var subtitle = isEditPrefs
      ? 'Cambia lo que necesites; se aplica a la próxima receta que generes.'
      : 'Esto define cada receta que se genere para ti. Puedes editarlo después.';
    var topPad = isEditPrefs ? '4px' : '48px';
    var saveLabel = isEditPrefs ? 'Guardar cambios' : 'Guardar preferencias';

    var spicyRow =
      '<div><div class="cp-field-label">¿Comida picante?</div><div style="display:flex;gap:8px;">' +
      tag({ label: 'Sí', icon: 'flame', selected: d.spicy === true, action: 'set-spicy', data: { val: 'true' } }) +
      tag({ label: 'No', icon: 'x', selected: d.spicy === false, action: 'set-spicy', data: { val: 'false' } }) +
      '</div></div>';
    var fruitRow =
      '<div><div class="cp-field-label">¿Fruta en las recetas?</div><div style="display:flex;gap:8px;">' +
      tag({ label: 'Sí', icon: 'citrus', selected: d.fruit === true, action: 'set-fruit', data: { val: 'true' } }) +
      tag({ label: 'No', icon: 'x', selected: d.fruit === false, action: 'set-fruit', data: { val: 'false' } }) +
      '</div></div>';
    var formatsRow =
      '<div><div class="cp-field-label">Formatos favoritos</div><div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      FORMATS.map(function (f) {
        return tag({ label: f.label, icon: f.icon, selected: d.formats.indexOf(f.value) !== -1, action: 'toggle-format', data: { val: f.value } });
      }).join('') + '</div></div>';
    var cuisinesRow =
      '<div><div class="cp-field-label">Cocinas favoritas</div><div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      CUISINES.map(function (c) {
        return tag({ label: c.label, icon: c.icon, selected: d.cuisines.indexOf(c.value) !== -1, action: 'toggle-cuisine', data: { val: c.value } });
      }).join('') + '</div></div>';
    var skillRow =
      '<div><div class="cp-field-label">Nivel de habilidad</div><div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      SKILLS.map(function (s) {
        return tag({ label: s.label, icon: 'chef-hat', selected: d.skill === s.value, action: 'set-skill', data: { val: s.value } });
      }).join('') + '</div></div>';

    var errorRow = state.onboardingError
      ? '<div style="display:flex;align-items:center;gap:8px;color:var(--accent-secondary-hover);font-size:var(--text-sm);font-weight:600;background:var(--olive-100);border-radius:var(--radius-md);padding:10px 14px;">' +
        icon('alert-triangle', 16, 'var(--accent-secondary-hover)') +
        'Elige al menos un formato y una cocina para continuar.</div>'
      : '';

    var actions = '<div style="display:flex;gap:10px;justify-content:flex-end;">' +
      (isEditPrefs ? button({ label: 'Cancelar', variant: 'secondary', action: 'cancel-prefs' }) : '') +
      button({ label: saveLabel, variant: 'primary', size: 'lg', icon: 'check', action: 'save-form' }) +
      '</div>';

    return '<div class="cp-fade" style="max-width:640px;margin:0 auto;padding:' + topPad + ' 28px 80px;">' +
      '<div style="margin-bottom:28px;">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">' +
      icon('sparkles', 18, 'var(--accent-primary)') + '<span class="cp-eyebrow">' + eyebrow + '</span></div>' +
      '<h1 style="font-size:var(--text-3xl);margin:0 0 8px;">' + esc(title) + '</h1>' +
      '<p style="font-family:var(--font-body);font-size:var(--text-base);color:var(--text-secondary);margin:0;line-height:var(--leading-normal);">' + esc(subtitle) + '</p>' +
      '</div>' +
      '<div class="cp-card">' + spicyRow + fruitRow + formatsRow + cuisinesRow + skillRow + errorRow + actions + '</div>' +
      '</div>';
  }

  function homeView() {
    var count = state.history.length;
    var label = count === 0 ? 'Sin recetas registradas todavía' : (count + (count === 1 ? ' receta cocinada' : ' recetas cocinadas'));
    return '<div class="cp-fade" style="max-width:640px;margin:0 auto;padding:24px 28px 40px;text-align:center;">' +
      '<div style="margin:40px 0 30px;">' +
      icon('chef-hat', 46, 'var(--accent-primary)') +
      '<h1 style="font-size:var(--text-3xl);margin:16px 0 10px;">¿Qué cocinamos hoy?</h1>' +
      '<p style="font-family:var(--font-body);font-size:var(--text-base);color:var(--text-secondary);max-width:420px;margin:0 auto;line-height:var(--leading-normal);">Genera una receta nueva ajustada a tus gustos, sin límites de un plan pago.</p>' +
      '</div>' +
      '<div style="max-width:420px;margin:0 auto 18px;text-align:left;">' +
        '<div style="display:flex;align-items:center;gap:8px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-pill);padding:11px 16px;box-shadow:var(--shadow-xs);">' +
          icon('sparkles', 16, 'var(--text-muted)') +
          '<input data-craving type="text" autocomplete="off" placeholder="¿Se te antoja algo en específico? (opcional)" value="' + esc(state.craving || '') + '" style="border:none;outline:none;background:transparent;flex:1;font-family:var(--font-body);font-size:var(--text-sm);color:var(--text-primary);" />' +
        '</div>' +
        '<div style="font-family:var(--font-body);font-size:var(--text-xs);color:var(--text-muted);margin-top:8px;text-align:center;">Déjalo vacío y te recomiendo según tus gustos.</div>' +
        '<div style="display:flex;align-items:center;gap:8px;margin-top:14px;flex-wrap:wrap;justify-content:center;">' +
          '<span style="font-family:var(--font-body);font-size:var(--text-sm);color:var(--text-secondary);width:100%;text-align:center;margin-bottom:2px;">¿Cuánto tiempo tienes?</span>' +
          TIME_OPTIONS.map(function (o) {
            var selected = (o.min === 0) ? (state.timeLimit == null) : (state.timeLimit === o.min);
            return tag({ label: o.label, icon: o.min === 0 ? 'sparkles' : 'clock', selected: selected, action: 'set-time', data: { min: o.min } });
          }).join('') +
        '</div>' +
      '</div>' +
      button({ label: 'Generar receta', variant: 'primary', size: 'lg', icon: 'sparkles', action: 'start-generate', style: 'width:100%;max-width:360px;margin:0 auto;' }) +
      '<div style="display:flex;gap:10px;justify-content:center;margin-top:32px;flex-wrap:wrap;">' +
      '<div class="cp-pill">' + icon('list', 15, 'var(--accent-secondary)') + '<span>' + esc(label) + '</span></div></div>' +
      '</div>';
  }

  function recipeView() {
    var inner = '';
    if (state.status === 'loading') {
      inner = '<div style="display:flex;flex-direction:column;align-items:center;gap:18px;padding:100px 20px;">' +
        '<div class="cp-spinner"></div>' +
        '<span style="font-family:var(--font-body);font-weight:600;color:var(--text-secondary);">Generando tu receta…</span></div>';
    } else if (state.status === 'error') {
      var detail = state.errorMsg && state.errorMsg !== 'network'
        ? esc(state.errorMsg)
        : 'Revisa tu conexión e intenta de nuevo.';
      inner = '<div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:90px 20px;text-align:center;">' +
        icon('alert-triangle', 34, 'var(--accent-secondary-hover)') +
        '<div><div style="font-family:var(--font-display);font-size:var(--text-lg);margin-bottom:6px;">No se pudo generar la receta</div>' +
        '<div style="font-family:var(--font-body);color:var(--text-muted);font-size:var(--text-sm);max-width:360px;">' + detail + '</div></div>' +
        button({ label: 'Reintentar', variant: 'primary', icon: 'refresh-cw', action: 'manual-retry' }) + '</div>';
    } else if (state.status === 'ready' && state.recipe) {
      inner = recipeReady();
    }
    return '<div class="cp-fade" style="max-width:720px;margin:0 auto;padding:8px 28px 120px;">' + inner + '</div>';
  }

  function recipeReady() {
    var r = state.recipe;
    var tagsHtml = (r.tags || []).map(function (t) { return badge({ label: t, tone: 'neutral' }); }).join('');
    var bookmarkBtn = (state.recipeSource === 'fresh')
      ? iconButton({ name: 'bookmark', size: 38, label: 'Guardar para después', active: isRecipeSaved(r), action: 'toggle-save' })
      : '';
    var badges = '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:14px;">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
      badge({ label: r.difficulty || '', tone: 'accent', icon: 'chef-hat' }) + tagsHtml + '</div>' +
      bookmarkBtn + '</div>';

    var stats = [
      { icon: 'flame', value: r.calories, label: 'Calorías' },
      { icon: 'clock', value: r.timeMinutes + ' min', label: 'Prep + cocción' },
      { icon: 'users', value: state.servings, label: 'Porciones' }
    ];
    var statsBar = '<div class="cp-statsbar" style="margin-bottom:28px;">' + stats.map(function (s) {
      return '<div class="cp-stat">' + icon(s.icon, 16, 'var(--slate-700)') +
        '<div class="cp-stat__col"><span class="cp-stat__v">' + esc(s.value) + '</span>' +
        '<span class="cp-stat__l">' + esc(s.label) + '</span></div></div>';
    }).join('') + '</div>';

    var servingsLabel = state.servings + (state.servings === 1 ? ' porción' : ' porciones');
    var ingHeader = '<div style="display:flex;align-items:center;justify-content:space-between;margin:28px 0 10px;">' +
      '<div style="display:flex;align-items:center;gap:8px;">' + icon('utensils', 17, 'var(--accent-primary)') +
      '<h3 style="font-size:var(--text-xl);margin:0;">Ingredientes</h3></div>' +
      '<div style="display:flex;align-items:center;gap:10px;">' +
      iconButton({ name: 'minus', size: 32, label: 'Menos porciones', action: 'dec-servings' }) +
      '<span style="font-family:var(--font-display);font-weight:700;font-size:var(--text-md);min-width:70px;text-align:center;">' + esc(servingsLabel) + '</span>' +
      iconButton({ name: 'plus', size: 32, label: 'Más porciones', action: 'inc-servings' }) +
      '</div></div>';

    var ingRows = r.ingredients.map(function (ing, i) {
      var ic = ICON_WHITELIST.indexOf(ing.icon) !== -1 ? ing.icon : 'circle-dot';
      var qty = scaledQty(ing.amount, ing.unit, state.servings, state.baseServings);
      var checked = !!state.checked[i];
      var check = '<div class="cp-ing__check">' + (checked ? icon('check', 13, 'var(--white)') : '') + '</div>';
      return '<div class="cp-ing' + (checked ? ' cp-ing--checked' : '') + '" data-action="toggle-ing" data-idx="' + i + '">' +
        check + icon(ic, 18, 'var(--slate-500)') +
        '<span class="cp-ing__label">' + esc(ing.label) + '</span>' +
        '<span class="cp-ing__qty">' + esc(qty) + '</span></div>';
    }).join('');
    var ingredients = ingHeader +
      '<div style="margin-bottom:12px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:4px 14px;">' +
      ingRows + '</div>' +
      '<div style="margin-bottom:32px;">' +
      button({ label: state.justCopied ? '¡Copiado!' : 'Copiar ingredientes', variant: 'secondary', size: 'sm', icon: state.justCopied ? 'check' : 'list', action: 'copy-ingredients' }) +
      '</div>';

    var stepsHeader = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">' +
      icon('list', 17, 'var(--accent-primary)') + '<h3 style="font-size:var(--text-xl);margin:0;">Instrucciones</h3></div>';
    var lastIdx = r.steps.length - 1;
    var stepsHtml = r.steps.map(function (st, i) {
      var isLast = i === lastIdx;
      var hasTimer = Number(st.waitSeconds) > 0;
      var timer = state.timers[i];
      var remaining = timer ? timer.remaining : Number(st.waitSeconds) || 0;
      var running = timer ? timer.running : false;
      var done = hasTimer && timer && timer.remaining <= 0;
      var timerBlock = '';
      if (hasTimer) {
        var tcolor = done ? 'var(--success)' : 'var(--accent-primary)';
        var btnVariant = running ? 'secondary' : 'primary';
        var btnLabel = done ? 'Listo' : (running ? 'Pausar' : (timer ? 'Reanudar' : 'Iniciar'));
        timerBlock = '<div class="cp-timer">' + icon('timer', 16, tcolor) +
          '<span class="cp-timer__val" style="color:' + tcolor + ';">' + fmtSeconds(remaining) + '</span>' +
          button({ label: btnLabel, variant: btnVariant, size: 'sm', action: 'toggle-timer', data: { idx: i, secs: Number(st.waitSeconds) || 0 } }) +
          '</div>';
      }
      return '<div class="cp-step">' +
        '<div class="cp-step__rail"><div class="cp-step__num">' + (i + 1) + '</div>' +
        (isLast ? '' : '<div class="cp-step__line"></div>') + '</div>' +
        '<div style="padding-bottom:' + (isLast ? '0' : '28px') + ';flex:1;">' +
        '<h4 class="cp-step__title">' + esc(st.title) + '</h4>' +
        '<p class="cp-step__desc">' + esc(st.description) + '</p>' + timerBlock + '</div></div>';
    }).join('');
    var steps = stepsHeader + '<div style="margin-bottom:20px;">' + stepsHtml + '</div>';

    var technique = '<a href="' + esc(techniqueURL(r)) + '" target="_blank" rel="noopener" class="cp-btn cp-btn--secondary cp-btn--md" style="text-decoration:none;margin-bottom:32px;">' +
      icon('search', 17, 'currentColor') +
      '<span>Ver la técnica en YouTube' + (r.technique ? ': ' + esc(r.technique) : '') + '</span></a>';

    var actionBar;
    if (state.recipeSource === 'history') {
      actionBar = '<div class="cp-actionbar">' +
        button({ label: 'Volver al historial', variant: 'secondary', icon: 'arrow-left', action: 'go-history', style: 'flex:1;max-width:320px;' }) +
        button({ label: 'Registrar de nuevo', variant: 'primary', icon: 'check', action: 'open-log', style: 'flex:1;max-width:320px;' }) +
        '</div>';
    } else if (state.recipeSource === 'saved') {
      actionBar = '<div class="cp-actionbar">' +
        button({ label: 'Quitar de guardadas', variant: 'secondary', icon: 'x', action: 'toggle-save', style: 'flex:1;max-width:320px;' }) +
        button({ label: 'Ya la cociné', variant: 'primary', icon: 'check', action: 'open-log', style: 'flex:1;max-width:320px;' }) +
        '</div>';
    } else {
      actionBar = '<div class="cp-actionbar">' +
        button({ label: 'No me convence, otra', variant: 'secondary', icon: 'refresh-cw', action: 'regenerate', style: 'flex:1;max-width:320px;' }) +
        button({ label: 'Ya la cociné', variant: 'primary', icon: 'check', action: 'open-log', style: 'flex:1;max-width:320px;' }) +
        '</div>';
    }

    return badges + '<h1 style="font-size:var(--text-3xl);margin:0 0 18px;">' + esc(r.title) + '</h1>' +
      statsBar + ingredients + steps + technique + actionBar;
  }

  function historyView() {
    var count = state.history.length;
    var countLabel = count === 0 ? 'Sin recetas registradas todavía' : (count + (count === 1 ? ' receta cocinada' : ' recetas cocinadas'));
    var body;
    if (count === 0) {
      body = '<div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:70px 20px;color:var(--text-muted);text-align:center;">' +
        icon('list', 28, 'var(--text-muted)') +
        'Todavía no has cocinado nada registrado. Genera una receta y confírmalo cuando la cocines.</div>';
    } else {
      body = state.history.map(function (h, i) {
        var starsHtml = [1, 2, 3, 4, 5].map(function (n) {
          var on = n <= h.rating;
          return icon('star', 14, on ? 'var(--accent-primary)' : 'var(--border-strong)', on ? 'fill:var(--accent-primary);' : '');
        }).join('');
        var note = h.note ? '<p style="margin:6px 0 0;font-family:var(--font-body);font-size:var(--text-sm);color:var(--text-secondary);line-height:var(--leading-normal);">' + esc(h.note) + '</p>' : '';
        var viewBtn = h.recipe
          ? '<div style="margin-top:12px;">' + button({ label: 'Ver receta', variant: 'secondary', size: 'sm', icon: 'list', action: 'view-history', data: { idx: i } }) + '</div>'
          : '';
        return '<div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:16px 18px;margin-bottom:12px;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px;">' +
          '<span style="font-family:var(--font-display);font-size:var(--text-md);font-weight:700;">' + esc(h.title) + '</span>' +
          '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">' +
          badge({ label: h.isRepeat ? 'Repetida' : 'Nueva', tone: h.isRepeat ? 'neutral' : 'accent' }) +
          iconButton({ name: 'x', size: 28, label: 'Borrar del historial', action: 'ask-remove-history', data: { idx: i } }) +
          '</div></div>' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">' +
          '<div style="display:flex;gap:2px;">' + starsHtml + '</div>' +
          '<span style="font-family:var(--font-body);font-size:var(--text-xs);color:var(--text-muted);">' + esc(h.date) + '</span></div>' +
          note + viewBtn + '</div>';
      }).join('');
    }
    return '<div class="cp-fade" style="max-width:640px;margin:0 auto;padding:24px 28px 40px;">' +
      '<h1 style="font-size:var(--text-3xl);margin:0 0 6px;">Historial</h1>' +
      '<p style="font-family:var(--font-body);color:var(--text-secondary);margin:0 0 24px;">' + esc(countLabel) + '</p>' +
      (count > 0 ? statsCard() : '') +
      body + '</div>';
  }

  // Monthly stats over the history (KPI tiles + month stepper).
  function statsCard() {
    var ym = state.statsMonth || currentMonth();
    var s = statsFor(ym);
    var atCurrent = ym >= currentMonth();
    var tile = function (value, label) {
      return '<div class="cp-stat" style="flex:1;justify-content:center;min-width:0;">' +
        '<div class="cp-stat__col" style="align-items:center;text-align:center;">' +
        '<span class="cp-stat__v">' + esc(value) + '</span>' +
        '<span class="cp-stat__l">' + esc(label) + '</span></div></div>';
    };
    var header = '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;">' +
      iconButton({ name: 'chevron-left', size: 32, label: 'Mes anterior', action: 'stats-prev' }) +
      '<span style="font-family:var(--font-display);font-weight:700;font-size:var(--text-md);">' + esc(monthLabel(ym)) + '</span>' +
      iconButton({ name: 'chevron-right', size: 32, label: 'Mes siguiente', action: 'stats-next', style: atCurrent ? 'opacity:0.35;pointer-events:none;' : '' }) +
      '</div>';
    var tiles = s.total === 0
      ? '<div style="text-align:center;color:var(--text-muted);font-family:var(--font-body);font-size:var(--text-sm);padding:8px 0;">Sin recetas cocinadas este mes.</div>'
      : '<div style="display:flex;gap:10px;">' +
          tile(s.total, s.total === 1 ? 'Cocinada' : 'Cocinadas') +
          tile(s.nuevas + '/' + s.repetidas, 'Nueva/Repet.') +
          tile(s.avg.toFixed(1), 'Rating prom.') +
        '</div>';
    return '<div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:16px 18px;margin-bottom:20px;">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">' +
      icon('calendar', 16, 'var(--accent-primary)') +
      '<span class="cp-eyebrow">Este mes</span></div>' +
      header + tiles + '</div>';
  }

  function savedListView() {
    var count = state.saved.length;
    var countLabel = count === 0 ? 'Sin recetas guardadas' : (count + (count === 1 ? ' receta guardada' : ' recetas guardadas'));
    var searchBox = count > 0
      ? '<div style="display:flex;align-items:center;gap:8px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-pill);padding:10px 16px;margin-bottom:20px;box-shadow:var(--shadow-xs);">' +
        icon('search', 16, 'var(--text-muted)') +
        '<input data-saved-search type="text" placeholder="Buscar por nombre o cocina" autocomplete="off" spellcheck="false" style="border:none;outline:none;background:transparent;flex:1;font-family:var(--font-body);font-size:var(--text-sm);color:var(--text-primary);" />' +
        '</div>'
      : '';
    var body;
    if (count === 0) {
      body = '<div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:70px 20px;color:var(--text-muted);text-align:center;">' +
        icon('bookmark', 28, 'var(--text-muted)') +
        'No tienes recetas guardadas. Cuando generes una que te interese pero no vayas a cocinar ahora, toca el marcador para guardarla y cocinarla después.</div>';
    } else {
      var cards = state.saved.map(function (s, i) {
        var r = s.recipe;
        var tagsHtml = badge({ label: r.difficulty || '', tone: 'accent', icon: 'chef-hat' }) +
          (r.tags || []).map(function (t) { return badge({ label: t, tone: 'neutral' }); }).join('');
        var hay = normTitle(r.title) + ' ' + (r.tags || []).join(' ').toLowerCase();
        return '<div data-savedcard data-hay="' + esc(hay) + '" style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:16px 18px;margin-bottom:12px;">' +
          '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px;">' +
          '<span style="font-family:var(--font-display);font-size:var(--text-md);font-weight:700;">' + esc(r.title) + '</span>' +
          iconButton({ name: 'x', size: 30, label: 'Quitar de guardadas', action: 'remove-saved', data: { idx: i } }) + '</div>' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">' + tagsHtml + '</div>' +
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">' +
          button({ label: 'Cocinar', variant: 'primary', size: 'sm', icon: 'utensils', action: 'view-saved', data: { idx: i } }) +
          '<span style="font-family:var(--font-body);font-size:var(--text-xs);color:var(--text-muted);">Guardada ' + esc(s.savedDate) + '</span>' +
          '</div></div>';
      }).join('');
      body = cards +
        '<div data-saved-empty style="display:none;padding:40px 20px;text-align:center;color:var(--text-muted);font-family:var(--font-body);">Ninguna receta coincide con tu búsqueda.</div>';
    }
    return '<div class="cp-fade" style="max-width:640px;margin:0 auto;padding:24px 28px 40px;">' +
      '<h1 style="font-size:var(--text-3xl);margin:0 0 6px;">Guardadas</h1>' +
      '<p style="font-family:var(--font-body);color:var(--text-secondary);margin:0 0 24px;">' + esc(countLabel) + '</p>' +
      searchBox + body + '</div>';
  }

  function logModal() {
    if (!state.logOpen) return '';
    var stars = [1, 2, 3, 4, 5].map(function (n) {
      return iconButton({ name: 'star', size: 42, active: n <= state.ratingDraft, action: 'set-rating', data: { val: n } });
    }).join('');
    return '<div class="cp-overlay"><div class="cp-modal">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">' +
      '<h3 style="font-size:var(--text-xl);margin:0;">¿Cómo salió?</h3>' +
      iconButton({ name: 'x', size: 32, label: 'Cerrar', action: 'close-log' }) + '</div>' +
      '<p style="font-family:var(--font-body);color:var(--text-secondary);margin:0 0 18px;font-size:var(--text-sm);">' + esc(state.recipe ? state.recipe.title : '') + '</p>' +
      '<div style="display:flex;gap:8px;margin-bottom:18px;">' + stars + '</div>' +
      '<div style="margin-bottom:20px;">' +
      '<label style="font-family:var(--font-body);font-weight:700;font-size:var(--text-sm);color:var(--text-secondary);display:block;margin-bottom:8px;">Observación (opcional)</label>' +
      '<textarea class="cp-textarea" data-note placeholder="¿Qué cambiarías? ¿Cómo te quedó?"></textarea></div>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end;">' +
      button({ label: 'Cancelar', variant: 'secondary', action: 'close-log' }) +
      button({ label: 'Guardar en historial', variant: 'primary', icon: 'check', action: 'save-log', disabled: state.ratingDraft < 1 }) +
      '</div></div></div>';
  }

  function confirmModal() {
    if (!state.confirmDelete) return '';
    return '<div class="cp-overlay"><div class="cp-modal">' +
      '<h3 style="font-size:var(--text-xl);margin:0 0 8px;">¿Borrar del historial?</h3>' +
      '<p style="font-family:var(--font-body);color:var(--text-secondary);margin:0 0 20px;font-size:var(--text-sm);line-height:var(--leading-normal);">Se quitará este registro de lo que cocinaste. No se puede deshacer.</p>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end;">' +
      button({ label: 'Cancelar', variant: 'secondary', action: 'cancel-confirm' }) +
      button({ label: 'Borrar', variant: 'primary', icon: 'x', action: 'confirm-delete' }) +
      '</div></div></div>';
  }

  // ------------------------- render -------------------------
  function render() {
    var view = state.view;
    var main = '';
    if (view === 'onboarding') main = formView(false);
    else if (view === 'editPrefs') main = formView(true);
    else if (view === 'home') main = homeView();
    else if (view === 'recipe') main = recipeView();
    else if (view === 'history') main = historyView();
    else if (view === 'saved') main = savedListView();

    document.getElementById('app').innerHTML = topBar(view) + main + logModal() + confirmModal();
  }

  // ------------------------- boot -------------------------
  function init() {
    var prefs = loadJSON(PREFS_KEY, null);
    var history = loadJSON(HISTORY_KEY, []);
    var saved = loadJSON(SAVED_KEY, []);
    state.prefs = prefs;
    state.history = Array.isArray(history) ? history : [];
    state.saved = Array.isArray(saved) ? saved : [];
    state.statsMonth = currentMonth();
    state.view = prefs ? 'home' : 'onboarding';
    state.draft = prefs ? JSON.parse(JSON.stringify(prefs)) : blankDraft();
    var app = document.getElementById('app');
    app.addEventListener('click', onClick);
    app.addEventListener('input', onInput);
    setInterval(tick, 1000);
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
