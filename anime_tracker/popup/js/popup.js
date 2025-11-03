//* 📦 Importaciones
import { obj_route } from '../../core/router/index.js';
import { guardarAnimeDesdePopup } from "./submodulos/guardar.js";
import { fnCapituloVisto } from "./submodulos/btnCapituloVisto.js";
import { iniciar } from "./submodulos/tabQuery.js";
import {
  obtener_entradas_anime,
  obtener_botones_interaccion,
  obtener_estado_anime,
  obtener_listas
} from "./submodulos/extraer.js";

//*) 🔗 Recolección de referencias DOM
const ref_input = obtener_entradas_anime();
const ref_botones = obtener_botones_interaccion();
const ref_estado = obtener_estado_anime();
const ref_listas = obtener_listas();

//*) 🌐 Obtener URL de la pestaña activa y cargar datos
chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
  //*) Combinar referencias para pasarlas a 'iniciar'
  const refs_para_iniciar = {
    ...ref_estado,
    ...ref_listas,
    ...ref_input
  };
  iniciar(obj_route, tabs, refs_para_iniciar);
});

//*) 🗃️ Guardar anime en IndexedDB
ref_botones.btn_guardar_datos.addEventListener("click", () => {
  //*) Combinar referencias para pasarlas a 'guardarAnimeDesdePopup'
  const refs_para_guardar = {
    ...ref_estado,
    ...ref_listas,
    ...ref_input
  };
  //!) Soluciona la implementación antes de activar
  alert("Soluciona la implementación");
  //todo) Activar guardado cuando esté implementado
  // guardarAnimeDesdePopup(obj_route, ref_botones.btn_guardar_datos, refs_para_guardar);
});

//*) 📁 Redirigir a carpetas.html
ref_botones.btn_abrir_carpetas.addEventListener("click", () => {
  window.location.href = "subpopup/carpetas.html";
});

//todo) 🔍 Buscar manualmente (PENDIENTE DE IMPLEMENTACIÓN)
ref_botones.btn_buscar.addEventListener("click", async () => {
  console.log("Funcionalidad de búsqueda manual aún no implementada.");
});