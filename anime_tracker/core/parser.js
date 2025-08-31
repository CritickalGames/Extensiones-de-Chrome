// parse.js
export function parse_url({ url }) {
  const partes = url.split('/');
  const regex = /[a-zA-Z]+-[a-zA-Z]+/;
  const match = partes.find(p => regex.test(p));

  const URL_nombre = match || false;
  const URL_dir = url.split('//')[1]?.split('.')[0] || 'desconocido';

  return {
    URL_nombre,
    URL_dir,
    nombre: URL_nombre.replace(/-/g, ' '),
    temporada: 0,
    capitulo: 0
  };
}
