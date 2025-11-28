const stores={
  animes: "animes",
  generos: "generos",
  folders: "folders",
}

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
  return buscar(stores.animes,PK);
}

export async function buscar_generos_por_clave(PK) {
  return buscar_por_index(stores.generos,"por_clave",PK);
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

async function buscar_por_index(store, INX, indice) {
  try {
    const objectStore = await db_object_store(store, "readonly");
    if (objectStore.error)
      return {
        error: objectStore.error,
        result: null
      };

    const result = await new Promise((resolve, reject) => {
      const index = objectStore.index(indice); 
      const request = index.get(INX); 

      request.onsuccess = function () {
        if (request.result) {
          console.log("✅ Índice encontrado:", request.result);
          resolve(request.result);
        } else {
          console.log(`⚠️ No se encontró el índice con clave "${INX}"`);
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
  if (!stores[store]) {
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

function abrir_db() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("animeIsAlive", 2);

    request.onupgradeneeded = function(event) {
      const db = event.target.result;

      //* Animes
      if (!db.objectStoreNames.contains(stores.animes)) {
        crearStore_Animes(db);
      }

      //* Géneros
      if (!db.objectStoreNames.contains(stores.generos)) {
        crearStore_Generos(db);
      }

      //* Folders
      if (!db.objectStoreNames.contains(stores.folders)){
        crearStore_Folders(db);
      }
    };

    request.onsuccess = function(event) {
      const db = event.target.result;
      console.log("Base de datos abierta con éxito:", db);
      resolve(db);
    };

    request.onerror = function(event) {
      console.error("Error al abrir la base de datos:", event.target.error);
      reject(event.target.error);
    };
  });
}

//* 🗂️ Crear store de Animes
function crearStore_Animes(db) {
  const store = db.createObjectStore(stores.animes, { keyPath: "clave" });
  store.createIndex("por_favorito", "favorito", { unique: false });
  store.createIndex("por_seguimiento", "seguimiento", { unique: false });
  store.createIndex("por_audio", "audio", { unique: false });
  store.createIndex("por_subtitulos", "subtitulos", { unique: false });
  store.createIndex("por_temporada", "temporada_estreno", { unique: false });
  store.createIndex("por_anyo", "anyo_estreno", { unique: false });
  store.createIndex("por_dia_estreno", "dia_estreno", { unique: false });
  store.createIndex("por_estado", "estado", { unique: false });
  store.createIndex("por_nota", "nota", { unique: false });

  /** Animes
   * PK: clave 
   * nombre 
   * favorito 
   * seguimiento 
   * audio 
   * subtitulos 
   * temporada (de emisión) 
   * anyo 
   * dia_estreno 
   * estado 
   * nota
   * URL, no se puede buscar por url 
   * URL_imagen, aunque no se puede buscar por url_imagen
  */
}

//* 🗂️ Crear store de Géneros
function crearStore_Generos(db) {
  const store = db.createObjectStore(stores.generos, {
    keyPath: ["genero", "clave"]
  });
  store.createIndex("por_genero", "genero", { unique: false });
  store.createIndex("por_clave", "clave", { unique: false });

  /** Episodios
   * PK: genero, clave 
  */
}

//* 🗂️ Crear store de Folder
function crearStore_Folders(db) {
  const store = db.createObjectStore(stores.folders, {keyPath: ["folder", "clave"]});
  store.createIndex("por_folder", "folder", {unique: false});
  store.createIndex("por_clave", "clave", {unique: false});
}