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
    },
    {
      _meal: ['almuerzo', 'cena'], _spicy: false, _fruit: false,
      _kw: ['risotto', 'hongos', 'champiñones', 'italiana', 'cremoso', 'arroz'],
      title: 'Risotto de hongos',
      difficulty: 'Avanzado', calories: 540, timeMinutes: 50, baseServings: 2,
      tags: ['Italiana', 'Cremoso'],
      technique: 'risotto cremoso',
      ingredients: [
        { icon: 'wheat', label: 'Arroz arborio (o carnaroli)', amount: 200, unit: 'g' },
        { icon: 'leaf', label: 'Hongos (champiñones o mixtos)', amount: 250, unit: 'g' },
        { icon: 'onion', label: 'Cebolla', amount: 0.5, unit: 'u' },
        { icon: 'onion', label: 'Ajo', amount: 1, unit: 'diente' },
        { icon: 'circle-dot', label: 'Caldo de verduras caliente', amount: 900, unit: 'ml' },
        { icon: 'circle-dot', label: 'Vino blanco (opcional)', amount: 80, unit: 'ml' },
        { icon: 'milk', label: 'Mantequilla', amount: 30, unit: 'g' },
        { icon: 'milk', label: 'Queso parmesano rallado', amount: 40, unit: 'g' },
        { icon: 'circle-dot', label: 'Aceite de oliva', amount: 2, unit: 'cda' },
        { icon: 'circle-dot', label: 'Sal y pimienta', amount: 1, unit: 'al gusto' }
      ],
      steps: [
        { title: 'Prepara el caldo', description: 'Pon el caldo en una olla aparte y mantenlo caliente a fuego muy bajo durante toda la receta: agregarlo frío corta la cocción del arroz y alarga todo.', waitSeconds: 0 },
        { title: 'Saltea los hongos', description: 'Limpia los hongos con un paño (sin lavarlos, absorben agua) y córtalos en láminas. En una sartén aparte, saltéalos a fuego alto con 1 cucharada de aceite 4-5 minutos hasta que doren y suelten el agua; retira y reserva.', waitSeconds: 300 },
        { title: 'Sofríe la base', description: 'En una olla ancha y de fondo grueso, calienta el aceite y la mitad de la mantequilla a fuego medio. Pica la cebolla y el ajo bien finos y sofríe 4-5 minutos hasta que la cebolla esté transparente, sin dorar.', waitSeconds: 300 },
        { title: 'Nacara el arroz', description: 'Sube el fuego a medio-alto, agrega el arroz seco (sin lavar) y revuelve 2 minutos hasta que los bordes se vean translúcidos y el grano suene "vidrioso" al moverlo. Este paso sella el grano para que no se pase.', waitSeconds: 120 },
        { title: 'Desglasa con vino', description: 'Si usas vino, viértelo ahora y revuelve hasta que se evapore casi por completo (huele: cuando ya no pica a alcohol, está listo).', waitSeconds: 90 },
        { title: 'Cocina de a cucharones', description: 'Agrega un cucharón de caldo caliente y revuelve casi sin parar a fuego medio hasta que el líquido se absorba. Repite cucharón por cucharón (no eches todo junto) durante 18-20 minutos: esto libera el almidón y da la cremosidad típica del risotto.', waitSeconds: 1080 },
        { title: 'Comprueba el punto', description: 'Prueba un grano: debe estar cocido pero con un centro apenas firme ("al dente"), y la mezcla debe quedar suelta, tipo ola, no seca ni pastosa. Ajusta con más caldo si hace falta.', waitSeconds: 0 },
        { title: 'Mantecatura final', description: 'Apaga el fuego, incorpora los hongos reservados, el resto de la mantequilla fría y el parmesano. Bate con fuerza fuera del fuego 30 segundos hasta que quede brillante y cremoso. Sal y pimienta al gusto, y sirve de inmediato.', waitSeconds: 0 }
      ]
    },
    {
      _meal: ['almuerzo'], _spicy: true, _fruit: true,
      _kw: ['ceviche', 'peruano', 'pescado', 'limon', 'crudo', 'mariscos', 'fresco'],
      title: 'Ceviche peruano clásico',
      difficulty: 'Intermedio', calories: 260, timeMinutes: 30, baseServings: 2,
      tags: ['Peruana', 'Sin cocción'],
      technique: 'curado en cítrico',
      ingredients: [
        { icon: 'fish', label: 'Filete de pescado blanco bien fresco', amount: 400, unit: 'g' },
        { icon: 'citrus', label: 'Limones (jugo)', amount: 8, unit: 'u' },
        { icon: 'onion', label: 'Cebolla morada', amount: 1, unit: 'u' },
        { icon: 'circle-dot', label: 'Ají limo o chile picante', amount: 1, unit: 'u' },
        { icon: 'leaf', label: 'Cilantro', amount: 1, unit: 'puñado' },
        { icon: 'circle-dot', label: 'Camote o choclo (opcional, para servir)', amount: 1, unit: 'u' },
        { icon: 'circle-dot', label: 'Sal', amount: 1, unit: 'cdta' }
      ],
      steps: [
        { title: 'Elige bien el pescado', description: 'Usa SIEMPRE pescado blanco muy fresco (idealmente comprado el mismo día, dile al pescadero que es para ceviche). No sirve congelado de baja calidad: el resultado depende de esto más que de cualquier otro paso.', waitSeconds: 0 },
        { title: 'Corta el pescado', description: 'Con un cuchillo bien afilado, corta el pescado en cubos parejos de ~2 cm. Un corte parejo asegura que el limón lo cure de forma uniforme.', waitSeconds: 0 },
        { title: 'Prepara la cebolla', description: 'Corta la cebolla morada en pluma bien fina. Enjuágala bajo agua fría y escúrrela: así pierde el picor fuerte y queda crocante sin amargar el plato.', waitSeconds: 0 },
        { title: 'Exprime el limón', description: 'Exprime los limones (evita que caigan semillas) hasta juntar suficiente jugo para cubrir el pescado. Prueba el jugo: no debe estar amargo (si exprimiste muy fuerte, sale amargo de la cáscara).', waitSeconds: 0 },
        { title: 'Cura el pescado', description: 'En un bol (no metálico, para que no reaccione con el ácido), pon el pescado, sal y el ají picado bien fino. Vierte el jugo de limón hasta cubrir. Mezcla suave y deja reposar 5-8 minutos: el pescado se va poniendo opaco y "cocido" por el ácido, no por calor.', waitSeconds: 360 },
        { title: 'Comprueba el punto', description: 'El pescado está listo cuando se ve blanco y opaco por fuera pero sigue jugoso por dentro (no lo dejes más de 10-15 minutos o se pone gomoso). En ese momento agrega la cebolla y el cilantro picado, mezcla suave.', waitSeconds: 0 },
        { title: 'Sirve de inmediato', description: 'Sirve enseguida en un plato hondo con un poco del jugo (el "leche de tigre") y, si quieres, acompaña con camote o choclo cocido al lado, como se hace tradicionalmente.', waitSeconds: 0 }
      ]
    },
    {
      _meal: ['cena'], _spicy: false, _fruit: false,
      _kw: ['costillas', 'cerdo', 'bbq', 'barbacoa', 'parrilla', 'lento', 'americana'],
      title: 'Costillas de cerdo a fuego lento con BBQ',
      difficulty: 'Avanzado', calories: 680, timeMinutes: 180, baseServings: 2,
      tags: ['Americana', 'Parrilla'],
      technique: 'cocción lenta al horno',
      ingredients: [
        { icon: 'drumstick', label: 'Costillar de cerdo', amount: 1, unit: 'u' },
        { icon: 'circle-dot', label: 'Pimentón (paprika)', amount: 2, unit: 'cda' },
        { icon: 'circle-dot', label: 'Azúcar morena', amount: 2, unit: 'cda' },
        { icon: 'circle-dot', label: 'Comino en polvo', amount: 1, unit: 'cdta' },
        { icon: 'circle-dot', label: 'Ajo en polvo', amount: 1, unit: 'cdta' },
        { icon: 'circle-dot', label: 'Sal y pimienta', amount: 1, unit: 'cda' },
        { icon: 'circle-dot', label: 'Salsa BBQ', amount: 200, unit: 'ml' }
      ],
      steps: [
        { title: 'Retira la membrana', description: 'En la cara de hueso del costillar hay una membrana blanca y brillante: despégala de una esquina con un cuchillo romo y tira con un paño para quitarla entera. Si se queda, las costillas salen menos tiernas y el humo/condimento no penetra igual.', waitSeconds: 0 },
        { title: 'Sazona (dry rub)', description: 'Mezcla el pimentón, azúcar morena, comino, ajo en polvo, sal y pimienta. Frota la mezcla por todo el costillar, por ambos lados, presionando para que se pegue bien.', waitSeconds: 0 },
        { title: 'Reposa en frío', description: 'Envuelve el costillar en film y refrigera al menos 1 hora (idealmente toda la noche): el condimento penetra la carne y mejora mucho el sabor final.', waitSeconds: 3600 },
        { title: 'Precalienta el horno', description: 'Saca las costillas de la heladera 20-30 minutos antes de cocinar (que no entren heladas). Precalienta el horno a 150 °C, para una cocción lenta y pareja.', waitSeconds: 600 },
        { title: 'Hornea tapado', description: 'Envuelve el costillar en papel aluminio bien cerrado (que no escape el vapor) y hornea 2 a 2,5 horas. Este vapor atrapado es lo que ablanda la carne hasta que se despega casi sola del hueso.', waitSeconds: 8100 },
        { title: 'Comprueba el punto', description: 'Abre con cuidado (sale vapor caliente) y pincha entre los huesos con un tenedor: debe entrar casi sin resistencia. Si todavía está firme, vuelve a tapar y dale 20-30 minutos más.', waitSeconds: 0 },
        { title: 'Glasea y dora', description: 'Destapa, sube el horno a 220 °C (o usa el grill), pinta generosamente con salsa BBQ por ambos lados y hornea 10-15 minutos más sin tapar, hasta que la salsa esté pegajosa y con manchas oscuras (sin quemarse).', waitSeconds: 900 },
        { title: 'Reposa y corta', description: 'Deja reposar 5 minutos antes de cortar entre hueso y hueso: así los jugos se redistribuyen y no se pierden al cortar. Sirve con más salsa BBQ aparte.', waitSeconds: 300 }
      ]
    },
    {
      _meal: ['almuerzo', 'snack'], _spicy: false, _fruit: false,
      _kw: ['empanadas', 'carne', 'horno', 'argentina', 'masa', 'relleno'],
      title: 'Empanadas de carne al horno',
      difficulty: 'Intermedio', calories: 310, timeMinutes: 70, baseServings: 4,
      tags: ['Argentina', 'Al horno'],
      technique: 'armado y repulgue',
      ingredients: [
        { icon: 'wheat', label: 'Tapas para empanadas', amount: 12, unit: 'u' },
        { icon: 'beef', label: 'Carne molida', amount: 400, unit: 'g' },
        { icon: 'onion', label: 'Cebolla', amount: 2, unit: 'u' },
        { icon: 'circle-dot', label: 'Pimentón (paprika)', amount: 1, unit: 'cda' },
        { icon: 'circle-dot', label: 'Comino en polvo', amount: 1, unit: 'cdta' },
        { icon: 'egg', label: 'Huevos duros', amount: 2, unit: 'u' },
        { icon: 'leaf', label: 'Aceitunas verdes', amount: 12, unit: 'u' },
        { icon: 'egg', label: 'Huevo para pintar', amount: 1, unit: 'u' },
        { icon: 'circle-dot', label: 'Aceite', amount: 2, unit: 'cda' },
        { icon: 'circle-dot', label: 'Sal', amount: 1, unit: 'al gusto' }
      ],
      steps: [
        { title: 'Pica la cebolla fina', description: 'Corta la cebolla en cubos muy pequeños (~3-4 mm): en el relleno de empanada la cebolla casi se "derrite", así que cuanto más pareja y fina, mejor queda.', waitSeconds: 0 },
        { title: 'Pocha la cebolla', description: 'En una sartén amplia, calienta el aceite a fuego bajo y cocina la cebolla 12-15 minutos tapada, revolviendo cada tanto, hasta que quede muy blanda y transparente pero sin dorar (este paso lento es clave para que el relleno no quede seco).', waitSeconds: 900 },
        { title: 'Agrega la carne', description: 'Sube a fuego medio, añade la carne molida y desármala bien con la cuchara. Cocina 8-10 minutos hasta que pierda el color rosado. Si suelta mucho líquido, cuela el exceso (un relleno muy húmedo rompe la tapa al hornear).', waitSeconds: 540 },
        { title: 'Condimenta y enfría', description: 'Agrega pimentón, comino y sal. Mezcla, prueba y ajusta. Pasa el relleno a un bol y déjalo enfriar por completo, idealmente en la heladera 30 minutos: un relleno caliente ablanda la tapa y hace que se pegue mal.', waitSeconds: 1800 },
        { title: 'Arma las empanadas', description: 'Pica los huevos duros y las aceitunas. Sobre cada tapa (a temperatura ambiente para que no se rompa) pon una cucharada colmada de relleno frío, un poco de huevo duro y media aceituna. Moja el borde con un dedo con agua.', waitSeconds: 0 },
        { title: 'Cierra con repulgue', description: 'Dobla la tapa por la mitad formando una media luna y presiona el borde para sellar. Para el repulgue, toma un pliegue pequeño del borde y dóblalo sobre sí mismo, repitiendo hacia el otro extremo (si es tu primera vez, alcanza con presionar bien el borde con un tenedor).', waitSeconds: 0 },
        { title: 'Hornea', description: 'Precalienta el horno a 200 °C. Coloca las empanadas en una bandeja con papel, píntalas con huevo batido (les da el dorado brillante) y hornea 18-20 minutos hasta que estén doradas.', waitSeconds: 1140 }
      ]
    }
  ];

  // Ranks a recipe's difficulty against the user's chosen skill level, so a
  // "principiante" never gets served an "Intermedio"/"Avanzado" dish from the
  // free catalog (a beginner asked for beginner-friendly recipes on purpose).
  var DIFFICULTY_RANK = { 'Fácil': 1, 'Intermedio': 2, 'Avanzado': 3 };
  var SKILL_MAX_DIFFICULTY = { principiante: 1, intermedio: 2, avanzado: 3 };

  function norm(s) {
    return (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Filler words that shouldn't count toward "how many words matched" \u2014 they
  // inflate the word count without saying anything about the dish, which
  // unfairly raised the match bar (e.g. "quiero pasta con tomate" has 2
  // content words and 2 filler words; only the content words should matter).
  var STOPWORDS = ['quiero', 'quisiera', 'algo', 'con', 'de', 'del', 'la', 'el', 'los', 'las', 'una', 'un',
    'en', 'se', 'me', 'te', 'antoja', 'porfa', 'favor', 'plato', 'comida', 'receta', 'hoy', 'para', 'que',
    'y', 'o', 'una', 'unas', 'unos', 'algun', 'alguna', 'tengo', 'ganas', 'por'];

  var lastTitle = '';

  // Pick the recipe that best matches what the user asked for. Never fails:
  // it relaxes filters until at least one recipe qualifies, so the app always
  // has something real to show. Returns { recipe, matchedCraving }: matchedCraving
  // is false when a craving was given but the (small, fixed) catalog doesn't
  // really have it — callers should be honest about that instead of pretending
  // a weak keyword hit ("arroz" matching "arroz con pollo" for a request of
  // "arroz frito asiático") is the dish the user asked for.
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
    var maxDifficulty = SKILL_MAX_DIFFICULTY[prefs.skill] || SKILL_MAX_DIFFICULTY.principiante;
    var bySkill = base.filter(function (r) { return (DIFFICULTY_RANK[r.difficulty] || 1) <= maxDifficulty; });
    if (bySkill.length) base = bySkill;
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
    var matchedCraving = false;
    if (craving) {
      var words = craving.split(/[^a-z0-9]+/).filter(function (w) { return w.length > 2 && STOPWORDS.indexOf(w) === -1; });
      if (words.length) {
        var scored = pool.map(function (r) {
          var hay = norm(r.title + ' ' + (r.tags || []).join(' ') + ' ' + (r._kw || []).join(' '));
          var score = 0;
          words.forEach(function (w) { if (hay.indexOf(w) !== -1) score++; });
          return { r: r, score: score };
        });
        // Require most of the words to hit, not just one coincidental keyword
        // — otherwise "arroz frito asiático" (3 words) would confidently match
        // "Arroz con pollo" off a single shared word ("arroz").
        var required = Math.max(1, Math.ceil(words.length * 0.6));
        var hits = scored.filter(function (x) { return x.score >= required; });
        if (hits.length) {
          hits.sort(function (a, b) { return b.score - a.score; });
          var top = hits[0].score;
          pool = hits.filter(function (x) { return x.score === top; }).map(function (x) { return x.r; });
          matchedCraving = true;
        }
        // No strong match: keep the meal/time-filtered pool as-is and be
        // upfront with the caller that the craving wasn't actually honored.
      }
    }
    if (!pool.length) pool = base;

    // Prefer recipes AT (or as close as possible to) the user's chosen skill
    // level, instead of treating every allowed difficulty as equally likely.
    // Without this, an "avanzado" user mostly saw the same easy dishes a
    // "principiante" would, simply because the catalog has more of those.
    var bestRank = 0;
    pool.forEach(function (r) {
      var rank = DIFFICULTY_RANK[r.difficulty] || 1;
      if (rank <= maxDifficulty && rank > bestRank) bestRank = rank;
    });
    if (bestRank) {
      var atLevel = pool.filter(function (r) { return (DIFFICULTY_RANK[r.difficulty] || 1) === bestRank; });
      if (atLevel.length) pool = atLevel;
    }

    // Avoid repeating a recipe the caller already showed recently (e.g. "otra")
    // when possible, not just the very last one served from this module.
    var exclude = (criteria.excludeTitles || []).map(norm);
    if (exclude.length) {
      var fresh = pool.filter(function (r) { return exclude.indexOf(norm(r.title)) === -1; });
      if (fresh.length) pool = fresh;
    }

    // Avoid repeating the exact same recipe two times in a row when possible.
    var choices = pool.filter(function (r) { return r.title !== lastTitle; });
    if (!choices.length) choices = pool;
    var chosen = choices[Math.floor(Math.random() * choices.length)];
    lastTitle = chosen.title;
    return { recipe: JSON.parse(JSON.stringify(chosen)), matchedCraving: matchedCraving };
  }

  window.RecipeBank = { pick: pick, all: RECIPES };
})();
