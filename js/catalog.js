/* ═══════════════════════════════════════════════════════════════
   LUSCENT'S — catalog.js
   ─────────────────────────────────────────────────────────────
   ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR PARA:
   • Activar/desactivar Cyber Days  →  cambia CYBER_ACTIVE abajo
   • Agregar un decant nuevo        →  añadir objeto al array `products`
   • Quitar un decant               →  eliminar o comentar el objeto
   • Cambiar precio/datos           →  editar los campos del objeto
   • Agregar un hot sale            →  añadir objeto al array `hotSales`
   • Quitar un hot sale             →  eliminar o comentar el objeto
   • Agregar un set                 →  añadir objeto al array `sets`

   ─────────────────────────────────────────────────────────────
   ⚡ CYBER DAYS — cómo funciona:

   1. Pon CYBER_ACTIVE = true  →  se activa el modo Cyber en TODO el sitio
   2. Pon CYBER_ACTIVE = false →  vuelve a precios normales

   Cuando Cyber está activo:
   • En decants:   cyberP5 y cyberP25 son el precio activo.
                   p5 y p25 aparecen tachados como precio original.
   • En hot sales: cyberPrice es el precio activo.
                   price aparece tachado como precio original.
   • En sets:      cyberPrice es el precio activo.
                   price aparece tachado como precio original.

   Si un producto no tiene cyberPrice/cyberP5/cyberP25 definido,
   ese producto NO se toca aunque Cyber esté activo.

   ─────────────────────────────────────────────────────────────
   ESTRUCTURA DE UN DECANT (array `products`):
   {
     brand:    "Nombre de la marca",
     name:     "Nombre del perfume",
     sim:      "Similar a X (dejar "" si no aplica)",
     cat:      "arabe" | "disenador" | "nicho",
     ocasion:  ["diaria","formal","cita","fiesta"],
     emocion:  ["limpio","calido","oscuro","vibrante","proyeccion-atomica"],
     p5:       PRECIO_5ML,       // precio normal 5ml
     p25:      PRECIO_25ML,      // precio normal 2.5ml
     cyberP5:  PRECIO_CYBER_5ML, // precio Cyber 5ml  (omitir si no participa)
     cyberP25: PRECIO_CYBER_25ML,// precio Cyber 2.5ml(omitir si no participa)
     img:      "nombre-imagen-sin-extension",
     notas:    "Nota1, Nota2, Nota3, Nota4",
     desc:     "Descripción breve del perfume.",
     active:   true
   }

   ESTRUCTURA DE UN HOT SALE (array `hotSales`):
   {
     brand:         "Nombre de la marca",
     name:          "Nombre del perfume",
     size:          "100ml EDP",
     condition:     "sellado" | "casi-lleno" | "parcial",
     price:         PRECIO_NORMAL,
     originalPrice: PRECIO_REFERENCIA,  // precio retail / sin descuento (tachado normal)
     cyberPrice:    PRECIO_CYBER,       // precio Cyber (omitir si no participa)
     img:           "nombre-imagen-sin-extension",
     notas:         "Nota1, Nota2, Nota3",
     desc:          "Descripción breve.",
     active:        true
   }
═══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   ⚡ CYBER DAYS
   Cambia a true para activar precios Cyber en TODO el sitio.
   Cambia a false cuando termine la oferta.
══════════════════════════════════════════════════════════════ */
const CYBER_ACTIVE = true;

// Fecha y hora en que termina el Cyber (cuando CYBER_ACTIVE = true).
// Formato: "AÑO-MES-DÍA HH:MM:SS"  — usa la zona horaria de tu servidor/browser.
// Ejemplo: "2025-11-30 23:59:59"
const CYBER_END_DATE = "2026-06-03 23:59:59";

