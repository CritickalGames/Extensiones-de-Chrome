export async function conseguir_anime({ URL_nombre }) {
  const db = await abrirDB();
  const tx = db.transaction("animes", "readonly");
  const store = tx.objectStore("animes");

  const resultado = await new Promise((resolve) => {
    const req = store.get(URL_nombre);
    req.onsuccess = () => resolve(req.result || false);
    req.onerror = () => resolve(false);
  });

  if (resultado) return resultado;

  const { buscar_en_api } = await import('./api.js');
  const api_resultado = await buscar_en_api(URL_nombre);
  return api_resultado || false;
}

export async function buscar_anime({ nombre }) {
  // TODO: búsqueda por nombre parcial
  return false;
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
