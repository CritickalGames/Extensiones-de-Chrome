import { obj_route } from "./router.js";
import { storesSchema } from "./db/estructuras.js";
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
function limpiarParaIndexedDB(obj) {//Medida extra de protección
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
    console.error(`❌ Error al guardar en ${storeName}:`, err);
  }
}
export async function guardarAnime(objeto) {
  try {
    const { cap, ...resto } = objeto;

    // Guardar el anime sin el campo "capitulo"
    return await guardarModulo("animes", resto);

  } catch (err) {
    console.error(`❌ Error al guardar en animes:`, err);
  }
}

/**
 * Lectura defensiva por índice.
 */
async function leerPorIndice(storeName, indexName, key) {
  const store = await abrirDB(storeName, "readonly");
  return await new Promise((resolve) => {    
    const req = store.index(indexName).getAll(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve([]);
  });
}

/**
 * Lectura defensiva por índice con mapeo.
 */
async function leerPorIndiceMap(storeName, indexName, key, mapFn) {
  const store = await abrirDB(storeName, "readonly");
  return await new Promise((resolve) => {
    const req = store.index(indexName).getAll(key);
    req.onsuccess = () => resolve(req.result.map(mapFn));
    req.onerror = () => resolve([]);
  });
}

/**
 * Obtiene todos los animes reconstruyendo desde múltiples stores.
 */
export async function getAllAnimes() {
  try {
    const baseStore = await abrirDB("animes", "readonly");
    const baseReq = baseStore.getAll();

    return await new Promise((resolve, reject) => {
      baseReq.onsuccess = async () => {
        const bases = baseReq.result;
        const resultado = [];

        for (const base of bases) {
          const url = base.url_anime;

          const [
            emisionStore,
            capitulosStore,
            idiomasStore,
            estrenoStore,
            notasStore,
            favoritosStore
          ] = await Promise.all([
            abrirDB("emision", "readonly"),
            abrirDB("capitulos", "readonly"),
            abrirDB("idiomas", "readonly"),
            abrirDB("estreno", "readonly"),
            abrirDB("notas", "readonly"),
            abrirDB("favoritos", "readonly")
          ]);

          const [
            emision,
            capitulos,
            idiomas,
            estreno,
            nota,
            favorito
          ] = await Promise.all([
            emisionStore.get(url),
            capitulosStore.get(url),
            idiomasStore.get(url),
            estrenoStore.get(url),
            notasStore.get(url),
            favoritosStore.get(url)
          ]);

          const tags = await leerPorIndice("tags", "url_anime", url);
          const relaciones = await leerPorIndice("relaciones", "url_anime1", url);
          const generos = await leerPorIndiceMap("generos", "url_anime", url, g => g.genero);
          resultado.push({
            ...base,
            emision: emision.result?.estado || "—",
            capitulo: capitulos.result?.capitulo || "—",
            cap_url: capitulos.result?.cap_url || "",
            visto: (capitulos.result.visto) ? "visto" : "ver", 
            doblaje: idiomas.result?.doblaje || "—",
            subtitulos: idiomas.result?.subtitulos || "—",
            temporada: estreno.result?.temporada || "—",
            año: estreno.result?.año || "—",
            nota: nota.result?.nota || "—",
            favorito: favorito.result?.favorito ? true : false,
            tags,
            generos,
            relaciones
          });
        }
        
        resolve(resultado);
      };

      baseReq.onerror = () => reject("❌ Error al obtener los animes.");
    });
  } catch (err) {
    console.error("❌ Error en getAllAnimes:", err);
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
  console.log("buscar_en_db(",url_anime,")");
  
  const resultado = await new Promise((resolve) => {
    const req = store.get(url_anime);
    req.onsuccess = () => resolve(req.result || false);
    req.onerror = () => resolve(false);
  });

  return {
      error: !resultado? `No existe ${url_anime}`:false,
      result: resultado
    };
}

// EXPORTAR E IMPORTAR
export async function exportarBDComoJSON(stores) {
  const respaldo = {};

  for (const storeName of stores) {
    const store = await abrirDB(storeName, "readonly");
    const req = store.getAll();

    respaldo[storeName] = await new Promise((resolve) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve([]);
    });
  }

  return JSON.stringify(respaldo, null, 2); // JSON legible
}

export async function importarDesdeJSON(json) {
  try {
    const respaldo = JSON.parse(json);

    for (const storeName in respaldo) {
      const store = await abrirDB(storeName, "readwrite");

      for (const objeto of respaldo[storeName]) {
        store.put(objeto);
      }

      console.info(`📥 Importados ${respaldo[storeName].length} registros en ${storeName}`);
    }
  } catch (err) {
    console.error("❌ Error al importar respaldo:", err);
  }
}