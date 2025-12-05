export async function guardar_anime(obj_route, refs) {
  const metaAnime = JSON.parse(sessionStorage.getItem("metaAnime"));
  const dato_clave =  refs.texto_id_anime.textContent; //~ no me gusta hacer llamadas dos veces.
  //* Parsear información
  //** Tabla anime
  
  let temporada_actual= parseInt(refs.entrada_temporada_actual.value);
  let episodio_actual= parseInt(refs.entrada_episodio_actual.value);
  let ep_visto;
  if (refs.entrada_episodio_visto.checked){
    ep_visto = [temporada_actual, episodio_actual];
  }
  const anime={
    clave: dato_clave,              // PK
    nombre: refs.texto_nombre_anime.textContent,
    favorito: ""+refs.entrada_es_favorito.checked,
    ep_visto,
    seguimiento: refs.selector_estado_seguimiento.value,
    audio: refs.selector_idioma_audio.value,
    subtitulos: refs.selector_idioma_subtitulos.value,
    temporada_estreno: refs.selector_temporada_estreno.value,
    anyo_estreno: parseInt(refs.entrada_anyo_estreno.value),
    dia_estreno: refs.selector_dia_emision.value,
    estado: refs.selector_estado_general_anime.value,
    nota: parseInt(refs.texto_nota_usuario.textContent),
    generos: refs.entrada_edicion_generos.value,
    url: metaAnime?.urlActual,
    url_img: metaAnime?.urlImagen
  }
  await obj_route("db.guardar", ["animes",anime]);
  //** Tabla generos
  //? ¿Debería hacer que llame a guardar_generos? De momento, no. Creo que es innecesario.
  // await guardar_generos(obj_route, refs);
  //** Tabla Folders
  /*
    Esto se debe guardar con "save folder".
    No tiene sentido guardar algo que no cambia tanto.
    ? Quizás vale la pena para ponerlo en "pendiente", "viendo", etc
    ? Quizás no vale la pena y se pueden falsear las carpetas de seguimiento.
  */

}

export async function guardar_generos(obj_route, refs) {
  const metaAnime = JSON.parse(sessionStorage.getItem("metaAnime"));
  const dato_clave =  refs.texto_id_anime.textContent; //~ no me gusta hacer llamadas dos veces.
  //- 1. Lista actual (entrada del usuario)
  const generosActuales = refs.entrada_edicion_generos.value
    .split(",")
    .map(g => g.trim())
    .filter(g => g.length > 0);

  //- 2. Lista original (desde sessionStorage)
  const tagsOriginales = metaAnime?.tagsOriginales
    .split(",")
    .map(g => g.trim())
    .filter(g => g.length > 0);

  //- 3. Diferencia: los que estaban antes pero ya no están ahora
  const generosEliminados = tagsOriginales.filter(
    g => !generosActuales.includes(g)
  );

  //- 4. Eliminar de la base de datos (ejemplo con fetch)
  await Promise.all(
    generosEliminados.map(eliminar => obj_route("db.borrar", ["generos", [eliminar, dato_clave]]))
  );

  //- 5. Guardar los generos
  const generos = generosActuales.map(genero => ({
    genero,
    clave: dato_clave
  }));

  await Promise.all(
    generos.map(genero => obj_route("db.guardar", ["generos", genero]))
  );
}

export async function guardar_folder(obj_route, refs) {
  //- Conseguir clave
  //- Conseguir Seguimiento
  //- Conseguir Favorito
  //- Conseguir Año
  //- Conseguir Temporada
  //- Conseguir Día de Estreno
  //- Conseguir Estado de Emisión
  //- Conseguir Meta_folders
  //- Encontrar diferencia
  //--Borra diferencias, si hay

  await Promise.all(
    //folders.map(folder => obj_route("db.guardar", ["folders", folder]))
  );
}