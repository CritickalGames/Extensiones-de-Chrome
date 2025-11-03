
//* 🧩 Auxiliares
function asignarValoresPorTipo(refs, datos) {
  for (const clave in datos) {
    const el = refs[clave];
    const valor = datos[clave];

    if (!el || valor === undefined) continue;

    const tipo = el.type?.toLowerCase();
    const etiqueta = el.tagName?.toLowerCase();

    if (etiqueta === 'input' && tipo === 'checkbox') {
      el.checked = Boolean(valor);
    } else if (etiqueta === 'input' || etiqueta === 'textarea' || etiqueta === 'select') {
      el.value = valor;
    } else {
      el.textContent = valor;
    }
  }
}

//* MAIN
export async function iniciar(obj_route, tabs, ref) {
  console.info("ENTRADA tabQuery");
  let metaAnime = {
    //todo) agregar esto en configuración
    urlActual: tabs[0]?.url || "No disponible", // ref.urlActual.textContent = url;
    //todo) agregar esto en configuración
    urlImagen: "",                              // ref.urlImagen.value = ref.animePortada.src;
    //todo) convertir en metadato del botón "save el folder"
    tagsTipo: "",                               // ref.tagsTipo.value = resultado.tags.tags.join(", ");
  };

  const url = metaAnime.urlActual;
  const {
    resultado,
    URL_nombre, 
    nombre, 
    temporada, 
    capitulo
  } = await fn(obj_route, url);

  if (resultado) {
    actualizarDOM(ref, resultado, temporada, capitulo);
  } else {
    prevista_generica(ref, URL_nombre, nombre, temporada, capitulo);
  }

  //*) Asignar nombre relacionado para guardar carpeta
  ref.entrada_buscar_anime_relacionado.textContent = URL_nombre;

  //*) Actualizar metadatos auxiliares
  metaAnime.urlImagen = ref.animePortada?.src || "";
  metaAnime.tagsTipo = resultado?.tags?.tags?.join(", ") || "";
}

//* 🔍 Función de parseo y búsqueda
async function fn(obj_route, url) {
  const { result: PARSEO, error: ERROR } = await obj_route('parse.parse_url', { url });
  //~) Con el nuevo router: error === false significa éxito
  if (ERROR) {
    //!) Error al parsear URL
    console.error("Error al parsear ", url);
    console.info(PARSEO);
    return false;
  }

  const {
    URL_dir,
    URL_nombre,
    nombre,
    temporada,
    capitulo 
  } = PARSEO;

  const busqueda = await obj_route('search.conseguir_anime', URL_nombre);

  const resultado = busqueda.result;
  if (busqueda.error === false) {
    //*) Anime encontrado correctamente
    console.log('Anime encontrado; Actualizando DOM con:', resultado);
  } else {
    //!) No se encontró el anime
    console.warn('No se encontró al buscar el anime:', busqueda.error);
  }

  return { resultado, URL_nombre, nombre, temporada, capitulo };
}

//* 🧩 Actualizar DOM con datos de anime
function actualizarDOM(ref, resultado, temporada = 0, capitulo = 0) {
  asignarValoresPorTipo(ref, 
    {
      texto_nombre_anime: resultado.anime.nombre,
      texto_id_anime: resultado.anime.nombre,
      entrada_temporada_actual: temporada,
      entrada_episodio_actual: capitulo,
      entrada_anyo_estreno: resultado.estreno.anyo,
      entrada_es_favorito: resultado.anime.favorito,
      entrada_edicion_generos: resultado.generos.generos.join(", "),
      texto_nota_usuario: resultado.notas.nota,
      selector_idioma_audio: resultado.idiomas.doblaje,
      selector_idioma_subtitulos: resultado.idiomas.subtitulos,
      selector_estado_general_anime: resultado.emision.estado || "desconocido",
      selector_estado_seguimiento: resultado.anime.seguimiento || "ver",
      selector_dia_emision: resultado.estreno.dia || "",
      selector_temporada_estreno: resultado.estreno.temporada || ""
    }
  );

  //*) Asignar imagen principal si existe
  if (resultado.anime.portada) {
    ref.imagen_portada_principal.src = resultado.anime.portada;
    ref.capa_fondo_portada.src = resultado.anime.portada;
  }
}

//* 🧪 Vista genérica si no se encuentra el anime
function prevista_generica(ref, URL_anime, name, temporada, capitulo) {
  asignarValoresPorTipo(ref, {
    texto_nombre_anime: name || "Anime Genérico",
    entrada_temporada_actual: temporada,
    entrada_episodio_actual: capitulo,
    texto_id_anime: URL_anime,
    texto_nota_usuario: 5
  });
}
