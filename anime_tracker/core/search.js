import { obj_route } from "./router.js";

export async function conseguir_anime(URL_nombre) {
  // Buscar en base de datos
  //? Si DB falla, busca en API automaticamente
  const resultado = await obj_route('db.buscar_en_db', URL_nombre);
  console.log(`Error: ${resultado.error} \n`,"Resultado DB:", resultado);
  
  // Con el nuevo router: !resultado.error significa éxito
  if (!resultado.error) return resultado.result;

  // Buscar en API
  const api_resultado = await obj_route('api.buscar_en_api', URL_nombre);
  // Con el nuevo router: !api_resultado.error significa éxito
  if (!api_resultado.error) 
    return {
      error: "api.buscar_en_api",
      result: URL_nombre
    };

  return {
      error: "api.buscar_en_api y no se encontró el la BD",
      result: URL_nombre
    };
}

export async function buscar_anime({ nombre }) {
  // TODO: búsqueda por nombre parcial
  return false;
}