export async function iniciar(obj_route, tabs, ref) {
  const resultado = await fn(obj_route, tabs, ref);

  if (resultado) {
    actualizarDOM(ref, resultado, resultado.temporada, resultado.capitulo);
  } else {
    ref.inputNombreAnime.value = resultado?.URL_nombre || "";
    prevista_generica(ref, resultado?.URL_nombre, resultado?.nombre, resultado?.temporada, resultado?.capitulo);
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

  return resultado;
}

// 🧩 Actualizar DOM con datos de anime
function actualizarDOM(ref, resultado, temporada = 0, capitulo = 0) {
  ref.animeNombre.textContent = resultado.nombre;
  ref.animeEstado.textContent = resultado.estado;
  ref.animeTempoCap.value = `T${temporada}/E${capitulo}`;
  ref.animeEstadoViendo.textContent = resultado.viendo;
  ref.animePortada.src = resultado.portada;
  ref.inputNombreAnime.value = resultado.nombre;

  ref.animeEstadoViendo.style.color = resultado.viendo === "Visto ✔" ? "green" : "red";
}

// 🧪 Vista genérica si no se encuentra el anime
function prevista_generica(ref, URL_anime, name, temporada, capitulo) {
  ref.animeNombre.textContent = name || "Anime Genérico";
  ref.animeEstado.textContent = "? Desconocido";
  ref.animeTempoCap.value = `T${temporada}/E${capitulo}`;
  ref.inputNombreAnime.value = URL_anime;
}
