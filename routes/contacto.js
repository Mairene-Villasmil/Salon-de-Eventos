export function renderContacto(container) {
  container.innerHTML = `
    <main class="flex-grow-1 py-5" data-section="contacto">
      <div class="container">
        <div class="row mb-5">
          <!-- Info de contacto -->
          <div class="col-md-6 mb-4">
            <h2 class="display-5 fw-bold mb-4 position-relative pb-3">
              Contacto
              <span class="position-absolute bottom-0 start-0 bg-primary rounded" style="height: 4px; width: 80px;"></span>
            </h2>
            <p><i class="fas fa-map-marker-alt me-2 text-primary"></i>Av. Siempre Viva 742, Springfield</p>
            <p><i class="fas fa-phone me-2 text-primary"></i>+54 11 1234-5678</p>
            <p><i class="fas fa-envelope me-2 text-primary"></i>info@idwsa.com</p>
            <div class="map-container mt-4 rounded shadow-sm overflow-hidden" style="width:100%; height:250px;">
              <iframe src="https://www.google.com/maps/embed?pb=..." width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </div>
          </div>

          <!-- Formulario -->
          <div class="col-md-6 mb-4">
            <h3 class="h4 text-primary mb-3"><i class="fas fa-paper-plane me-2"></i>Contáctanos</h3>
            <form id="contactForm" class="contact-form bg-light p-4 rounded shadow-sm">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre completo</label>
                <input type="text" id="nombre" name="nombre" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Correo electrónico</label>
                <input type="email" id="email" name="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="telefono" class="form-label">Teléfono (opcional)</label>
                <input type="tel" id="telefono" name="telefono" class="form-control" />
              </div>
              <div class="mb-3">
                <label for="mensaje" class="form-label">Mensaje</label>
                <textarea id="mensaje" name="mensaje" rows="5" class="form-control" required></textarea>
              </div>
              <p id="contactoMensaje" class="text-success small"></p>
              <p id="contactoError" class="text-danger small"></p>
              <div class="text-end">
                <button type="submit" class="btn btn-primary">
                  Enviar mensaje <i class="fas fa-paper-plane ms-2"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  `;

  const form = container.querySelector('#contactForm');
  const mensajeSuccess = container.querySelector('#contactoMensaje');
  const mensajeError = container.querySelector('#contactoError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const auth = JSON.parse(localStorage.getItem('auth'));
    if (!auth) {
      mensajeError.textContent = "Debes iniciar sesión para enviar una consulta.";
      return;
    }

    mensajeError.textContent = '';

    const nuevaConsulta = {
      nombre: form.nombre.value.trim(),
      email: form.email.value.trim(),
      telefono: form.telefono.value.trim(),
      mensaje: form.mensaje.value.trim(),
      fecha: new Date().toLocaleString(),
      usuario: auth.username,
    };

    const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
    consultas.push(nuevaConsulta);
    localStorage.setItem('consultas', JSON.stringify(consultas));

    mensajeSuccess.textContent = "Consulta enviada. ¡Gracias!";
    form.reset();
  });
}