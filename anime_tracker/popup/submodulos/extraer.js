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
    animePortada: getElemento("anime_portada"), // Puede ser un <img> oculto
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
// Añadimos las referencias a los elementos específicos del nuevo diseño
export function extraerAnimeDesdeDOM() {
  return {
    ...obtenerInputsAnime(),
    ...obtenerEstadoAnime(),
    ...obtenerListas(),
    ...obtenerBotonesAnime(),
    // Elementos específicos del nuevo diseño
    anime_id_display: getElemento("anime_id_display"),
    copy_id_btn: getElemento("copy_id_btn"),
    temporada_actual: getElemento("temporada_actual"),
    episodio_actual: getElemento("episodio_actual"),
    temp_dec_btn: getElemento("temp_dec_btn"),
    temp_inc_btn: getElemento("temp_inc_btn"),
    ep_dec_btn: getElemento("ep_dec_btn"),
    ep_inc_btn: getElemento("ep_inc_btn"),
    nota_usuario_display: getElemento("nota_usuario_display"),
    rating_dec_btn: getElemento("rating_dec_btn"),
    rating_inc_btn: getElemento("rating_inc_btn"),
    editar_generos_btn: getElemento("editar_generos_btn"),
    generos_display: getElemento("generos_display"),
    generos_input: getElemento("generos_input"), // Ya está en obtenerInputsAnime, pero lo repetimos por claridad si se usa aparte
    cover_container: getElemento("cover_container"),
    settings_toggle_btn: getElemento("settings_toggle_btn"),
    settings_dropdown: getElemento("settings_dropdown"),
    url_anime_buscar: getElemento("url_anime_buscar"),
    save_btn_icon: document.querySelector('.save-btn-icon'),
    folder_btn_icon: document.querySelector('.folder-btn-icon'),
    menu_btn: document.querySelector('.menu-btn')
  };
}