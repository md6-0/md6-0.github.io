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

// Repos que no se listan: este mismo sitio, el README del perfil y el destacado (ya está arriba).
const OCULTOS = new Set([`${USUARIO}.github.io`, USUARIO, "TFG-GeoData.gl"].map((n) => n.toLowerCase()));

// Nombres más legibles para algunos repos (opcional). Clave: nombre exacto del repo.
const NOMBRES = {
  "TFG-GeoData.gl": "GeoData.gl",
  "APP-movil-API-AEMET-BING-MAPS": "App móvil AEMET + Bing Maps",
  "Disenyo-de-Aplicaciones-Web": "Diseño de Aplicaciones Web",
  "Compresion-y-Seguridad-Cifrador": "Compresión y Seguridad: cifrador",
  "CarGL-Graficos-por-computador": "CarGL · Gráficos por computador",
  "Juego-Mates-Ninios": "Juego de mates para niños",
  "Prueba-tecnica-maquetacion-frontend": "Prueba técnica de maquetación frontend",
  "Prueba-Godot-Guardado-Tienda": "Prueba Godot: guardado y tienda",
  "hackathon2019-nonstap": "Hackathon 2019 · Nonstap",
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

const CACHE = "repos-md6-0";
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
    .filter((r) => !r.fork && !r.archived && !OCULTOS.has(r.name.toLowerCase()))
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

function tarjeta(r) {
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
      r.demo && el("a", { class: "boton boton-pequeno", href: r.demo }, "Demo"),
      el("a", { class: "enlace", href: r.url }, "Código"),
    ),
  );
}

let todos = [];
let filtro = null;

function pintarRepos() {
  const visibles = filtro ? todos.filter((r) => r.lenguaje === filtro) : todos;
  $("repos").replaceChildren(...visibles.map(tarjeta));
  $("estado").textContent = `${visibles.length} ${visibles.length === 1 ? "proyecto" : "proyectos"}${filtro ? ` en ${filtro}` : ""}`;
}

function pintarFiltros() {
  const lenguajes = [...new Set(todos.map((r) => r.lenguaje).filter(Boolean))].sort((a, b) => a.localeCompare(b));
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

async function iniciar() {
  pintarContacto();
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