/* ─────────────────────────────────────────
   DECANTS — Catálogo principal
───────────────────────────────────────── */
const products = [

  // ── ÁRABES ────────────────────────────
  {
    brand: "Lattafa", name: "Khamrah Qahwa",
    sim: "Kilian Angels' Share",
    cat: "arabe", ocasion: ["cita","fiesta"], emocion: ["calido"],
    p5: 3500, p25: 2000, img: "lattafa-khamrah-qahwa",
    notas: "Café tostado, vainilla, praliné, especias cálidas",
    desc: "Perfume gourmand cálido donde el café oscuro equilibra el dulzor resinoso de la vainilla. Ideal para climas fríos.",
    active: true
  },
  {
    brand: "Lattafa", name: "Ramz Silver",
    sim: "Jean Paul Gaultier Ultra Male",
    cat: "arabe", ocasion: ["fiesta"], emocion: ["calido"],
    p5: 3000, p25: 1700, img: "lattafa-ramz-silver",
    notas: "Pera, lavanda, vainilla, menta",
    desc: "Composición aromática dulce. Salida afrutada y vibrante que asienta de forma gradual en una base de vainilla atalcada.",
    active: true
  },
  {
    brand: "Lattafa", name: "Teriaq Intense",
    sim: "",
    cat: "arabe", ocasion: ["formal","fiesta"], emocion: ["oscuro","calido"],
    p5: 3500, p25: 2000, img: "lattafa-teriaq-intense",
    notas: "Azafrán, licor de ciruela, canela, ámbar",
    desc: "Acorde especiado de alta intensidad diseñado por Quentin Bisch.",
    active: true
  },
  {
    brand: "Lattafa", name: "Eternal Oud",
    sim: "Grand Soir MFK",
    cat: "arabe", ocasion: ["formal","cita"], emocion: ["oscuro","calido"],
    p5: 3000, p25: 1700, img: "lattafa-eternal-oud",
    notas: "Ámbar, ciruela, vainilla, madera de oud",
    desc: "Perfil oriental majestuoso. Un oud refinado envuelto en resinas ambaradas.",
    active: true
  },
  {
    brand: "Lattafa", name: "Atlas",
    sim: "Orto Parisi Megamare",
    cat: "arabe", ocasion: ["diaria","fiesta"], emocion: ["limpio","proyeccion-atomica"],
    p5: 4000, p25: 2300, img: "lattafa-atlas",
    notas: "Notas marinas, calone, ambroxan, maderas",
    desc: "Fragancia acuática de potencia extrema y salinidad oceánica. Fijación excepcional.",
    active: true
  },
  {
    brand: "Lattafa", name: "Ameer Al Oudh Intense",
    sim: "Maison Margiela By the Fireplace",
    cat: "arabe", ocasion: ["cita","diaria"], emocion: ["calido","oscuro"],
    p5: 3000, p25: 1700, img: "lattafa-ameer-al-oudh-intense",
    notas: "Azúcar, maderas ahumadas, vainilla, sándalo",
    desc: "Aroma amaderado reconfortante. Evoca maderas crepitantes envueltas en azúcar caramelizada.",
    active: true
  },
  {
    brand: "Game of Spades", name: "Win",
    sim: "Bond n°9 Greenwich Village",
    cat: "arabe", ocasion: ["diaria"], emocion: ["vibrante"],
    p5: 5000, p25: 3000, img: "game-of-spades-win",
    notas: "Mandarina, jazmín, vainilla, almizcle",
    desc: "Composición luminosa y altamente versátil. Cítricos efervescentes sobre almizcle limpio.",
    active: true
  },
  {
    brand: "Game of Spades", name: "King",
    sim: "Xerjoff Erba Pura",
    cat: "arabe", ocasion: ["fiesta"], emocion: ["vibrante"],
    p5: 5000, p25: 3000, img: "game-of-spades-king",
    notas: "Naranja, bergamota, frutas dulces, almizcle blanco",
    desc: "Explosión frutal de alto impacto y estela proyectante para destacar.",
    active: true
  },
  {
    brand: "Armaf", name: "Odyssey Aqua Edition",
    sim: "Invictus Platinum",
    cat: "arabe", ocasion: ["diaria","formal"], emocion: ["limpio"],
    p5: 3500, p25: 2000, img: "armaf-odyssey-aqua",
    notas: "Pomelo, hojas de violeta, notas marinas, ámbar",
    desc: "Perfil acuático y vigorizante. Notas marinas limpias contrastadas con madera.",
    active: true
  },
  {
    brand: "Rave", name: "Royal Supreme",
    sim: "Lattafa Khamrah + vainilla",
    cat: "arabe", ocasion: ["cita","fiesta"], emocion: ["calido"],
    p5: 3000, p25: 1700, img: "rave-royal-supreme",
    notas: "Vainilla, canela, praliné, notas amaderadas",
    desc: "Aroma cálido, dulce y especiado. Destaca por una vainilla pronunciada.",
    active: true
  },
  {
    brand: "Al Haramain", name: "Aqua Dubai Extrait",
    sim: "Louis Vuitton Imagination",
    cat: "arabe", ocasion: ["diaria","formal"], emocion: ["limpio","vibrante"],
    p5: 4500, p25: 3000, img: "al-haramain-aqua-dubai",
    notas: "Té negro, cidra, jengibre, ambroxan",
    desc: "Cítrico sofisticado de alta gama. Frescura punzante del jengibre.",
    active: true
  },
  {
    brand: "Rasasi", name: "Hawas ICE",
    sim: "Invictus Aqua",
    cat: "arabe", ocasion: ["fiesta","diaria"], emocion: ["limpio","vibrante"],
    p5: 3500, p25: 2000, img: "rasasi-hawas-ice",
    notas: "Manzana, limón, menta, ámbar gris",
    desc: "Versión polarizada y crujiente del original. Menta helada de proyección sobresaliente.",
    active: true
  },
  {
    brand: "Maison Alhambra", name: "Kismet Magic",
    sim: "Kilian Angels Share",
    cat: "arabe", ocasion: ["cita","fiesta"], emocion: ["calido"],
    p5: 3000, p25: 1700, img: "alhambra-kismet-magic",
    notas: "Coñac, canela, haba tonka, vainilla",
    desc: "Perfume licoroso de corte nocturno. Elegante representación olfativa de coñac.",
    active: true
  },
  {
    brand: "Maison Alhambra", name: "Jean Lowe Immortel",
    sim: "Louis Vuitton L'Immensité",
    cat: "arabe", ocasion: ["formal","diaria"], emocion: ["limpio"],
    p5: 3000, p25: 1700, img: "alhambra-jean-lowe-immortel",
    notas: "Pomelo, jengibre, notas acuáticas, ambroxan",
    desc: "Frescura radiante de corte ejecutivo. Cítricos afilados sostenidos por un fondo limpio.",
    active: true
  },
  {
    brand: "Maison Alhambra", name: "Jean Lowe Vibe",
    sim: "Louis Vuitton Pacific Chill",
    cat: "arabe", ocasion: ["diaria"], emocion: ["limpio","vibrante"],
    p5: 3000, p25: 1700, img: "alhambra-jean-lowe-vibe",
    notas: "Menta, naranja, albahaca, albaricoque",
    desc: "Cóctel botánico revitalizante. Hierbas aromáticas frescas con matices frutales.",
    active: true
  },
  {
    brand: "Parfums Yadav", name: "Apple Pie",
    sim: "Kilian Angels Share",
    cat: "arabe", ocasion: ["cita","diaria"], emocion: ["calido"],
    p5: 5000, p25: 3000, img: "yadav-apple-pie",
    notas: "Coñac, vainilla, canela, maderas blandas",
    desc: "Extrait gourmand envolvente. Recrea el aroma cálido de la repostería fina.",
    active: true
  },
  {
    brand: "French Avenue", name: "Vulcan Feu",
    sim: "God of Fire",
    cat: "arabe", ocasion: ["fiesta","diaria"], emocion: ["vibrante"],
    p5: 5000, p25: 3000, img: "french-avenue-vulcan-feu",
    notas: "Mango, jengibre, limón, maderas ambaradas",
    desc: "Frutal exótico y vibrante. Tropical y picante en una estela densa.",
    active: true
  },
  {
    brand: "French Avenue", name: "Liquid Brun",
    sim: "Parfums de Marly Althaïr",
    cat: "arabe", ocasion: ["cita","formal"], emocion: ["calido"],
    p5: 5000, p25: 3000, img: "french-avenue-liquid-brun",
    notas: "Vainilla, cardamomo, flor de azahar, praliné",
    desc: "Dulzor especiado moderno. Vainilla masculina complementada con cardamomo.",
    active: true
  },
  {
    brand: "French Avenue", name: "After Effect",
    sim: "Initio Side Effect",
    cat: "arabe", ocasion: ["fiesta","cita"], emocion: ["oscuro","calido"],
    p5: 5000, p25: 3000, img: "french-avenue-after-effect",
    notas: "Ron, vainilla, tabaco, canela",
    desc: "Composición oscura y narcótica. Estructura densa basada en tabaco y licores.",
    active: true
  },
  {
    brand: "Afnan", name: "Supremacy Not Only Intense",
    sim: "Creed Aventus",
    cat: "arabe", ocasion: ["diaria","formal"], emocion: ["oscuro","vibrante"],
    p5: 5000, p25: 3000, img: "afnan-supremacy-intense",
    notas: "Grosella negra, bergamota, musgo de roble, pachulí",
    desc: "Chipre frutal ahumado de alto rendimiento y transición oscura.",
    active: true
  },

  // ── DISEÑADOR ─────────────────────────
  {
    brand: "Jean Paul Gaultier", name: "Le Male Elixir",
    sim: "",
    cat: "disenador", ocasion: ["cita","fiesta"], emocion: ["calido"],
    p5: 7500, p25: 4000, img: "jpgaultier-le-male-elixir",
    notas: "Lavanda, menta, vainilla, miel dorada",
    desc: "Interpretación rica y opulenta de un clásico.",
    active: true
  },
  {
    brand: "Jean Paul Gaultier", name: "Le Male Le Parfum",
    sim: "",
    cat: "disenador", ocasion: ["formal","cita"], emocion: ["oscuro","calido"],
    p5: 7500, p25: 4000, img: "jpgaultier-le-male-le-parfum",
    notas: "Cardamomo, lavanda, iris, vainilla",
    desc: "Elegancia oriental atalcada. Oscuro y sofisticado.",
    active: true
  },
  {
    brand: "Jean Paul Gaultier", name: "Le Male Pride Edition",
    sim: "",
    cat: "disenador", ocasion: ["diaria"], emocion: ["limpio","vibrante"],
    p5: 5500, p25: 3000, img: "jpgaultier-le-male-pride",
    notas: "Yuzu, naranja sanguina, neroli, maderas claras",
    desc: "Aroma cítrico y luminoso. Frescura vibrante unisex.",
    active: true
  },
  {
    brand: "Jean Paul Gaultier", name: "Le Beau Paradise Garden",
    sim: "",
    cat: "disenador", ocasion: ["diaria","cita"], emocion: ["vibrante","calido"],
    p5: 7500, p25: 4000, img: "jpgaultier-le-beau-paradise",
    notas: "Coco, notas verdes, higo, haba tonka",
    desc: "Tropical y vegetal. Equilibrio cremoso y botánico.",
    active: true
  },
  {
    brand: "Jean Paul Gaultier", name: "Scandal Pour Homme",
    sim: "",
    cat: "disenador", ocasion: ["fiesta","cita"], emocion: ["calido"],
    p5: 5000, p25: 2700, img: "jpgaultier-scandal-homme",
    notas: "Salvia, mandarina, caramelo, vetiver",
    desc: "Contrastes audaces. Dulzor denso cortado por salvia limpia.",
    active: true
  },
  {
    brand: "Jean Paul Gaultier", name: "Scandal Le Parfum",
    sim: "",
    cat: "disenador", ocasion: ["fiesta","cita"], emocion: ["calido","oscuro"],
    p5: 6000, p25: 3200, img: "jpgaultier-scandal-le-parfum",
    notas: "Geranio, haba tonka, sándalo",
    desc: "Minimalismo olfativo de alta densidad.",
    active: true
  },
  {
    brand: "Moschino", name: "Toy Boy",
    sim: "",
    cat: "disenador", ocasion: ["cita","fiesta"], emocion: ["vibrante"],
    p5: 4500, p25: 2500, img: "moschino-toy-boy",
    notas: "Pimienta rosa, pera, rosa, vetiver",
    desc: "Floral amaderado masculino, picante y vanguardista.",
    active: true
  },
  {
    brand: "Carolina Herrera", name: "Bad Boy Cobalt",
    sim: "",
    cat: "disenador", ocasion: ["diaria","fiesta"], emocion: ["vibrante"],
    p5: 5000, p25: 3000, img: "carolina-herrera-bad-boy-cobalt",
    notas: "Pimienta rosa, lavanda, trufa, vetiver",
    desc: "Frescor mineral y terroso asombrosamente versátil.",
    active: true
  },
  {
    brand: "Giorgio Armani", name: "Acqua Di Gio Profondo EDP",
    sim: "",
    cat: "disenador", ocasion: ["diaria","formal"], emocion: ["limpio"],
    p5: 6500, p25: 3500, img: "armani-acqua-di-gio-profondo",
    notas: "Notas marinas, aquozone, romero, pachulí",
    desc: "Fougère acuático inmersivo. Profundidad fría del océano.",
    active: true
  },
  {
    brand: "Rabanne", name: "Invictus Victory Elixir",
    sim: "",
    cat: "disenador", ocasion: ["fiesta","cita"], emocion: ["oscuro","calido"],
    p5: 7500, p25: 4000, img: "rabanne-invictus-victory-elixir",
    notas: "Incienso, pachulí, vainilla, haba tonka",
    desc: "Densidad resinosa y misteriosa de uso nocturno.",
    active: true
  },
  {
    brand: "Emporio Armani", name: "Stronger With You Intensely",
    sim: "",
    cat: "disenador", ocasion: ["cita","fiesta"], emocion: ["calido"],
    p5: 6500, p25: 3500, img: "emporio-armani-stronger-intensely",
    notas: "Pimienta rosa, toffee, canela, ámbar",
    desc: "Gourmand masculino cálido y acogedor.",
    active: true
  },
  {
    brand: "Azzaro", name: "The Most Wanted EDP Intense",
    sim: "",
    cat: "disenador", ocasion: ["cita","fiesta"], emocion: ["calido"],
    p5: 6500, p25: 3500, img: "azzaro-most-wanted-intense",
    notas: "Cardamomo, toffee, madera de ámbar",
    desc: "Especiado de estructura simple pero impacto directo.",
    active: true
  },
  {
    brand: "Azzaro", name: "The Most Wanted Parfum",
    sim: "",
    cat: "disenador", ocasion: ["cita","fiesta"], emocion: ["calido","oscuro"],
    p5: 6500, p25: 3500, img: "azzaro-most-wanted-parfum",
    notas: "Jengibre rojo, maderas incandescentes, vainilla",
    desc: "Perfil cálido, ardiente y licoroso.",
    active: true
  },
  {
    brand: "Viktor&Rolf", name: "Spicebomb Extreme",
    sim: "",
    cat: "disenador", ocasion: ["cita","fiesta"], emocion: ["calido","oscuro"],
    p5: 8000, p25: 4500, img: "viktor-rolf-spicebomb-extreme",
    notas: "Vainilla, tabaco, canela, comino",
    desc: "Complejidad especiada invernal de gran rendimiento.",
    active: true
  },
  {
    brand: "Valentino", name: "Coral Fantasy",
    sim: "",
    cat: "disenador", ocasion: ["cita","diaria"], emocion: ["vibrante","calido"],
    p5: 8000, p25: 4500, img: "valentino-coral-fantasy",
    notas: "Manzana roja, cardamomo, tabaco, pachulí",
    desc: "Afrutado aromático contemporáneo hacia tabaco limpio.",
    active: true
  },
  {
    brand: "Kenzo", name: "Pour Homme Intense",
    sim: "",
    cat: "disenador", ocasion: ["diaria","formal"], emocion: ["limpio","oscuro","proyeccion-atomica"],
    p5: 4000, p25: 2500, img: "kenzo-pour-homme-intense",
    notas: "Notas marinas, pimienta rosa, madera de higuera",
    desc: "Acuático seco y salino. Recrea madera secándose al sol marino.",
    active: true
  },
  {
    brand: "Chanel", name: "Edition Blanche EDP",
    sim: "",
    cat: "disenador", ocasion: ["formal","diaria"], emocion: ["limpio","calido"],
    p5: 9000, p25: 5000, img: "chanel-edition-blanche",
    notas: "Limón, bergamota, vainilla, sándalo",
    desc: "Contraste técnico perfecto entre cítrico brillante y vainilla suave.",
    active: true
  },

  // ── NICHO ─────────────────────────────
  {
    brand: "Parfums de Marly", name: "Althaïr",
    sim: "",
    cat: "nicho", ocasion: ["cita","formal"], emocion: ["calido"],
    p5: 18500, p25: 10000, img: "pdm-althair",
    notas: "Flor de azahar, canela, vainilla bourbon, praliné",
    desc: "Alta costura olfativa. Vainilla elegante masculina.",
    active: true
  },
  {
    brand: "Xerjoff", name: "40 Knots",
    sim: "",
    cat: "nicho", ocasion: ["formal","diaria"], emocion: ["limpio","vibrante"],
    p5: 18000, p25: 9500, img: "xerjoff-40-knots",
    notas: "Sal, notas marinas, maderas nobles, miel",
    desc: "Perfil acuático de lujo. Recrea estilo de vida náutico.",
    active: true
  },
  {
    brand: "Xerjoff", name: "Naxos",
    sim: "",
    cat: "nicho", ocasion: ["formal","cita"], emocion: ["calido","vibrante"],
    p5: 17000, p25: 9000, img: "xerjoff-naxos",
    notas: "Lavanda, miel, canela, hoja de tabaco",
    desc: "Equilibrio magistral. Tabaco dulce y miel de alta concentración.",
    active: true
  },
  {
    brand: "Mancera", name: "Red Tobacco",
    sim: "",
    cat: "nicho", ocasion: ["fiesta","formal"], emocion: ["oscuro","proyeccion-atomica"],
    p5: 8500, p25: 4500, img: "mancera-red-tobacco",
    notas: "Azafrán, incienso, pachulí, tabaco oscuro",
    desc: "Intensidad y proyección superlativas. Perfil robusto y terroso.",
    active: true
  },
  {
    brand: "Montale", name: "Honey Aoud",
    sim: "",
    cat: "nicho", ocasion: ["formal","fiesta"], emocion: ["calido","oscuro","proyeccion-atomica"],
    p5: 8500, p25: 4500, img: "montale-honey-aoud",
    notas: "Miel, madera de oud, pachulí, notas florales",
    desc: "Resinas dulces occidentales. Oud domesticado y meloso.",
    active: true
  },
  {
    brand: "Montale", name: "Intense Café",
    sim: "",
    cat: "nicho", ocasion: ["cita","diaria"], emocion: ["calido","proyeccion-atomica"],
    p5: 8500, p25: 4500, img: "montale-intense-cafe",
    notas: "Notas florales, rosa, café tostado, vainilla",
    desc: "Floral gourmand magnético. Pétalos de rosa almibarados sobre café.",
    active: true
  },
  {
    brand: "Montale", name: "Arabians Tonka",
    sim: "",
    cat: "nicho", ocasion: ["fiesta"], emocion: ["calido","proyeccion-atomica"],
    p5: 9000, p25: 5000, img: "montale-arabians-tonka",
    notas: "Azafrán, madera de oud, rosa, haba tonka",
    desc: "Rendimiento extremo. Azúcar quemada y maderas contundentes.",
    active: true
  },
  {
    brand: "Giardini di Toscana", name: "Bianco Latte",
    sim: "",
    cat: "nicho", ocasion: ["cita","diaria"], emocion: ["calido","limpio","proyeccion-atomica"],
    p5: 10000, p25: 6000, img: "giardini-bianco-latte",
    notas: "Caramelo, cumarina, miel, almizcle blanco",
    desc: "Gourmand lechoso por excelencia. Textura suave.",
    active: true
  },
  {
    brand: "Casa Niche", name: "La Vida del Naranjo Extrait",
    sim: "",
    cat: "nicho", ocasion: ["diaria","formal"], emocion: ["limpio","vibrante"],
    p5: 12500, p25: 7000, img: "casa-niche-naranjo-extrait",
    notas: "Hojas de naranjo, naranja amarga, neroli, maderas",
    desc: "Viaje botánico conceptual fresco y limpio.",
    active: true
  },
  {
    brand: "Casa Niche", name: "EVA",
    sim: "",
    cat: "nicho", ocasion: ["diaria","cita"], emocion: ["vibrante","limpio"],
    p5: 9500, p25: 5500, img: "casa-niche-eva",
    notas: "Manzana verde, caramelo, almizcles blancos",
    desc: "Frutal pulcro y balanceado. Dulzor y crujido fresco.",
    active: true
  },
  {
    brand: "Penhaligon's", name: "Cairo",
    sim: "",
    cat: "nicho", ocasion: ["formal","fiesta"], emocion: ["oscuro"],
    p5: 25000, p25: 15000, img: "penhaligons-cairo",
    notas: "Rosa damascena, azafrán, incienso, sándalo",
    desc: "Misticismo amaderado estructurado con elegancia técnica.",
    active: true
  },
  {
    brand: "Granado", name: "Infusao Botanica",
    sim: "",
    cat: "nicho", ocasion: ["diaria","formal"], emocion: ["limpio","vibrante"],
    p5: 10000, p25: 6000, img: "granado-infusao-botanica",
    notas: "Cilantro, pimienta negra, peonía, pachulí",
    desc: "Verdor especiado de corte boticario. Terroso e intrigante.",
    active: true
  },

];

