// Importamos el módulo que contiene las funciones de extracción
// Ajusta la ruta según la estructura real de tu proyecto.
import { extraerAnimeDesdeDOM } from './submodulos/extraer.js';

document.addEventListener('DOMContentLoaded', function() {
    // --- Referencias a elementos del DOM ---
    // Utilizamos el objeto combinado devuelto por extraerAnimeDesdeDOM
    const refs = extraerAnimeDesdeDOM();

    // --- Variables de estado ---
    let editingGeneros = false;
    let generosEditingValue = '';

    // --- Funciones de manejo de eventos ---

    // 1. Editar Géneros (AHORA FUNCIONAL)
    // Accedemos a los elementos específicos a través del objeto refs
    if (refs.editar_generos_btn && refs.generos_display && refs.generos_input) {
        refs.editar_generos_btn.addEventListener('click', function() {
            if (editingGeneros) {
                // Guardar
                refs.generos_display.textContent = refs.generos_input.value;
                refs.generos_input.style.display = 'none';
                refs.generos_display.style.display = 'block';
                refs.editar_generos_btn.textContent = 'Edit Genres';
                editingGeneros = false;
            } else {
                // Editar
                refs.generos_input.value = refs.generos_display.textContent;
                refs.generos_display.style.display = 'none';
                refs.generos_input.style.display = 'block';
                refs.editar_generos_btn.textContent = 'Save';
                editingGeneros = true;
            }
        });
    } else {
        console.warn("Elementos necesarios para editar géneros no encontrados (desde extraer.js).");
    }

    // 2. Manejar Rating con botones
    if (refs.rating_dec_btn && refs.rating_inc_btn && refs.nota_usuario_display) {
        refs.rating_dec_btn.addEventListener('click', function() {
            let val = parseInt(refs.nota_usuario_display.textContent) || 0;
            if (val > 0) {
                refs.nota_usuario_display.textContent = val - 1;
                // Opcional: Actualizar el input oculto si es necesario para otros scripts
                if (refs.notaUsuario) refs.notaUsuario.value = val - 1;
            }
        });

        refs.rating_inc_btn.addEventListener('click', function() {
            let val = parseInt(refs.nota_usuario_display.textContent) || 0;
            if (val < 10) {
                refs.nota_usuario_display.textContent = val + 1;
                // Opcional: Actualizar el input oculto si es necesario para otros scripts
                if (refs.notaUsuario) refs.notaUsuario.value = val + 1;
            }
        });
    }

    // 3. Sincronizar T/E (Opcional, si se desea que se actualice desde los numéricos)
    function syncCapituloTempCap() {
        if (refs.temporada_actual && refs.episodio_actual && refs.animeTempoCap) {
            const temp = refs.temporada_actual.value || '1';
            const cap = refs.episodio_actual.value || '1';
            // Asumimos que animeTempoCap es el input oculto que necesitamos actualizar
            refs.animeTempoCap.value = `T${temp}/E${cap}`;
        }
    }

    if (refs.temporada_actual && refs.episodio_actual) {
        refs.temporada_actual.addEventListener('input', syncCapituloTempCap);
        refs.episodio_actual.addEventListener('input', syncCapituloTempCap);
    }

    // 4. Sincronizar ID display con url_anime
    // Asumimos que inputNombreAnime es el input y anime_id_display es el span
    if (refs.inputNombreAnime && refs.anime_id_display) {
        refs.inputNombreAnime.addEventListener('input', function() {
            refs.anime_id_display.textContent = `ID: ${this.value}`;
        });
    }

    // 5. Copiar ID
    if (refs.copy_id_btn && refs.anime_id_display) {
        refs.copy_id_btn.addEventListener('click', function() {
            navigator.clipboard.writeText(refs.anime_id_display.textContent.replace('ID: ', ''));
        });
    }

    // 6. Botones de incremento/decremento de temporada
    if (refs.temp_dec_btn && refs.temp_inc_btn && refs.temporada_actual) {
        refs.temp_dec_btn.addEventListener('click', function() {
            let val = parseInt(refs.temporada_actual.value) || 1;
            if (val > 1) refs.temporada_actual.value = val - 1;
            syncCapituloTempCap();
        });
        refs.temp_inc_btn.addEventListener('click', function() {
            let val = parseInt(refs.temporada_actual.value) || 0;
            refs.temporada_actual.value = val + 1;
            syncCapituloTempCap();
        });
    }

    // 7. Botones de incremento/decremento de episodio
    if (refs.ep_dec_btn && refs.ep_inc_btn && refs.episodio_actual) {
        refs.ep_dec_btn.addEventListener('click', function() {
            let val = parseInt(refs.episodio_actual.value) || 1;
            if (val > 1) refs.episodio_actual.value = val - 1;
            syncCapituloTempCap();
        });
        refs.ep_inc_btn.addEventListener('click', function() {
            let val = parseInt(refs.episodio_actual.value) || 0;
            refs.episodio_actual.value = val + 1;
            syncCapituloTempCap();
        });
    }

    // 8. Actualizar portada si cambia la URL de imagen
    if (refs.urlImagen && refs.cover_container) {
        // Asumimos que cover_container es el div con background-image
        refs.urlImagen.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                refs.cover_container.style.backgroundImage = `url("${this.value}")`;
                // Si también hay un <img> oculto (animePortada) que quieres actualizar:
                if (refs.animePortada) {
                     refs.animePortada.src = this.value;
                }
            }
        });
    }

    // 9. Menú desplegable de ajustes
    if (refs.settings_toggle_btn && refs.settings_dropdown) {
        refs.settings_toggle_btn.addEventListener('click', function() {
            // Toggle la clase 'hidden' en el dropdown
            refs.settings_dropdown.classList.toggle('hidden');
        });

        // Cerrar el menú si se hace clic fuera
        document.addEventListener('click', function(event) {
            // Verificamos que el clic no fue en el botón ni en el dropdown
            if (!refs.settings_toggle_btn.contains(event.target) && !refs.settings_dropdown.contains(event.target)) {
                // Añadimos la clase 'hidden' para ocultarlo
                refs.settings_dropdown.classList.add('hidden');
            }
        });
    }

    // 10. Acciones de botones de icono (guardar, carpetas, menú)
    if (refs.save_btn_icon && refs.btnGuardar) {
        refs.save_btn_icon.addEventListener('click', function() {
            // Simula clic en el botón principal de guardar
            refs.btnGuardar.click();
        });
    }

    if (refs.folder_btn_icon) {
        refs.folder_btn_icon.addEventListener('click', function() {
            // Lógica para mostrar carpetas
            // window.location.href = "carpetas.html"; // O la ruta que uses
            console.log("Botón de carpetas presionado.");
        });
    }

    if (refs.menu_btn) {
        refs.menu_btn.addEventListener('click', function() {
            console.log("Botón de menú presionado.");
            // Lógica para abrir menú (si aplica)
        });
    }

    // 11. Acciones de botones principales (buscar, mostrar carpetas) - Opcional si no se usan
    // Estos botones están ahora dentro de refs gracias a extraerAnimeDesdeDOM
    if (refs.btnBuscar) {
        refs.btnBuscar.addEventListener('click', function() {
            console.log("Botón de buscar presionado.");
            // Lógica de búsqueda
        });
    }

    if (refs.btnCarpetas) {
        refs.btnCarpetas.addEventListener('click', function() {
            console.log("Botón de mostrar carpetas presionado.");
            // Lógica de mostrar carpetas
        });
    }

    // 12. Actualizar ID actual si se modifica el input de nombre
    // Asumimos que inputNombreAnime es el input y urlActual es el span a actualizar
    if (refs.inputNombreAnime && refs.urlActual) {
        refs.inputNombreAnime.addEventListener('input', function() {
            refs.urlActual.textContent = this.value; // Asumiendo que urlActual es un span
        });
    }

    console.log("Script de popup cargado y listeners asignados usando extraer.js.");

}); // Fin de DOMContentLoaded