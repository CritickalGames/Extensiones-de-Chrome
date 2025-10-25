import { obj_route } from "../../../../core/router.js";

// 🔗 Referencias DOM
const contenedor = document.getElementById("lista_animes");
const inputBuscar = document.getElementById("buscar");
const btnVolver = document.getElementById("btn_volver");
const btnBorrar = document.getElementById("btn_borrar");

// 🧱 Renderizar tabla
function renderLista(animes) {
  contenedor.innerHTML = "";

  if (!animes.length) {
    contenedor.innerHTML = "<p>No hay animes guardados.</p>";
    return;
  }
  // Mapeo de temporadas a símbolos
  const simboloTemporada = {
    primavera: "🌸",
    verano: "☀️",
    otoño: "🍂",
    invierno: "❄️"
  };
  animes.forEach(anime => {
    console.log("Info de la obra: ", anime.anime.nombre, anime);
    
    const item = document.createElement("div");
    item.className = "anime-item";
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.gap = "12px";
    item.style.padding = "8px";
    item.style.borderBottom = "1px solid #ccc";

    item.innerHTML = `
      <div>
        <div>
          <a href="${
            anime.urls_base.url_dir || anime.urls_base.url_ultima || "#"
          }" target="_blank" title="${anime.anime.nombre}">
            ${anime.anime.nombre}
          </a>
        </div>
        <img class="portada" src="${anime.anime.portada || 'placeholder.jpg'}" alt="${anime.anime.nombre}" style="max-width: 80px; border-radius: 4px;">
        <div><strong>📡 Emisión:</strong> ${anime.emision.estado || "—"}</div>
        <div><strong>🌸 Estreno:</strong> ${simboloTemporada[anime.estreno.temporada.toLowerCase()] || "—" } ${anime.estreno.anyo || ""}</div>
        <div><strong>📺 Capítulo:</strong> ${anime.capitulos.capitulo || "—"} 
          (<a href="${anime.capitulos.cap_url || "#"}" target="_blank">${anime.capitulos.visto? "visto":"ver"}</a>)
        </div>
      </div>
      <div style="flex: 1;">
        <div><strong>🌍 Idiomas:</strong> Doblaje: ${anime.idiomas.doblaje || "—"}, Subtítulos: ${anime.idiomas.subtitulos || "—"}</div>
        <div><strong>🎭 Géneros:</strong> ${anime.generos.generos && anime.generos.generos.length > 0 ? anime.generos.generos.join(", ") : "—"}</div>
        <div><strong>🏷️ Tags:</strong> ${anime.tags.tags && anime.tags.tags.length > 0 ? anime.tags.tags.join(", ") : "—"}</div>
        <div><strong>🔗 Relación:</strong> ${anime.urls_base.relacion || "—"}</div>
        <div><strong>📝 Nota:</strong> ${anime.notas.nota || "—"}</div>
        <div><strong>⭐ Favorito:</strong> ${anime.anime.favorito ? "Sí" : "No"}</div>
        <div><p>Seguimiento: ${anime.anime.seguimiento}</p></div>
      </div>
      <div>
        <strong>🔗 Otras URLs:</strong>
        <ul style="padding: 0;">
          ${anime.urls_base.otras_urls && anime.urls_base.otras_urls.length > 0 ? 
            anime.urls_base.otras_urls.map(url => 
              `<li><strong>${url.relacion}:</strong></li>
              <ul style="padding: 0;">
              <li>
                -<a href="${url.url_dir? url.url_dir:url.url_ultima}" target="_blank">${url.url_anime}</a>
              </li>
              </ul>
              `
            ).join('') : 
            '<li>No hay otras URLs</li>'
          }
        </ul>
      </div>
    `;



    // 🎯 Evento sobre la portada (img)
    const portada = item.querySelector(".portada");
    if (portada) {
      portada.addEventListener("click", () => {
        inputBuscar.value = anime.anime.url_anime;
        inputBuscar.focus();
      });
    }

    contenedor.appendChild(item);
  });
}


// 🗑️ Borrar anime por nombre
async function borrarAnime(nombre) {
  nombre = nombre.trim().replace(/\s+/g, '-').toLowerCase();
  try {
    await obj_route("db.deleteAnime", nombre);
    const actualizados = await obj_route("db.getAllAnimes");
    const animes = actualizados.result?.data || actualizados.data || [];
    renderLista(animes); // Asumiendo que aquí accedemos a .data
  } catch (err) {
    alert("❌ [carpetas_js.borrarAnime]Error al borrar anime: " + err);
  }
}

// 🚀 Inicializar flujo
async function init() {
  try {
    const respuesta = await obj_route("db.getAllAnimes");
    const animes = respuesta.result?.data || respuesta.data || [];
    renderLista(animes);

    // Restaurar último anime buscado desde popup
    chrome.storage.local.get("animeActual", ({ animeActual }) => {
      if (animeActual?.nombre) {
        inputBuscar.value = animeActual.nombre;
      }
    });

    btnBorrar.addEventListener("click", async () => {
      const nombre = inputBuscar.value.trim();
      if (!nombre) return alert("Escribe el nombre del anime a borrar.");
      await borrarAnime(nombre);
      inputBuscar.value = "";
    });

    btnVolver.addEventListener("click", () => {
      window.location.href = "../popup.html";
    });
  } catch (err) {
    alert("❌ Error al inicializar: " + err);
  }
}

init();