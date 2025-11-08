const stores={
  animes: "animes",
  generos: "generos",
}

export async function guardar(store, tabla) {
  if (!stores[store]) {
    console.log("❌ No existe la store: :", JSON.stringify(store, null, 2));
    return;
  }
  try {
    const db = await abrir_db();
    const transaction = db.transaction([store], "readwrite");
    const objectStore = transaction.objectStore(store);

    console.log(tabla);
    
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

function abrir_db() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("animeIsAlive", 2);

    request.onupgradeneeded = function(event) {
      const db = event.target.result;

      //* Animes
      if (!db.objectStoreNames.contains(stores.animes)) {
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
        store.createIndex("por_url", "url", { unique: true });

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
         * URL 
        */
      }

      //* Géneros
      if (!db.objectStoreNames.contains(stores.generos)) {
        const store = db.createObjectStore(stores.generos, {
          keyPath: ["genero", "clave"]
        });
        store.createIndex("por_clave", "clave", { unique: true });
        store.createIndex("por_url", "url", { unique: true });
        /** Episodios
         * FK: generos, 
         * genero 
         * clave 
        */
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
