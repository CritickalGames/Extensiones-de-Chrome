export async function guardarAnimeDesdePopup(obj_route, refs) {
  const {
    inputNombreAnime,
    animeNombre,
    animeEstado,
    animeTempoCap,
    animeEstadoViendo,
    animePortada,
    urlActual,
    btnGuardar
  } = refs;

  const anime = {
    url_anime: inputNombreAnime?.value.trim(),
    nombre: animeNombre?.textContent?.trim(),
    portada: animePortada?.src,
    url_dir: urlActual?.textContent?.trim(),
    seguimiento: "ver"
  };

  await obj_route("db.guardar_anime", anime);

  btnGuardar.textContent = "Guardado ✔";
  setTimeout(() => btnGuardar.textContent = "Guardar anime", 1500);
}