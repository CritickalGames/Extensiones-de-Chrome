import { obj_route } from "../../../core/router.js";

// 🔗 Referencias DOM
const contenedor = document.getElementById("lista_animes");
const inputBuscar = document.getElementById("buscar");
const btnVolver = document.getElementById("btn_volver");
const btnBorrar = document.getElementById("btn_borrar");

// 🧱 Renderizar tabla
function renderTabla(animes) {
  contenedor.innerHTML = "";

  if (!animes.length) {
    contenedor.innerHTML = "<p>No hay animes guardados.</p>";
    return;
  }

  const tabla = document.createElement("table");
  tabla.border = "1";
  tabla.style.width = "100%";
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>Imagen</th>
        <th>Nombre</th>
        <th>Estado</th>
        <th>Temporada</th>
        <th>Estado Vista</th>
        <th>Fecha</th>
        <th>Url</th>
      </tr>
    </thead>
    <tbody>
      ${animes.map(anime => `
        <tr>
          <td><img src="${anime.portada}" alt="${anime.nombre}" width="100"></td>
          <td>${anime.nombre}</td>
          <td>${anime.estado}</td>
          <td>${anime.temporada}</td>
          <td>${anime.viendo}</td>
          <td>${new Date(anime.fecha).toLocaleString()}</td>
          <td>${anime.url}</td>
        </tr>
      `).join("")}
    </tbody>
  `;

  contenedor.appendChild(tabla);

  tabla.querySelectorAll("tbody tr").forEach(row => {
    row.addEventListener("click", () => {
      const nombre = row.children[1].textContent;
      inputBuscar.value = nombre;
      inputBuscar.focus();
    });
  });
}

// 🗑️ Borrar anime por nombre
async function borrarAnime(nombre) {
  try {
    await obj_route("db.deleteAnime", nombre);
    const actualizados = await obj_route("db.getAllAnimes");
    renderTabla(actualizados);
  } catch (err) {
    alert("❌ Error al borrar anime: " + err);
  }
}

// 🚀 Inicializar flujo
async function init() {
  try {
    const animes = await obj_route("db.getAllAnimes");
    renderTabla(animes);

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
