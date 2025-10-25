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
  ref.urlImagen.value = ref.animePortada.src;
  ref.animeRelacionado.value = URL_nombre;
}

async function fn(obj_route, tabs, ref) {
  const activeTab = tabs[0];
  const url = activeTab.url || "No disponible";
  ref.urlActual.textContent = url;

  const parseo = await obj_route('parse.parse_url', { url });
  // Con el nuevo router: error === false significa éxito
  if (parseo.error) {
    console.error("Error al parsear ", url);
    console.info(parseo.result);
    return false;
  }  
  const {
    URL_dir, // ← Corregido: quité el guion bajo
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
  ref.animeNombre.textContent = resultado.anime.nombre;
  ref.inputNombreAnime.value = resultado.anime.nombre;
  ref.animeTempoCap.value = `T${temporada}/E${capitulo}`;
  ref.anyoEstreno.value = resultado.estreno.anyo;
  ref.favoritoCheckbox.checked = resultado.anime.favorito;
  ref.tagsTipo.value = resultado.tags.tags.join(", ");

  if (resultado.anime.portada) ref.animePortada.src = resultado.anime.portada;

  // Aseguramos que el estado se refleje en el <select>
  if (ref.animeEstado instanceof HTMLSelectElement) {
    ref.animeEstado.value = resultado.emision.estado || "desconocido";
  }

  if (ref.serieViendo instanceof HTMLSelectElement) {
    ref.serieViendo.value = resultado.anime.seguimiento || "ver";
  }

  if (ref.dia instanceof HTMLSelectElement) {
    ref.dia.value = resultado.estreno.dia || "";
  }

  if (ref.temporadaEstreno instanceof HTMLSelectElement) {
    ref.temporadaEstreno.value = resultado.estreno.temporada || "";
  }

  if (ref.notaUsuario) {
    ref.notaUsuario.value = resultado.notas.nota;
  }

  if (ref.doblaje) {
    ref.doblaje.value = resultado.idiomas.doblaje;
  }

  if (ref.subtitulos) {
    ref.subtitulos.value = resultado.idiomas.subtitulos;
  }

  if (ref.generosInput) {
    ref.generosInput.value = resultado.generos.generos.join(", ");
  }

  // Si hay URL principal, usarla para la imagen
  if (ref.urlImagen) {
    ref.urlImagen.value = resultado.urls_base.url_principal;
  }
}

// 🧪 Vista genérica si no se encuentra el anime
function prevista_generica(ref, URL_anime, name, temporada, capitulo) {
  ref.animeNombre.textContent = name || "Anime Genérico";
  ref.animeTempoCap.value = `T${temporada}/E${capitulo}`;
  ref.inputNombreAnime.value = URL_anime;
  ref.notaUsuario.value = 1;
}