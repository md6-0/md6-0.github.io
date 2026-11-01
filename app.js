/**
 * Lista todos los repos públicos de md6-0 leyéndolos de la API de GitHub.
 * Si creas un repo nuevo (público), aparece aquí solo.
 *
 * Para cambiar algo, toca la configuración de abajo.
 */
const USUARIO = "md6-0";

const CONTACTO = [
  { texto: "GitHub", url: `https://github.com/${USUARIO}` },
  { texto: "Email", url: "mailto:mdiazu600@gmail.com" },
  { texto: "LinkedIn", url: "https://www.linkedin.com/in/mario-diaz-dev/" },
];

// Repos que no se listan: este mismo sitio, el README del perfil y los destacados (ya están arriba).
const OCULTOS = new Set([`${USUARIO}.github.io`, USUARIO, "TFG-GeoData.gl", "videogames-backlog-app"].map((n) => n.toLowerCase()));

// Orden en la página: primero estos, en este orden; el resto (también los repos
// nuevos) va detrás, del más reciente al más antiguo.
const ORDEN = [
  "The-endless-deck",
  "hackathon2019-nonstap",
  "Aparcapp",
  "union-sistemas",
  "TFWStudiosWeb",
  "Prueba-tecnica-maquetacion-frontend",
];

// Nombre y descripción que se muestran en la página. Tienen prioridad sobre los de
// GitHub; un repo que no esté aquí se muestra con su nombre y su descripción de GitHub.
const NOMBRES = {
  "TFG-GeoData.gl": "GeoData.gl",
  "videogames-backlog-app": "Mi biblioteca de videojuegos",
  "union-sistemas": "Unión de sistemas · Godot 3D",
  "TFWStudiosWeb": "TFW Studios · web",
  "The-endless-deck": "The Endless Deck",
  "Aparcapp": "Aparcapp",
  "Prueba-tecnica-maquetacion-frontend": "Prueba técnica de maquetación",
  "hackathon2019-nonstap": "Nonstap · Hackathon 2019",
};

const DESCRIPCIONES = {
  "TFG-GeoData.gl": "Web app para ver en un mapa datos geolocalizados desde CSV, JSON o GeoJSON, con capas 2D y 3D (deck.gl + MapLibre). Mi TFG de Ingeniería Multimedia, puesto al día en 2026.",
  "videogames-backlog-app": "App web instalable para llevar tus videojuegos: pendientes, jugando y terminados, con nota, horas y un resumen anual (Rewind). Funciona sin conexión y sin cuenta.",
  "union-sistemas": "Prototipo 3D en primera persona con Godot 4 para aprender a unir sistemas de juego: movimiento con escalada, armas, enemigos, puertas con llave y ascensores.",
  "TFWStudiosWeb": "Web corporativa de TFW Studios, el pequeño estudio de apps que formamos dos amigos, con su política de privacidad. HTML y CSS.",
  "The-endless-deck": "Endless runner 2D con estética 1 bit hecho en Godot: cada vez que usas un botón del mando, su acción cambia al azar según tu baraja de cartas.",
  "Aparcapp": "App móvil para recordar dónde has aparcado: guarda la ubicación por GPS, busca la calle y lleva un historial. Hecha para aprender React, Ionic y Capacitor.",
  "Prueba-tecnica-maquetacion-frontend": "Maquetación en HTML y CSS de la página principal de una joyería, hecha como prueba técnica para una entrevista de trabajo.",
  "hackathon2019-nonstap": "App para crear experiencias turísticas en 3 pasos con recomendaciones basadas en IA, datos abiertos y opiniones de usuarios. Premio de la Asociación Nacional de Big Data y Analytics y accésit en «Hackea tu destino!» 2019.",
};

// Colores de lenguaje (los de GitHub) para el puntito de cada tarjeta.
const COLORES = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#663399",
  SCSS: "#c6538c",
  Python: "#3572A5",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  GDScript: "#355570",
  Dart: "#00B4AB",
  Vue: "#41b883",
  PHP: "#4F5D95",
  Swift: "#F05138",
};

// Se guarda la lista sin filtrar: OCULTOS, ORDEN, NOMBRES y DESCRIPCIONES se aplican al
// pintar, así un cambio en ellos se ve al momento aunque haya una lista guardada.
const CACHE = "repos-md6-0-v2";
const CACHE_MINUTOS = 30;

// --- Utilidades ------------------------------------------------------------------
const $ = (id) => document.getElementById(id);

function el(etiqueta, atributos = {}, ...hijos) {
  const nodo = document.createElement(etiqueta);
  for (const [k, v] of Object.entries(atributos)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") nodo.className = v;
    else if (k === "style") Object.assign(nodo.style, v);
    else if (k.startsWith("on")) nodo.addEventListener(k.slice(2), v);
    else nodo.setAttribute(k, v);
  }
  // Siempre como texto: las descripciones vienen de fuera y no se meten como HTML.
  for (const h of hijos.flat()) if (h !== null && h !== undefined && h !== false) nodo.append(h);
  return nodo;
}

const nombreBonito = (nombre) => NOMBRES[nombre] ?? nombre.replace(/[-_]+/g, " ");
const fecha = new Intl.DateTimeFormat("es-ES", { month: "short", year: "numeric" });

