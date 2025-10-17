// 🔧 Utilidad base
function getElemento(id) {
  return document.getElementById(id);
}

// 📥 Inputs relacionados al anime
export function obtenerInputsAnime() {
  return {
    inputNombreAnime: getElemento("url_anime"),
    animeTempoCap: getElemento("capitulo_temp_cap"),
    capVisto: getElemento("cap_visto"),
    urlImagen: getElemento("url_imagen"),
    relacionUrl: getElemento("relacion_url"),
    animeRelacionado: getElemento("anime_relacionado"),
    temporadaEstreno: getElemento("temporada_estreno"),
    anyoEstreno: getElemento("anyo_estreno"),
    favoritoCheckbox: getElemento("favorito_checkbox"),
    notaUsuario: getElemento("nota_usuario"),
    generosInput: getElemento("generos_input"),
    tagsTipo: getElemento("tags_tipo")
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
    subtitulos: getElemento("subtitulos"),
    dia: getElemento("tags_dia")
  };
}

// 🎛️ Botones de interacción
export function obtenerBotonesAnime() {
  return {
    btnGuardar: getElemento("guardar"),
    btnBuscar: getElemento("btn_buscar"),
    btnCarpetas: getElemento("mostrarCarpetas")
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