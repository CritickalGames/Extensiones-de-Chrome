// parse.js
export function parse_url({ url }) {
  if (typeof url !== 'string') return fallback();

  let u;
  try {
    u = new URL(url);
  } catch {
    return fallback();
  }

  const URL_dir = u.hostname;
  const partes = u.pathname.split('/').filter(Boolean);

  if (partes.length < 2) return fallback();

  const last = partes.at(-1);
  const prev = partes.at(-2);

  const isNumeric = /^\d+$/.test(last);
  const capitulo = isNumeric ? parseInt(last) : null;

  const animeSegment = isNumeric ? prev : last;
  const URL_anime = animeSegment;
  const nombre = animeSegment.replace(/-/g, ' ');

  // Temporada: detecta "s2", "2nd-season", etc.
  const temporadaMatch = animeSegment.match(/(?:s|season-)?(\d+)(?:nd|st|rd|th)?-season?/i);
  const temporada = temporadaMatch ? parseInt(temporadaMatch[1]) : capitulo ? 1 : 0;
  return {
    URL_dir,
    URL_anime,
    nombre,
    temporada,
    capitulo
  };
}

function fallback() {
  return {
    URL_dir: null,
    URL_anime: null,
    nombre: null,
    temporada: 0,
    capitulo: null
  };
}