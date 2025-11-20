//* MAIN
let refs;
export async function iniciar(obj_route, tabs, ref) {
  console.info("ENTRADA tabQuery");
  refs =ref;
  let metaAnime = {
    //todo) agregar esto en configuración
    urlActual: tabs[0]?.url || "No disponible", // ref.urlActual.textContent = url;
    //todo) agregar esto en configuración
    urlImagen: "",                              // ref.urlImagen.value = ref.animePortada.src;
    //todo) convertir en metadato del botón "save el folder"
    tagsTipo: "",                               // ref.tagsTipo.value = resultado.tags.tags.join(", ");
    tagsOriginales: ""
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
    actualizarDOM(resultado, URL_nombre, nombre, temporada, capitulo);
  } else {
    prevista_generica(URL_nombre, nombre, temporada, capitulo);
  }

  //*) Asignar nombre relacionado para guardar carpeta
  refs.entrada_buscar_anime_relacionado.textContent = URL_nombre;

  //*) Actualizar metadatos auxiliares
  metaAnime.urlImagen = refs.imagen_portada_principal?.src || "";
  metaAnime.tagsTipo = resultado?.tags?.tags?.join(", ") || ""; //~ Serán las carpetas
  //~ metaAnime.urlActual para la URL del capítulo y el anime en general.
  metaAnime.tagsOriginales = ref.entrada_edicion_generos.value;//~ para ayudar a eliminar los generos viejos.
  sessionStorage.setItem("metaAnime", JSON.stringify(metaAnime));
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
  console.log("busqueda:", JSON.stringify(busqueda, null, 2));
  
  if (busqueda.error === false) {
    //*) Anime encontrado correctamente
    console.log('Anime encontrado; Actualizando DOM con:', resultado);
  } else {
    //!) No se encontró el anime
    console.error('No se encontró al buscar el anime:', busqueda.error);
  }

  return { resultado, URL_nombre, nombre, temporada, capitulo };
}

//* 🧩 Actualizar DOM con datos de anime
function actualizarDOM(resultado, URL_nombre, nombre, temporada, capitulo) {
  console.log(resultado);
  asignarValoresPorTipo(
    {
      texto_nombre_anime: nombre,
      texto_id_anime: URL_nombre,
      entrada_temporada_actual: temporada ?? 0,
      entrada_episodio_actual: capitulo ?? 0,
      entrada_anyo_estreno: resultado?.estreno?.anyo || 2000,
      entrada_es_favorito: resultado?.anime?.favorito ?? false,
      entrada_edicion_generos: resultado?.generos?.generos?.join(", ") || "",
      texto_nota_usuario: resultado?.notas?.nota ?? 5,
      selector_idioma_audio: resultado?.idiomas?.doblaje || "es",
      selector_idioma_subtitulos: resultado?.idiomas?.subtitulos || "-",
      selector_estado_general_anime: resultado?.emision?.estado || "desconocido",
      selector_estado_seguimiento: resultado?.anime?.seguimiento || "ver",
      selector_dia_emision: resultado?.estreno?.dia || "",
      selector_temporada_estreno: resultado?.estreno?.temporada || ""
    }
  );


  //*) Asignar imagen principal si existe
  if (resultado?.anime?.portada) {
    refs.imagen_portada_principal.src = resultado.anime.portada;
  }
}

//* 🧪 Vista genérica si no se encuentra el anime
function prevista_generica(URL_nombre, name, temporada, capitulo) {
  asignarValoresPorTipo({
    texto_nombre_anime: name || "Anime Genérico",
    texto_id_anime: URL_nombre|| "anime-generico",
    entrada_temporada_actual: temporada,
    entrada_episodio_actual: capitulo,
    texto_nota_usuario: 5
  });
}

//* 🧩 Auxiliares
function asignarValoresPorTipo(datos) {
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