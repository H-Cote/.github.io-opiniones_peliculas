# SALA 35mm

Un archivo personal de cine desarrollado en HTML, CSS y JavaScript Vanilla, diseñado para ser publicado en GitHub Pages.

## Cómo funciona

Esta es una Single Page Application (SPA) sin frameworks. Toda la información de las películas se almacena en `movies.json` y se renderiza dinámicamente mediante `app.js`. La navegación de las fichas individuales se realiza mediante parámetros en la URL (ej: `?id=oppenheimer`), lo cual es perfectamente compatible con hosting estático como GitHub Pages.

## Cómo agregar una nueva película

Para añadir una reseña:

1. Agrega el archivo de la imagen del póster en la carpeta `assets/posters/` o utiliza una URL válida.
2. Abre el archivo `movies.json`.
3. Añade un nuevo bloque JSON respetando esta estructura:

```json
{
  "id": "nombre-unico-en-minusculas-con-guiones",
  "title": "Título de la Película",
  "year": 2024,
  "director": "Nombre del Director",
  "rating": 5,
  "duration": "120 min",
  "genre": "Drama",
  "poster": "assets/posters/mi-poster.jpg",
  "shortOpinion": "Opinión de una línea (para los estados de WhatsApp).",
  "longOpinion": "Primer párrafo de la reseña.\n\nSegundo párrafo separado por doble salto de línea (backslash-n-backslash-n)."
}
```

4. Sube tus cambios a GitHub (commit y push). La página se actualizará automáticamente.

## Despliegue en GitHub Pages

1. Sube los archivos a un repositorio público en GitHub.
2. Ve a la pestaña **Settings** del repositorio.
3. En el menú lateral izquierdo, haz clic en **Pages**.
4. En Source selecciona `Deploy from a branch`.
5. Selecciona la rama `main` o `master` y la carpeta `/(root)`.
6. Haz clic en **Save**. En unos minutos tu página estará activa.

## Notas sobre Metadatos (Open Graph)
Dado que GitHub Pages es un servidor de archivos estáticos puros, los rastreadores web (como WhatsApp o Twitter) que no ejecutan JavaScript verán los metadatos globales de `index.html`. Para generar páginas HTML individuales con metadatos específicos para cada película (Open Graph), puedes crear un script en Node.js o Python que lea el JSON y genere carpetas estáticas antes de hacer el push. Sin embargo, para mantener este proyecto sin dependencias (como se solicitó), el sistema actual usa enrutamiento dinámico SPA muy limpio y funcional en navegadores.
