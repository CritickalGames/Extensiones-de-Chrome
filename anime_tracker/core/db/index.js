import { abrir_db } from "./abrir.js";
import { STORES } from "./stores.js";

export async function guardar(store, tabla) {
  try {
    const objectStore = await db_object_store(store);
    if (objectStore.error) {
      return {
        error: objectStore.error,
        result: null
      };
    }
    const request = objectStore.put(tabla); // usa `put` para insertar o actualizar

    request.onsuccess = function () {
      console.log(`✅ Guardado exitoso en store "${store}"`);
    };

    request.onerror = function (event) {
      console.error("❌ Error al guardar:\n", event.target.error, "\n");
    };
  } catch (error) {
    console.error("❌ Error al abrir la base de datos:\n", error);
  }
}

export async function borrar(store, PK) {
  try {
    const objectStore = await db_object_store(store);
    if (objectStore.error) {
      return {
        error: objectStore.error,
        result: null
      };
    }
    const request = objectStore.delete(PK);

    request.onsuccess = function () {
      console.log(`🗑️ Borrado exitoso en store "${store}"`);
    };

    request.onerror = function (event) {
      console.error("❌ Error al borrar:\n", event.target.error, "\n");
    };
  } catch (error) {
    console.error("❌ Error al abrir la base de datos:\n", error);
  }
}

export async function buscar_anime(PK) {
  return buscar(STORES.animes,PK);
}

export async function buscar_generos_por_anime(PK) {
  return buscar_todo_por_index(STORES.generos,"por_clave",PK);
}

async function buscar(store, PK) {
  try {
    const objectStore = await db_object_store(store, "readonly");
    if (objectStore.error)
      return {
        error: objectStore.error,
        result: null
      };

    const result = await new Promise((resolve, reject) => {
      const request = objectStore.get(PK);

      request.onsuccess = function () {
        if (request.result) {
          console.log("✅ Anime encontrado:", request.result);
          resolve(request.result);
        } else {
          console.log(`⚠️ No se encontró anime con clave "${PK}"`);
          resolve(null);
        }
      };

      request.onerror = function (event) {
        console.error("❌ Error al buscar:\n", event.target.error);
        reject(event.target.error);
      };
    });

    return {
      error: false,
      result
    };

  } catch (error) {
    console.error("❌ Error al abrir la base de datos:\n", error);
    return {
      error: "❌ Error al abrir la base de datos",
      result: null
    };
  }
}

async function buscar_todo_por_index(store, indice, PK) {
  try {
    const objectStore = await db_object_store(store, "readonly");
    if (objectStore.error)
      return {
        error: objectStore.error,
        result: null
      };

    const result = await new Promise((resolve, reject) => {
      const index = objectStore.index(indice); 
      const request = index.getAll(PK); 

      request.onsuccess = function () {
        if (request.result) {
          console.log("✅ Índice encontrado:", request.result);
          resolve(request.result);
        } else {
          console.log(`⚠️ No se encontró el índice con clave "${PK}"`);
          resolve(null);
        }
      };

      request.onerror = function (event) {
        console.error("❌ Error al buscar:\n", event.target.error);
        reject(event.target.error);
      };
    });

    return {
      error: false,
      result
    };

  } catch (error) {
    console.error("❌ Error al abrir la base de datos:\n", error);
    return {
      error: "❌ Error al abrir la base de datos",
      result: null
    };
  }
}

async function db_object_store(store, formato="readwrite") {
  if (!STORES[store]) {
    console.log("❌ No existe la store: :", JSON.stringify(store, null, 2));
    return{
      error: `❌ No existe el store '${store}'`,
      result: null
    };
  }
  const db = await abrir_db();
  const transaction = db.transaction([store], formato);
  const objectStore = transaction.objectStore(store);
  return objectStore;
}

