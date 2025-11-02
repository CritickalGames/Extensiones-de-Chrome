export async function iniciar(obj_route, tabs, ref) {
  const {
    resultado,
    URL_nombre, 
    nombre, 
    temporada, 
    capitulo
  } = await fn(obj_route, tabs, ref);
  
  if (resultado) {
    actualizarDOM(ref, resultado, temporada, capitulo);
  } else {
    prevista_generica(ref, URL_nombre, nombre, temporada, capitulo);
  }
  /**
   * todo: agregar esto en configuración 
   * ref.urlImagen.value = ref.animePortada.src;
  */
  ref.animeRelacionado.textContent = URL_nombre;
}

async function fn(obj_route, tabs, ref) {
  const activeTab = tabs[0];
  const url = activeTab.url || "No disponible";
  /**
   * todo: agregar esto en configuración 
   * ref.urlActual.textContent = url;
  */

  const parseo = await obj_route('parse.parse_url', { url });
  // Con el nuevo router: error === false significa éxito
  if (parseo.error) {
    console.error("Error al parsear ", url);
    console.info(parseo.result);
    return false;
  }  
  const {
    URL_dir,
    URL_nombre,
    nombre,
    temporada,
    capitulo 
  } = parseo.result;

  const busqueda = await obj_route('search.conseguir_anime', URL_nombre);
  
  // Con el nuevo router: error === false significa éxito
  let resultado = null;
  if (busqueda.error === false) {
    resultado = busqueda.result;
    console.log('Anime encontrado; Actualizando DOM con:', resultado);
  } else {
    console.warn('No se encontró al buscar el anime:', busqueda.error);
  }

  return { resultado, URL_nombre, nombre, temporada, capitulo };
}

// 🧩 Actualizar DOM con datos de anime
function actualizarDOM(ref, resultado, temporada = 0, capitulo = 0) {
  ref.texto_nombre_anime.textContent = resultado.anime.nombre;
  ref.texto_id_anime.textContent = resultado.anime.nombre;
  ref.entrada_temporada_actual.value = temporada;
  ref.entrada_episodio_actual.value = capitulo;
  ref.entrada_anyo_estreno.value = resultado.estreno.anyo;
  ref.entrada_es_favorito.checked = resultado.anime.favorito;
  /**
   * todo: convertir en metadato del botón "save el folder"
   * ref.tagsTipo.value = resultado.tags.tags.join(", ");
  */
  ref.entrada_edicion_generos.value = resultado.generos.generos.join(", ");

  if (resultado.anime.portada) {
    ref.imagen_portada_principal.src = resultado.anime.portada;
    ref.capa_fondo_portada.src = resultado.anime.portada;
  }

  // Aseguramos que el estado se refleje en el <select>
  if (ref.selector_estado_general_anime instanceof HTMLSelectElement) {
    ref.selector_estado_general_anime.value = resultado.emision.estado || "desconocido";
  }

  if (ref.selector_estado_seguimiento instanceof HTMLSelectElement) {
    ref.selector_estado_seguimiento.value = resultado.anime.seguimiento || "ver";
  }

  if (ref.selector_dia_emision instanceof HTMLSelectElement) {
    ref.selector_dia_emision.value = resultado.estreno.dia || "";
  }

  if (ref.selector_temporada_estreno instanceof HTMLSelectElement) {
    ref.selector_temporada_estreno.value = resultado.estreno.temporada || "";
  }

  if (ref.texto_nota_usuario) {
    ref.texto_nota_usuario.value = resultado.notas.nota;
  }

  if (ref.selector_idioma_audio) {
    ref.selector_idioma_audio.value = resultado.idiomas.doblaje;
  }

  if (ref.selector_idioma_subtitulos) {
    ref.selector_idioma_subtitulos.value = resultado.idiomas.subtitulos;
  }

  // Si hay URL principal, usarla para la imagen
  /**
   * todo: agregar esto en configuración 
   * ref.urlActual.textContent = url;
  */
}

// 🧪 Vista genérica si no se encuentra el anime
function prevista_generica(ref, URL_anime, name, temporada, capitulo) {
  ref.texto_nombre_anime.textContent = name || "Anime Genérico";
    ref.entrada_temporada_actual.value = temporada;
  ref.entrada_episodio_actual.value = capitulo;
  ref.texto_id_anime.textContent = URL_anime;
  ref.texto_nota_usuario.textContent = 5;
}