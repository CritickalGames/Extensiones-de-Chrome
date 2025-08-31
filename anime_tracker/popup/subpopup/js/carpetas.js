// 🔗 Referencias
const contenedor = document.getElementById("lista_animes");
const inputBuscar = document.getElementById("buscar");
const btnVolver = document.getElementById("btn_volver");
const btnBorrar = document.getElementById("btn_borrar");

// 📦 Obtener data guardada
const carpeta = JSON.parse(localStorage.getItem("carpetaAnimes")) || [];

// 🧱 Renderizar tabla con interacción
function renderTabla(animes) {
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
      ${animes.map((anime, index) => `
        <tr data-index="${index}">
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

  // 🎯 Interacción: al hacer click en una fila, copiar nombre al input
  tabla.querySelectorAll("tbody tr").forEach(row => {
    row.addEventListener("click", () => {
      const nombre = row.children[1].textContent;
      inputBuscar.value = nombre;
      inputBuscar.focus();
    });
  });
}

// 🚀 Ejecutar render
renderTabla(carpeta);

// 🔙 Volver al popup principal
btnVolver.addEventListener("click", () => {
  window.location.href = "../popup.html";
});

// 🗑️ Borrar anime por nombre exacto
btnBorrar.addEventListener("click", () => {
  const nombreABorrar = inputBuscar.value.trim();
  if (!nombreABorrar) return alert("Escribe el nombre del anime a borrar.");

  const index = carpeta.findIndex(anime => anime.nombre === nombreABorrar);
  if (index === -1) return alert("No se encontró ese anime.");

  // 🧹 Eliminar y actualizar
  carpeta.splice(index, 1);
  localStorage.setItem("carpetaAnimes", JSON.stringify(carpeta));
  contenedor.innerHTML = ""; // Limpiar tabla
  renderTabla(carpeta);      // Volver a renderizar
  inputBuscar.value = "";    // Limpiar input
});