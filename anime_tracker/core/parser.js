export function parse_url({ url }) {
  // 🛡️ Validación inicial: si no es string, retornar estructura vacía
  if (typeof url !== 'string') return fallback();

  url = url.trim();
  let u;
  try {
    u = new URL(url);
  } catch {
    return fallback();
  }

  const URL_dir = u.hostname;
  const partes = u.pathname.split('/').filter(Boolean).slice(1);

  let {
    _, 
    URL_nombre, 
    nombre, 
    temporada, 
    capitulo
  } = fallback();

  const last = partes.at(-1)?.replace(/\.html$/, '') ?? '';
  const prev = partes.at(-2) ?? '';

  // 🧩 Unificación de patrones
  const patterns_length_1 = [
    {
      name: 'nombre/>',
      match: true,
      extract: () => {
        URL_nombre = last;
      }
    },
    {
      name: 'nombre-<capítulo>',
      match: /^(.+)-(\d{1,3})$/.test(last),
      extract: () => {
        const m = last.match(/^(.+)-(\d{1,3})$/);
        capitulo = parseInt(m[2]);
      }
    },
    {
      name: 'nombre-<capítulo>',
      match: /^(.+)-(\d{1,3})x(\d{1,3})$/.test(last),
      extract: () => {
        const m = last.match(/^(.+)-(\d{1,3})x(\d{1,3})$/);
        URL_nombre = m[1];
        temporada = parseInt(m[2]);
        capitulo = parseInt(m[3]);
        console.log(URL_nombre);
      }
    },
    {
      name: 'nombre-<ordinal>-season<pueden haber más cosas>',
      match: /^(.+)-(\d{1,2})(st|nd|rd|th)-season/i.test(last),
      extract: () => {
        const m = last.match(/^(.+)-(\d{1,2})(st|nd|rd|th)-season/i);
        temporada = parseInt(m[2]);
        URL_nombre = m[1];

        const season_patron = new RegExp("-" + m[2] + m[3] + "-season", 'i');
        URL_nombre = URL_nombre?.replace(season_patron, '');
      }
    },
    {
      name: 'nombre-s<temporada>-<más cosas>',
      match: /^(.+)-s(\d{1,2})/i.test(last),
      extract: () => {
        const m = last.match(/^(.+)-s(\d{1,2})/i);
        capitulo = parseInt(m[1]);
      }
    }
  ];

  const patterns_length_2 = [
    {
      name: 'nombre/>',
      match: true,
      extract: () => {
        URL_nombre = prev;
      }
    },
    {
      name: 'nombre/<capítulo>',
      match: /^\d{1,3}$/.test(last),
      extract: () => {
        capitulo = parseInt(last);
      }
    },
    {
      name: 'nombre-<ordinal>-season<pueden haber más cosas>',
      match: /^(.+)-(\d{1,2})(st|nd|rd|th)-season/i.test(prev),
      extract: () => {
        const m = prev.match(/^(.+)-(\d{1,2})(st|nd|rd|th)-season/i);
        temporada = parseInt(m[2]);
        URL_nombre = m[1];

        const season_patron = new RegExp("-" + m[2] + m[3] + "-season", 'i');
        URL_nombre = URL_nombre?.replace(season_patron, '');
      }
    }
  ];

  if (partes.length <2) {
    for (const p of patterns_length_1) {
      if (p.match) {
        p.extract();
        // console.warn(`Patrón de 1 detectado: ${p.name}`);
      }
    }
  } else {
        console.warn(`Patrón de 2 detectado`);
    for (const p of patterns_length_2) {
      if (p.match) {
        p.extract();
        // console.warn(`Patrón de 2 detectado: ${p.name}`);
      }
    }
  }

  // 🧩 Normalizar nombre
  nombre = URL_nombre?.replace(/-/g, ' ')
            .trim() ?? null;
  const capitalizar = str => str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
  nombre = capitalizar(nombre);
  temporada = (u.pathname.split('/').filter(Boolean)[0]=="pelicula") ? 0 : temporada;
  return {
    URL_dir,
    URL_nombre,
    nombre,
    temporada,
    capitulo
  };
}

// 🧩 Estructura vacía en caso de error
function fallback() {
  return {
    URL_dir: null,
    URL_nombre: null,
    nombre: null,
    temporada: 1,
    capitulo: 0
  };
}
