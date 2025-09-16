// 🔧 Utilidad base
function getElemento(id) {
  return document.getElementById(id);
}

// 📥 Inputs relacionados al anime
export function obtenerInputsAnime() {
  return {
    inputNombreAnime: getElemento("url_anime"),
    inputBuscarAnime: getElemento("url_anime_buscar"),
    animeTempoCap: getElemento("capitulo_temp_cap"),
    capVisto: getElemento("cap_visto")
  };
}

// 📄 Elementos de estado y metadatos
export function obtenerEstadoAnime() {
  return {
    animeNombre: getElemento("anime_nombre"),
    animePortada: getElemento("anime_portada"),
    urlActual: getElemento("url_actual")
  };
}

// 📋 Listas desplegables y controles
export function obtenerListas() {
  return {
    animeEstado: getElemento("lista_anime_estado"),
    serieViendo: getElemento("lista_serie_viendo"),
    doblaje: getElemento("doblaje"),
    subtitulos: getElemento("subtitulos")
  };
}

// 🎛️ Botones de interacción
export function obtenerBotonesAnime() {
  return {
    btnGuardar: getElemento("guardar"),
    btnMostrarCarpetas: getElemento("mostrarCarpetas"),
    btnBuscar: getElemento("btn_buscar")
  };
}

// 🧩 Composición final
export function extraerAnimeDesdeDOM() {
  return {
    ...obtenerInputsAnime(),
    ...obtenerEstadoAnime(),
    ...obtenerListas(),
    ...obtenerBotonesAnime()
  };
}