// 🔧 Utilidad base
function getElemento(id) {
  return document.getElementById(id);
}

// 📥 Inputs relacionados al anime
export function obtenerInputsAnime() {
  return {
    inputNombreAnime: getElemento("url_anime"),
    inputBuscarAnime: getElemento("url_anime_buscar"),
    animeTempoCap: getElemento("anime_tempo_cap")
  };
}

// 📄 Elementos de estado y metadatos
export function obtenerEstadoAnime() {
  return {
    animeNombre: getElemento("anime_nombre"),
    animeEstado: getElemento("anime_estado"),
    animeEstadoViendo: getElemento("anime_estado_viendo"),
    animePortada: getElemento("anime_portada"),
    urlActual: getElemento("url_actual")
  };
}

// 🎛️ Botones de interacción
export function obtenerBotonesAnime() {
  return {
    btnGuardar: getElemento("guardar"),
    btnMostrarCarpetas: getElemento("mostrarCarpetas"),
    btnBuscar: getElemento("btn_buscar"),
    btnCapituloVisto: getElemento("btn_capitulo_visto")
  };
}

// 🧩 Composición final
export function extraerAnimeDesdeDOM() {
  return {
    ...obtenerInputsAnime(),
    ...obtenerEstadoAnime(),
    ...obtenerBotonesAnime()
  };
}