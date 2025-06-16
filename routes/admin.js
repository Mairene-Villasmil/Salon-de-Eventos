export function renderAdminPanel(container) {
  container.innerHTML = `
    <div class="admin-container">
      <div class="admin-header d-flex justify-content-between align-items-center mb-4">
        <h2>Panel de Administración</h2>
        <button id="logout" class="btn btn-danger">Cerrar sesión</button>
      </div>
      <div id="eventosServicios"></div>
      <div id="comentariosPendientes" class="mt-5"></div>
      <div id="consultasAdmin" class="mt-5"></div>
      <div id="notificacionesAdmin" class="mt-5"></div>
    </div>
  `;

  const eventosContainer = container.querySelector('#eventosServicios');
  const comentariosContainer = container.querySelector('#comentariosPendientes');
  const consultasContainer = container.querySelector('#consultasAdmin');
  const notificacionesContainer = container.querySelector('#notificacionesAdmin');

  const eventos = JSON.parse(localStorage.getItem('eventos') || '[]');

  renderEventosServicios(eventosContainer, eventos);
  renderComentariosPendientes(comentariosContainer);
  renderConsultasAdmin(consultasContainer);
  renderNotificacionesAdmin(notificacionesContainer);

  document.getElementById('logout').addEventListener('click', () => {
    sessionStorage.clear();
    localStorage.removeItem('auth');
    window.location.hash = "#/login";
  });
}

function renderEventosServicios(container, data) {
  let editIndex = null;

  container.innerHTML = `
  <div class="admin-card mb-4">
    <div class="admin-card-header bg-primary text-white p-3 rounded-top">
      <h5 id="formTitle" class="m-0">Agregar nuevo evento o servicio</h5>
    </div>
    <div class="admin-card-body p-3 bg-light rounded-bottom">
      <form id="addForm" class="form-grid d-flex flex-column gap-3">
        <input type="text" id="nombre" placeholder="Nombre del evento" required />
        <input type="text" id="descripcion" placeholder="Descripción" required />

        <div>
          <label>
            <input type="radio" name="imgOption" value="url" checked />
            Usar URL
          </label>
          <label>
            <input type="radio" name="imgOption" value="file" />
            Subir archivo
          </label>
        </div>

        <input type="text" id="imagenUrl" placeholder="URL de imagen" />
        <input type="file" id="imagenFile" accept="image/*" style="display:none;" />

        <select id="tipo" required>
          <option value="" disabled selected>Seleccionar tipo</option>
          <option value="salon">Salón</option>
          <option value="servicio">Servicio</option>
        </select>

        <div class="img-preview" style="display:none;">
          <img id="preview" src="" alt="Vista previa" style="max-width: 100px; border-radius: 8px;" />
        </div>

        <button type="submit" class="btn btn-success">Agregar</button>
      </form>
    </div>
  </div>

  <ul id="listaEventos" class="list-group"></ul>
`;

  const form = container.querySelector('#addForm');
  const nombre = form.querySelector('#nombre');
  const descripcion = form.querySelector('#descripcion');

  const imgOptionRadios = form.querySelectorAll('input[name="imgOption"]');
  const imagenUrlInput = form.querySelector('#imagenUrl');
  const imagenFileInput = form.querySelector('#imagenFile');

  const tipo = form.querySelector('#tipo');

  const previewImg = form.querySelector('#preview');
  const previewContainer = form.querySelector('.img-preview');
  const btnSubmit = form.querySelector('button');
  const formTitle = container.querySelector('#formTitle');

  const lista = container.querySelector('#listaEventos');

  function actualizarPreview(src) {
    if (src) {
      previewImg.src = src;
      previewContainer.style.display = 'block';
    } else {
      previewImg.src = '';
      previewContainer.style.display = 'none';
    }
  }

  imgOptionRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'url' && radio.checked) {
        imagenUrlInput.style.display = 'block';
        imagenFileInput.style.display = 'none';
        actualizarPreview(imagenUrlInput.value.trim());
      }
      if (radio.value === 'file' && radio.checked) {
        imagenUrlInput.style.display = 'none';
        imagenFileInput.style.display = 'block';
        actualizarPreview('');
      }
    });
  });

  imagenUrlInput.addEventListener('input', () => {
    actualizarPreview(imagenUrlInput.value.trim());
  });

  imagenFileInput.addEventListener('change', () => {
    const file = imagenFileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => actualizarPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      actualizarPreview('');
    }
  });

  function mostrarEventos() {
    const eventosActualizados = JSON.parse(localStorage.getItem('eventos') || '[]');
    lista.innerHTML = '';
    eventosActualizados.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex flex-row align-items-center gap-2';
      li.innerHTML = `
        <img src="${item.imagen || 'https://via.placeholder.com/150'}" alt="${item.nombre}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 10px;">
        <div class="flex-grow-1">
          <h5>${item.nombre}</h5>
          <p class="text-muted small">${item.descripcion}</p>
          <span class="badge bg-info text-dark">${item.tipo}</span>
        </div>
        <div class="d-flex flex-column gap-2">
          <button class="btn btn-warning btn-sm btn-editar" data-index="${index}">Editar</button>
          <button class="btn btn-danger btn-sm btn-eliminar" data-index="${index}">Eliminar</button>
        </div>
      `;
      lista.appendChild(li);
    });

    lista.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.index);
        if (confirm('¿Eliminar este evento o servicio?')) {
          const eventosActualizados = JSON.parse(localStorage.getItem('eventos') || '[]');
          eventosActualizados.splice(index, 1);
          localStorage.setItem('eventos', JSON.stringify(eventosActualizados));
          mostrarEventos();
        }
      });
    });

    lista.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', () => {
        editIndex = Number(btn.dataset.index);
        const eventosActualizados = JSON.parse(localStorage.getItem('eventos') || '[]');
        const evento = eventosActualizados[editIndex];
        nombre.value = evento.nombre;
        descripcion.value = evento.descripcion;
        tipo.value = evento.tipo;
        actualizarPreview(evento.imagen);
        previewContainer.style.display = 'block';

        if (evento.imagen && evento.imagen.startsWith('data:image')) {
          form.querySelector('input[name="imgOption"][value="file"]').checked = true;
          imagenUrlInput.style.display = 'none';
          imagenFileInput.style.display = 'block';
        } else {
          form.querySelector('input[name="imgOption"][value="url"]').checked = true;
          imagenUrlInput.style.display = 'block';
          imagenFileInput.style.display = 'none';
        }

        btnSubmit.textContent = 'Actualizar';
        formTitle.textContent = 'Editar evento o servicio';
      });
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const eventosActualizados = JSON.parse(localStorage.getItem('eventos') || '[]');

    let imagenFinal = '';
    if (form.querySelector('input[name="imgOption"]:checked').value === 'url') {
      imagenFinal = imagenUrlInput.value.trim();
    } else {
      const file = imagenFileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          guardarEvento(e.target.result);
        };
        reader.readAsDataURL(file);
        return; 
      } else if (editIndex !== null) {
        imagenFinal = eventosActualizados[editIndex].imagen || '';
      }
    }

    guardarEvento(imagenFinal);

    function guardarEvento(imagen) {
      const nuevoEvento = {
        id: editIndex !== null ? eventosActualizados[editIndex].id : Date.now(),
        nombre: nombre.value.trim(),
        descripcion: descripcion.value.trim(),
        imagen: imagen,
        tipo: tipo.value,
      };

      if (editIndex !== null) {
        eventosActualizados[editIndex] = nuevoEvento;
        editIndex = null;
      } else {
        eventosActualizados.push(nuevoEvento);
      }

      localStorage.setItem('eventos', JSON.stringify(eventosActualizados));
      form.reset();
      previewContainer.style.display = 'none';
      btnSubmit.textContent = 'Agregar';
      formTitle.textContent = 'Agregar nuevo evento o servicio';
      mostrarEventos();
    }
  });

  mostrarEventos();
}

