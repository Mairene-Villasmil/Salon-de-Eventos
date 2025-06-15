import { renderNosotros } from './nosotros.js';

export function aprobarComentario(idComentario, container) {
  let pendientes = JSON.parse(localStorage.getItem("comentariosPendientes") || "[]");
  let aprobados = JSON.parse(localStorage.getItem("comentariosAprobados") || "[]");

  const index = pendientes.findIndex(c => c.id === idComentario);
  if (index === -1) {
    console.warn(`Comentario con id ${idComentario} no encontrado en pendientes.`);
    return;
  }

  const comentarioAprobado = { ...pendientes[index], aprobado: true };
  aprobados.push(comentarioAprobado);
  pendientes.splice(index, 1);

  localStorage.setItem("comentariosPendientes", JSON.stringify(pendientes));
  localStorage.setItem("comentariosAprobados", JSON.stringify(aprobados));

  console.log("Comentario aprobado y guardado correctamente.");
  console.log("Pendientes:", pendientes);
  console.log("Aprobados:", aprobados);

  renderNosotros(container);
}