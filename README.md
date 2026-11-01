# md6-0.github.io

Mi página personal: https://md6-0.github.io/

Muestra un proyecto destacado y la lista de todos mis repositorios públicos, que se lee de la API de GitHub al abrir la página. Si creo un repo público nuevo, aparece solo. Los que tienen GitHub Pages llevan un botón «Demo».

## Cambiar cosas

Todo lo configurable está al principio de `app.js`:

- `CONTACTO`: enlaces de la cabecera.
- `OCULTOS`: repos que no quiero que salgan en la lista.
- `NOMBRES`: nombre legible de un repo cuando el del repo no queda bien.

La descripción y el lenguaje de cada tarjeta salen de GitHub: se cambian en el apartado **About** de cada repo (el engranaje junto a «About»). Para que un repo enlace a su demo, basta con activar GitHub Pages en él.

Sin dependencias ni build: HTML, CSS y JavaScript sueltos. Tipografía Barlow bajo la SIL Open Font License (`fuentes/OFL.txt`).
