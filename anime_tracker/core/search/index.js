import { obj_route } from "../router/index.js";

export async function conseguir_anime(URL_nombre) {
  // Buscar en base de datos
  //? Si DB falla, busca en API automaticamente
  const resultado = await obj_route('db.buscar_anime', URL_nombre);
  
  //~ Con el nuevo router: !resultado.error significa éxito
  if (!resultado.error) return {
    error: resultado.error,
    result: resultado.result
  };

  // Buscar en API
  const api_resultado = await obj_route('api.buscar_en_api', URL_nombre);
  //~ Con el nuevo router: !api_resultado.error significa éxito
  if (!api_resultado.error) 
    return {
      error: "api.buscar_en_api[no encuentra]: "+URL_nombre,
      result: null
    };

  return {
      error: false,
      result: api_resultado.result
    };
}

export async function buscar_anime({ nombre }) {
  // TODO: búsqueda por nombre parcial
  return false;
}