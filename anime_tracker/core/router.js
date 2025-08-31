const rutas = {
  search: 'core/search.js',
  api: 'core/api.js',
  parse: 'core/parser.js',
  db: 'core/db.js'
};

export async function obj_route(action, payload) {
  const [modulo, funcion] = action.split('.');
  const ruta = rutas[modulo];

  if (!ruta) {
    console.warn(`Módulo desconocido: ${modulo}`);
    return false;
  }

  const url = chrome.runtime.getURL(ruta);
  const mod = await import(url);
  return await mod[funcion](payload);
}
