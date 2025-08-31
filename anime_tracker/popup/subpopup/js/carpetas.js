// 🔗 Referencias
const contenedor = document.getElementById("lista_animes");
const inputBuscar = document.getElementById("buscar");
const btnVolver = document.getElementById("btn_volver");
const btnBorrar = document.getElementById("btn_borrar");

// 🗃️ Abrir base de datos
const dbRequest = indexedDB.open("AnimeDB", 1);

dbRequest.onsuccess = function (event) {
  const db = event.target.result;

  // 🧱 Renderizar tabla
  function renderTabla(animes) {
    contenedor.innerHTML = "";

    if (animes.length === 0) {
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

  // 📥 Obtener todos los animes
  function cargarAnimes() {
    const tx = db.transaction("animes", "readonly");
    const store = tx.objectStore("animes");
    const request = store.getAll();

    request.onsuccess = () => {
      renderTabla(request.result);
    };
  }

  cargarAnimes();

  // 🗑️ Borrar anime por nombre
  btnBorrar.addEventListener("click", () => {
    const nombre = inputBuscar.value.trim();
    if (!nombre) return alert("Escribe el nombre del anime a borrar.");

    const tx = db.transaction("animes", "readwrite");
    const store = tx.objectStore("animes");
    const deleteRequest = store.delete(nombre);

    deleteRequest.onsuccess = () => {
      cargarAnimes();
      inputBuscar.value = "";
    };

    deleteRequest.onerror = () => {
      alert("No se pudo borrar el anime.");
    };
  });
};

// 🔙 Volver al popup principal
btnVolver.addEventListener("click", () => {
  window.location.href = "../popup.html";
});
