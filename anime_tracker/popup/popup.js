//TODO: Hacer la búsqueda de la URL; si no encuentra el anime, no cambiar placeholder
//TODO: Hacer la búsqueda de la URL; si encuentra url, cambiar placeholder

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

// 🌐 Obtener URL de la pestaña activa
chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
  const activeTab = tabs[0];
  const url = activeTab.url || "No disponible";
  urlActual.textContent = url;

  // 🧠 Parsear URL vía router
  const { nombre, temporada, capitulo } = await obj_route('parse.parse_url', { url });

  // 🧠 Buscar anime
  const resultado = await obj_route('search.conseguir_anime', { URL_nombre: nombre });

  if (!resultado or !nombre) {
    inputNombreAnime.value = nombre;
    console.warn("Anime no encontrado en DB ni API");
    return; // No modificar DOM si no se encontró
  }
  // ✅ Actualizar DOM
  animeNombre.textContent = resultado.nombre;
  animeEstado.textContent = resultado.estado;
  animeTempoCap.textContent = `T${temporada}/E${capitulo}`;
  animeEstadoViendo.textContent = resultado.viendo;
  animePortada.src = resultado.portada;
  inputNombreAnime.value = resultado.nombre;
});


// 🔍 Buscar manualmente
btnBuscar.addEventListener("click", async () => {
  const nombre = inputBuscarAnime.value.trim();
  if (!nombre) return;

  const resultado = await obj_route('conseguir_anime', { nombre, temporada: 0, capitulo: 0 });
  if (!resultado) return;

  animeNombre.textContent = resultado.nombre;
  animeEstado.textContent = resultado.estado;
  animeTempoCap.textContent = `T${resultado.temporada}/E${resultado.capitulo}`;
  animeEstadoViendo.textContent = resultado.viendo;
  animePortada.src = resultado.portada;
});

// 🗃️ Guardar anime en IndexedDB
btnGuardar.addEventListener("click", async () => {
  const anime = {
    nombre: animeNombre.textContent,
    estado: animeEstado.textContent,
    temporada: animeTempoCap.textContent,
    viendo: animeEstadoViendo.textContent,
    portada: animePortada.src,
    url: urlActual.textContent,
    fecha: new Date().toISOString()
  };

  await obj_route('guardar_anime', anime);

  btnGuardar.textContent = "Guardado ✔";
  setTimeout(() => btnGuardar.textContent = "Guardar anime", 1500);
});

// 📁 Redirigir a carpetas.html
btnMostrarCarpetas.addEventListener("click", () => {
  window.location.href = "subpopup/carpetas.html";
});

// ✅ Marcar capítulo como visto
// TODO: Cambiar txt de btn de "Capítulo no visto ❌" a "Capítulo visto ✔"
// TODO: Hacer que el botón pueda alternar entre ambos estados
btnCapituloVisto.addEventListener("click", () => {
  const actual = animeEstadoViendo.textContent;
  if (actual === "Visto") {
    animeEstadoViendo.textContent = "No visto ❌";
    animeEstadoViendo.style.color = "red";
  } else {
    animeEstadoViendo.textContent = "Visto ✔";
    animeEstadoViendo.style.color = "green";
  }
});