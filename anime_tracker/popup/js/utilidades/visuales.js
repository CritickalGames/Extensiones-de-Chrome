import { extraer_anime_desde_dom } from '../submodulos/extraer.js';
import { guardar_generos } from '../submodulos/guardar.js';
import { obj_route } from '../../../core/router/index.js';
let editingGeneros = false;

document.addEventListener('DOMContentLoaded', function () {
  const refs = extraer_anime_desde_dom();

  iniciarPopup(refs);

  console.log("Popup script cargado y listeners asignados.");
});

function iniciarPopup(refs) {
  editarGeneros(refs);
  manejarCalificacion(refs);
  sincronizarTemporadaEpisodio(refs);
  copiarID(refs);
  //! testear Sincronizar Fondos
  sincronizarFondoPortada(refs);
  //TODO: Hay que cambiar esto.
  //ºla idea original era mandar a otra pantalla, así que, hay lo eliminaré luego
  alternarMenuConfiguracion(refs);
  //TODO: borrar los siguientes cuando ya no sean útiles
  botonesCabecera(refs);
  guardarFinal(refs);
  buscarAnime(refs);
}

// * 1. Editar Géneros
function editarGeneros(refs) {
  if (refs.btn_editar_generos && refs.texto_lista_generos && refs.entrada_edicion_generos) {
    refs.btn_editar_generos.addEventListener('click', function () {
      if (editingGeneros) {
        refs.texto_lista_generos.textContent = refs.entrada_edicion_generos.value;
        refs.entrada_edicion_generos.style.display = 'none';
        refs.texto_lista_generos.style.display = 'block';
        refs.btn_editar_generos.textContent = 'Edit Genres';
        editingGeneros = false;
        //º Ref para guardar_generos
        const refs_para_generos = {
          entrada_edicion_generos: refs.entrada_edicion_generos,
          texto_id_anime: refs.texto_id_anime
        };
      
        guardar_generos(obj_route, refs_para_generos);
      } else {
        refs.entrada_edicion_generos.value = refs.texto_lista_generos.textContent;
        refs.texto_lista_generos.style.display = 'none';
        refs.entrada_edicion_generos.style.display = 'block';
        refs.btn_editar_generos.textContent = 'Guardar';
        editingGeneros = true;
      }
    });
  } else {
    console.warn("Faltan elementos para editar géneros.");
  }
}

// * 2. Manejar Calificación
function manejarCalificacion(refs) {
  if (refs.btn_restar_calificacion && refs.btn_sumar_calificacion && refs.texto_nota_usuario) {
    const actualizarNota = (delta) => {
      let val = parseInt(refs.texto_nota_usuario.textContent) || 0;
      val = Math.max(0, Math.min(10, val + delta));
      refs.texto_nota_usuario.textContent = val;
    };
    refs.btn_restar_calificacion.addEventListener('click', () => actualizarNota(-1));
    refs.btn_sumar_calificacion.addEventListener('click', () => actualizarNota(+1));
  }
}

// * 3. Temporada/Episodio
function sincronizarTemporadaEpisodio(refs) {
  const sync = () => {
    if (refs.entrada_temporada_actual) {
      const temp = parseInt(refs.entrada_temporada_actual.value) || 1;
      refs.entrada_temporada_actual.value = Math.max(1, temp);
    }
    if (refs.entrada_episodio_actual) {
      const ep = parseInt(refs.entrada_episodio_actual.value) || 1;
      refs.entrada_episodio_actual.value = Math.max(1, ep);
    }
  };

  if (refs.entrada_temporada_actual) {
    refs.entrada_temporada_actual.addEventListener('input', sync);
    refs.btn_restar_temporada?.addEventListener('click', () => {
      let val = parseInt(refs.entrada_temporada_actual.value) || 1;
      refs.entrada_temporada_actual.value = Math.max(1, val - 1);
    });
    refs.btn_sumar_temporada?.addEventListener('click', () => {
      let val = parseInt(refs.entrada_temporada_actual.value) || 0;
      refs.entrada_temporada_actual.value = val + 1;
    });
  }

  if (refs.entrada_episodio_actual) {
    refs.entrada_episodio_actual.addEventListener('input', sync);
    refs.btn_restar_episodio?.addEventListener('click', () => {
      let val = parseInt(refs.entrada_episodio_actual.value) || 1;
      refs.entrada_episodio_actual.value = Math.max(1, val - 1);
    });
    refs.btn_sumar_episodio?.addEventListener('click', () => {
      let val = parseInt(refs.entrada_episodio_actual.value) || 0;
      refs.entrada_episodio_actual.value = val + 1;
    });
  }
}

// * 4. Copiar ID
function copiarID(refs) {
  if (refs.btn_copiar_id && refs.texto_id_anime) {
    refs.btn_copiar_id.addEventListener('click', () => {
      const id = refs.texto_id_anime.textContent.trim();
      navigator.clipboard.writeText(id).catch(err => console.error('No se pudo copiar:', err));
    });
  }
}

// * 5. Fondo de portada
function sincronizarFondoPortada(refs) {
  if (refs.imagen_portada_principal && refs.capa_fondo_portada) {
    const actualizarFondo = () => {
      const src = refs.imagen_portada_principal.src;
      if (src && !src.includes('data:image')) {
        refs.capa_fondo_portada.style.backgroundImage = `url("${src}")`;
      } else {
        refs.capa_fondo_portada.style.backgroundImage = 'none';
      }
    };
    actualizarFondo();
    const observer = new MutationObserver(() => actualizarFondo());
    observer.observe(refs.imagen_portada_principal, { attributes: true, attributeFilter: ['src'] });
  }
}

// * 6. Menú configuración
function alternarMenuConfiguracion(refs) {
  if (refs.btn_alternar_configuracion && refs.menu_configuracion) {
    refs.btn_alternar_configuracion.addEventListener('click', (e) => {
      e.stopPropagation();
      refs.menu_configuracion.classList.toggle('oculto');
    });

    document.addEventListener('click', (e) => {
      if (
        !refs.btn_alternar_configuracion.contains(e.target) &&
        !refs.menu_configuracion.contains(e.target)
      ) {
        refs.menu_configuracion.classList.add('oculto');
      }
    });
  }
}

// * 7. Botones de cabecera
function botonesCabecera(refs) {
  refs.btn_abrir_carpetas?.addEventListener('click', () => {

  });

  refs.btn_menu_principal?.addEventListener('click', () => {
    alert("VISUALES.js:Menú principal presionado.");
    console.log("Menú principal presionado.");
  });
}

// * 8. Botón final de guardar
function guardarFinal(refs) {
  refs.btn_guardar_final?.addEventListener('click', () => {
    alert("VISUALES.js:Guardar a carpetas presionado.");
    console.log("Guardar a carpetas presionado.");
  });
}

// * 9. Búsqueda de anime
function buscarAnime(refs) {
  refs.entrada_buscar_anime?.addEventListener('input', () => {
    console.log("VISUALES.js: Búsqueda:", refs.entrada_buscar_anime.value);
  });
}