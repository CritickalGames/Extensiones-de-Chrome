export async function guardarAnimeDesdePopup(obj_route, refs, btnGuardar) {
  const metaAnime = JSON.parse(sessionStorage.getItem("metaAnime"));
  
  const anime={
    clave: refs.texto_id_anime.textContent,              // PK
    nombre: refs.texto_nombre_anime.textContent,
    favorito: refs.entrada_es_favorito .value,
    seguimiento: refs.selector_estado_seguimiento.value,
    audio: refs.selector_idioma_audio.value,
    subtitulos: refs.selector_idioma_subtitulos.value,
    temporada_estreno: refs.selector_temporada_estreno.textContent,
    anyo_estreno: parseInt(refs.entrada_anyo_estreno.value),
    dia_estreno: refs.selector_dia_emision.value,
    estado: refs.selector_estado_general_anime.value,
    nota: parseInt(refs.texto_nota_usuario.textContent),
    generos: refs.entrada_edicion_generos.value,
    temporada_actual: parseInt(refs.entrada_temporada_actual.value),
    episodio_actual: parseInt(refs.entrada_episodio_actual.value),
    url: metaAnime?.urlActual,
    //! Falta : URLIMG
  }

  const genero={
    genero: "acción",             // parte de PK compuesta
    clave: refs.texto_id_anime.textContent,              // FK al anime
  }

  const esValido = verificarCamposDOM([anime, genero]);

  if (esValido) {
    await obj_route("db.guardar", ["animes",anime]);
    await obj_route("db.guardar", ["generos",genero]);
  }

}


function verificarCamposDOM(objetos) {
  const errores = [];

  objetos.forEach((objeto, index) => {
    for (const [clave, valor] of Object.entries(objeto)) {
      if (
        valor instanceof Node || // incluye HTMLElement, Text, etc.
        (typeof valor === "object" && valor !== null && "nodeType" in valor)
      ) {
        errores.push(`🛑 Objeto[${index}] campo "${clave}" contiene un nodo DOM: ${valor.constructor.name}`);
      }
    }
  });

  if (errores.length > 0) {
    console.error("❌ Se detectaron campos con nodos DOM:");
    errores.forEach(e => console.error(e));
    return false;
  }

  console.log("✅ Todos los objetos están libres de nodos DOM.");
  return true;
}