// --- Datos -----------------------------------------------------------------------
async function leerRepos() {
  try {
    const guardado = JSON.parse(sessionStorage.getItem(CACHE) ?? "null");
    if (guardado && Date.now() - guardado.hora < CACHE_MINUTOS * 60_000) return guardado.repos;
  } catch {
    /* sin almacenamiento: se pide a GitHub */
  }

  const respuesta = await fetch(`https://api.github.com/users/${USUARIO}/repos?per_page=100&sort=pushed&type=owner`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!respuesta.ok) {
    const error = new Error(`GitHub respondió ${respuesta.status}`);
    error.limite = respuesta.status === 403 || respuesta.status === 429;
    throw error;
  }
  const repos = (await respuesta.json())
    .filter((r) => !r.fork && !r.archived)
    .map((r) => ({
      nombre: r.name,
      descripcion: r.description,
      lenguaje: r.language,
      url: r.html_url,
      demo: r.has_pages ? `https://${USUARIO}.github.io/${r.name}/` : r.homepage || null,
      actualizado: r.pushed_at,
      estrellas: r.stargazers_count,
    }));

  try {
    sessionStorage.setItem(CACHE, JSON.stringify({ hora: Date.now(), repos }));
  } catch {
    /* da igual si no se puede guardar */
  }
  return repos;
}

// --- Interfaz --------------------------------------------------------------------
function pintarContacto() {
  $("contacto").replaceChildren(...CONTACTO.map((c) => el("li", {}, el("a", { href: c.url }, c.texto))));
}

function tarjeta(repo) {
  const r = { ...repo, descripcion: DESCRIPCIONES[repo.nombre] ?? repo.descripcion };
  return el(
    "li",
    { class: "tarjeta" },
    el("h3", {}, el("a", { href: r.demo ?? r.url, class: "tarjeta-enlace" }, nombreBonito(r.nombre))),
    el("p", { class: r.descripcion ? "descripcion" : "descripcion vacia" }, r.descripcion ?? "Sin descripción."),
    el(
      "p",
      { class: "meta" },
      r.lenguaje && el("span", { class: "lenguaje" }, el("span", { class: "punto", style: { background: COLORES[r.lenguaje] ?? "#9aa0b8" }, "aria-hidden": "true" }), r.lenguaje),
      el("time", { datetime: r.actualizado }, fecha.format(new Date(r.actualizado))),
    ),
    el(
      "p",
      { class: "acciones" },
      r.demo && el("a", { class: "boton boton-pequeno", href: r.demo }, "Abrir la app"),
      el("a", { class: "enlace", href: r.url }, "Código"),
    ),
  );
}

let todos = [];
let filtro = null;

function posicion(repo) {
  const i = ORDEN.findIndex((n) => n.toLowerCase() === repo.nombre.toLowerCase());
  return i === -1 ? ORDEN.length : i;
}

function ordenar(repos) {
  // Array.sort es estable: los que no están en ORDEN conservan el orden por fecha de la API.
  return [...repos].sort((a, b) => posicion(a) - posicion(b));
}

const visible = (r) => !OCULTOS.has(r.nombre.toLowerCase());

function pintarRepos() {
  const lista = todos.filter(visible);
  const visibles = ordenar(filtro ? lista.filter((r) => r.lenguaje === filtro) : lista);
  $("repos").replaceChildren(...visibles.map(tarjeta));
  $("estado").textContent = `${visibles.length} ${visibles.length === 1 ? "proyecto" : "proyectos"}${filtro ? ` en ${filtro}` : ""}`;
}

function pintarFiltros() {
  const lenguajes = [...new Set(todos.filter(visible).map((r) => r.lenguaje).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  if (lenguajes.length < 2) return;
  const boton = (texto, valor) =>
    el(
      "button",
      {
        type: "button",
        class: "chip",
        "aria-pressed": String(filtro === valor),
        onclick: () => {
          filtro = valor;
          pintarFiltros();
          pintarRepos();
        },
      },
      texto,
    );
  $("filtros").replaceChildren(boton("Todos", null), ...lenguajes.map((l) => boton(l, l)));
}

// --- Columna de proyectos: empieza cerrada y se abre con la pestaña -----------------
function montarLateral() {
  const pagina = document.querySelector(".pagina");
  const lateral = $("lateral");
  const abrir = $("abrirProyectos");
  const cerrar = $("cerrarProyectos");

  const poner = (abierto, { foco = false } = {}) => {
    pagina.dataset.lateral = abierto ? "abierto" : "cerrado";
    lateral.inert = !abierto;
    abrir.setAttribute("aria-expanded", String(abierto));
    abrir.querySelector("span").textContent = abierto ? "Ocultar mis proyectos" : "Ver todos mis proyectos";
    if (foco) (abierto ? cerrar : abrir).focus();
  };

  abrir.addEventListener("click", () => poner(pagina.dataset.lateral !== "abierto", { foco: true }));
  cerrar.addEventListener("click", () => poner(false, { foco: true }));
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && pagina.dataset.lateral === "abierto") poner(false, { foco: true });
  });
}

async function iniciar() {
  pintarContacto();
  montarLateral();
  try {
    todos = await leerRepos();
    pintarFiltros();
    pintarRepos();
  } catch (error) {
    $("estado").replaceChildren(
      error.limite
        ? "GitHub limita las consultas sin registrarse y se ha alcanzado el límite por ahora. "
        : "No se han podido cargar los proyectos. ",
      "Puedes verlos en ",
      el("a", { href: `https://github.com/${USUARIO}?tab=repositories` }, "mi perfil de GitHub"),
      ".",
    );
    $("estado").classList.add("error");
  }
}

iniciar();
