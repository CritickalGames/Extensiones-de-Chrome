// router.js
export async function obj_route(action, payload) {
  const [modulo, funcion] = action.split('.');

  switch (modulo) {
    case 'search': {
        const url = chrome.runtime.getURL('core/search.js');
        const mod = await import(url);
        return await mod[funcion](payload);
    }
    case 'api': {
        const url = chrome.runtime.getURL('core/api.js');
        const mod = await import(url);
        return await mod[funcion](payload);
    }
    case 'parse': {
        const url = chrome.runtime.getURL('core/parser.js');
        const mod = await import(url);
        return await mod[funcion](payload);
    }
    default:
        console.warn(`Módulo desconocido: ${modulo}`);
        return false;
  }
}
