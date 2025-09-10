/*
!v0.2.4
todo: FIX/mostrar los datos de los animes guardados en formato de carpetas
todo: ADD/funcionalidad para marcar capítulos como vistos y actualizar el estado del anime
!v0.3.0
todo: ADD/nuevas tablas en la base de datos para gestionar las carpetas
!v0.4.0
todo: ADD/buscar anime en la api o db y mostrar los resultados en una tabla
todo: ADD/elegir un anime buscado y guardarlo en la base de datos
!v0.4.1
todo: ADD/cargar una foto de portada manualmente si no se encuentra en la api
!v0.5.0
todo: FIX/un anime guardado y cargar la página de ese anime al hacer click en la portada
!v0.5.1
todo: FIX/guardar el capitulo como "ver" automaticamente si se encuentra el anime en la DB
!v0.6.0
todo: FIX/ESTILO
*/

// TODO: v0.2.4
/*
Creo que debo cambiar los datos que guardo en la base de datos.
//* La clave primaria se mantiene
//* Las propiedades que se mantienen son:
-nombre
-url_anime
-url_dir
-portada
-capitulo
//* base de datos segundarias
-emision: FK:anime; emision (emitiendose, finalizado, pelicula)
-visto: FK:anime; visto (viendo, completado, pendiente);
-tags: FK:anime; tipo (serie, pelicula, ova, etc);
-temporada: FK:anime; temporada (primavera, verano, etc); año;
-genero: FK:anime; genero (accion, comedia, etc);
-relación: FK:anime; relacion (secuela, precuela, etc);
-actualización: FK:anime; día (lunes, martes, etc);
-nota: FK:anime; nota (1-10);
-favorito: FK:anime; favorito (si/no);
-fecha_ultimo_visto: FK:anime; fecha (fecha de agregado);
-idioma: FK:anime; doblaje (japones, español, etc); subtitulo (español, inglés, etc);
//* Las carpetas se deben separar en:
-"todos"
---
-"viendo"
-"completados"
-"pendientes"
---
-"emision"
-"finalizados"
---
-"películas"
-"mangas"
-tags propias
*/