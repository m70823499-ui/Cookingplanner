/* Recetario integrado (gratis, sin API).
   Recetas listas con la MISMA forma que produce la IA (title, difficulty,
   calories, timeMinutes, baseServings, tags, technique, ingredients, steps).
   Los campos con guion bajo (_meal, _spicy, _fruit, _kw) son solo metadatos
   para elegir una receta acorde a lo que pide el usuario; la app no los
   muestra. Se usa como respaldo cuando no hay API configurada (o falla), para
   que la app SIEMPRE entregue una receta real y sin costo.

   Íconos válidos (ICON_WHITELIST en app.js): carrot, egg, wheat, milk, shrimp,
   drumstick, beef, onion, leaf, cookie, candy, chef-hat, utensils, fish,
   flame, heart, circle-dot. */
(function () {
  'use strict';

  var RECIPES = [
    {
      _meal: ['desayuno'], _spicy: false, _fruit: false,
      _kw: ['huevo', 'huevos', 'revueltos', 'rapido', 'proteina', 'americano'],
      title: 'Huevos revueltos cremosos',
      difficulty: 'Fácil', calories: 280, timeMinutes: 12, baseServings: 2,
      tags: ['Rápido', 'Desayuno'],
      technique: 'huevos revueltos',
      ingredients: [
        { icon: 'egg', label: 'Huevos', amount: 4, unit: 'u' },
        { icon: 'milk', label: 'Leche', amount: 30, unit: 'ml' },
        { icon: 'milk', label: 'Mantequilla', amount: 15, unit: 'g' },
        { icon: 'circle-dot', label: 'Sal', amount: 1, unit: 'pizca' },
        { icon: 'circle-dot', label: 'Pimienta', amount: 1, unit: 'pizca' },
        { icon: 'wheat', label: 'Pan para acompañar', amount: 2, unit: 'rebanadas' }
      ],
      steps: [
        { title: 'Bate los huevos', description: 'Casca los 4 huevos en un bol. Agrega la leche, una pizca de sal y otra de pimienta. Bátelos con un tenedor unos 30 segundos, hasta que el color quede parejo y sin hilos de clara; así quedan más esponjosos.', waitSeconds: 0 },
        { title: 'Calienta la sartén', description: 'Pon una sartén antiadherente a fuego BAJO (importante: bajo, no medio, para que no se cocinen de golpe). Agrega la mantequilla y muévela para cubrir el fondo hasta que se derrita, sin dejar que se dore.', waitSeconds: 60 },
        { title: 'Vierte y espera', description: 'Vierte los huevos batidos. Déjalos quietos unos 20 segundos, hasta que empiecen a cuajar apenas en los bordes.', waitSeconds: 20 },
        { title: 'Remueve suave', description: 'Con una espátula, empuja los huevos del borde hacia el centro con movimientos lentos, formando pliegues grandes. Repite cada pocos segundos. Verás que se forman cuajos cremosos.', waitSeconds: 60 },
        { title: 'Retira antes de tiempo', description: 'Cuando aún se vean un poco brillantes y húmedos (no secos), apaga el fuego y retíralos de inmediato: el calor de la sartén termina de cocinarlos. Este es el truco para que queden cremosos y no gomosos.', waitSeconds: 0 },
        { title: 'Sirve', description: 'Sírvelos enseguida sobre el pan (puedes tostarlo antes en la misma sartén). Ajusta sal si hace falta.', waitSeconds: 0 }
      ]
    },
    {
      _meal: ['desayuno', 'snack'], _spicy: false, _fruit: false,
      _kw: ['avena', 'dulce', 'canela', 'rapido', 'reconfortante', 'sano'],
      title: 'Avena cremosa con canela',
      difficulty: 'Fácil', calories: 250, timeMinutes: 10, baseServings: 2,
      tags: ['Rápido', 'Reconfortante'],
      technique: 'avena en olla',
      ingredients: [
        { icon: 'wheat', label: 'Avena en hojuelas', amount: 100, unit: 'g' },
        { icon: 'milk', label: 'Leche', amount: 300, unit: 'ml' },
        { icon: 'circle-dot', label: 'Agua', amount: 100, unit: 'ml' },
        { icon: 'circle-dot', label: 'Canela en polvo', amount: 1, unit: 'cdta' },
        { icon: 'circle-dot', label: 'Miel o azúcar', amount: 1, unit: 'cda' },
        { icon: 'circle-dot', label: 'Sal', amount: 1, unit: 'pizca' }
      ],
      steps: [
        { title: 'Junta los líquidos', description: 'En una olla pequeña pon la leche, el agua y una pizca de sal (la sal realza el sabor, no la vas a notar salada). Ponla a fuego medio.', waitSeconds: 0 },
        { title: 'Agrega la avena', description: 'Cuando empiece a humear pero antes de que hierva, echa la avena y la canela. Revuelve para que no se pegue al fondo.', waitSeconds: 120 },
        { title: 'Cocina revolviendo', description: 'Baja a fuego medio-bajo y cocina de 4 a 5 minutos revolviendo cada tanto, hasta que la avena se ablande y la mezcla espese a una textura cremosa. Si queda muy espesa, añade un chorrito de leche.', waitSeconds: 270 },
        { title: 'Endulza', description: 'Apaga el fuego y agrega la miel o el azúcar. Revuelve y prueba: ajusta el dulzor a tu gusto.', waitSeconds: 0 },
        { title: 'Reposa y sirve', description: 'Deja reposar 1 minuto (sigue espesando fuera del fuego) y sirve caliente. Puedes espolvorear un poco más de canela por encima.', waitSeconds: 60 }
      ]
    },
    {
      _meal: ['almuerzo', 'cena'], _spicy: false, _fruit: false,
      _kw: ['pasta', 'tomate', 'italiana', 'pomodoro', 'salsa', 'vegetariano', 'espagueti'],
      title: 'Pasta al pomodoro',
      difficulty: 'Fácil', calories: 480, timeMinutes: 25, baseServings: 2,
      tags: ['Italiana', 'Vegetariano'],
      technique: 'salsa de tomate',
      ingredients: [
        { icon: 'wheat', label: 'Pasta (espagueti o similar)', amount: 200, unit: 'g' },
        { icon: 'circle-dot', label: 'Tomate triturado', amount: 400, unit: 'g' },
        { icon: 'onion', label: 'Ajo', amount: 2, unit: 'dientes' },
        { icon: 'circle-dot', label: 'Aceite de oliva', amount: 2, unit: 'cda' },
        { icon: 'leaf', label: 'Albahaca (o orégano)', amount: 1, unit: 'puñado' },
        { icon: 'circle-dot', label: 'Sal', amount: 1, unit: 'cdta' },
        { icon: 'circle-dot', label: 'Azúcar', amount: 1, unit: 'pizca' }
      ],
      steps: [
        { title: 'Pon a hervir el agua', description: 'Llena una olla grande con agua, agrega 1 cucharadita de sal y ponla a fuego alto hasta que rompa a hervir. El agua con sal es lo que le da sabor a la pasta.', waitSeconds: 480 },
        { title: 'Sofríe el ajo', description: 'Mientras hierve el agua, pela y pica los 2 dientes de ajo bien finos. En una sartén amplia calienta el aceite a fuego medio-bajo y agrega el ajo. Sofríe 1 a 2 minutos, solo hasta que esté fragante y apenas dorado (si se quema, amarga: retíralo del fuego si hace falta).', waitSeconds: 90 },
        { title: 'Agrega el tomate', description: 'Echa el tomate triturado con cuidado (salpica). Agrega una pizca de sal y una pizca de azúcar (corta la acidez del tomate). Sube a fuego medio.', waitSeconds: 0 },
        { title: 'Cocina la salsa', description: 'Deja que la salsa borbotee suavemente de 10 a 12 minutos, revolviendo cada tanto, hasta que espese y el color se vuelva más oscuro e intenso. Debe dejar rastro al pasar la cuchara.', waitSeconds: 660 },
        { title: 'Cocina la pasta', description: 'Cuando el agua hierva, echa la pasta y cocínala el tiempo que diga el paquete (normalmente 9-11 min) hasta que esté "al dente": tierna pero con una leve resistencia al morder. Antes de colarla, guarda medio vaso del agua de cocción.', waitSeconds: 600 },
        { title: 'Une todo', description: 'Cuela la pasta y pásala a la sartén con la salsa. Mezcla bien 1 minuto a fuego bajo; si queda seca, añade un chorrito del agua reservada para que la salsa se pegue a la pasta.', waitSeconds: 60 },
        { title: 'Termina con albahaca', description: 'Apaga el fuego, agrega la albahaca troceada con la mano y un chorrito de aceite de oliva crudo. Mezcla y sirve enseguida.', waitSeconds: 0 }
      ]
    },
    {
      _meal: ['almuerzo', 'cena'], _spicy: false, _fruit: false,
      _kw: ['arroz', 'pollo', 'guiso', 'completo', 'familiar', 'reconfortante'],
      title: 'Arroz con pollo sencillo',
      difficulty: 'Intermedio', calories: 560, timeMinutes: 45, baseServings: 4,
      tags: ['Reconfortante', 'Plato único'],
      technique: 'sofrito y arroz',
      ingredients: [
        { icon: 'drumstick', label: 'Muslos de pollo', amount: 4, unit: 'u' },
        { icon: 'wheat', label: 'Arroz', amount: 300, unit: 'g' },
        { icon: 'onion', label: 'Cebolla', amount: 1, unit: 'u' },
        { icon: 'carrot', label: 'Zanahoria', amount: 1, unit: 'u' },
        { icon: 'onion', label: 'Ajo', amount: 2, unit: 'dientes' },
        { icon: 'circle-dot', label: 'Caldo o agua', amount: 700, unit: 'ml' },
        { icon: 'circle-dot', label: 'Aceite', amount: 2, unit: 'cda' },
        { icon: 'circle-dot', label: 'Sal y pimienta', amount: 1, unit: 'al gusto' }
      ],
      steps: [
        { title: 'Prepara los ingredientes', description: 'Pica la cebolla en cubos pequeños (~0,5 cm), ralla o pica fina la zanahoria y pica los ajos. Salpimienta los muslos de pollo por ambos lados.', waitSeconds: 0 },
        { title: 'Dora el pollo', description: 'En una olla ancha calienta el aceite a fuego medio-alto. Coloca los muslos con la piel hacia abajo y dóralos 3-4 minutos por lado, sin moverlos, hasta que tomen color dorado. No es para cocinarlos del todo, solo para sellar sabor. Retíralos a un plato.', waitSeconds: 420 },
        { title: 'Haz el sofrito', description: 'En la misma olla (con los jugos del pollo) baja a fuego medio y echa la cebolla y la zanahoria. Sofríe 5-6 minutos hasta que la cebolla esté transparente y blanda. Agrega el ajo y cocina 1 minuto más, hasta que suelte aroma.', waitSeconds: 420 },
        { title: 'Nacara el arroz', description: 'Agrega el arroz seco y revuélvelo con el sofrito 1-2 minutos, hasta que los granos se vean brillantes y algo translúcidos en los bordes. Esto ayuda a que el arroz quede suelto.', waitSeconds: 90 },
        { title: 'Añade caldo y pollo', description: 'Vierte el caldo caliente (700 ml), prueba y ajusta la sal. Vuelve a colocar los muslos encima del arroz. Sube el fuego hasta que hierva.', waitSeconds: 120 },
        { title: 'Cocina tapado', description: 'Cuando hierva, baja a fuego bajo y tapa la olla. Cocina 18 minutos SIN destapar ni revolver (el vapor cocina el arroz de forma pareja).', waitSeconds: 1080 },
        { title: 'Reposa', description: 'Apaga el fuego y deja reposar tapado 5 minutos más. Destapa, suelta el arroz con un tenedor y sirve cada muslo con una porción de arroz.', waitSeconds: 300 }
      ]
    },
    {
      _meal: ['almuerzo', 'cena'], _spicy: false, _fruit: false,
      _kw: ['sopa', 'verduras', 'caldo', 'liviano', 'sano', 'reconfortante', 'vegetariano'],
      title: 'Sopa de verduras reconfortante',
      difficulty: 'Fácil', calories: 190, timeMinutes: 35, baseServings: 4,
      tags: ['Liviano', 'Vegetariano'],
      technique: 'sofrito para sopa',
      ingredients: [
        { icon: 'onion', label: 'Cebolla', amount: 1, unit: 'u' },
        { icon: 'carrot', label: 'Zanahorias', amount: 2, unit: 'u' },
        { icon: 'circle-dot', label: 'Papa', amount: 2, unit: 'u' },
        { icon: 'leaf', label: 'Apio', amount: 2, unit: 'tallos' },
        { icon: 'onion', label: 'Ajo', amount: 2, unit: 'dientes' },
        { icon: 'circle-dot', label: 'Caldo o agua', amount: 1200, unit: 'ml' },
        { icon: 'circle-dot', label: 'Aceite', amount: 2, unit: 'cda' },
        { icon: 'circle-dot', label: 'Sal y pimienta', amount: 1, unit: 'al gusto' }
      ],
      steps: [
        { title: 'Corta las verduras', description: 'Pela y corta la cebolla en cubos pequeños, la zanahoria y la papa en cubos de ~1,5 cm, el apio en trozos finos y pica el ajo. Tener todo cortado antes hace el resto más fácil.', waitSeconds: 0 },
        { title: 'Sofríe la base', description: 'En una olla grande calienta el aceite a fuego medio. Agrega cebolla, zanahoria y apio. Sofríe 6-7 minutos removiendo, hasta que la cebolla esté transparente y las verduras empiecen a ablandarse.', waitSeconds: 420 },
        { title: 'Suma el ajo', description: 'Agrega el ajo picado y cocina 1 minuto más, solo hasta que huela rico (sin dejarlo dorar demasiado).', waitSeconds: 60 },
        { title: 'Añade caldo y papa', description: 'Echa la papa en cubos y el caldo (o agua) hasta cubrir bien. Agrega sal y pimienta. Sube el fuego hasta que hierva.', waitSeconds: 240 },
        { title: 'Cocina a fuego lento', description: 'Baja a fuego medio-bajo y cocina 18-20 minutos, hasta que la papa y la zanahoria estén tiernas al pincharlas con un tenedor (deben ceder sin esfuerzo).', waitSeconds: 1140 },
        { title: 'Ajusta y sirve', description: 'Prueba y corrige la sal. Si te gusta más espesa, aplasta algunos trozos de papa contra la olla con la cuchara. Sirve caliente.', waitSeconds: 0 }
      ]
    },
    {
      _meal: ['cena'], _spicy: false, _fruit: false,
      _kw: ['salmon', 'pescado', 'horno', 'papas', 'mariscos', 'saludable', 'mediterranea'],
      title: 'Salmón al horno con papas',
      difficulty: 'Intermedio', calories: 520, timeMinutes: 40, baseServings: 2,
      tags: ['Mediterránea', 'Al horno'],
      technique: 'cocción al horno',
      ingredients: [
        { icon: 'fish', label: 'Filetes de salmón', amount: 2, unit: 'u' },
        { icon: 'circle-dot', label: 'Papas', amount: 3, unit: 'u' },
        { icon: 'onion', label: 'Ajo', amount: 2, unit: 'dientes' },
        { icon: 'circle-dot', label: 'Aceite de oliva', amount: 3, unit: 'cda' },
        { icon: 'leaf', label: 'Perejil o eneldo', amount: 1, unit: 'puñado' },
        { icon: 'circle-dot', label: 'Limón', amount: 1, unit: 'u' },
        { icon: 'circle-dot', label: 'Sal y pimienta', amount: 1, unit: 'al gusto' }
      ],
      steps: [
        { title: 'Precalienta el horno', description: 'Enciende el horno a 200 °C para que esté bien caliente cuando entren las papas. Un horno frío hace que todo quede aguado.', waitSeconds: 600 },
        { title: 'Prepara las papas', description: 'Pela las papas y córtalas en rodajas finas de ~0,5 cm. Ponlas en una fuente, riégalas con 2 cucharadas de aceite, sal y pimienta, y mézclalas para que se cubran parejo. Extiéndelas en una sola capa.', waitSeconds: 0 },
        { title: 'Hornea las papas primero', description: 'Mete la fuente al horno 20 minutos. Las papas tardan más que el pescado, por eso van solas al principio.', waitSeconds: 1200 },
        { title: 'Sazona el salmón', description: 'Mientras, pica el ajo y el perejil. Seca los filetes con papel de cocina (así se doran mejor), y úntalos con el ajo, el perejil, sal, pimienta y la cucharada restante de aceite.', waitSeconds: 0 },
        { title: 'Suma el salmón', description: 'Saca la fuente, mueve un poco las papas y coloca los filetes de salmón encima, con la piel hacia abajo. Exprime medio limón por encima.', waitSeconds: 0 },
        { title: 'Hornea junto', description: 'Vuelve a hornear 12-14 minutos, hasta que el salmón se vea opaco y se deshaga en lascas al presionar suave con un tenedor (por dentro apenas rosado queda jugoso; muy seco significa pasado).', waitSeconds: 780 },
        { title: 'Sirve', description: 'Sirve el salmón sobre las papas con unas rodajas del limón restante. Un chorrito de aceite crudo al final realza el sabor.', waitSeconds: 0 }
      ]
    },
    {
      _meal: ['almuerzo', 'cena'], _spicy: false, _fruit: false,
      _kw: ['tacos', 'carne', 'molida', 'mexicana', 'tortilla', 'rapido'],
      title: 'Tacos de carne molida',
      difficulty: 'Fácil', calories: 450, timeMinutes: 25, baseServings: 3,
      tags: ['Mexicana', 'Rápido'],
      technique: 'salteado de carne',
      ingredients: [
        { icon: 'beef', label: 'Carne molida', amount: 400, unit: 'g' },
        { icon: 'onion', label: 'Cebolla', amount: 1, unit: 'u' },
        { icon: 'onion', label: 'Ajo', amount: 2, unit: 'dientes' },
        { icon: 'circle-dot', label: 'Comino en polvo', amount: 1, unit: 'cdta' },
        { icon: 'circle-dot', label: 'Pimentón (paprika)', amount: 1, unit: 'cdta' },
        { icon: 'wheat', label: 'Tortillas', amount: 6, unit: 'u' },
        { icon: 'leaf', label: 'Cilantro', amount: 1, unit: 'puñado' },
        { icon: 'circle-dot', label: 'Sal y aceite', amount: 1, unit: 'al gusto' }
      ],
      steps: [
        { title: 'Pica la base', description: 'Pica la cebolla en cubos pequeños y el ajo bien fino. Reserva un poco de cebolla cruda y el cilantro picado para servir al final.', waitSeconds: 0 },
        { title: 'Sofríe la cebolla', description: 'Calienta un chorrito de aceite en una sartén a fuego medio. Agrega la cebolla y sofríe 4-5 minutos hasta que esté transparente. Suma el ajo y cocina 1 minuto más.', waitSeconds: 300 },
        { title: 'Dora la carne', description: 'Sube a fuego medio-alto y añade la carne molida. Desármala con la cuchara en trozos pequeños y cocínala 6-8 minutos, removiendo, hasta que pierda el color rosado y empiece a dorarse. Si suelta mucho líquido, deja que se evapore.', waitSeconds: 450 },
        { title: 'Condimenta', description: 'Agrega el comino, el pimentón y sal. Mezcla bien y cocina 2 minutos más para que las especias suelten su aroma y se integren. Prueba y ajusta la sal.', waitSeconds: 120 },
        { title: 'Calienta las tortillas', description: 'En otra sartén seca (o en la misma, aparte) calienta cada tortilla 20-30 segundos por lado, solo hasta que estén flexibles y con alguna mancha dorada.', waitSeconds: 60 },
        { title: 'Arma los tacos', description: 'Rellena cada tortilla con la carne, y remata con la cebolla cruda reservada y el cilantro. Un chorrito de limón al servir le va muy bien.', waitSeconds: 0 }
      ]
    },
    {
      _meal: ['snack', 'almuerzo'], _spicy: false, _fruit: false,
      _kw: ['quesadilla', 'queso', 'tortilla', 'rapido', 'snack', 'mexicana'],
      title: 'Quesadillas de queso',
      difficulty: 'Fácil', calories: 320, timeMinutes: 12, baseServings: 2,
      tags: ['Rápido', 'Snack'],
      technique: 'dorado en sartén',
      ingredients: [
        { icon: 'wheat', label: 'Tortillas de trigo', amount: 4, unit: 'u' },
        { icon: 'milk', label: 'Queso que funde', amount: 200, unit: 'g' },
        { icon: 'circle-dot', label: 'Aceite o mantequilla', amount: 1, unit: 'cdta' },
        { icon: 'leaf', label: 'Cilantro (opcional)', amount: 1, unit: 'puñado' }
      ],
      steps: [
        { title: 'Ralla el queso', description: 'Si el queso está en bloque, rállalo o córtalo en láminas finas: cuanto más fino, mejor y más parejo funde.', waitSeconds: 0 },
        { title: 'Arma la quesadilla', description: 'Reparte el queso sobre media tortilla (deja libre el borde para que no se salga), añade un poco de cilantro si usas, y dóblala por la mitad presionando suave.', waitSeconds: 0 },
        { title: 'Calienta la sartén', description: 'Pon una sartén a fuego medio con apenas una gota de aceite o mantequilla esparcida. Fuego medio: si está muy fuerte, se quema la tortilla antes de que funda el queso.', waitSeconds: 60 },
        { title: 'Dora un lado', description: 'Coloca la quesadilla y cocínala 2-3 minutos, hasta que la parte de abajo esté dorada y crujiente con manchas de tostado.', waitSeconds: 150 },
        { title: 'Voltea', description: 'Dale la vuelta con cuidado y dora el otro lado 2 minutos más, hasta que el queso esté completamente derretido (verás que se asoma un poco por el borde).', waitSeconds: 120 },
        { title: 'Corta y sirve', description: 'Pásala a una tabla, deja reposar 1 minuto (para que el queso no se escape) y córtala en triángulos. Sirve caliente.', waitSeconds: 60 }
      ]
    },
    {
      _meal: ['postre', 'snack'], _spicy: false, _fruit: false,
      _kw: ['postre', 'chocolate', 'mug', 'cake', 'rapido', 'dulce', 'microondas'],
      title: 'Mug cake de chocolate',
      difficulty: 'Fácil', calories: 380, timeMinutes: 8, baseServings: 1,
      tags: ['Postre', 'Rápido'],
      technique: 'bizcocho en taza',
      ingredients: [
        { icon: 'wheat', label: 'Harina', amount: 4, unit: 'cda' },
        { icon: 'candy', label: 'Cacao en polvo', amount: 2, unit: 'cda' },
        { icon: 'circle-dot', label: 'Azúcar', amount: 3, unit: 'cda' },
        { icon: 'milk', label: 'Leche', amount: 3, unit: 'cda' },
        { icon: 'circle-dot', label: 'Aceite neutro', amount: 2, unit: 'cda' },
        { icon: 'circle-dot', label: 'Polvo de hornear', amount: 0.5, unit: 'cdta' },
        { icon: 'circle-dot', label: 'Sal', amount: 1, unit: 'pizca' }
      ],
      steps: [
        { title: 'Mezcla lo seco', description: 'En una taza grande apta para microondas (que quede a medio llenar, porque el bizcocho sube) mezcla la harina, el cacao, el azúcar, el polvo de hornear y una pizca de sal. Deshaz los grumos con una cuchara.', waitSeconds: 0 },
        { title: 'Suma lo húmedo', description: 'Agrega la leche y el aceite. Mezcla bien hasta que quede una masa lisa y sin grumos secos en el fondo. Raspa las esquinas de la taza.', waitSeconds: 0 },
        { title: 'Cocina en microondas', description: 'Cocina en el microondas a máxima potencia 60-90 segundos. Empieza con 60 y ve mirando: está listo cuando la superficie se ve cocida (no líquida) y firme al tacto. Cada microondas varía, así que mejor de a poco.', waitSeconds: 90 },
        { title: 'Comprueba el punto', description: 'Inserta un palillo en el centro: debe salir apenas húmedo, no con masa cruda pegada. Si sale crudo, dale 10-15 segundos más. Cuidado de no pasarte o queda seco.', waitSeconds: 0 },
        { title: 'Reposa y disfruta', description: 'Deja reposar 1 minuto (la taza quema). Cómelo tibio directo de la taza; queda genial con un poco de leche fría al lado.', waitSeconds: 60 }
      ]
    }
  ];

  function norm(s) {
    return (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  var lastTitle = '';

  // Pick the recipe that best matches what the user asked for. Never fails:
  // it relaxes filters until at least one recipe qualifies, so the app always
  // has something real to show. Returns a deep copy (safe to mutate/store).
  function pick(criteria) {
    criteria = criteria || {};
    var prefs = criteria.prefs || {};
    var meal = criteria.mealType || '';
    var limit = Number(criteria.timeLimit) || 0;
    var craving = norm(criteria.craving || '');

    var base = RECIPES.slice();
    // Hard preferences: never break these.
    if (prefs.spicy === false) base = base.filter(function (r) { return !r._spicy; });
    if (prefs.fruit === false) base = base.filter(function (r) { return !r._fruit; });
    if (!base.length) base = RECIPES.slice();

    var pool = base.slice();
    if (meal) {
      var byMeal = pool.filter(function (r) { return r._meal.indexOf(meal) !== -1; });
      if (byMeal.length) pool = byMeal;
    }
    if (limit) {
      var byTime = pool.filter(function (r) { return r.timeMinutes <= limit; });
      if (byTime.length) pool = byTime;
    }
    if (craving) {
      var words = craving.split(/[^a-z0-9]+/).filter(function (w) { return w.length > 2; });
      if (words.length) {
        var scored = pool.map(function (r) {
          var hay = norm(r.title + ' ' + (r.tags || []).join(' ') + ' ' + (r._kw || []).join(' '));
          var score = 0;
          words.forEach(function (w) { if (hay.indexOf(w) !== -1) score++; });
          return { r: r, score: score };
        });
        var hits = scored.filter(function (x) { return x.score > 0; });
        if (hits.length) {
          hits.sort(function (a, b) { return b.score - a.score; });
          var top = hits[0].score;
          pool = hits.filter(function (x) { return x.score === top; }).map(function (x) { return x.r; });
        }
      }
    }
    if (!pool.length) pool = base;

    // Avoid repeating the exact same recipe two times in a row when possible.
    var choices = pool.filter(function (r) { return r.title !== lastTitle; });
    if (!choices.length) choices = pool;
    var chosen = choices[Math.floor(Math.random() * choices.length)];
    lastTitle = chosen.title;
    return JSON.parse(JSON.stringify(chosen));
  }

  window.RecipeBank = { pick: pick, all: RECIPES };
})();
