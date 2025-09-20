export async function guardarAnimeDesdePopup(obj_route, btnGuardar, refs) {
  const url_anime = refs.inputNombreAnime?.value.trim().toLowerCase().replace(/\s+/g, "-");
  const url_dir = refs.urlActual?.textContent?.trim();
  const cap = refs.animeTempoCap?.value?.trim() || "";
  const EPISODIO = cap.match(/(.*?)(\d+)(.*?)(\d+)/)?.[2] || 0;

  // Datos base del anime
  const anime_base = {
    url_anime,
    nombre: refs.animeNombre?.textContent?.trim() || refs.inputNombreAnime?.value.trim(),
    portada: refs.urlImagen?.value.trim() || refs.animePortada?.src,
    seguimiento: refs.serieViendo?.value || "ver",
    favorito: refs.favoritoCheckbox?.checked || false
  };

  // URL base
  const url = {
    url_anime,
    url_dir,
    relacion: refs.relacionUrl?.value || "primera"
  };

  // Estado de emisión
  const emision = {
    url_anime,
    estado: refs.animeEstado?.value || "desconocido"
  };

  // Capítulos
  const capitulos = {
    url_anime,
    visto: refs.capVisto?.checked,
    capitulo: cap,
    url_dir
  };

  // Idiomas
  const idiomas = {
    url_anime,
    doblaje: refs.doblaje?.value || "es",
    subtitulos: refs.subtitulos?.value || "es"
  };

  // Estreno
  const estreno = {
    url_anime,
    temporada: refs.temporadaEstreno?.value || "",
    anyo: refs.anyoEstreno?.value || "",
    dia: refs.dia?.value || ""
  };

  // Nota
  const nota = {
    url_anime,
    nota: refs.notaUsuario?.value ? parseInt(refs.notaUsuario.value) : 0
  };


  // 🗃️ Guardar cada módulo por separado
  await obj_route("db.guardarAnime", anime_base);
  await obj_route("db.guardarModulo", ["emision", emision]);
  await obj_route("db.guardarModulo", ["capitulos", capitulos]);
  await obj_route("db.guardarModulo", ["idiomas", idiomas]);
  await obj_route("db.guardarModulo", ["estreno", estreno]);
  await obj_route("db.guardarModulo", ["notas", nota]);
  
  // Guardar URL base (es donde está toda la lista de capítulos)
  if (EPISODIO == 0) {
    await obj_route("db.guardarModulo", ["urls_base", url]);
  }
  
  // Guardar géneros (múltiples)
  if (refs.generosInput?.value) {
    const generos = refs.generosInput.value.split(",").map(g => g.trim()).filter(g => g);
    for (const genero of generos) {
      await obj_route("db.guardarModulo", ["generos", { url_anime, genero }]);
    }
  }
  
  // Guardar tags (múltiples)
  if (refs.tagsTipo?.value) {
    const tags = refs.tagsTipo.value.split(",").map(t => t.trim()).filter(t => t);
    for (const tipo of tags) {
      const tag = {
        url_anime,
        tipo: tipo
      };
      await obj_route("db.guardarModulo", ["tags", tag]);
    }
  }

  btnGuardar.textContent = "Guardado ✔";
  setTimeout(() => btnGuardar.textContent = "Guardar anime", 1500);
}