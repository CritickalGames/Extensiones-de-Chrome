import { obj_route } from "../../../core/router.js";

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

  animes.forEach(anime => {
    console.log("Info de la obra: ",anime.nombre,anime);
    
    const item = document.createElement("div");
    item.className = "anime-item";
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.gap = "12px";
    item.style.padding = "8px";
    item.style.borderBottom = "1px solid #ccc";

    item.innerHTML = `
      <img class="portada" src="${anime.portada || 'placeholder.jpg'}" alt="${anime.nombre}" style="max-width: 80px; border-radius: 4px;">
      <div style="flex: 1;">
        <div>
          <a href="${
            anime.url_principal || anime.cap_url || "#"
          }" target="_blank" title="${anime.nombre}">
            ${anime.nombre}
          </a>
        </div>

        <div><strong>📡 Emisión:</strong> ${anime.emision || "—"}</div>
        <div><strong>🌸 Estreno:</strong> ${anime.temporada ? `${anime.temporada} ${anime.año || ""}` : "—"}</div>
        <div><strong>📺 Capítulo:</strong> ${anime.capitulo || "—"} 
          (<a href="${anime.cap_url || "#"}" target="_blank">${anime.visto || "ver"}</a>)
        </div>
        <div><strong>🌍 Idiomas:</strong> Doblaje: ${anime.doblaje || "—"}, Subtítulos: ${anime.subtitulos || "—"}</div>
        <div><strong>🎭 Géneros:</strong> ${anime.generos && anime.generos.length > 0 ? anime.generos.join(", ") : "—"}</div>
        <div><strong>🏷️ Tags:</strong> ${anime.tags && anime.tags.length > 0 ? anime.tags.map(t => `${t.tipo} (${t.dia || "—"})`).join(", ") : "—"}</div>
        <div><strong>🔗 Relación:</strong> ${anime.relacion || "—"}</div>
        <div><strong>📝 Nota:</strong> ${anime.nota || "—"}</div>
        <div><strong>⭐ Favorito:</strong> ${anime.favorito ? "Sí" : "No"}</div>

        <div>
          <label for="seguimiento_${anime.url_anime}">Seguimiento:</label>
          <select id="seguimiento_${anime.url_anime}" name="seguimiento">
            <option value="ver" ${anime.seguimiento === "ver" ? "selected" : ""}>ver</option>
            <option value="viendo" ${anime.seguimiento === "viendo" ? "selected" : ""}>viendo</option>
            <option value="completa" ${anime.seguimiento === "completa" ? "selected" : ""}>completa</option>
            <option value="abandonada" ${anime.seguimiento === "abandonada" ? "selected" : ""}>abandonada</option>
          </select>
        </div>
      </div>
      <div>
        <strong>🔗 Otras URLs:</strong>
        <ul>
          ${anime.otras_urls && anime.otras_urls.length > 0 ? 
            anime.otras_urls.map(url => 
              `<li><a href="${url.url_dir}" target="_blank">${url.relacion}</a></li>`
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
        inputBuscar.value = anime.url_anime;
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
    renderLista(actualizados);
  } catch (err) {
    alert("❌ Error al borrar anime: " + err);
  }
}

// 🚀 Inicializar flujo
async function init() {
  try {
    const animes = (await obj_route("db.getAllAnimes")).result.data;
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
