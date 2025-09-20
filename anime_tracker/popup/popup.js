// 📦 Importaciones
import { obj_route } from '../core/router.js';
import { guardarAnimeDesdePopup } from "./submodulos/guardar.js";
import { fnCapituloVisto } from "./submodulos/btnCapituloVisto.js";
import { iniciar } from "./submodulos/tabQuery.js";
import {
  obtenerInputsAnime,
  obtenerBotonesAnime,
  obtenerEstadoAnime,
  obtenerListas
} from "./submodulos/extraer.js";

// 🔗 Recolección de referencias DOM
const {
  inputNombreAnime,
  inputBuscarAnime,
  animeTempoCap,
  capVisto
} = obtenerInputsAnime();

const {
  btnGuardar,
  btnMostrarCarpetas,
  btnBuscar
  // btnCapituloVisto ← no existe en el DOM actual
} = obtenerBotonesAnime();

const {
  animeNombre,
  animePortada,
  urlActual
} = obtenerEstadoAnime();

const {
  animeEstado,
  serieViendo,
  doblaje,
  subtitulos
} = obtenerListas();

// 🌐 Obtener URL de la pestaña activa y cargar datos
chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
  iniciar(obj_route, tabs, {
      urlActual,
      animeNombre,
      animeEstado,
      serieViendo,
      capVisto,
      animeTempoCap,
      animePortada,
      inputNombreAnime
    }
  );
});

// 🗃️ Guardar anime en IndexedDB
btnGuardar.addEventListener("click", () => {
  guardarAnimeDesdePopup(obj_route, btnGuardar, {
      inputNombreAnime,   //* url_anime
      animeNombre,        //* nombre
      animePortada,       //* portada
      urlActual,          //* urls_bases.url_dir
      animeEstado,        //* emision.estado
      serieViendo,        //* seguimiento
      capVisto,           //* capitulos.visto
      animeTempoCap,      //* capitulos.capitulo
      doblaje,            //* idiomas.doblaje
      subtitulos          //* idiomas.subtitulos
    }
  );
});

// 📁 Redirigir a carpetas.html
btnMostrarCarpetas.addEventListener("click", () => {
  window.location.href = "subpopup/carpetas.html";
});

//! YA NO ES UN BOTÓN, ES UNA LISTA.
// ✅ Alternar estado de capítulo visto
// btnCapituloVisto.addEventListener("click", () => {
//   fnCapituloVisto(animeEstadoViendo);
// });

//!PRENDIENTE
// 🔍 Buscar manualmente
btnBuscar.addEventListener("click", async () => {

});