/* ─────────────────────────────────────────
   HOT SALES — Frascos completos / parciales
   ─────────────────────────────────────────
   condition: "sellado" | "casi-lleno" | "parcial"

   EJEMPLOS — edita, duplica o elimina libremente:
───────────────────────────────────────── */
const hotSales = [


  // EJEMPLO 3 — Frasco parcial
  {
    brand: "Parfums de Marly", name: "Althaïr",
    size: "125ml EDP",
    condition: "parcial",
    price: 155000,
    originalPrice: 195000,
    img: "pdm-althair",
    notas: "Flor de azahar, canela, vainilla bourbon, praliné",
    desc: "Frasco con ~95ml restantes. Excelente oportunidad de probar nicho premium a precio accesible.",
    active: false
  },

  // PARA AGREGAR UNO NUEVO, copia este bloque y edítalo:
  // {
  //   brand: "Marca",
  //   name: "Nombre",
  //   size: "100ml EDP",
  //   condition: "sellado",   // sellado | casi-lleno | parcial
  //   price: 00000,
  //   originalPrice: 00000,   // 0 si no quieres mostrar precio referencia
  //   img: "nombre-imagen",
  //   notas: "Nota1, Nota2, Nota3",
  //   desc: "Descripción.",
  //   active: true
  // },

];

