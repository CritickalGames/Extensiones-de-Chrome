export const storesSchema = [
  {
    name: "animes", // 🧩 Store principal
    //*Guarda: 
    // url_anime (clave primaria), 
    // nombre, 
    // url_dir, 
    // portada, 
    // seguimiento(ver, viendo, abandonado, completado)
    options: { keyPath: "url_anime" },
    indices: [
      { name: "url_dir", keyPath: "url_dir", options: { unique: false } }
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
    // Guarda: url_anime (FK), estado ("emitiéndose", "finalizado", "película")
    options: { keyPath: "url_anime" },
    indices: [{ name: "estado", keyPath: "estado" }]
  },
  {
    name: "visto", // 👀 Estado de visualización
    // Guarda: url_anime (FK), estado ("viendo", "completado", "pendiente")
    options: { keyPath: "url_anime" },
    indices: [{ name: "estado", keyPath: "estado" }]
  },
  {
    name: "tags", // 🏷️ Clasificación por tipo
    // Guarda: url_anime (FK), tipo ("serie", "película", "OVA", etc.)
    options: { keyPath: ["url_anime", "tipo"] },
    indices: [
      { name: "url_anime", keyPath: "url_anime" },
      { name: "tipo", keyPath: "tipo" }
    ]
  },
  {
    name: "temporadas", // 🌸 Temporada de emisión
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
    // Guarda: url_anime (FK), relacion ("secuela", "precuela", "spin-off", etc.)
    options: { keyPath: ["url_anime", "relacion"] },
    indices: [
      // Podés agregar: { name: "url_anime", keyPath: "url_anime" }, { name: "relacion", keyPath: "relacion" }
    ]
  },
  {
    name: "actualizaciones", // 📅 Día de actualización
    // Guarda: url_anime (FK), dia ("lunes", "martes", etc.)
    options: { keyPath: "url_anime" },
    indices: [
      { name: "dia", keyPath: "dia" }
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
