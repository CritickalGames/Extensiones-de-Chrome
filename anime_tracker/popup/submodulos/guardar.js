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

  const anime_base = {
    url_anime,
    nombre: animeNombre?.textContent?.trim(),
    portada: animePortada?.src,
    url_dir: urlActual?.textContent?.trim(),
    seguimiento: serieViendo?.value || "ver"
  };

  const emision = {
    url_anime,
    estado: animeEstado?.value || "desconocido"
  };

  const capitulos = {
    url_anime,
    visto: capVisto?.checked,
    capitulo: animeTempoCap?.value?.trim() || ""
  };

  const idiomas = {
    url_anime,
    doblaje: doblaje?.value || "es",
    subtitulos: subtitulos?.value || "es"
  };

  // 🗃️ Guardar cada módulo por separado
  await obj_route("db.guardarModulo", ["animes", anime_base]);
  await obj_route("db.guardarModulo", ["emision", emision]);
  await obj_route("db.guardarModulo", ["capitulos", capitulos]);
  await obj_route("db.guardarModulo", ["idiomas", idiomas]);

  btnGuardar.textContent = "Guardado ✔";
  setTimeout(() => btnGuardar.textContent = "Guardar anime", 1500);
}