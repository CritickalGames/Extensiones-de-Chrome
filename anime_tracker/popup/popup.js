//TODO: Hacer la búsqueda de la URL; si no encuentra el anime, no cambiar placeholder
//TODO: Hacer la búsqueda de la URL; si encuentra url, cambiar placeholder
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
  //TODO: Implementar búsqueda real
  animeNombre.textContent = nombre;
  animeEstado.textContent = "Emisión";
  animeTempoCap.textContent = "T1/E1";
  animeEstadoViendo.textContent = "Ver";
  //! Acá termina la simulación
  animePortada.style.border = "2px solid lime";
  setTimeout(() => animePortada.style.border = "none", 1500);
});

// 🗃️ IndexedDB: guardar anime
const dbRequest = indexedDB.open("AnimeDB", 1);
dbRequest.onupgradeneeded = function (event) {
  //TODO: crear las tablas necesarias
  //TODO: animes PK: url_nombre
  const db = event.target.result;
  db.createObjectStore("animes", { keyPath: "nombre" });
};

dbRequest.onsuccess = function (event) {
  const db = event.target.result;

  btnGuardar.addEventListener("click", () => {
    const anime = {
      nombre: animeNombre.textContent,
      estado: animeEstado.textContent,
      temporada: animeTempoCap.textContent,
      viendo: animeEstadoViendo.textContent,
      portada: animePortada.src,
      //TODO: Separar URL en nombre y dominio
      url: urlActual.textContent,
      fecha: new Date().toISOString()
    };

    const tx = db.transaction("animes", "readwrite");
    const store = tx.objectStore("animes");
    store.put(anime);

    btnGuardar.textContent = "Guardado ✔";
    setTimeout(() => btnGuardar.textContent = "Guardar anime", 1500);
  });
};

// 📁 Redirigir a carpetas.html
btnMostrarCarpetas.addEventListener("click", () => {
  window.location.href = "subpopup/carpetas.html";
});

// ✅ Marcar capítulo como visto
// TODO: Cambiar txt de btn de "Capítulo no visto ❌" a "Capítulo visto ✔"
// TODO: Hacer que el botón pueda alternar entre ambos estados
btnCapituloVisto.addEventListener("click", () => {
  animeEstadoViendo.textContent = "Visto";
  animeEstadoViendo.style.color = "green";
});
