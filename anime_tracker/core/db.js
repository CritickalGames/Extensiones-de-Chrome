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

  dbInstance = await new Promise((resolve, reject) => {
    const req = indexedDB.open("AnimeIsAlive2", 1);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      const store = db.createObjectStore("animes", { keyPath: "URL_nombre" });
      store.createIndex("URL_dir", "URL_dir", { unique: false });
    };

    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject("❌ Error al abrir la base de datos.");
  });

  return objectStoreName && accion
    ? dbInstance.transaction(objectStoreName, accion).objectStore(objectStoreName)
    : dbInstance;
}

/**
 * Guarda o actualiza un anime en la base de datos.
 */
export async function guardar_anime(anime) {
  try {
    const store = await abrirDB("animes", "readwrite");

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
 * Elimina un anime por su clave URL_nombre.
 */
export async function deleteAnime(URL_nombre) {
  try {
    const store = await abrirDB("animes", "readwrite");

    return await new Promise((resolve, reject) => {
      const request = store.delete(URL_nombre);
      request.onsuccess = () => resolve();
      request.onerror = () => reject("❌ No se pudo borrar el anime.");
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Busca un anime por su clave URL_nombre.
 */
export async function buscar_en_db(URL_nombre) {
  const store = await abrirDB("animes", "readonly");

  return await new Promise((resolve) => {
    const req = store.get(URL_nombre);
    req.onsuccess = () => resolve(req.result || false);
    console.warn("REQ:", req);
    
    req.onerror = () => resolve(false);
  });
}
