// 🔧 Utilidad base
function obtener_elemento_por_id(id) {
  const elemento = document.getElementById(id);
  if (!elemento) {
    console.warn(`Elemento con ID '${id}' no encontrado.`);
  }
  return elemento;
}

// 📄 Elementos de estado y visualización (solo lectura o representación visual del estado)
export function obtener_estado_anime() {
  return {
    texto_nombre_anime: obtener_elemento_por_id("texto_nombre_anime"),
    texto_id_anime: obtener_elemento_por_id("texto_id_anime"),
    imagen_portada_principal: obtener_elemento_por_id("imagen_portada_principal"),
    texto_nota_usuario: obtener_elemento_por_id("texto_nota_usuario"),
    texto_lista_generos: obtener_elemento_por_id("texto_lista_generos"),
    capa_fondo_portada: obtener_elemento_por_id("capa_fondo_portada"),
  };
}

// 📥 Entradas relacionadas al anime (campos editables: input type="text", "number", etc.)
export function obtener_entradas_anime() {
  return {
    entrada_buscar_anime: obtener_elemento_por_id("entrada_buscar_anime"),
    entrada_es_favorito: obtener_elemento_por_id("entrada_es_favorito"),
    entrada_temporada_actual: obtener_elemento_por_id("entrada_temporada_actual"),
    entrada_episodio_actual: obtener_elemento_por_id("entrada_episodio_actual"),
    entrada_anyo_estreno: obtener_elemento_por_id("entrada_anyo_estreno"),
    entrada_edicion_generos: obtener_elemento_por_id("entrada_edicion_generos"),
    entrada_buscar_anime_relacionado: obtener_elemento_por_id("entrada_buscar_anime_relacionado"),
    entrada_episodio_visto: obtener_elemento_por_id("entrada_episodio_visto"),
  };
}

// 📋 Listas desplegables y controles (solo <select>)
export function obtener_listas() {
  return {
    selector_estado_seguimiento: obtener_elemento_por_id("selector_estado_seguimiento"),
    selector_idioma_audio: obtener_elemento_por_id("selector_idioma_audio"),
    selector_idioma_subtitulos: obtener_elemento_por_id("selector_idioma_subtitulos"),
    selector_temporada_estreno: obtener_elemento_por_id("selector_temporada_estreno"),
    selector_dia_emision: obtener_elemento_por_id("selector_dia_emision"),
    selector_estado_general_anime: obtener_elemento_por_id("selector_estado_general_anime"),
    selector_tipo_relacion: obtener_elemento_por_id("selector_tipo_relacion"),
  };
}

// 🎛️ Botones de interacción (solo <button>)
export function obtener_botones_interaccion() {
  return {
    btn_menu_principal: obtener_elemento_por_id("btn_menu_principal"),
    btn_guardar_datos: obtener_elemento_por_id("btn_guardar_datos"),
    btn_abrir_carpetas: obtener_elemento_por_id("btn_abrir_carpetas"),
    btn_buscar: obtener_elemento_por_id("btn_buscar"),
    btn_alternar_configuracion: obtener_elemento_por_id("btn_alternar_configuracion"),
    btn_copiar_id: obtener_elemento_por_id("btn_copiar_id"),
    btn_restar_temporada: obtener_elemento_por_id("btn_restar_temporada"),
    btn_sumar_temporada: obtener_elemento_por_id("btn_sumar_temporada"),
    btn_restar_episodio: obtener_elemento_por_id("btn_restar_episodio"),
    btn_sumar_episodio: obtener_elemento_por_id("btn_sumar_episodio"),
    btn_restar_calificacion: obtener_elemento_por_id("btn_episodio_visto"),
    btn_sumar_calificacion: obtener_elemento_por_id("btn_sumar_calificacion"),
    btn_editar_generos: obtener_elemento_por_id("btn_editar_generos"),
    btn_guardar_final: obtener_elemento_por_id("btn_guardar_final"),
  };
}

export function obtener_ocultos() {
  return{
    menu_configuracion: obtener_elemento_por_id("menu_configuracion")
  }
}

// export function obtener_test() {
//   return{
//     log: obtener_elemento_por_id("log"),
//     check: obtener_elemento_por_id("prueba"),
//   }
// }

// 🧩 Composición final
export function extraer_anime_desde_dom() {
  return {
    ...obtener_entradas_anime(),
    ...obtener_estado_anime(),
    ...obtener_listas(),
    ...obtener_botones_interaccion(),
    ...obtener_ocultos(),
  };
}