# LuScent's — Decants de Perfumes Originales

Sitio web estático para la tienda de decants **LuScent's** (Chile).  
Fragancias 100% originales en frascos de 2,5 ml y 5 ml.

## Estructura

```
/
├── index.html          ← Catálogo principal
├── asistente.html      ← Asistente Olfativo (IA)
├── solicitud.html      ← Solicitar fragancia / Asesor
├── como-funciona.html  ← Proceso de compra
├── terminos.html       ← Términos y condiciones
├── css/
│   └── styles.css
├── js/
│   ├── catalog.js      ← Catálogo de productos (editable)
│   └── scripts.js      ← Lógica UI
└── img/
    └── *.png           ← Imágenes de los perfumes
```

## Imágenes

Sube todas las imágenes de los perfumes en formato `.png` a la carpeta `img/`.  
El nombre debe coincidir exactamente con el campo `img` del producto en `catalog.js`.

Ejemplo: si el producto tiene `img: "lattafa-khamrah-qahwa"`, el archivo debe ser `img/lattafa-khamrah-qahwa.png`.

## Editar el catálogo

Abre **`js/catalog.js`** — es el único archivo que necesitas modificar para:

- Activar/desactivar Cyber Days → `CYBER_ACTIVE = true/false`
- Agregar o quitar decants → array `products`
- Agregar o quitar hot sales → array `hotSales`
- Agregar o quitar sets → array `sets`

## Deploy en GitHub Pages

1. Sube todos los archivos al repositorio (rama `main`).
2. En **Settings → Pages**, selecciona `Branch: main / root`.
3. GitHub Pages servirá `index.html` automáticamente.

## Contacto

Instagram: [@luscents.perfumes](https://instagram.com/luscents.perfumes)  
Email: luscents.contacto@gmail.com
