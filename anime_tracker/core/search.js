import { obj_route } from "./router.js";

export async function conseguir_anime(URL_nombre) {
  // Buscar en base de datos
  //? Si DB falla, busca en API automaticamente
  const resultado = await obj_route('db.buscar_en_db', URL_nombre);
  console.log("Resultado DB:", resultado);
  if (resultado) return resultado;

  // Buscar en API
  const api_resultado = await obj_route('api.buscar_en_api', URL_nombre);
  if (!api_resultado) return false;

  // Guardar en base de datos si se obtuvo desde API
  await obj_route('db.guardar_anime', api_resultado);

  return api_resultado;
}

export async function buscar_anime({ nombre }) {
  // TODO: búsqueda por nombre parcial
  return false;
}
