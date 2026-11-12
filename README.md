# md6-0.github.io

Mi página personal: https://md6-0.github.io/

Muestra cinco proyectos destacados y, en una columna aparte, la lista de todos mis repositorios públicos, que se lee de la API de GitHub al abrir la página. Si creo un repo público nuevo, aparece solo. Los que tienen GitHub Pages llevan un botón «Abrir».

## Cambiar cosas

Los proyectos destacados (Misión Lucentum, GeoData.gl, Mi biblioteca de videojuegos, The Endless Deck y Mi pachanga) están escritos a mano en `index.html`, con sus capturas en `img/`.


Todo lo configurable está al principio de `app.js`:

- `CONTACTO`: enlaces de la cabecera.
- `DEMOS`: enlace y texto del botón para demos que no están en GitHub Pages (por ejemplo, un prototipo en Figma).
- `ORDEN`: qué proyectos van primero. Los demás, incluidos los repos nuevos, van detrás por fecha.
- `OCULTOS`: repos que no quiero que salgan en la lista.
- `NOMBRES` y `DESCRIPCIONES`: nombre y descripción que se muestran de cada repo. Tienen prioridad sobre los de GitHub.

Las listas usan el nombre del repo: **si renombras un repo en GitHub, cámbialo también aquí**, o perderá su posición, su nombre y su descripción. Un repo que no esté en esas listas se muestra con su nombre y la descripción del apartado **About** de GitHub (el engranaje junto a «About»). El lenguaje sale siempre de GitHub. Para que un repo enlace a su demo, basta con activar GitHub Pages en él.

Sin dependencias ni build: HTML, CSS y JavaScript sueltos. Tipografía Barlow bajo la SIL Open Font License (`fuentes/OFL.txt`).