function renderComentariosPendientes(container) {
  const comentarios = JSON.parse(localStorage.getItem("comentariosPendientes") || "[]");

  container.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header bg-warning p-3 rounded-top">
        <h5 class="m-0">Comentarios Pendientes</h5>
      </div>
      <ul id="listaComentarios" class="list-group list-group-flush"></ul>
    </div>

    <div class="admin-card mt-4">
      <div class="admin-card-header bg-success text-white p-3 rounded-top">
        <h5 class="m-0">Comentarios Aprobados</h5>
      </div>
      <ul id="listaAprobados" class="list-group list-group-flush"></ul>
    </div>
  `;

  const listaComentarios = container.querySelector('#listaComentarios');
  const listaAprobados = container.querySelector('#listaAprobados');

  function mostrarComentarios() {
    listaComentarios.innerHTML = '';
    comentarios.forEach((c, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `
        <p>"${c.texto}" - <strong>${c.autor}</strong></p>
        <div>${'⭐'.repeat(c.valoracion)}</div>
        <div class="d-flex gap-2 mt-2">
          <button class="btn btn-success btn-sm" data-accion="aprobar" data-index="${index}">Aprobar</button>
          <button class="btn btn-danger btn-sm" data-accion="eliminar" data-index="${index}">Eliminar</button>
        </div>
      `;
      listaComentarios.appendChild(li);
    });

    listaComentarios.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.index);
        const accion = btn.dataset.accion;
        if (accion === 'aprobar') {
          const aprobados = JSON.parse(localStorage.getItem("testimoniosAprobados") || "[]");
          aprobados.push({ ...comentarios[index], aprobado: true });
          localStorage.setItem("testimoniosAprobados", JSON.stringify(aprobados));
        }
        comentarios.splice(index, 1);
        localStorage.setItem("comentariosPendientes", JSON.stringify(comentarios));
        mostrarComentarios();
        mostrarAprobados();
      });
    });
  }

  function mostrarAprobados() {
    const aprobados = JSON.parse(localStorage.getItem("testimoniosAprobados") || "[]");
    listaAprobados.innerHTML = '';

    aprobados.forEach((c, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `
        <p>"${c.texto}" - <strong>${c.autor}</strong></p>
        <div>${'⭐'.repeat(c.valoracion)}</div>
        <div class="mt-2">
          <button class="btn btn-sm btn-outline-danger eliminar-aprobado" data-index="${index}">Eliminar</button>
        </div>
      `;
      listaAprobados.appendChild(li);
    });

    listaAprobados.querySelectorAll('.eliminar-aprobado').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.index);
        if (confirm("¿Seguro que querés eliminar este comentario aprobado?")) {
          const aprobados = JSON.parse(localStorage.getItem("testimoniosAprobados") || "[]");
          aprobados.splice(index, 1);
          localStorage.setItem("testimoniosAprobados", JSON.stringify(aprobados));
          mostrarAprobados();
        }
      });
    });
  }

  mostrarComentarios();
  mostrarAprobados();
}

function renderConsultasAdmin(container) {
  const consultas = JSON.parse(localStorage.getItem("consultas") || "[]");

  container.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header bg-info p-3 rounded-top">
        <h5 class="m-0">📨 Consultas de usuarios</h5>
      </div>
      ${consultas.length === 0
      ? '<p class="text-muted p-3">No hay consultas registradas.</p>'
      : `
        <ul class="list-group list-group-flush">
          ${consultas
        .map(
          (c, i) => `
              <li class="list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row gap-2">
                <div>
                  <p class="mb-1"><strong>${c.nombre}</strong> (${c.email})</p>
                  <p class="mb-1"><strong>Usuario:</strong> ${c.usuario}</p>
                  <p class="mb-1"><strong>Tel:</strong> ${c.telefono || '—'}</p>
                  <p class="mb-1"><strong>Mensaje:</strong> ${c.mensaje}</p>
                  <small class="text-muted">${c.fecha}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger eliminar-consulta" data-index="${i}">
                  Eliminar
                </button>
              </li>`
        )
        .join("")}
        </ul>
      `
    }
    </div>
  `;

  container.querySelectorAll('.eliminar-consulta').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = Number(btn.dataset.index);
      if (confirm("¿Seguro que querés eliminar esta consulta?")) {
        const consultasActualizadas = JSON.parse(localStorage.getItem("consultas") || "[]");
        consultasActualizadas.splice(index, 1);
        localStorage.setItem("consultas", JSON.stringify(consultasActualizadas));
        renderConsultasAdmin(container);
      }
    });
  });
}

