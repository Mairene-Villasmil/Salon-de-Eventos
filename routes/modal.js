export function renderModal(item) {
  const auth = JSON.parse(sessionStorage.getItem("auth")); 
  const modal = document.createElement('div');
  modal.className = 'custom-modal';

  const capacidadHTML = item.capacidad ? `<p><strong>Capacidad:</strong> ${item.capacidad}</p>` : '';
  const precioHTML = item.precio ? `<p><strong>Precio:</strong> $${item.precio}</p>` : '<p><strong>Precio:</strong> Consultar</p>';

  const botonReservarHTML = (auth && auth.user && auth.user.role === "user") 
  ? `<button id="btnReservar" class="btn btn-success mt-2 ms-2">Reservar <i class="fas fa-calendar-check ms-1"></i></button>`
  : '';
  console.log("Usuario rol en modal:", auth?.user?.role);

  modal.innerHTML = `
    <div class="custom-modal-content container">
      <span class="modal-close">&times;</span>
      <div class="row">
        <!-- Imagen -->
        <div class="col-md-6 mb-3 mb-md-0 text-center">
          <img src="${item.imagen}" alt="${item.nombre}" class="img-fluid rounded detalle-img" style="max-height: 300px; object-fit: cover;" />
        </div>
        <!-- Información -->
        <div class="col-md-6">
          <h4 class="mb-3">${item.nombre}</h4>
          <p><strong>Tipo:</strong> ${item.tipo}</p>
          <p>${item.descripcion}</p>
          ${capacidadHTML}
          ${precioHTML}
          <div class="d-flex flex-wrap">
            <button class="btn btn-primary btn-solicitar mt-3">
              Solicitar información <i class="fas fa-envelope ms-3"></i>
            </button>
            ${botonReservarHTML}
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  modal.querySelector('.btn-solicitar').addEventListener('click', () => {
    const mensaje = encodeURIComponent(`Hola, me gustaría recibir información sobre "${item.nombre}".`);
    window.location.hash = `#/contacto?mensaje=${mensaje}`;
    modal.remove();
  });

  const reservarBtn = modal.querySelector('#btnReservar'); 
  if (reservarBtn) {
    reservarBtn.addEventListener('click', () => {
      window.location.hash = `#/reservar?salon=${encodeURIComponent(item.nombre)}`;
      modal.remove();
    });
  }
}