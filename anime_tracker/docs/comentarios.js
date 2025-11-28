//!) Validación crítica o advertencia funcional
//?) Pregunta abierta o decisión pendiente
//*) Confirmación de éxito o estado blindado y títulos
//^ -) Precaución técnica o fases
//& +) Sugerencia de mejora de vida y estética o de soluciones
//~ º) Justificar una convención de nombres y decisiones no obvias
//todo) Tarea pendiente o marcador de acción
// // Comentario neutral sin semántica especial

/**
 * sessionStorage.setItem("metaAnime", JSON.stringify(metaAnime));
 * // En otra página:
 * const metaAnime = JSON.parse(sessionStorage.getItem("metaAnime") || "{}");
 */

//!// TODO: Si eliminas un genero, no se elimina de la base de datos
//! Implementar buscar_generos
//*Probelma
/*
 * Cuando Search consigue Anime por DB, no consigue sus generos.
 * Como no consigue sus generos, no puedo actualizar la lista de generos.
 & Si busqueda Anime tiene éxito, buscar Generos antes de enviar la información
 º Mantener la responsabilidad en search y no en el tabquerry
 * */
// TODO: IMPLEMENTAR EL SAVE FOLDER
//- Tabla de FOLDER(KF=Folder+serie)
// TODO: El botón folder debe tener menos relevacia, es más importante el de guardar anime.
// º Los nuevos usuarios no entenderán
// + Los botones de disquete y de carpeta deben ser para ver la lista enteras
// + Al findo, o en algún lugar accesible deben estar los dos botones: guaradar anime y guardar en carpeta
// ºº Guardar en carpeta debe desplegar un menú de carpetas
// TODO: IMPLEMENTAR LA URL IMG
//-// Guardar la URL a meta datos
//- Extraer la URL de meta datos
// TODO: BORRAR ALERTS