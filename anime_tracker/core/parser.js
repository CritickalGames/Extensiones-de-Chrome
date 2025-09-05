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
  let season_patron = "";

  console.warn({ prev, last });
  // 🧩 Unificación de patrones
  const patterns = [
    {
      name: 'nombre-<capítulo>',
      match: /^(.+)-(\d{1,3})$/.test(last),
      extract: () => {
        const m = last.match(/^(.+)-(\d{1,3})$/);
        URL_nombre = m[1];
        capitulo = parseInt(m[2]);
      }
    },
    {
      name: 'nombre-<ordinal>-season<pueden haber más cosas>',
      match: /^(.+)-(\d{1,2})(st|nd|rd|th)-season/i.test(prev) 
          || /^(.+)-(\d{1,2})(st|nd|rd|th)-season/i.test(last),
      extract: () => {
        const m1 = prev.match(/^(.+)-(\d{1,2})(st|nd|rd|th)-season/i)
                || last.match(/^(.+)-(\d{1,2})(st|nd|rd|th)-season/i);
        console.log(m1);
        temporada = parseInt(m1[2]);
        URL_nombre = m1[1];

        const season_patron = new RegExp("-" + m1[2] + m1[3] + "-season", 'i');
        URL_nombre = URL_nombre?.replace(season_patron, '');
      }
    },
    {
      name: 'nombre-s<ordinal>-<pueden haber más cosas>',
      match: /^(.+)-s(\d{1,2})/i.test(prev) 
          || /^(.+)-s(\d{1,2})/i.test(last),
      extract: () => {
        const m1 = prev.match(/^(.+)-s(\d{1,2})/i)
                || last.match(/^(.+)-s(\d{1,2})/i);
        console.log(m1);
        temporada = parseInt(m1[2]);
        URL_nombre = m1[1];
      }
    },
    {
      name: '<temporada>(algo)<capítulo>',
      match: /^(\d{1,2})x(\d{1,3})$/.test(last),
      extract: () => {
        const m = last.match(/^(\d{1,2})x(\d{1,3})$/);
        temporada = parseInt(m[1]);
        capitulo = parseInt(m[2]);
      }
    },
    {
      name: 'prev/<capítulo>',
      match: /^\d{1,3}$/.test(last),
      extract: () => {
        capitulo = parseInt(last);
      }
    }
  ];

  // 🧩 Evaluar patrones en orden
  for (const p of patterns) {
    if (p.match) {
      p.extract();
      console.warn(`Patrón detectado: ${p.name}`);
    }
  }
  if (URL_nombre === null){
    URL_nombre = prev;
  }
  console.log(URL_nombre);
  // 🧩 Normalizar nombre
  nombre = URL_nombre?.replace(/-/g, ' ')
            .trim() ?? null;
  const capitalizar = str => str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
  nombre = capitalizar(nombre);
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
    temporada: 0,
    capitulo: 0
  };
}
