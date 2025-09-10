// router
import { obj_route } from '../core/router.js';

// 🔗 Referencias DOM
const urlActual = document.getElementById("url_actual");
const inputNombreAnime = document.getElementById("url_anime");
const inputBuscarAnime = document.getElementById("url_anime_buscar");

const btnGuardar = document.getElementById("guardar");
const btnMostrarCarpetas = document.getElementById("mostrarCarpetas");
const btnBuscar = document.getElementById("btn_buscar");
const btnCapituloVisto = document.getElementById("btn_capitulo_visto");

const animeNombre = document.getElementById("anime_nombre");
const animeEstado = document.getElementById("anime_estado");
const animeTempoCap = document.getElementById("anime_tempo_cap");
const animeEstadoViendo = document.getElementById("anime_estado_viendo");
const animePortada = document.getElementById("anime_portada");

// 🧩 Función modular para actualizar DOM
function actualizarDOM(resultado, temporada = 0, capitulo = 0) {
  animeNombre.textContent = resultado.nombre;
  animeEstado.textContent = resultado.estado;
  animeTempoCap.value = `T${temporada}/E${capitulo}`;
  animeEstadoViendo.textContent = resultado.viendo;
  animePortada.src = resultado.portada;
  inputNombreAnime.value = resultado.nombre;

  animeEstadoViendo.style.color = resultado.viendo === "Visto ✔" ? "green" : "red";
}
function prevista_generica(URL_anime, nombre, temporada, capitulo) {
  animeNombre.textContent = nombre;
  animeEstado.textContent = "? Desconocido";
  animeTempoCap.value = `T${temporada}/E${capitulo}`;
  inputNombreAnime.value = URL_anime;
}
// 🌐 Obtener URL de la pestaña activa
chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
  const activeTab = tabs[0];
  const url = activeTab.url || "No disponible";
  urlActual.textContent = url;

  const {URL_dir, URL_nombre, nombre, temporada, capitulo} = await obj_route('parse.parse_url', { url });
  
  const resultado = await obj_route('search.conseguir_anime', URL_nombre);

  if (!resultado || !URL_nombre) {
    inputNombreAnime.value = URL_nombre;
    console.warn("Anime no encontrado en DB ni API");
    prevista_generica(URL_nombre, nombre, temporada, capitulo);
    return;
  }
  // mostrar todo resultado en consola
  actualizarDOM(resultado, temporada, capitulo);
});

// 🔍 Buscar manualmente
btnBuscar.addEventListener("click", async () => {
  const nombre = inputBuscarAnime.value.trim();
  if (!nombre) return;

  const resultado = await obj_route('search.conseguir_anime', nombre);
  if (!resultado) return;

  actualizarDOM(resultado, resultado.temporada, resultado.capitulo);
});

// 🗃️ Guardar anime en IndexedDB
btnGuardar.addEventListener("click", async () => {
  const anime = {
    url_anime: inputNombreAnime.value.trim(),
    nombre: animeNombre.textContent,
    estado: animeEstado.textContent.includes,
    capitulo: animeTempoCap.value,
    viendo: animeEstadoViendo.textContent,
    portada: animePortada.src,
    url: urlActual.textContent,
    completo: false
  };

  await obj_route('db.guardar_anime', anime);

  btnGuardar.textContent = "Guardado ✔";
  setTimeout(() => btnGuardar.textContent = "Guardar anime", 1500);
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
