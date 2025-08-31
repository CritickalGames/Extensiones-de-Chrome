const blocks = document.querySelectorAll(".block");
const canvas = document.getElementById("canvas");
const resultado = document.getElementById("resultado");
const cssEditor = document.getElementById("cssEditor");
const styleTag = document.getElementById("customStyles");

const CLAVE_HTML = "editorHTML";
const CLAVE_CSS = "editorCSS";

// Drag & Drop
blocks.forEach(block => {
  block.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/html", block.dataset.html);
  });
});

canvas.addEventListener("dragover", e => e.preventDefault());

canvas.addEventListener("drop", e => {
  e.preventDefault();
  const html = e.dataTransfer.getData("text/html");
  insertarBloque(html);
  sincronizarHTML();
  guardarEstado();
});

// Insertar bloque visual con botón eliminar
function insertarBloque(html) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("canvas-item");

  const content = document.createElement("div");
  content.innerHTML = html;

  const eliminarBtn = document.createElement("button");
  eliminarBtn.textContent = "🗑️";
  eliminarBtn.classList.add("eliminar");
  eliminarBtn.addEventListener("click", () => {
    wrapper.remove();
    sincronizarHTML();
    guardarEstado();
  });

  wrapper.appendChild(content);
  wrapper.appendChild(eliminarBtn);
  canvas.appendChild(wrapper);
}

// Exportar HTML desde canvas
function sincronizarHTML() {
  let htmlFinal = "";
  canvas.querySelectorAll(".canvas-item > div").forEach(el => {
    htmlFinal += el.innerHTML + "\n";
  });
  resultado.value = htmlFinal.trim();
}

// Importar HTML al canvas
function importarHTML() {
  const html = resultado.value.trim();
  if (html) {
    limpiarCanvas();
    const temp = document.createElement("div");
    temp.innerHTML = html;
    [...temp.children].forEach(child => {
      insertarBloque(child.outerHTML);
    });
  }
}

// Limpiar canvas sin borrar encabezado
function limpiarCanvas() {
  canvas.innerHTML = "<h3>Previsualización</h3>";
}

// Sincronizar estilos CSS
function sincronizarCSS() {
  styleTag.textContent = cssEditor.value;
}

// Guardar estado en localStorage
function guardarEstado() {
  localStorage.setItem(CLAVE_HTML, resultado.value);
  localStorage.setItem(CLAVE_CSS, cssEditor.value);
}

// Cargar estado desde localStorage
function cargarEstado() {
  const html = localStorage.getItem(CLAVE_HTML);
  const css = localStorage.getItem(CLAVE_CSS);

  if (html) {
    resultado.value = html;
    importarHTML();
  }

  if (css) {
    cssEditor.value = css;
    sincronizarCSS();
  }
}

// Eventos
resultado.addEventListener("input", () => {
  importarHTML();
  guardarEstado();
});

cssEditor.addEventListener("input", () => {
  sincronizarCSS();
  guardarEstado();
});

// Botones
document.getElementById("exportar").addEventListener("click", () => {
  sincronizarHTML();
  guardarEstado();
});

document.getElementById("importar").addEventListener("click", () => {
  importarHTML();
  guardarEstado();
});

// Restaurar al cargar
window.addEventListener("DOMContentLoaded", cargarEstado);