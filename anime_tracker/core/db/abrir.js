import { STORES } from "./stores.js";

export function abrir_db() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("animeIsAlive", 2);

    request.onupgradeneeded = function(event) {
      const db = event.target.result;

      //* Animes
      if (!db.objectStoreNames.contains(STORES.animes)) {
        crearStore_Animes(db);
      }

      //* Géneros
      if (!db.objectStoreNames.contains(STORES.generos)) {
        crearStore_Generos(db);
      }

      //* Folders
      if (!db.objectStoreNames.contains(STORES.folders)){
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
  const store = db.createObjectStore(STORES.animes, { keyPath: "clave" });
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
   * ep_visto, un array de [temporada, episodio]
  */
}

//* 🗂️ Crear store de Géneros
function crearStore_Generos(db) {
  const store = db.createObjectStore(STORES.generos, {
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
  const store = db.createObjectStore(STORES.folders, {keyPath: ["folder", "clave"]});
  store.createIndex("por_folder", "folder", {unique: false});
  store.createIndex("por_clave", "clave", {unique: false});
}