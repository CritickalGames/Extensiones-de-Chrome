export const storesSchema = [
  {
    name: "animes", // 🧩 Store principal
    //*Guarda: 
    // url_anime (clave primaria), 
    // nombre, 
    // url_dir, 
    // temporada, 
    // portada, 
    // seguimiento(ver, viendo, abandonado, completado),
    // favorito
    options: { keyPath: "url_anime" },
    indices: [
      { name: "favorito", keyPath: "favorito", options:{unique: false}},
    ]
  },
  {
    name: "urls_base", // 🔗 URLs múltiples por anime
    //*Guarda:
    // url_anime (FK)
    // url_relacion (PK)
    // url_dir
    // url_ultima //la última en ser guardada
    // relación (secuelas, película, paralela, primera)
    options: { keyPath: ["url_anime", "url_relacion"] }, // Clave primaria compuesta
    indices: [
      { name: "url_anime", keyPath: "url_anime" },
      { name: "relacion", keyPath: "relacion", options:{unique: false}},
      { name: "url_relacion", keyPath: "url_relacion", options:{unique: false}},
    ]
  },
  {
    name: "capitulos", // 📺 Episodios individuales
    //*Guarda: 
    // url_anime (FK), 
    // capitulo (formato T1/E5), 
    // visto (boolean), 
    // url del capítulo
    options: { keyPath: "url_anime" },
    indices: [
      { name: "visto", keyPath: "visto", options: { unique: false } }
    ]
  },
  {
    name: "emision", // 📡 Estado de emisión
    // Guarda: url_anime (FK), estado ("emitiéndose", "finalizado")
    options: { keyPath: "url_anime" },
    indices: [{ name: "estado", keyPath: "estado" }]
  },
  {
    name: "tags", // 🏷️ Clasificación por tipo
    //*Guarda: 
    // url_anime (FK), 
    // tipo ("serie", "película", "OVA", etc.)
    // Actualización (no o día de la semana)
    options: { keyPath: ["url_anime", "tipo"] },
    indices: [
      { name: "url_anime", keyPath: "url_anime" },
      { name: "tipo", keyPath: "tipo", options:{unique: false} }
    ]
  },
  {
    name: "estreno", // 🌸 Temporada de emisión
    // Guarda: url_anime (FK), temporada ("primavera", "verano", etc.), año
    options: { keyPath: "url_anime" },
    indices: [
      { name: "temporada", keyPath: "temporada", options:{unique: false} },
      { name: "anyo", keyPath: "anyo", options:{unique: false} },
      { name: "dia", keyPath: "dia", options:{unique: false} }
    ]
  },
  {
    name: "generos", // 🎭 Géneros narrativos
    // Guarda: url_anime (FK), genero[PK] ("acción", "comedia", "drama", etc.)
    options: { keyPath: ["url_anime", "genero"] },
    indices: [
      { name: "url_anime", keyPath: "url_anime" },
      { name: "genero", keyPath: "genero" }
    ]
  },
  {
    name: "notas", // 📝 Calificación del usuario
    // Guarda: url_anime (FK), nota (número entre 1 y 10)
    options: { keyPath: "url_anime" },
    indices: [
      { name: "nota", keyPath: "nota" }
    ]
  },
  {
    name: "idiomas", // 🌍 Idioma de audio y subtítulos
    // Guarda: url_anime (FK), doblaje ("japonés", "español", etc.), subtitulo ("español", "inglés", etc.)
    options: { keyPath: "url_anime" },
    indices: [
      { name: "doblaje", keyPath: "doblaje" },
      { name: "subtitulo", keyPath: "subtitulo" }
    ]
  }
];
