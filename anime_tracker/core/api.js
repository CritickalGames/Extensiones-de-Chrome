// api.js
export async function buscar_en_api(URL_nombre) {
  // TODO: llamada real a API
  return false;
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
