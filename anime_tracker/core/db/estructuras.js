export const storesSchema = [
  {
    name: "animes", // 🧩 Store principal
    //*Guarda: 
    // url_anime (clave primaria), 
    // nombre, 
    // url_dir, 
    // temporada, 
    // portada, 
    // seguimiento(ver, viendo, abandonado, completado)
    options: { keyPath: "url_anime" },
    indices: [
      { name: "url_dir", keyPath: "url_dir", options: { unique: false } }
    ]
  },
  {
    name: "urls_base", // 🔗 URLs múltiples por anime
    options: { keyPath: ["url_anime", "url_dir"] }, // Clave primaria compuesta
    indices: [
      { name: "por_url_anime", keyPath: "url_anime" }
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
      { name: "tipo", keyPath: "tipo", options:{unique: false} },
      { name: "dia", keyPath: "dia", options:{unique: false} }
    ]
  },
  {
    name: "estreno", // 🌸 Temporada de emisión
    // Guarda: url_anime (FK), temporada ("primavera", "verano", etc.), año
    options: { keyPath: "url_anime" },
    indices: [
      { name: "temporada", keyPath: "temporada" },
      { name: "año", keyPath: "año" }
    ]
  },
  {
    name: "generos", // 🎭 Géneros narrativos
    // Guarda: url_anime (FK), genero ("acción", "comedia", "drama", etc.)
    options: { autoIncrement: true },
    indices: [
      { name: "url_anime", keyPath: "url_anime" },
      { name: "genero", keyPath: "genero" }
    ]
  },
  {
    name: "relaciones", // 🔗 Vínculos entre animes
    // Guarda: url_anime1 (origen), url_anime2 (destino), relacion ("secuela", etc.)
    options: { keyPath: ["url_anime1", "url_anime2"] },
    indices: [
      { name: "url_anime1", keyPath: "url_anime1", options: { unique: false } },
      { name: "url_anime2", keyPath: "url_anime2", options: { unique: false } },
      { name: "relacion", keyPath: "relacion", options: { unique: false } }
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
    name: "favoritos", // ⭐ Marcado como favorito
    // Guarda: url_anime (FK), favorito (booleano: true/false)
    options: { keyPath: "url_anime" },
    indices: []
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
