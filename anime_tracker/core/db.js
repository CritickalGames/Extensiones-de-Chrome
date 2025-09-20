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
  try {
    const store = await abrirDB(storeName, "readonly");
    const index = store.index(indexName);
    const request = index.getAll(key);
    
    return await new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve([]);
    });
  } catch (error) {
    console.error(`Error leyendo índice ${indexName} en ${storeName}:`, error);
    return [];
  }
}

/**
 * Función auxiliar para obtener un registro de IndexedDB
 */
async function obtenerRegistro(storeName, key) {
  try {
    const db = await abrirDB();
    return await new Promise(resolve => {
      const req = db.transaction(storeName, "readonly").objectStore(storeName).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (error) {
    console.error(`Error obteniendo ${storeName}:`, error);
    return null;
  }
}
/**
 * Organiza las URLs en categorías
 */
function organizarUrls(urls) {
  if (!urls || urls.length === 0) {
    return {
      url_principal: null,
      otras_urls: [],
      relacion: "primera"
    };
  }
  
  // Buscar la URL principal
  const urlPrincipal_obj = urls.find(url => url.relacion === "primera") || urls[0];
  const urlPrincipal = urlPrincipal_obj.url_dir;
  const url_relacion = urlPrincipal_obj.relacion;
  
  // Otras URLs (excluyendo la principal)
  const otrasUrls = urls.filter(url => 
    url.url_dir !== urlPrincipal_obj.url_dir
  );
  
  return {
    url_principal: urlPrincipal,
    otras_urls: otrasUrls,
    relacion: url_relacion
  };
}

/**
 * Valores por defecto para cuando hay error
 */
const ANIME_ERROR_DEFAULTS = {
  emision: "—",
  capitulo: "—",
  cap_url: "",
  visto: "ver",
  doblaje: "—",
  subtitulos: "—",
  temporada: "—",
  anyo: "—",
  dia: "",
  nota: "—",
  favorito: false,
  tags: [],
  generos: [],
  url_principal: null,
  otras_urls: [],
  relacion: "primera"
};
/**
 * Obtiene un anime específico con todos sus datos
 */
async function getAnimeCompleto(url_anime) {
  try {
    // Obtener datos base primero
    const base = await obtenerRegistro("animes", url_anime);
    if (!base) return null;

    // Obtener todos los datos relacionados en paralelo
    const [
      emision,
      capitulos,
      idiomas,
      estreno,
      nota,
      tags,
      generos,
      urls
    ] = await Promise.all([
      obtenerRegistro("emision", url_anime),
      obtenerRegistro("capitulos", url_anime),
      obtenerRegistro("idiomas", url_anime),
      obtenerRegistro("estreno", url_anime),
      obtenerRegistro("notas", url_anime),
      leerPorIndice("tags", "url_anime", url_anime),
      leerPorIndice("generos", "url_anime", url_anime),
      leerPorIndice("urls_base", "por_url_anime", url_anime)
    ]);
    
    // Organizar las URLs
    const urlsOrganizadas = organizarUrls(urls || []);
    
    return {
      ...base,
      emision: emision?.estado || "—",
      capitulo: capitulos?.capitulo || "—",
      cap_url: capitulos?.url_dir || "",
      visto: (capitulos?.visto) ? "visto" : "ver", 
      doblaje: idiomas?.doblaje || "—",
      subtitulos: idiomas?.subtitulos || "—",
      temporada: estreno?.temporada || "—",
      anyo: estreno?.anyo || "—",
      dia: estreno?.dia || "",
      nota: nota?.nota || "—",
      tags: tags.map(t => t?.tipo || t) || [],
      generos: generos.map(g => g?.genero || g) || [],
      ...urlsOrganizadas // Añade url_principal y otras_urls
    };

  } catch (error) {
    console.error("Error obteniendo anime completo:", error);
    return null;
  }
}

/**
 * Obtiene todos los animes con paginación
 */
export async function getAllAnimes(page = 1, limit = 20) {
  try {
    const db = await abrirDB();
    const baseStore = db.transaction("animes", "readonly").objectStore("animes");
    
    // Obtener todos los animes
    const baseReq = baseStore.getAll();
    
    return await new Promise((resolve, reject) => {
      baseReq.onsuccess = async () => {
        const allBases = baseReq.result;
        
        // Calcular paginación
        const total = allBases.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const bases = allBases.slice(startIndex, endIndex);
        
        const resultado = [];
        
        // Procesar cada anime usando la función existente
        for (const base of bases) {
          try {
            const animeCompleto = await getAnimeCompleto(base.url_anime);
            if (animeCompleto) {
              resultado.push(animeCompleto);
            } else {
              // Si falla, añadir el base con valores por defecto
              resultado.push({...base, ...ANIME_ERROR_DEFAULTS});
            }
          } catch (error) {
            console.error(`Error procesando anime ${base.url_anime}:`, error);
            resultado.push({...base, ...ANIME_ERROR_DEFAULTS});
          }
        }
        
        resolve({
          data: resultado,
          pagination: {
            page: page,
            limit: limit,
            total: total,
            pages: Math.ceil(total / limit)
          }
        });
      };

      baseReq.onerror = () => reject("❌ Error al obtener los animes.");
    });
  } catch (err) {
    console.error("❌ Error en getAllAnimes:", err);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: limit,
        total: 0,
        pages: 0
      }
    };
  }
}

/**
 * Obtiene todos los animes (sin paginación, para compatibilidad)
 */
export async function getAllAnimesFull() {
  const result = await getAllAnimes(1, 10000); // Número grande para obtener todos
  return result.data;
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
  
  const resultado = await getAnimeCompleto(url_anime);
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