import { renderHome } from './routes/home.js';
import { renderContacto } from './routes/contacto.js';
import { renderNotFound } from './routes/notfound.js';
import { renderNosotros } from './routes/nosotros.js';
import { renderModal } from './routes/modal.js';
import { renderFooter } from './routes/footer.js';
import { renderLogin } from './routes/login.js';

const app = document.getElementById('app');
const navbar = document.getElementById('navbar');

let dataGlobal = [];

function getPath() {
  return window.location.hash.slice(2).split('?')[0] || '';
}

async function fetchData() {
  try {
    const res = await fetch('./data/salones.json');
    if (!res.ok) throw new Error('Error cargando los datos');

    const jsonData = await res.json();

    const guardados = JSON.parse(localStorage.getItem('eventos'));
    if (guardados && Array.isArray(guardados)) {
      dataGlobal = [...jsonData]; 
    } else {
      dataGlobal = jsonData;
    }

    setupNavbar();
    await route();
  } catch (error) {
    app.innerHTML = `<p>Error cargando datos: ${error.message}</p>`;
  }
}

function ocultarTodo() {
  const secciones = document.querySelectorAll('[data-section]');
  secciones.forEach(section => {
    section.style.display = 'none';
  });
}

function mostrarSolo(id) {
  ocultarTodo();
  const target = document.querySelector(`[data-section="${id}"]`);
  if (target) {
    target.style.display = 'block';
  }
}

function setupNavbar() {
  const auth = JSON.parse(sessionStorage.getItem('auth'));
  const usuario = auth ? auth.user : null;

  navbar.innerHTML = `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand" id="logo">Eventos - Salones Infantiles</div>
        <button class="navbar-toggle" id="navbarToggle">☰</button>
        
        <div class="nav-links" id="navLinks">
          <button class="btn-nav" data-filtro="todos">Todos</button>
          <button class="btn-nav" data-filtro="salon">Salones</button>
          <button class="btn-nav" data-filtro="servicio">Servicios</button>
          <button class="btn-nav" data-filtro="contacto">Contacto</button>
          <button class="btn-nav" data-filtro="nosotros">Nosotros</button>
        </div>

        <div class="right-controls">
          <input type="text" id="searchInput" placeholder="Buscar..." style="display:none" />
          ${usuario
      ? `<img src="${usuario.foto}" 
                      alt="Mi perfil" 
                      id="perfilBtn" 
                      class="perfil-avatar" 
                      title="Mi perfil" />`
      : `<button id="loginBtn" class="btn-login">Iniciar sesión</button>`
    }
          ${usuario ? `<button id="logoutBtn" class="btn-logout" title="Cerrar sesión"></button>` : ''}
        </div>
      </div>
    </nav>
  `;

  document.getElementById('navbarToggle')?.addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('show');
  });

  document.getElementById('logo')?.addEventListener('click', () => {
    window.location.hash = '#/';
  });

  navbar.querySelectorAll('button[data-filtro]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filtro = btn.getAttribute('data-filtro');
      const nuevoHash = filtro === 'todos' ? '#/' : `#/${filtro}`;
      if (window.location.hash === nuevoHash) {
        route(filtro === 'todos' ? '' : filtro);
      } else {
        window.location.hash = nuevoHash;
      }
    });
  });

  document.getElementById('perfilBtn')?.addEventListener('click', () => {
    window.location.hash = '#/perfil';
  });

  document.getElementById('loginBtn')?.addEventListener('click', () => {
    window.location.hash = '#/login';
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem('auth');
    window.location.hash = '#/login';
    setupNavbar();
  });

  const searchInput = document.getElementById('searchInput');
  searchInput?.addEventListener('input', (e) => {
    const texto = e.target.value.trim().toLowerCase();
    const path = getPath();
    if (path === 'contacto' || path === 'nosotros') return;

    if (texto === '') {
      route(path || 'todos');
    } else {
      filtrarTarjetas(texto);
    }
  });
}

