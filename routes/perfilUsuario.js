export function renderPerfilUsuario(container, usuario) {
  if (!usuario) {
    container.innerHTML = `
      <div class="perfil-container">
        <p class="error-msg">⚠️ Debes iniciar sesión para ver tu perfil.</p>
        <a href="#/login" class="btn btn-primary mt-3">Ir al Login</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="perfil-container">
      <div class="perfil-card">
        <img src="${usuario.image}" alt="Avatar" class="perfil-avatar" />
        <h2>${usuario.firstName} ${usuario.lastName}</h2>
        <p><strong>📧 Email:</strong> ${usuario.email}</p>
        <button id="logoutUsuario" class="btn btn-danger mt-2">Cerrar sesión</button>
      </div>

      <section class="comentarios mt-5">
        <h3 class="h5">¿Cómo fue tu experiencia?</h3>
        <form id="comentarioForm">
          <textarea id="comentarioTexto" rows="3" placeholder="Escribí tu testimonio..." required></textarea>
          <label for="comentarioValoracion">Valoración:</label>
          <select id="comentarioValoracion" required>
            <option value="5">⭐⭐⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="2">⭐⭐</option>
            <option value="1">⭐</option>
          </select>
          <button type="submit">Enviar comentario</button>
          <p id="comentarioMensaje" class="success-msg mt-2"></p>
        </form>
      </section>

      <section class="historial mt-5">
        <h3 class="h5">🗂 Tu historial</h3>
        <div id="historialComentarios" class="mt-3"></div>
        <div id="historialReservas" class="mt-3"></div>
        <div id="historialConsultas" class="mt-3"></div>
      </section>
    </div>
  `;

  document.getElementById("logoutUsuario").addEventListener("click", () => {
    sessionStorage.clear();
    localStorage.removeItem("auth");
    window.location.hash = "#/login";
  });

  const form = document.getElementById("comentarioForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const texto = document.getElementById("comentarioTexto").value.trim();
    const valoracion = parseInt(document.getElementById("comentarioValoracion").value);

    const nuevoComentario = {
      tipo: "testimonio",
      texto,
      autor: `${usuario.firstName} ${usuario.lastName}`,
      valoracion,
      aprobado: false,
      usuario: usuario.email,
    };

    const comentarios = JSON.parse(localStorage.getItem("comentariosPendientes") || "[]");
    comentarios.push(nuevoComentario);
    localStorage.setItem("comentariosPendientes", JSON.stringify(comentarios));

    form.reset();
    document.getElementById("comentarioMensaje").textContent = "¡Gracias! Tu comentario será revisado.";
    cargarHistorial();
  });

  function cargarHistorial() {
    const email = usuario.email;

    const pendientes = JSON.parse(localStorage.getItem("comentariosPendientes") || "[]");
    const aprobados = JSON.parse(localStorage.getItem("testimoniosAprobados") || "[]");
    const todosComentarios = [...pendientes, ...aprobados].filter(c => c.usuario === email);

    const comentariosHTML = todosComentarios.length
      ? `<ul class="list-group">${todosComentarios.map(c =>
          `<li class="list-group-item d-flex justify-content-between align-items-start">
            <span>${c.texto}</span>
            <span class="badge ${c.aprobado ? 'bg-success' : 'bg-secondary'}">${c.aprobado ? 'Aprobado' : 'Pendiente'}</span>
          </li>`
        ).join("")}</ul>`
      : "<p class='text-muted'>No enviaste comentarios todavía.</p>";

    document.getElementById("historialComentarios").innerHTML = `
      <h5>📝 Comentarios enviados</h5>
      ${comentariosHTML}
    `;

    const reservas = JSON.parse(localStorage.getItem("reservas") || "[]")
      .filter(r => r.usuario === email);

    const reservasHTML = reservas.length
      ? `<ul class="list-group">${reservas.map(r =>
          `<li class="list-group-item">
            <strong>${r.salon || "Salón"}</strong> para el <em>${r.fecha}</em>
          </li>`
        ).join("")}</ul>`
      : "<p class='text-muted'>No tenés reservas registradas.</p>";

    document.getElementById("historialReservas").innerHTML = `
      <h5>📅 Reservas realizadas</h5>
      ${reservasHTML}
    `;

    const consultas = JSON.parse(localStorage.getItem("consultas") || "[]")
      .filter(c => c.usuario === email);

    const consultasHTML = consultas.length
      ? `<ul class="list-group">${consultas.map(c =>
          `<li class="list-group-item">
            <strong>Mensaje:</strong> ${c.mensaje}<br/>
            <small class="text-muted">${c.fecha}</small>
          </li>`
        ).join("")}</ul>`
      : "<p class='text-muted'>No hiciste consultas todavía.</p>";

    document.getElementById("historialConsultas").innerHTML = `
      <h5>📨 Consultas enviadas</h5>
      ${consultasHTML}
    `;
  }

  cargarHistorial();
}