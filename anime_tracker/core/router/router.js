//* 🔁 Router dinámico para módulos
export async function obj_route(action, payload) {
  console.info("ENTRADA router");
  try {
    const [modulo, funcion] = action.split('.');
    const ruta = "core/" + modulo + "/"+modulo+".js";

    //^) Validar que el módulo esté definido
    if (!modulo) {
      console.warn(`Módulo no especificado: ${modulo}`);
      return { error: `Módulo desconocido: ${modulo}`, result: null };
    }

    //^) Validar que la función esté definida
    if (!funcion) {
      console.warn(`Función no especificada para el módulo: ${modulo}`);
      return { error: `Función no especificada`, result: null };
    }
    //^) Conseguimos el modulo através de ruta relativa a la raíz
    const mod = await import(chrome.runtime.getURL(ruta));

    //^) Verificar que la función exista en el módulo
    if (typeof mod[funcion] !== 'function') {
      console.warn(`Función no encontrada: ${funcion} en módulo ${modulo}`);
      return { error: `Función no encontrada: ${funcion}`, result: null };
    }

    //🛡️ Validación de tipo antes de aplicar spread
    let result;
    if (Array.isArray(payload)) {
      console.log("Payload como array:", payload);
      result = await mod[funcion](...payload);
    } else {
      console.log("Payload sin array", payload);
      result = await mod[funcion](payload);
    }

    //*) Convención de retorno: error debe ser explícito si existe
    //~) Sólo consideramos que hay un error si "error" no da Fasle
    //~) Si error = false, debería devolver un resultado
    return {
      //^) descompongo el resultado en: resultado o null
      error: result?.error,
      result: result?.result
    };
  } catch (error) {
    //!) Error inesperado en importación o ejecución
    console.error(`para ${action} y ${payload}; Error en obj_route:`, error);
    return { error: error.message, result: null };
  }
}

//* 🧩 Función auxiliar para llamadas más limpias
export async function call(module, func, payload) {
  return await obj_route(`${module}.${func}`, payload);
}
