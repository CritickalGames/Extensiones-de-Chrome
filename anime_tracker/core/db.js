import { obj_route } from "./router.js";
let dbInstance = null;

/**
 * Abre la base de datos AnimeDB como singleton.
 * Si se pasan objectStoreName y accion, devuelve directamente el objectStore.
 */
export async function abrirDB(objectStoreName = null, accion = null) {
  if (dbInstance) {
    return objectStoreName && accion
      ? dbInstance.transaction(objectStoreName, accion).objectStore(objectStoreName)
      : dbInstance;
  }

  dbInstance = await crearDB();
  return objectStoreName && accion
    ? dbInstance.transaction(objectStoreName, accion).objectStore(objectStoreName)
    : dbInstance;
}

// Estructura que tendrá la base de datos
const storesSchema = [
  {
    name: "animes",
    options: { keyPath: "url_anime" },
    indices: [
      { name: "url_dir", keyPath: "url_dir", options: { unique: false } }
    ]
  }
];

// 🧱 Función interna para crear la base y sus stores
async function crearDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("AnimeIsAlive2", 1);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;

      storesSchema.forEach(storeDef => {
        const store = db.createObjectStore(storeDef.name, storeDef.options);
        storeDef.indices.forEach(index =>
          store.createIndex(index.name, index.keyPath, index.options)
        );
      });
    };

    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject("❌ Error al abrir la base de datos.");
  });
}

/**
 * Guarda o actualiza un anime en la base de datos.
 */
export async function guardar_anime(anime) {
  try {
    const store = await abrirDB("animes", "readwrite");

    console.warn(anime);
    console.warn(anime.url_anime);
    const existente = await new Promise((resolve) => {
      
      const req = store.get(anime.url_anime);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });

    if (existente) {
      console.info(`🔁 Actualizando anime existente: ${anime.url_anime}`);
    }

    store.put(anime);
  } catch (err) {
    console.error("❌ Error al guardar anime:", err);
  }
}

/**
 * Obtiene todos los animes guardados.
 */
export async function getAllAnimes() {
  try {
    const store = await abrirDB("animes", "readonly");

    return await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("❌ Error al obtener los animes.");
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}

/**
 * Elimina un anime por su clave url_anime.
 */
export async function deleteAnime(url_anime) {
  try {
    const store = await abrirDB("animes", "readwrite");
    
    return await new Promise((resolve, reject) => {
      const request = store.delete(url_anime);
      request.onsuccess = () => resolve();
      request.onerror = () => reject("❌ No se pudo borrar el anime.");
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Busca un anime por su clave url_anime.
 */
export async function buscar_en_db(url_anime) {
  const store = await abrirDB("animes", "readonly");

  const resultado = await new Promise((resolve) => {
    const req = store.get(url_anime);
    req.onsuccess = () => resolve(req.result || false);
    req.onerror = () => resolve(false);
  });

  if (resultado) return resultado;

  // Buscar en API si no está en DB
  const api_resultado = await obj_route('api.buscar_en_api', url_anime);
  if (!api_resultado) return false;

  // Guardar en DB si lo encontrás
  //! Aún no lo decido: await obj_route('db.guardar_anime', api_resultado);

  return api_resultado;
}
