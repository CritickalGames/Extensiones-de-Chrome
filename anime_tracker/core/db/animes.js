import { abrirDB } from "./conexion.js";
import { obtenerRegistro, leerPorIndice } from "./crud.js";
import { organizarUrls } from "./helpers.js";

/**
 * Obtiene un objeto con valores por defecto para un anime, usando base como base de datos
 * @param {Object} base - Objeto base con datos mínimos (como url_anime, nombre, etc.)
 * @returns {Object} - Objeto completo con valores por defecto
 */
const ANIME_ERROR_DEFAULTS = (base) => ({
  anime: {
    ...base,
    temporada: base.temporada || "—",
    seguimiento: base.seguimiento || "ver",
    favorito: base.favorito || false
  },
  emision: { estado: "—" },
  capitulos: { capitulo: "—", cap_url: "", visto: false },
  idiomas: { doblaje: "—", subtitulos: "—" },
  estreno: { temporada: "—", anyo: "—", dia: "" },
  notas: { nota: "—" },
  tags: { tags: [] },
  generos: { generos: [] },
  urls_base: {
    url_anime: null,
    url_dir: "",
    url_ultima: "",
    url_relacionada: null,
    relacion: "primera",
    otras_urls: []
  }
});

/**
 * Obtiene un anime específico con todos sus datos
 */
export async function getAnimeCompleto(url_anime) {
  try {
    // Obtener datos base primero
    const base = await obtenerRegistro("animes", url_anime);
    if (!base) return null;

    // Obtener todos los datos relacionados en paralelo
    const [
      emision,
      capitulos,
      idiomas,
      estreno,
      nota,
      tags,
      generos,
      urls,
    ] = await Promise.all([
      obtenerRegistro("emision", url_anime),
      obtenerRegistro("capitulos", url_anime),
      obtenerRegistro("idiomas", url_anime),
      obtenerRegistro("estreno", url_anime),
      obtenerRegistro("notas", url_anime),
      leerPorIndice("tags", "url_anime", url_anime),
      leerPorIndice("generos", "url_anime", url_anime),
      leerPorIndice("urls_base", "url_relacion", url_anime)
    ]);
    //TODO: AGRECAR UN ÍNDICE "PARTICIPANTES COMO SUGIERE QWEN"
    // Organizar las URLs
    const urlsOrganizadas = organizarUrls(urls || []);

    return {
      anime: {
        ...base,
        temporada: base.temporada || "—",
        seguimiento: base.seguimiento || "ver",
        favorito: base.favorito || false
      },
      emision: { estado: emision?.estado || "—" },
      capitulos: {
        capitulo: capitulos?.capitulo || "—",
        cap_url: capitulos?.url_dir || "",
        visto: capitulos?.visto
      },
      idiomas: {
        doblaje: idiomas?.doblaje || "—",
        subtitulos: idiomas?.subtitulos || "—"
      },
      estreno: {
        temporada: estreno?.temporada || "—",
        anyo: estreno?.anyo || "—",
        dia: estreno?.dia || ""
      },
      notas: { nota: nota?.nota || "—" },
      tags: { tags: tags.map(t => t?.tipo || t).filter(Boolean) || [] },
      generos: { generos: generos.map(g => g?.genero || g).filter(Boolean) || [] },
      urls_base: urlsOrganizadas
    };
  } catch (error) {
    console.error("Error obteniendo anime completo:", error);
    return null;
  }
}

/**
 * Obtiene todos los animes con paginación
 */
export async function getAllAnimes(page = 1, limit = 20) {
  try {
    const db = await abrirDB();
    const baseStore = db.transaction("animes", "readonly").objectStore("animes");

    const baseReq = baseStore.getAll();

    return await new Promise((resolve, reject) => {
      baseReq.onsuccess = async () => {
        const allBases = baseReq.result;

        // Calcular paginación
        const total = allBases.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const bases = allBases.slice(startIndex, endIndex);

        const resultado = [];

        for (const base of bases) {
          try {
            const animeCompleto = await getAnimeCompleto(base.url_anime);
            if (animeCompleto) {
              resultado.push(animeCompleto);
            } else {
              resultado.push(ANIME_ERROR_DEFAULTS(base));
            }
          } catch (error) {
            console.error(`Error procesando anime ${base.url_anime}:`, error);
            resultado.push(ANIME_ERROR_DEFAULTS(base));
          }
        }

        resolve({
          data: resultado,
          pagination: {
            page: page,
            limit: limit,
            total: total,
            pages: Math.ceil(total / limit)
          }
        });
      };

      baseReq.onerror = () => reject("❌ Error al obtener los animes.");
    });
  } catch (err) {
    console.error("❌ Error en getAllAnimes:", err);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: limit,
        total: 0,
        pages: 0
      }
    };
  }
}

/**
 * Obtiene todos los animes (sin paginación, para compatibilidad)
 */
export async function getAllAnimesFull() {
  const result = await getAllAnimes(1, 10000); // Número grande para obtener todos
  return result.data;
}

/**
 * Busca un anime por su clave url_anime.
 */
export async function buscar_en_db(url_anime) {
  const resultado = await getAnimeCompleto(url_anime);
  return {
    error: !resultado ? `No existe ${url_anime}` : false,
    result: resultado
  };
}