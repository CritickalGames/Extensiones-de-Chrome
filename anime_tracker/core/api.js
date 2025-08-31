// api.js
export async function guardar_anime(anime) {
  const db = await abrirDB();
  const tx = db.transaction("animes", "readwrite");
  const store = tx.objectStore("animes");
  store.put(anime);
}

export async function buscar_en_api(URL_nombre) {
  // TODO: llamada real a API
  return {
    URL_nombre,
    URL_dir: "simulado",
    nombre: URL_nombre,
    estado: "Emisión",
    temporada: 0,
    capitulo: 0,
    viendo: "Ver",
    portada: "https://via.placeholder.com/150?text=" + encodeURIComponent(URL_nombre),
    fecha: new Date().toISOString()
  };
}

async function abrirDB() {
  return await new Promise((resolve, reject) => {
    const req = indexedDB.open("AnimeDB", 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      const store = db.createObjectStore("animes", { keyPath: "URL_nombre" });
      store.createIndex("URL_dir", "URL_dir", { unique: false });
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject();
  });
}