/* ─────────────────────────────────────────
   SETS DE DECANTS — Ofertas por llevar varios
   ─────────────────────────────────────────

   ★ CYBER / OFERTAS ESPECIALES:
   Cambia CYBER_ACTIVE a true para activar precios
   de cyber en TODOS los sets de una vez.
   Vuelve a false cuando termine la oferta.

   ESTRUCTURA DE UN SET:
   {
     id:          "id-unico-sin-espacios",       // identificador interno
     name:        "Nombre del Set",              // título que verá el cliente
     badge:       "Más vendido",                 // texto del badge (opcional, "" para ocultar)
     desc:        "Descripción del set.",        // subtítulo debajo del nombre
     size:        "5ml",                         // tamaño de cada decant del set ("2.5ml" | "5ml")
     items: [                                    // lista de decants incluidos
       { img: "nombre-imagen", brand: "Marca", name: "Nombre" },
       { img: "nombre-imagen", brand: "Marca", name: "Nombre" },
       ...                                       // sin límite, pero 3-4 es ideal visualmente
     ],
     price:       PRECIO_NORMAL,                 // precio del set (número sin $ ni puntos)
     originalPrice: PRECIO_SIN_DESCUENTO,        // precio si se compraran por separado (para mostrar ahorro)
     cyberPrice:  PRECIO_CYBER,                  // precio especial Cyber (0 si no aplica)
     active:      true                           // false = oculto sin borrar
   }

   EJEMPLO DE CÓMO AGREGAR UN SET NUEVO:
   Copia el bloque de ejemplo de abajo, pégalo antes del cierre ];
   y edita los campos. Los imgs deben coincidir con los nombres
   en /img/ exactamente (sin extensión).
───────────────────────────────────────── */

