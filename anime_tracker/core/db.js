import { abrirDB } from "./db/conexion.js";
import { 
  guardarModulo,
  guardarAnime,guardarURL,
  deleteAnime,
  obtenerRegistro,
  leerPorIndice } from "./db/crud.js";
import { getAnimeCompleto, getAllAnimes, getAllAnimesFull, buscar_en_db } from "./db/animes.js";
import { organizarUrls} from "./db/helpers.js";

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

// Exportar todo lo demás
export {
  abrirDB,
  guardarModulo,
  guardarAnime,guardarURL,
  deleteAnime,
  obtenerRegistro,
  leerPorIndice,
  getAnimeCompleto,
  getAllAnimes,
  getAllAnimesFull,
  buscar_en_db,
  organizarUrls
};