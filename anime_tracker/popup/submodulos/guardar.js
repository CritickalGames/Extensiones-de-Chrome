export async function guardarAnimeDesdePopup(obj_route, btnGuardar, refs) {
  const {
    inputNombreAnime,
    animeNombre,
    animePortada,
    urlActual,
    animeEstado,
    serieViendo,
    capVisto,
    animeTempoCap,
    doblaje,
    subtitulos
  } = refs;

  const url_anime = inputNombreAnime?.value.trim().toLowerCase().replace(/\s+/g, "-");
  const url_dir = urlActual?.textContent?.trim();
  const cap = animeTempoCap?.value?.trim() || "";
  const EPISODIO = cap.match(/(.*?)(\d+)(.*?)(\d+)/)[2];

  const anime_base = {
    url_anime,
    nombre: animeNombre?.textContent?.trim(),
    portada: animePortada?.src,
    seguimiento: serieViendo?.value || "ver"
  };
  const url ={
    url_anime,
    url_dir,
    seguimiento: serieViendo?.value || "ver",
    relación: "temporada"
  };

  const emision = {
    url_anime,
    estado: animeEstado?.value || "desconocido"
  };

  const capitulos = {
    url_anime,
    visto: capVisto?.checked,
    capitulo: cap
  };

  const idiomas = {
    url_anime,
    doblaje: doblaje?.value || "es",
    subtitulos: subtitulos?.value || "es"
  };

  // 🗃️ Guardar cada módulo por separado
  await obj_route("db.guardarAnime", anime_base);
  await obj_route("db.guardarModulo", ["emision", emision]);
  await obj_route("db.guardarModulo", ["capitulos", capitulos]);
  await obj_route("db.guardarModulo", ["idiomas", idiomas]);
  if (EPISODIO==0){
    await obj_route("db.guardarModulo",["urls_base",url]);
  }

  btnGuardar.textContent = "Guardado ✔";
  setTimeout(() => btnGuardar.textContent = "Guardar anime", 1500);
}