const sets = [

  // ── EJEMPLO 1 — Set cálido de inicio ─────────────────────────
  // Descomenta, edita y pon active: true para activar
  // {
  //   id:   "set-calido-inicio",
  //   name: "Set Cálido de Inicio",
  //   badge: "Más popular",
  //   desc: "Tres decants gourmand perfectos para quien recién empieza. Dulces, envolventes y de larga duración.",
  //   size: "5ml",
  //   items: [
  //     { img: "lattafa-khamrah-qahwa",        brand: "Lattafa", name: "Khamrah Qahwa"      },
  //     { img: "rave-royal-supreme",            brand: "Rave",    name: "Royal Supreme"      },
  //     { img: "lattafa-ameer-al-oudh-intense", brand: "Lattafa", name: "Ameer Al Oudh"      },
  //   ],
  //   price:         9000,
  //   originalPrice: 9500,
  //   cyberPrice:    7500,   // se activa solo cuando CYBER_ACTIVE = true
  //   active: false
  // },

  // ── EJEMPLO 2 — Set frescos diarios ──────────────────────────
  // {
  //   id:   "set-frescos-diarios",
  //   name: "Set Frescos & Limpios",
  //   badge: "Ideal oficina",
  //   desc: "Tres fragancias acuáticas y limpias. Proyección moderada, perfectas para el día a día.",
  //   size: "5ml",
  //   items: [
  //     { img: "armaf-odyssey-aqua",           brand: "Armaf",           name: "Odyssey Aqua"       },
  //     { img: "alhambra-jean-lowe-immortel",  brand: "Maison Alhambra", name: "Jean Lowe Immortel" },
  //     { img: "rasasi-hawas-ice",             brand: "Rasasi",          name: "Hawas ICE"          },
  //   ],
  //   price:         9500,
  //   originalPrice: 10500,
  //   cyberPrice:    8000,
  //   active: false
  // },

  // ── EJEMPLO 3 — Set Nicho Premium ────────────────────────────
  // {
  //   id:   "set-nicho-premium",
  //   name: "Set Nicho Premium",
  //   badge: "Exclusivo",
  //   desc: "Para quienes quieren salir del mainstream. Tres piezas de nicho con carácter propio.",
  //   size: "5ml",
  //   items: [
  //     { img: "mancera-red-tobacco",    brand: "Mancera",             name: "Red Tobacco"  },
  //     { img: "montale-intense-cafe",   brand: "Montale",             name: "Intense Café" },
  //     { img: "giardini-bianco-latte",  brand: "Giardini di Toscana", name: "Bianco Latte" },
  //   ],
  //   price:         23000,
  //   originalPrice: 25500,
  //   cyberPrice:    19000,
  //   active: false
  // },

  // ══════════════════════════════════════════════════════════════
  // SETS GENERADOS AUTOMÁTICAMENTE — marcas con 3+ productos
  // Cada set tiene -10% sobre el precio individual
  // ══════════════════════════════════════════════════════════════

  // ── Lattafa — Colección Oscura (3 decants) ───────────────────
  {
    id:   "lattafa-oscura",
    name: "Lattafa — Colección Oscura",
    badge: "Más vendido",
    desc: "Tres íconos orientales de Lattafa: café oscuro, coñac licoroso y maderas ahumadas. Cálidos, envolventes, imperdibles.",
    size: "5ml",
    items: [
      { img: "lattafa-eternal-oud",          brand: "Lattafa", name: "Eternal Oud"         },
      { img: "lattafa-ameer-al-oudh-intense",brand: "Lattafa", name: "Ameer Al Oudh Intense"},
      { img: "lattafa-khamrah-qahwa",        brand: "Lattafa", name: "Khamrah Qahwa"      },
    ],
    price:         9000,
    originalPrice: 12500,   // precio referencia inflado — descuento visible ~28%
    cyberPrice:    8000,
    active: true
  },

  // ── Lattafa — Colección Completa (6 decants) ─────────────────
  {
    id:   "lattafa-completa",
    name: "Lattafa — Colección Completa",
    badge: "Todo Lattafa",
    desc: "Los 6 decants de Lattafa en un solo set: desde el frescor marino del Atlas hasta la oscuridad del Teriaq. El mejor valor de la tienda.",
    size: "5ml",
    items: [
      { img: "lattafa-atlas",                brand: "Lattafa", name: "Atlas"                },
      { img: "lattafa-ramz-silver",          brand: "Lattafa", name: "Ramz Silver"          },
      { img: "lattafa-teriaq-intense",       brand: "Lattafa", name: "Teriaq Intense"       },
      { img: "lattafa-khamrah-qahwa",        brand: "Lattafa", name: "Khamrah Qahwa"       },
      { img: "lattafa-eternal-oud",          brand: "Lattafa", name: "Eternal Oud"          },
      { img: "lattafa-ameer-al-oudh-intense",brand: "Lattafa", name: "Ameer Al Oudh Intense"},
    ],
    price:         18000,
    originalPrice: 25000,   // precio referencia inflado — descuento visible ~28%
    cyberPrice:    16500,
    active: true
  },

  // ── Maison Alhambra — Trilogía ────────────────────────────────
  {
    id:   "alhambra-trilogia",
    name: "Alhambra — Trilogía",
    badge: "Inspirados en Louis Vuitton",
    desc: "La trilogía completa de Maison Alhambra: un coñac licoroso, frescura ejecutiva y cóctel botánico. Tres perfiles, una sola casa.",
    size: "5ml",
    items: [
      { img: "alhambra-kismet-magic",       brand: "Maison Alhambra", name: "Kismet Magic"       },
      { img: "alhambra-jean-lowe-immortel", brand: "Maison Alhambra", name: "Jean Lowe Immortel" },
      { img: "alhambra-jean-lowe-vibe",     brand: "Maison Alhambra", name: "Jean Lowe Vibe"     },
    ],
    price:         8100,
    originalPrice: 11500,   // precio referencia inflado — descuento visible ~30%
    cyberPrice:    7500,
    active: false
  },

  // ── French Avenue — Trilogía ──────────────────────────────────
  {
    id:   "french-avenue-trilogia",
    name: "French Avenue — Trilogía",
    badge: "Alta gama árabe",
    desc: "Tres facetas de French Avenue: vibrante tropical, dulzor especiado y profundidad oscura del ron. Proyección superior garantizada.",
    size: "5ml",
    items: [
      { img: "french-avenue-vulcan-feu",  brand: "French Avenue", name: "Vulcan Feu"  },
      { img: "french-avenue-liquid-brun", brand: "French Avenue", name: "Liquid Brun" },
      { img: "french-avenue-after-effect",brand: "French Avenue", name: "After Effect" },
    ],
    price:         13500,
    originalPrice: 19000,   // precio referencia inflado — descuento visible ~29%
    cyberPrice:    12000,
    active: true
  },

  // ── Jean Paul Gaultier — Serie Le Male (3 decants) ───────────
  {
    id:   "jpg-le-male",
    name: "JPG — Serie Le Male",
    badge: "Colección icónica",
    desc: "Los tres Le Male de la era actual: el opulento Elixir, el oriental Le Parfum y el cítrico Pride Edition. De oscuro a luminoso.",
    size: "5ml",
    items: [
      { img: "jpgaultier-le-male-le-parfum",brand: "Jean Paul Gaultier", name: "Le Male Le Parfum"   },
      { img: "jpgaultier-le-male-pride",    brand: "Jean Paul Gaultier", name: "Le Male Pride Edition"},
      { img: "jpgaultier-le-male-elixir",   brand: "Jean Paul Gaultier", name: "Le Male Elixir"      },
    ],
    price:         18500,
    originalPrice: 25500,   // precio referencia inflado — descuento visible ~27%
    cyberPrice:    16500,
    active: true
  },

  // ── Jean Paul Gaultier — Colección Completa (6 decants) ──────
  {
    id:   "jpg-completa",
    name: "JPG — Colección Completa",
    badge: "Todo Jean Paul Gaultier",
    desc: "Los 6 decants de Jean Paul Gaultier: desde la sensualidad oscura del Scandal Le Parfum hasta el vibrante tropicalismo del Le Beau Paradise Garden.",
    size: "5ml",
    items: [
      { img: "jpgaultier-scandal-le-parfum", brand: "Jean Paul Gaultier", name: "Scandal Le Parfum"      },
      { img: "jpgaultier-le-beau-paradise",  brand: "Jean Paul Gaultier", name: "Le Beau Paradise Garden"},
      { img: "jpgaultier-scandal-homme",     brand: "Jean Paul Gaultier", name: "Scandal Pour Homme"     },
      { img: "jpgaultier-le-male-elixir",    brand: "Jean Paul Gaultier", name: "Le Male Elixir"         },
      { img: "jpgaultier-le-male-le-parfum", brand: "Jean Paul Gaultier", name: "Le Male Le Parfum"      },
      { img: "jpgaultier-le-male-pride",     brand: "Jean Paul Gaultier", name: "Le Male Pride Edition"  },
    ],
    price:         35100,
    originalPrice: 49000,   // precio referencia inflado — descuento visible ~28%
    cyberPrice:    32000,
    active: true
  },

  // ── Montale — Trilogía Proyección Máxima ─────────────────────
  {
    id:   "montale-proyeccion",
    name: "Montale — Trilogía Proyección",
    badge: "Bestias olfativas",
    desc: "Los tres Montale de mayor proyección: oud meloso, café floral y tonka especiada. Para quienes exigen que los sientan llegar.",
    size: "5ml",
    items: [
      { img: "montale-honey-aoud",    brand: "Montale", name: "Honey Aoud"      },
      { img: "montale-intense-cafe",  brand: "Montale", name: "Intense Café"    },
      { img: "montale-arabians-tonka",brand: "Montale", name: "Arabians Tonka"  },
    ],
    price:         23400,
    originalPrice: 32500,   // precio referencia inflado — descuento visible ~28%
    cyberPrice:    19990,
    active: true
  },

  // ── Set Oriental Oscuro — 5 decants árabes ───────────────────
  {
    id:   "set-oriental-oscuro",
    name: "Set Oriental Oscuro",
    badge: "Nuestra selección",
    desc: "Los cinco pilares del oriente oscuro: café, maderas ahumadas, coñac licoroso, oud y especias densas. Un viaje completo por el lado más seductor de la perfumería árabe.",
    size: "5ml",
    items: [
      { img: "lattafa-teriaq-intense",        brand: "Lattafa",         name: "Teriaq Intense"        },
      { img: "lattafa-eternal-oud",           brand: "Lattafa",         name: "Eternal Oud"           },
      { img: "lattafa-khamrah-qahwa",         brand: "Lattafa",         name: "Khamrah Qahwa"         },
      { img: "alhambra-kismet-magic",         brand: "Maison Alhambra", name: "Kismet Magic"          },
      { img: "lattafa-ameer-al-oudh-intense", brand: "Lattafa",         name: "Ameer Al Oudh Intense" },
    ],
    price:         14500,
    originalPrice: 19000,
    cyberPrice:    13000,
    active: true
  },

  // ── Invierno de Lujo — 3 decants nicho cálidos ───────────────
  {
    id:   "set-invierno-lujo",
    name: "Invierno de Lujo",
    badge: "Alta costura olfativa",
    desc: "Tres piezas de nicho para los días fríos: vainilla bourbon de haute couture, gourmand lechoso de colección y tabaco dulce magistral. La trilogía invernal definitiva.",
    size: "5ml",
    items: [
      { img: "pdm-althair",          brand: "Parfums de Marly",      name: "Althaïr"         },
      { img: "giardini-bianco-latte",brand: "Giardini di Toscana",   name: "Bianco Latte"    },
      { img: "xerjoff-naxos",        brand: "Xerjoff",               name: "Naxos"           },
    ],
    price:         40000,
    originalPrice: 51000,
    cyberPrice:    37000,
    active: true
  },

  // ── Verano de Lujo — 3 decants nicho frescos ─────────────────
  {
    id:   "set-verano-lujo",
    name: "Verano de Lujo",
    badge: "Frescura premium",
    desc: "Tres piezas de nicho para el calor: sal náutica de lujo, verdor boticario especiado y naranja botánica conceptual. Frescura de alta gama que no tiene equivalente masivo.",
    size: "5ml",
    items: [
      { img: "xerjoff-40-knots",         brand: "Xerjoff",    name: "40 Knots"             },
      { img: "granado-infusao-botanica", brand: "Granado",    name: "Infusao Botanica"     },
      { img: "casa-niche-naranjo-extrait",brand: "Casa Niche", name: "La Vida del Naranjo"  },
    ],
    price:         35500,
    originalPrice: 46000,
    cyberPrice:    31500,
    active: true
  },

  // ── Para ellas — 4 decants mixtos todas las temporadas ───────
  {
    id:   "para-ellas",
    name: "Para ellas",
    badge: "Unisex & Femeninos",
    desc: "Cuatro fragancias vibrantes y envolventes que cubren todas las temporadas. Vulcan Feu y Jean Lowe Vibe para los días cálidos; Khamrah Qahwa y Win para el frío y las noches. Perfiles modernos, unisex y versátiles que funcionan en cualquier ocasión.",
    size: "5ml",
    items: [
      { img: "game-of-spades-win",       brand: "Game of Spades",  name: "Win"             },
      { img: "alhambra-jean-lowe-vibe",  brand: "Maison Alhambra", name: "Jean Lowe Vibe"  },
      { img: "lattafa-khamrah-qahwa",    brand: "Lattafa",         name: "Khamrah Qahwa"   },
      { img: "french-avenue-vulcan-feu", brand: "French Avenue",   name: "Vulcan Feu"      },
    ],
    price:         13000,
    originalPrice: 16500,
    cyberPrice:    11750,
    active: true
  },

  // ── Para ellas PREMIUM — 6 decants nicho & alta gama ─────────
  {
    id:   "para-ellas-premium",
    name: "Para ellas PREMIUM",
    badge: "Set Premium",
    desc: "Seis joyas olfativas de nicho y alta gama para un armario olfativo completo. Desde la frescura botánica y frutal de temporadas cálidas hasta el gourmand cremoso y floral de los días fríos. Fragancias unisex de proyección y sofisticación superior, para quienes no se conforman con lo ordinario.",
    size: "5ml",
    items: [
      { img: "casa-niche-eva",              brand: "Casa Niche",          name: "EVA"                    },
      { img: "casa-niche-naranjo-extrait",  brand: "Casa Niche",          name: "La Vida del Naranjo"    },
      { img: "giardini-bianco-latte",       brand: "Giardini di Toscana", name: "Bianco Latte"           },
      { img: "montale-intense-cafe",        brand: "Montale",             name: "Intense Café"           },
      { img: "jpgaultier-le-male-pride",    brand: "Jean Paul Gaultier",  name: "Le Male Pride Edition"  },
      { img: "granado-infusao-botanica",    brand: "Granado",             name: "Infusao Botanica"       },
    ],
    price:         44000,
    originalPrice: 56000,
    cyberPrice:    40000,
    active: true
  },

  // ── Colección Completa — todos los decants en 2.5ml ──────────
  {
    id:   "coleccion-completa",
    name: "Colección Completa",
    badge: "Todo el catálogo",
    desc: "Los 49 decants de todo el catálogo LuScent's en formato 2,5 ml. Árabes, diseñador y nicho. El set definitivo para explorar cada fragancia sin límites.",
    size: "2.5ml",
    items: [
      { img: "lattafa-khamrah-qahwa",         brand: "Lattafa",               name: "Khamrah Qahwa"            },
      { img: "lattafa-ramz-silver",           brand: "Lattafa",               name: "Ramz Silver"              },
      { img: "lattafa-teriaq-intense",        brand: "Lattafa",               name: "Teriaq Intense"           },
      { img: "lattafa-eternal-oud",           brand: "Lattafa",               name: "Eternal Oud"              },
      { img: "lattafa-atlas",                 brand: "Lattafa",               name: "Atlas"                    },
      { img: "lattafa-ameer-al-oudh-intense", brand: "Lattafa",               name: "Ameer Al Oudh Intense"    },
      { img: "game-of-spades-win",            brand: "Game of Spades",        name: "Win"                      },
      { img: "game-of-spades-king",           brand: "Game of Spades",        name: "King"                     },
      { img: "armaf-odyssey-aqua",            brand: "Armaf",                 name: "Odyssey Aqua"             },
      { img: "rave-royal-supreme",            brand: "Rave",                  name: "Royal Supreme"            },
      { img: "al-haramain-aqua-dubai",        brand: "Al Haramain",           name: "Aqua Dubai Extrait"       },
      { img: "rasasi-hawas-ice",              brand: "Rasasi",                name: "Hawas ICE"                },
      { img: "alhambra-kismet-magic",         brand: "Maison Alhambra",       name: "Kismet Magic"             },
      { img: "alhambra-jean-lowe-immortel",   brand: "Maison Alhambra",       name: "Jean Lowe Immortel"       },
      { img: "alhambra-jean-lowe-vibe",       brand: "Maison Alhambra",       name: "Jean Lowe Vibe"           },
      { img: "yadav-apple-pie",               brand: "Parfums Yadav",         name: "Apple Pie"                },
      { img: "french-avenue-vulcan-feu",      brand: "French Avenue",         name: "Vulcan Feu"               },
      { img: "french-avenue-liquid-brun",     brand: "French Avenue",         name: "Liquid Brun"              },
      { img: "french-avenue-after-effect",    brand: "French Avenue",         name: "After Effect"             },
      { img: "afnan-supremacy-intense",       brand: "Afnan",                 name: "Supremacy Not Only Intense"},
      { img: "jpgaultier-le-male-elixir",     brand: "Jean Paul Gaultier",    name: "Le Male Elixir"           },
      { img: "jpgaultier-le-male-le-parfum",  brand: "Jean Paul Gaultier",    name: "Le Male Le Parfum"        },
      { img: "jpgaultier-le-male-pride",      brand: "Jean Paul Gaultier",    name: "Le Male Pride Edition"    },
      { img: "jpgaultier-le-beau-paradise",   brand: "Jean Paul Gaultier",    name: "Le Beau Paradise Garden"  },
      { img: "jpgaultier-scandal-homme",      brand: "Jean Paul Gaultier",    name: "Scandal Pour Homme"       },
      { img: "jpgaultier-scandal-le-parfum",  brand: "Jean Paul Gaultier",    name: "Scandal Le Parfum"        },
      { img: "moschino-toy-boy",              brand: "Moschino",              name: "Toy Boy"                  },
      { img: "carolina-herrera-bad-boy-cobalt",brand:"Carolina Herrera",      name: "Bad Boy Cobalt"           },
      { img: "armani-acqua-di-gio-profondo",  brand: "Giorgio Armani",        name: "Acqua Di Gio Profondo EDP"},
      { img: "rabanne-invictus-victory-elixir",brand:"Rabanne",               name: "Invictus Victory Elixir"  },
      { img: "emporio-armani-stronger-intensely",brand:"Emporio Armani",      name: "Stronger With You Intensely"},
      { img: "azzaro-most-wanted-intense",    brand: "Azzaro",                name: "The Most Wanted EDP Intense"},
      { img: "azzaro-most-wanted-parfum",     brand: "Azzaro",                name: "The Most Wanted Parfum"   },
      { img: "viktor-rolf-spicebomb-extreme", brand: "Viktor&Rolf",           name: "Spicebomb Extreme"        },
      { img: "valentino-coral-fantasy",       brand: "Valentino",             name: "Coral Fantasy"            },
      { img: "kenzo-pour-homme-intense",      brand: "Kenzo",                 name: "Pour Homme Intense"       },
      { img: "chanel-edition-blanche",        brand: "Chanel",                name: "Edition Blanche EDP"      },
      { img: "pdm-althair",                   brand: "Parfums de Marly",      name: "Althaïr"                  },
      { img: "xerjoff-40-knots",              brand: "Xerjoff",               name: "40 Knots"                 },
      { img: "xerjoff-naxos",                 brand: "Xerjoff",               name: "Naxos"                    },
      { img: "mancera-red-tobacco",           brand: "Mancera",               name: "Red Tobacco"              },
      { img: "montale-honey-aoud",            brand: "Montale",               name: "Honey Aoud"               },
      { img: "montale-intense-cafe",          brand: "Montale",               name: "Intense Café"             },
      { img: "montale-arabians-tonka",        brand: "Montale",               name: "Arabians Tonka"           },
      { img: "giardini-bianco-latte",         brand: "Giardini di Toscana",   name: "Bianco Latte"             },
      { img: "casa-niche-naranjo-extrait",    brand: "Casa Niche",            name: "La Vida del Naranjo Extrait"},
      { img: "casa-niche-eva",                brand: "Casa Niche",            name: "EVA"                      },
      { img: "penhaligons-cairo",             brand: "Penhaligon's",          name: "Cairo"                    },
      { img: "granado-infusao-botanica",      brand: "Granado",               name: "Infusao Botanica"         },
    ],
    price:         164500,
    originalPrice: 232500,
    cyberPrice:    150000,
    active: true
  },

];
