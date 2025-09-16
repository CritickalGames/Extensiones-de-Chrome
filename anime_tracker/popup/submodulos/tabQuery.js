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
    ref.inputNombreAnime.value = URL_nombre || "";
    prevista_generica(ref, URL_nombre, nombre, temporada, capitulo);
  }
}

async function fn(obj_route, tabs, ref) {
  const activeTab = tabs[0];
  const url = activeTab.url || "No disponible";
  ref.urlActual.textContent = url;

  const { URL_dir, URL_nombre, nombre, temporada, capitulo } = await obj_route('parse.parse_url', { url });
  const resultado = await obj_route('search.conseguir_anime', URL_nombre);

  // Guardamos los datos extraídos en ref para trazabilidad
  Object.assign(ref, { URL_dir, URL_nombre, nombre, temporada, capitulo });

  return { resultado, URL_nombre, nombre, temporada, capitulo };
}

// 🧩 Actualizar DOM con datos de anime
function actualizarDOM(ref, resultado, temporada = 0, capitulo = 0) {
  console.log(resultado);

  ref.animeNombre.textContent = resultado.nombre;
  ref.inputNombreAnime.value = resultado.nombre;
  ref.animePortada.src = resultado.portada;

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
