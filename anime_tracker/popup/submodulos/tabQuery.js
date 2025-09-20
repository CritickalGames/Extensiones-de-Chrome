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
    _URL_dir,
    URL_nombre,
    nombre,
    temporada,
    capitulo 
  } = parseo.result;

  const busqueda = await obj_route('search.conseguir_anime', URL_nombre);
  console.warn(busqueda);
  
  // Con el nuevo router: error === false significa éxito
  let resultado = null;
  if (!busqueda.error) {
    resultado = parseo.result;
    console.log('Anime encontrado:', busqueda.result);
  } else {
    console.warn('No se encontró al buscar el anime:', busqueda.result);
  }

  return { resultado, URL_nombre, nombre, temporada, capitulo };
}

// 🧩 Actualizar DOM con datos de anime
function actualizarDOM(ref, resultado, temporada = 0, capitulo = 0) {
  console.log(resultado);

  ref.animeNombre.textContent = resultado.nombre;
  ref.inputNombreAnime.value = resultado.nombre;
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

  ref.animeTempoCap.value = `T${temporada}/E${capitulo}`;
}

// 🧪 Vista genérica si no se encuentra el anime
function prevista_generica(ref, URL_anime, name, temporada, capitulo) {
  ref.animeNombre.textContent = name || "Anime Genérico";

  if (ref.animeEstado instanceof HTMLSelectElement) {
    ref.animeEstado.value = "desconocido";
  }

  if (ref.serieViendo instanceof HTMLSelectElement) {
    ref.serieViendo.value = "ver";
  }

  if (ref.capSeguimiento instanceof HTMLSelectElement) {
    ref.capSeguimiento.value = "ver";
  }

  ref.animeTempoCap.value = `T${temporada}/E${capitulo}`;
  ref.inputNombreAnime.value = URL_anime;
}