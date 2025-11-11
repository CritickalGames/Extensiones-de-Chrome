export async function guardarAnimeDesdePopup(obj_route, refs, btnGuardar) {
  const metaAnime = JSON.parse(sessionStorage.getItem("metaAnime"));
  
  const anime={
    clave: refs.texto_id_anime.textContent,              // PK
    nombre: refs.texto_nombre_anime.textContent,
    favorito: refs.entrada_es_favorito .value,
    seguimiento: refs.selector_estado_seguimiento.value,
    audio: refs.selector_idioma_audio.value,
    subtitulos: refs.selector_idioma_subtitulos.value,
    temporada_estreno: refs.selector_temporada_estreno.value,
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

  const generos = refs.entrada_edicion_generos.value
  .split(",")
  .map(g => g.trim())
  .filter(g => g.length > 0)
  .map(genero => ({
    genero,
    clave: refs.texto_id_anime.value
  }));


  await obj_route("db.guardar", ["animes",anime]);
  await Promise.all(
    generos.map(genero => obj_route("db.guardar", ["generos", genero]))
  );

}