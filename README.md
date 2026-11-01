# md6-0.github.io

Mi página personal: https://md6-0.github.io/

Muestra un proyecto destacado y la lista de todos mis repositorios públicos, que se lee de la API de GitHub al abrir la página. Si creo un repo público nuevo, aparece solo. Los que tienen GitHub Pages llevan un botón «Demo».

## Cambiar cosas

Todo lo configurable está al principio de `app.js`:

- `CONTACTO`: enlaces de la cabecera.
- `OCULTOS`: repos que no quiero que salgan en la lista.
- `NOMBRES` y `DESCRIPCIONES`: nombre y descripción que se muestran de cada repo. Tienen prioridad sobre los de GitHub.

Un repo que no esté en esas listas se muestra con su nombre y la descripción del apartado **About** de GitHub (el engranaje junto a «About»). El lenguaje sale siempre de GitHub. Para que un repo enlace a su demo, basta con activar GitHub Pages en él.

Sin dependencias ni build: HTML, CSS y JavaScript sueltos. Tipografía Barlow bajo la SIL Open Font License (`fuentes/OFL.txt`).
