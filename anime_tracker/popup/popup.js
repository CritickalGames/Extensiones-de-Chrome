const carpeta = JSON.parse(localStorage.getItem("carpetaAnimes")) || [];
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
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  const activeTab = tabs[0];
  urlActual.textContent = activeTab.url || "No disponible";
});

// 🔍 Buscar anime (simulado)
btnBuscar.addEventListener("click", () => {
  const nombre = inputBuscarAnime.value.trim();
  if (!nombre) return;

  animeNombre.textContent = nombre;
  animeEstado.textContent = "Emisión";
  animeTempoCap.textContent = "T1/E1";
  animeEstadoViendo.textContent = "Ver";

  animePortada.style.border = "2px solid lime";
  setTimeout(() => animePortada.style.border = "none", 1500);
});

// 💾 Guardar anime en localStorage
btnGuardar.addEventListener("click", () => {
  const anime = {
    nombre: animeNombre.textContent,
    estado: animeEstado.textContent,
    temporada: animeTempoCap.textContent,
    viendo: animeEstadoViendo.textContent,
    portada: animePortada.src,
    url: urlActual.textContent,
    fecha: new Date().toISOString()
  };

  carpeta.push(anime);
  console.warn("Animes:", carpeta);
  localStorage.setItem("carpetaAnimes", JSON.stringify(carpeta));

  btnGuardar.textContent = "Guardado ✔";
  setTimeout(() => btnGuardar.textContent = "Guardar anime", 1500);
});

// 📁 Redirigir a carpetas.html
btnMostrarCarpetas.addEventListener("click", () => {
  window.location.href = "subpopup/carpetas.html";
});

// ✅ Marcar capítulo como visto
btnCapituloVisto.addEventListener("click", () => {
  animeEstadoViendo.textContent = "Visto";
  animeEstadoViendo.style.color = "green";
});
