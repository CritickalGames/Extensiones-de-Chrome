import * as LStores from "./LStores.js"

export async function crear_carpeta(nombre) {
  //^ Validación básica
  if (!nombre || nombre.trim() === '') {
    return{
      error: 'El nombre de la carpeta no puede estar vacío',
      result: null
    }
  }

  const id = 'fold_' + Date.now();
  const nueva_carpeta = {
    id,
    nombre: nombre.trim(),
  };

  //^ Leer el estado actual
  //TODO: hacer una función que elija si usar crhome o browser en base  si es firefox o no
  const data = await chrome.storage.local.get(LStores.carpetas);
  const carpetas = data.carpetas || {};

  //^ Añadir la nueva carpeta
  carpetas[id] = nueva_carpeta;

  //^ Guardar todo de nuevo
  await chrome.storage.local.set({ carpetas });

  return {
    error: false,
    result: {msg: "carpeta creada", id:id, nombre: nombre}
  };
}

export async function listar_carpetas() {
  const data = await chrome.storage.local.get(LStores.carpetas);
  return {
    error: false,
    retrun: Object.values(data.carpetas || {})
  };
}

export async function renombrar_carpeta(id, nuevo_nombre) {
  //- Validación
  if (!nuevo_nombre || nuevo_nombre.trim() === '') {
    return {
      error: `Nombre inválido: ${nombre}`,
      result: null,
    }
  }

  //- Leer datos
  //TODO: hacer compatible con firefox
  const data = await chrome.storage.local.get(LStores.carpetas);
  const carpetas = data.carpetas || {};

  if (!carpetas[id]) {
    throw new Error('Carpeta no encontrada');
  }

  carpetas[id].nombre = nuevo_nombre.trim();

  await chrome.storage.local.set({ carpetas });
}

export async function eliminar_carpeta(id) {
  const data = await chrome.storage.local.get(LStores.carpetas);
  const carpetas = data.carpetas || {};

  if (!carpetas[id]) return; // ya no existe, no error

  delete carpetas[id];
  await chrome.storage.local.set({ carpetas });

  // ⚠️ ¡No olvides eliminar sus relaciones en IndexedDB!
  // Llamá a tu función: eliminar_todas_las_relaciones_de_carpeta(id);
}
// Exportar
export async function exportar_carpetas() {
  const data = await chrome.storage.local.get(LStores.carpetas);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'carpetas_anime.json';
  a.click();
}

// Importar
export async function importar_carpetas(jsonString) {
  const data = JSON.parse(jsonString);
  await chrome.storage.local.set({ carpetas: data.carpetas });
}