function renderNotificacionesAdmin(container) {
  const comentarios = JSON.parse(localStorage.getItem("comentariosPendientes") || "[]");
  const consultas = JSON.parse(localStorage.getItem("consultas") || "[]");
  const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");

  const notificacionesPorUsuario = {};

  function agregarNotif(tipo, item) {
    const key = item.usuario || item.email || 'anónimo';
    if (!notificacionesPorUsuario[key]) notificacionesPorUsuario[key] = [];
    notificacionesPorUsuario[key].push({ tipo, item });
  }

  comentarios.forEach(c => agregarNotif('Comentario', c));
  consultas.forEach(c => agregarNotif('Consulta', c));
  reservas.forEach(r => agregarNotif('Reserva', r));

  container.innerHTML = `
    <div class="admin-card">
      <div class="admin-card-header bg-success p-3 rounded-top">
        <h5 class="m-0">🔔 Notificaciones por usuario</h5>
      </div>
      <ul class="list-group list-group-flush" id="listaNotificaciones"></ul>
    </div>
  `;

  const lista = container.querySelector('#listaNotificaciones');
  lista.innerHTML = '';

  Object.entries(notificacionesPorUsuario).forEach(([usuario, items]) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';

    const mensajes = items.map(({ tipo, item }) => {
      let resumen = '';
      if (tipo === 'Comentario') resumen = `"${item.texto.slice(0, 30)}..." (Comentario pendiente)`;
      else if (tipo === 'Consulta') resumen = `"${item.mensaje.slice(0, 30)}..." (Consulta)`;
      else if (tipo === 'Reserva') resumen = `Reserva para ${item.fecha || 'fecha no definida'}`;
      return `<li><strong>${tipo}:</strong> ${resumen}</li>`;
    }).join('');

    li.innerHTML = `
      <strong>${usuario}</strong>
      <ul>${mensajes}</ul>
    `;
    lista.appendChild(li);
  });
}