function filtrarTarjetas(texto) {
  const grid = app.querySelector('.grid-container');
  if (!grid) return;

  const cards = Array.from(grid.children);
  let hayVisible = false;

  cards.forEach(card => {
    const nombre = card.querySelector('h5')?.textContent.toLowerCase() || '';
    const descripcion = card.querySelector('p')?.textContent.toLowerCase() || '';
    const visible = nombre.includes(texto) || descripcion.includes(texto);
    card.style.display = visible ? 'block' : 'none';
    if (visible) hayVisible = true;
  });

  const mensaje = app.querySelector('.sin-resultados');
  if (!hayVisible) {
    if (!mensaje) {
      const nuevo = document.createElement('p');
      nuevo.className = 'sin-resultados';
      nuevo.textContent = `No se encontraron resultados para "${texto}".`;
      app.appendChild(nuevo);
    }
  } else {
    if (mensaje) mensaje.remove();
  }
}

async function route(path = null) {
  if (!path) path = getPath();
  const [rawPath, query] = path.split("?");
  const params = new URLSearchParams(query);

  const searchInput = navbar.querySelector('#searchInput');
  if (searchInput) {
    if (['', 'todos', 'salon', 'servicio'].includes(rawPath)) {
      searchInput.style.display = 'block';
    } else {
      searchInput.style.display = 'none';
      searchInput.value = '';
    }
  }

  const auth = JSON.parse(sessionStorage.getItem('auth'));
  const estaLogueado = Boolean(auth && auth.token);
  const usuario = estaLogueado ? auth.user : null;

  if (['', 'todos', 'salon', 'servicio'].includes(rawPath)) {
    mostrarSolo('inicio');
    await renderWithFade(renderHome, app, dataGlobal, rawPath || 'todos');

  } else if (rawPath.startsWith('detalles/')) {
    mostrarSolo('inicio');
    const id = parseInt(rawPath.split('/')[1]);
    const item = dataGlobal.find(d => d.id === id);
    if (item) {
      renderModal(item);
    } else {
      await renderWithFade(renderNotFound, app);
    }

  } else if (rawPath === 'contacto') {
    mostrarSolo('contacto');
    await renderWithFade(renderContacto, app, params);

  } else if (rawPath === 'nosotros') {
    mostrarSolo('nosotros');
    await renderWithFade(renderNosotros, app, dataGlobal);

  } else if (rawPath === 'reservar') {
    const { renderReservar } = await import('./routes/reservar.js');
    await renderWithFade(renderReservar, app, dataGlobal);
  } else if (rawPath === 'perfil') {
    if (!estaLogueado) {
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
      }
      return;
    }
    if (usuario.role === 'admin') {
      const { renderAdminPanel } = await import('./routes/admin.js');
      await renderWithFade(renderAdminPanel, app, dataGlobal);
    } else {
      const { renderPerfilUsuario } = await import('./routes/perfilUsuario.js');
      await renderWithFade(renderPerfilUsuario, app, usuario);
    }
    console.log('Usuario en perfil:', usuario.role);

  } else if (rawPath === 'login') {
    if (estaLogueado) {
      window.location.hash = '#/perfil';
      return;
    }
    await renderWithFade(renderLogin, app);

  } else {
    await renderWithFade(renderNotFound, app);
  }


  function actualizarActivo(filtro) {
    navbar.querySelectorAll('button[data-filtro]').forEach(btn => {
      const valor = btn.getAttribute('data-filtro');
      btn.classList.toggle('active', valor === filtro);
    });

    const loginBtn = navbar.querySelector('#loginBtn');
    loginBtn?.classList.toggle('active', filtro === 'login');
  }
  const activo = path === '' ? 'todos' : path.split('/')[0];
  actualizarActivo(activo);
}

function fadeOut(element) {
  return new Promise((resolve) => {
    element.style.transition = "opacity 0.3s ease";
    element.style.opacity = 0;
    setTimeout(resolve, 300);
  });
}

function fadeIn(element) {
  return new Promise((resolve) => {
    element.style.transition = "opacity 0.3s ease";
    element.style.opacity = 1;
    setTimeout(resolve, 300);
  });
}

async function renderWithFade(renderFn, container, ...args) {
  await fadeOut(container);
  container.innerHTML = '';
  await renderFn(container, ...args);

  const existingFooter = document.getElementById('footer');
  if (existingFooter) existingFooter.remove();

  const footer = document.createElement('div');
  footer.id = 'footer';
  renderFooter(footer);
  container.appendChild(footer);

  await fadeIn(container);
}

window.addEventListener('load', () => route());
window.addEventListener('hashchange', () => route());

fetchData();