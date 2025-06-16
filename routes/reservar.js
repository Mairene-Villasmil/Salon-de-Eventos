export function renderReservar(container, catalogo) {
  const serviciosDisponibles = catalogo.filter(item => item.tipo === "servicio");
  const auth = JSON.parse(sessionStorage.getItem("auth"));
  if (!auth || auth.user.role !== "user") {
    container.innerHTML = `<p class="error-msg">⚠️ Solo usuarios pueden hacer reservas.</p>`;
    return;
  }

  const query = new URLSearchParams(window.location.hash.split("?")[1]);
  const salonPrecargado = query.get("salon") || "";
  const hoy = new Date().toISOString().split("T")[0];

const itemSeleccionado = catalogo.find(item => item.nombre === salonPrecargado);

if (itemSeleccionado && itemSeleccionado.tipo === "servicio") {
  container.innerHTML = `
    <main class="container py-5">
      <h2 class="mb-4">Reservá el servicio: ${itemSeleccionado.nombre} 🎉</h2>
      <form id="formReservaServicio" class="bg-light p-4 rounded shadow-sm">
        <div class="mb-3">
          <label for="fechaServicio" class="form-label">Fecha del evento</label>
          <input type="date" id="fechaServicio" name="fechaServicio" class="form-control" min="${hoy}" required>
        </div>
        <div class="mb-3">
          <label for="horaServicio" class="form-label">Hora</label>
          <input type="time" id="horaServicio" name="horaServicio" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="direccionEvento" class="form-label">Dirección del evento</label>
          <input type="text" id="direccionEvento" name="direccionEvento" class="form-control" placeholder="Calle, número, ciudad" required>
        </div>
        <button type="submit" class="btn btn-primary">Confirmar reserva</button>
      </form>
    </main>

    <div id="reservaModalServicio" class="modal fade" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content p-4">
          <h5>¡Reserva confirmada!</h5>
          <p>Revisá tu correo para continuar con el pago. 🎁</p>
          <button id="cerrarModalReservaServicio" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("formReservaServicio").addEventListener("submit", (e) => {
    e.preventDefault();

    const fecha = document.getElementById("fechaServicio").value;
    const hora = document.getElementById("horaServicio").value;
    const direccion = document.getElementById("direccionEvento").value;

    const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");

    const nuevaReserva = {
      tipo: "servicio",
      servicio: itemSeleccionado.nombre,
      fecha,
      hora,
      direccion,
      usuario: auth.user.email,
    };

    reservas.push(nuevaReserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    const modal = new bootstrap.Modal(document.getElementById("reservaModalServicio"));
    modal.show();
  });

  document.addEventListener("click", (e) => {
    if (e.target.id === "cerrarModalReservaServicio") {
      window.location.hash = "#/perfil";
    }
  });

  return; 
}

  const serviciosHTML = serviciosDisponibles.map(servicio => `
    <div>
      <input type="checkbox" class="form-check-input servicio" id="servicio-${servicio.id}" value="${servicio.nombre}">
      <label for="servicio-${servicio.id}">${servicio.nombre} ($${servicio.precio})</label>
    </div>
  `).join("");

  container.innerHTML = `
    <main class="container py-5">
      <h2 class="mb-4">Reservá tu evento 🎉</h2>
      <form id="formReserva" class="bg-light p-4 rounded shadow-sm">
        <div class="mb-3">
          <label for="salon" class="form-label">Elegí el salón</label>
          <input type="text" id="salon" class="form-control" readonly required value="${salonPrecargado}">
        </div>
        <div class="mb-3">
          <label for="fecha" class="form-label">Fecha del evento</label>
          <input type="date" id="fecha" name="fecha" class="form-control" min="${hoy}" required>
          <small id="disponibilidadMsg" class="text-danger d-none mt-1">Fecha no disponible para ese salón.</small>
        </div>
        <div class="mb-3">
          <label class="form-label">Servicios extra (máx. 5)</label>
          <div id="serviciosContainer" class="form-check">
            ${serviciosHTML}
          </div>
          <small id="servicioMsg" class="text-danger d-none">Máximo 5 servicios por reserva.</small>
        </div>
        <div class="mb-3">
          <label for="hora" class="form-label">Hora</label>
          <input type="time" id="hora" name="hora" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">Confirmar reserva</button>
      </form>
    </main>

    <div id="reservaModal" class="modal fade" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content p-4">
          <h5>¡Reserva confirmada!</h5>
          <p>Revisá tu correo para continuar con el pago. 🎁</p>
          <button id="cerrarModalReserva" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  `;

  const salonInput = document.getElementById("salon");
  const fechaInput = document.getElementById("fecha");
  const msg = document.getElementById("disponibilidadMsg");

  if (salonPrecargado) salonInput.value = salonPrecargado;

  const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");

  const fechasOcupadas = reservas.reduce((mapa, r) => {
    if (!mapa[r.salon]) mapa[r.salon] = [];
    mapa[r.salon].push(r.fecha);
    return mapa;
  }, {});

  salonInput.addEventListener("change", validarDisponibilidad);
  fechaInput.addEventListener("input", validarDisponibilidad);

  function validarDisponibilidad() {
    const salon = salonInput.value;
    const fecha = fechaInput.value;

    if (salon && fecha) {
      const ocupadas = fechasOcupadas[salon] || [];
      const ocupada = ocupadas.includes(fecha);
      if (ocupada) {
        msg.classList.remove("d-none");
        fechaInput.setCustomValidity("Fecha no disponible");
      } else {
        msg.classList.add("d-none");
        fechaInput.setCustomValidity("");
      }
    }
  }

  const checkboxes = document.querySelectorAll(".servicio");
  const servicioMsg = document.getElementById("servicioMsg");

  checkboxes.forEach(cb => cb.addEventListener("change", () => {
    const seleccionados = document.querySelectorAll(".servicio:checked").length;
    if (seleccionados > 5) {
      cb.checked = false;
      servicioMsg.classList.remove("d-none");
      setTimeout(() => servicioMsg.classList.add("d-none"), 2000);
    }
  }));

  document.getElementById("formReserva").addEventListener("submit", (e) => {
    e.preventDefault();
  
    if (!fechaInput.checkValidity()) {
      fechaInput.reportValidity();
      return;
    }
  
    const servicios = [...document.querySelectorAll(".servicio:checked")].map(cb => cb.value);
  
    const nuevaReserva = {
      fecha: fechaInput.value,
      hora: document.getElementById("hora").value,
      salon: salonInput.value,
      usuario: auth.user.email,
      servicios: servicios
    };
  
    reservas.push(nuevaReserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));
  
    const modal = new bootstrap.Modal(document.getElementById("reservaModal"));
    modal.show();
  });  

  document.addEventListener("click", (e) => {
    if (e.target.id === "cerrarModalReserva") {
      window.location.hash = "#/perfil";
    }
  });
}