// 📦 Importaciones
import { obj_route } from '../core/router.js';
import { guardarAnimeDesdePopup } from "./submodulos/guardar.js";
import {
  obtenerInputsAnime,
  obtenerBotonesAnime,
  obtenerEstadoAnime
} from "./submodulos/extraer.js";

// 🔗 Recolección de referencias DOM
const {
  inputNombreAnime,
  inputBuscarAnime,
  animeTempoCap
} = obtenerInputsAnime();

const {
  btnGuardar,
  btnMostrarCarpetas,
  btnBuscar,
  btnCapituloVisto
} = obtenerBotonesAnime();

const {
  animeNombre,
  animeEstado,
  animeEstadoViendo,
  animePortada,
  urlActual
} = obtenerEstadoAnime();


// 🧩 Actualizar DOM con datos de anime
function actualizarDOM(resultado, temporada = 0, capitulo = 0) {
  animeNombre.textContent = resultado.nombre;
  animeEstado.textContent = resultado.estado;
  animeTempoCap.value = `T${temporada}/E${capitulo}`;
  animeEstadoViendo.textContent = resultado.viendo;
  animePortada.src = resultado.portada;
  inputNombreAnime.value = resultado.nombre;

  animeEstadoViendo.style.color = resultado.viendo === "Visto ✔" ? "green" : "red";
}

// 🧪 Vista genérica si no se encuentra el anime
function prevista_generica(URL_anime, temporada, capitulo) {
  animeEstado.textContent = "? Desconocido";
  animeTempoCap.value = `T${temporada}/E${capitulo}`;
  inputNombreAnime.value = URL_anime;
}

// 🌐 Obtener URL de la pestaña activa y cargar datos
chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
  const activeTab = tabs[0];
  const url = activeTab.url || "No disponible";
  urlActual.textContent = url;

  const { URL_dir, URL_nombre, nombre, temporada, capitulo } = await obj_route('parse.parse_url', { url });
  const resultado = await obj_route('search.conseguir_anime', URL_nombre);

  if (!resultado || !URL_nombre) {
    inputNombreAnime.value = URL_nombre;
    prevista_generica(URL_nombre, temporada, capitulo);
    return;
  }

  actualizarDOM(resultado, temporada, capitulo);
});

// 🗃️ Guardar anime en IndexedDB
btnGuardar.addEventListener("click", () => {
  guardarAnimeDesdePopup(obj_route,
    {
    inputNombreAnime,
    animeNombre,
    animeEstado,
    animeTempoCap,
    animeEstadoViendo,
    animePortada,
    urlActual,
    btnGuardar
  });
});

// 📁 Redirigir a carpetas.html
btnMostrarCarpetas.addEventListener("click", () => {
  window.location.href = "subpopup/carpetas.html";
});

// ✅ Alternar estado de capítulo visto
btnCapituloVisto.addEventListener("click", () => {
  const actual = animeEstadoViendo.textContent;
  const nuevoEstado = actual === "Visto ✔" ? "No visto ❌" : "Visto ✔";
  animeEstadoViendo.textContent = nuevoEstado;
  animeEstadoViendo.style.color = nuevoEstado === "Visto ✔" ? "green" : "red";
});

// 🔍 Buscar manualmente
btnBuscar.addEventListener("click", async () => {
  const nombre = inputBuscarAnime.value.trim();
  if (!nombre) return;

  const resultado = await obj_route('search.conseguir_anime', nombre);
  if (!resultado) return;

  actualizarDOM(resultado, resultado.temporada, resultado.capitulo);
});