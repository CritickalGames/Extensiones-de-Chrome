export function fnCapituloVisto(animeEstadoViendo){
  const actual = animeEstadoViendo.textContent;
  const nuevoEstado = actual === "Visto ✔" ? "No visto ❌" : "Visto ✔";
  animeEstadoViendo.textContent = nuevoEstado;
  animeEstadoViendo.style.color = nuevoEstado === "Visto ✔" ? "green" : "red";
}