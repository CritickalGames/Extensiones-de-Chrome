let dbInstance = null;

/**
 * Abre la base de datos AnimeDB como singleton.
 */
export async function abrirDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await new Promise((resolve, reject) => {
    const req = indexedDB.open("AnimeDB", 1);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      const store = db.createObjectStore("animes", { keyPath: "URL_nombre" });
      store.createIndex("URL_dir", "URL_dir", { unique: false });
    };

    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject("❌ Error al abrir la base de datos.");
  });

  return dbInstance;
}

/**
 * Guarda o actualiza un anime en la base de datos.
 */
export async function guardar_anime(anime) {
  try {
    const db = await abrirDB();
    const tx = db.transaction("animes", "readwrite");
    const store = tx.objectStore("animes");

    // Validación opcional: evitar duplicados
    const existente = await new Promise((resolve) => {
      const req = store.get(anime.URL_nombre);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });

    if (existente) {
      console.info(`🔁 Actualizando anime existente: ${anime.URL_nombre}`);
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
    const db = await abrirDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("animes", "readonly");
      const store = tx.objectStore("animes");
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
 * Elimina un anime por su clave URL_nombre.
 */
export async function deleteAnime(URL_nombre) {
  try {
    const db = await abrirDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("animes", "readwrite");
      const store = tx.objectStore("animes");
      const request = store.delete(URL_nombre);
      request.onsuccess = () => resolve();
      request.onerror = () => reject("❌ No se pudo borrar el anime.");
    });
  } catch (err) {
    console.error(err);
  }
}
