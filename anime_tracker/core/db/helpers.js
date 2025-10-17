/**
 * Organiza las URLs en categorías
 */
export function organizarUrls(urls,urls_por_originales) {
  if (!urls || urls.length === 0) {
    return {
      url_anime: null,
      url_dir: "",
      url_ultima: "",
      url_relacionada: null,
      relacion: "primera",
      otras_urls: []
    };
  }

  // Buscar la URL principal (relacion === "primera")
  const urlPrincipal_obj = urls.find(url => url.relacion === "primera") || urls[0];
  const urlPrincipal = urlPrincipal_obj.url_dir;
  const url_relacion = urlPrincipal_obj.relacion;
  const url_relacionada = urlPrincipal_obj.url_relacion; // Nuevo campo
  const url_anime = urlPrincipal_obj.url_anime;

  // Otras URLs (excluyendo la principal)
  let otrasUrls = urls.filter(url => 
    url.relacion !== "primera"
  );
  if (otrasUrls.length == 0) {
    console.warn(urls,urls_por_originales);
  }
  console.log(otrasUrls);
  return {
    url_anime: url_anime,
    url_dir: urlPrincipal,
    url_ultima: urlPrincipal_obj.url_ultima || "",
    url_relacionada: url_relacionada, // Nuevo campo
    relacion: url_relacion,
    otras_urls: otrasUrls
  };
}