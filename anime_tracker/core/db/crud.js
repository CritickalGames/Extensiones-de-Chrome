import { abrirDB } from "./conexion.js";

/**
 * Guarda o actualiza un anime en la base de datos.
 */
function limpiarParaIndexedDB(obj) {
  const limpio = {};
  for (const key in obj) {
    const val = obj[key];
    if (typeof val !== "function" && typeof val !== "symbol") {
      limpio[key] = val;
    } else {
      console.warn(`⚠️ Propiedad no clonable eliminada: ${key}`);
    }
  }
  return limpio;
}

export async function guardarModulo(storeName, objeto) {
  try {
    const store = await abrirDB(storeName, "readwrite");

    const existente = await new Promise((resolve) => {
      const req = store.get(objeto.url_anime);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });

    const limpio = limpiarParaIndexedDB(objeto);

    if (existente) {
      console.info(`🔁 Actualizando en ${storeName}: ${objeto.url_anime}`);
      const actualizado = { ...existente, ...limpio };
      store.put(actualizado);
    } else {
      console.info(`🆕 Insertando en ${storeName}: ${objeto.url_anime}`);
      store.put(limpio);
    }
    return store;
  } catch (err) {
    console.error(`[crud_js.guardarModulo] ❌ Error al guardar en ${storeName}:`, err);
  }
}

export async function guardarURL(objeto) {
  try {
    const store = await abrirDB("urls_base", "readwrite");

    const existente = await new Promise((resolve) => {
      const req = store.get(objeto.url_anime);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });

    const limpio = limpiarParaIndexedDB(objeto);

    if (existente) {
      console.info(`🔁 Actualizando en urls_base: ${objeto.url_anime}`);

      // Si el campo url_dir ya existía, mantenerlo
      if (existente.url_dir) {
        console.info(`⚠️ Manteniendo url_dir original: ${existente.url_dir}`);
        limpio.url_dir = existente.url_dir;
      }
      if (existente.url_ultima) {
        console.info(`⚠️ Manteniendo url_ultima original: ${existente.url_ultima}`);
        limpio.url_ultima = existente.url_ultima;
      }
      const actualizado = { ...existente, ...limpio };
      store.put(actualizado);
    } else {
      console.info(`🆕 Insertando en urls_base: ${objeto.url_anime}`);
      store.put(limpio);
    }
    return store;
  } catch (err) {
    console.error(`[crud_js.guardarURL] ❌ Error al guardar en urls_base:`, err);
  }
}

export async function guardarAnime(objeto) {
  try {
    return await guardarModulo("animes", objeto);
  } catch (err) {
    console.error(`[crud_js.guardarAnime] ❌ Error al guardar en animes:`, err);
  }
}

/**
 * Verifica si un anime existe en la tabla "animes".
 */
async function animeExiste(url_anime) {
  const db = await abrirDB();
  const transaction = db.transaction("animes", "readonly");
  const store = transaction.objectStore("animes");

  const exists = await new Promise((resolve, reject) => {
    const request = store.get(url_anime);
    request.onsuccess = () => resolve(request.result !== undefined);
    request.onerror = () => reject(request.error);
  });

  return exists;
}

/**
 * Elimina un registro de una tabla específica por su clave principal.
 */
async function eliminarRegistro(storeName, key) {
  const db = await abrirDB();
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Elimina todos los registros de "urls_base" relacionados con un url_anime.
 */
async function eliminarUrlsBase(url_anime) {
  const db = await abrirDB();
  const transaction = db.transaction("urls_base", "readwrite");
  const urlsStore = transaction.objectStore("urls_base");
  const urlsIndex = urlsStore.index("url_anime"); // Asumiendo que el índice se llama así

  const urlsToDelete = await new Promise((resolve, reject) => {
    const request = urlsIndex.getAllKeys(url_anime); // Obtener todas las claves secundarias (url_relacion)
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  const promises = urlsToDelete.map(key => eliminarRegistro("urls_base", key));
  await Promise.all(promises);
}

/**
 * Elimina un anime por su clave url_anime.
 */
export async function deleteAnime(url_anime) {
  try {
    const existe = await animeExiste(url_anime);

    if (!existe) {
      return { error: "El anime no existe y no se pudo eliminar.", result: null };
    }

    // Tablas a eliminar (excepto urls_base)
    const tablas = [
      "animes",
      "emision",
      "capitulos",
      "idiomas",
      "estreno",
      "notas",
      "tags",
      "generos"
    ];

    // Eliminar de todas las demás tablas
    const promises = tablas.map(storeName => eliminarRegistro(storeName, url_anime));

    // Eliminar de urls_base usando índice
    await eliminarUrlsBase(url_anime);

    await Promise.all(promises);

    // Devolver un objeto que obj_route pueda interpretar
    return { error: false, result: "Anime eliminado correctamente." };
  } catch (err) {
    console.error(`[crud_js.deleteAnime]`, err);
    return { error: `Error al eliminar: ${err.message}`, result: null };
  }
}

/**
 * Función auxiliar para obtener un registro de IndexedDB
 */
export async function obtenerRegistro(storeName, key) {
  try {
    const db = await abrirDB();
    return await new Promise(resolve => {
      const req = db.transaction(storeName, "readonly").objectStore(storeName).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (error) {
    console.error(`[crud_js.obtenerRegistro] Error obteniendo ${storeName}:`, error);
    return null;
  }
}

/**
 * Lectura defensiva por índice.
 */
export async function leerPorIndice(storeName, indexName, key) {
  try {
    const store = await abrirDB(storeName, "readonly");
    const index = store.index(indexName);
    const request = index.getAll(key);
    
    return await new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve([]);
    });
  } catch (error) {
    console.error(`[crud_js.leerPorIndice] Error leyendo índice ${indexName} en ${storeName}:`, error);
    return [];
  }
}