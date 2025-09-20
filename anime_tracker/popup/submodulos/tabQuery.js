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
  if (parseo.error !== false) {
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
    console.log('Anime encontrado:', resultado);
  } else {
    console.warn('No se encontró al buscar el anime:', busqueda.error);
  }

  return { resultado, URL_nombre, nombre, temporada, capitulo };
}

// 🧩 Actualizar DOM con datos de anime
function actualizarDOM(ref, resultado, temporada = 0, capitulo = 0) {
  console.log(`Actualizando DOM con: `, resultado);
  
  ref.animeNombre.textContent = resultado.nombre;
  ref.inputNombreAnime.value = resultado.nombre;
  ref.animeTempoCap.value = `T${temporada}/E${capitulo}`;
  ref.anyoEstreno.value = resultado.anyo;
  ref.favoritoCheckbox.checked = resultado.favorito;
  ref.tagsTipo.value = resultado.tags;
  if (resultado.portada) ref.animePortada.src = resultado.portada;

  // Aseguramos que el estado se refleje en el <select>
  if (ref.animeEstado instanceof HTMLSelectElement) {
    ref.animeEstado.value = resultado.estado || "desconocido";
  }

  if (ref.serieViendo instanceof HTMLSelectElement) {
    ref.serieViendo.value = resultado.seguimiento || "ver";
  }

  if (ref.capSeguimiento instanceof HTMLSelectElement) {
    ref.capSeguimiento.value = resultado.cap_estado || "ver";
  }

  if (ref.dia instanceof HTMLSelectElement) {
    ref.dia.value = resultado.dia;
  }

  if (ref.temporadaEstreno instanceof HTMLSelectElement) {
    ref.temporadaEstreno.value = resultado.temporada;
  }
  
  if (resultado.nota && ref.notaUsuario) {
    ref.notaUsuario.value = resultado.nota;
  }
  
  if (resultado.doblaje && ref.doblaje) {
    ref.doblaje.value = resultado.doblaje;
  }
  
  if (resultado.subtitulos && ref.subtitulos) {
    ref.subtitulos.value = resultado.subtitulos;
  }
  
  if (resultado.generos && ref.generosInput) {
    ref.generosInput.value = resultado.generos.join(", ");
  }
  
  // Si hay URL principal, usarla para la imagen
  if (resultado.url_principal && ref.urlImagen) {
    ref.urlImagen.value = resultado.url_principal;
  }
}

// 🧪 Vista genérica si no se encuentra el anime
function prevista_generica(ref, URL_anime, name, temporada, capitulo) {
  ref.animeNombre.textContent = name || "Anime Genérico";
  ref.animeTempoCap.value = `T${temporada}/E${capitulo}`;
  ref.inputNombreAnime.value = URL_anime;
  ref.favoritoCheckbox.checked = true;
}