const rutas = {
  search: 'core/search.js',
  api: 'core/api.js',
  parse: 'core/parser.js',
  db: 'core/db.js'
};

export async function obj_route(action, payload) {
  try {
    const [modulo, funcion] = action.split('.');
    const ruta = rutas[modulo];
    
    if (!ruta) {
      console.warn(`Módulo desconocido: ${modulo}`);
      return { error: `Módulo desconocido: ${modulo}`, result: null };
    }

    if (!funcion) {
      console.warn(`Función no especificada para el módulo: ${modulo}`);
      return { error: `Función no especificada`, result: null };
    }

    const url = chrome.runtime.getURL(ruta);
    const mod = await import(url);
    
    // Verificar que la función exista en el módulo
    if (typeof mod[funcion] !== 'function') {
      console.warn(`Función no encontrada: ${funcion} en módulo ${modulo}`);
      return { error: `Función no encontrada: ${funcion}`, result: null };
    }

    // 🛡️ Validación de tipo antes de aplicar spread
    let result;
    if (Array.isArray(payload)) {
      console.log("Payload como array:", payload);
      result = await mod[funcion](...payload);
    } else {
      result = await mod[funcion](payload);
    }
    
    //* Si sólo es "return", error: false
    //* Si quieres error, debes enviarlo junto a un result
    //* Parse no manda errores, pero search sí, como ejemplos
    return { 
            error: result.error? result.error:false,
            result: result.result? result.result: result
           };
  } catch (error) {
    console.error(`para ${action} y ${payload}; Error en obj_route:`, error);
    return { error: error.message, result: null };
  }
}

// Función auxiliar para llamadas más limpias
export async function call(module, func, payload) {
  return await obj_route(`${module}.${func}`, payload);
}