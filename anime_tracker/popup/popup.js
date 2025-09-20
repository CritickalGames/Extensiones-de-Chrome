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
const ref_input = obtenerInputsAnime();

const ref_botones = obtenerBotonesAnime();

const ref_estado = obtenerEstadoAnime();

const ref_listas = obtenerListas();

// 🌐 Obtener URL de la pestaña activa y cargar datos
chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
  iniciar(obj_route, tabs, {
      ...ref_estado,
      ...ref_listas,
      ...ref_input
    }
  );
});

// 🗃️ Guardar anime en IndexedDB
ref_botones.btnGuardar.addEventListener("click", () => {
  guardarAnimeDesdePopup(obj_route, ref_botones.btnGuardar, {
      ...ref_estado,
      ...ref_listas,
      ...ref_input
    }
  );
});

// 📁 Redirigir a carpetas.html
ref_botones.btnCarpetas.addEventListener("click", () => {
  window.location.href = "subpopup/carpetas.html";
});

//! YA NO ES UN BOTÓN, ES UNA LISTA.
// ✅ Alternar estado de capítulo visto
// ref_botones.btnCapituloVisto.addEventListener("click", () => {
//   fnCapituloVisto(animeEstadoViendo);
// });

//!PENDIENTE
// 🔍 Buscar manualmente
ref_botones.btnBuscar.addEventListener("click", async () => {

});