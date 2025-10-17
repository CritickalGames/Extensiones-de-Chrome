import { storesSchema } from "./estructuras.js";

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