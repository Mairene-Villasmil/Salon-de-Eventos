export function renderNosotros(container) {
  const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");

  const eventosItems = reservas.length > 0
    ? reservas.map((r, i) => {
        const fecha = new Date(r.fecha);
        const dia = fecha.getDate();
        const mes = fecha.toLocaleString('es-AR', { month: 'short' }).toUpperCase();

        const nombreEvento = r.salon ? `Reserva: ${r.salon}` : 'Reserva de Servicio';
        const lugar = r.lugar || 'No especificado';  
        const hora = r.hora || '--:--';

        return `
          <div class="carousel-item ${i === 0 ? 'active' : ''}">
            <div class="d-flex align-items-center px-4">
              <div class="bg-accent text-white text-center rounded-3 me-3 p-2" style="width: 50px;">
                <div class="fw-bold">${dia}</div>
                <div class="small">${mes}</div>
              </div>
              <div>
                <h4 class="h6 mb-1">${nombreEvento}</h4>
                <p class="small text-muted mb-0">${hora} hs</p>
              </div>
            </div>
          </div>
        `;
      }).join('')
    : `<div class="carousel-item active">
         <div class="text-center px-4">
           <p class="mb-3">No hay reservas aún. ¡Sé el primero en reservar tu evento!</p>
         </div>
       </div>`;

  const aprobados = JSON.parse(localStorage.getItem("testimoniosAprobados") || "[]");

  // Generar los items para el carrusel de testimonios
  const testimoniosItems = aprobados.length > 0
    ? aprobados.map((c, i) => `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
          <blockquote class="blockquote px-4">
            <p>"${c.texto}"</p>
            <footer class="blockquote-footer">${c.autor} — ${'⭐'.repeat(c.valoracion)}</footer>
          </blockquote>
        </div>
      `).join('')
    : `<div class="carousel-item active">
         <div class="text-center px-4">
           <p>No hay testimonios aprobados aún.</p>
         </div>
       </div>`;

  container.innerHTML = `
    <main class="flex-grow-1 py-5" data-section="nosotros">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <section class="about">
              <h2 class="display-5 fw-bold mb-4 position-relative pb-3">Sobre Nosotros
                <span class="position-absolute bottom-0 start-0 bg-primary rounded" style="height: 4px; width: 80px;"></span>
              </h2>
               <article class="mb-5">
                <h3 class="h4 text-primary mb-3">Nuestra Historia</h3>
                <p>Desde 2010, en <strong>IDW S.A</strong> nos especializamos en crear fiestas infantiles inolvidables...</p>

                <div class="row align-items-center mt-4">
                  <div class="col-md-6 mb-4 mb-md-0">
                    <img src="https://media.istockphoto.com/id/1384618716/es/foto/grupo-multirracial-de-amigos-tomando-selfie-foto-afuera-felices-diferentes-j%C3%B3venes.jpg?s=612x612&w=0&k=20&c=YPn6wpnh5wjCixG93QDxISyTbvXbl4cWuyJzJKDHXrU=" alt="Nuestro equipo" loading="lazy" class="img-fluid rounded shadow" />
                  </div>
                  <div class="col-md-6">
                    <h3 class="h4 text-primary mb-3">Misión</h3>
                    <p>Convertir los sueños de los más pequeños en realidad...</p>
                  </div>
                </div>
              </article>

              <article>
                <h3 class="h4 text-primary mb-3">Valores</h3>
                <ul class="list-unstyled">
                  <li class="mb-2 d-flex align-items-start">
                    <i class="fas fa-check-circle text-primary me-2 mt-1"></i> Creatividad e innovación
                  </li>
                  <li class="mb-2 d-flex align-items-start">
                    <i class="fas fa-check-circle text-primary me-2 mt-1"></i> Seguridad garantizada
                  </li>
                  <li class="mb-2 d-flex align-items-start">
                    <i class="fas fa-check-circle text-primary me-2 mt-1"></i> Atención personalizada
                  </li>
                </ul>
                <div class="row text-center mt-5 g-4">
                  <div class="col-md-4"><div class="bg-light p-4 rounded">
                    <span class="d-block fs-2 fw-bold text-primary mb-2">12+</span><span class="text-muted">Años</span>
                  </div></div>
                  <div class="col-md-4"><div class="bg-light p-4 rounded">
                    <span class="d-block fs-2 fw-bold text-primary mb-2">500+</span><span class="text-muted">Eventos</span>
                  </div></div>
                  <div class="col-md-4"><div class="bg-light p-4 rounded">
                    <span class="d-block fs-2 fw-bold text-primary mb-2">98%</span><span class="text-muted">Satisfacción</span>
                  </div></div>
                </div>
              </article>
            </section>
          </div>
          <aside class="col-lg-4 mt-5 mt-lg-0">
            <h3 class="h5 text-primary border-3 ps-3 mb-2">
              <i class="fas fa-calendar-star me-2"></i>Próximos Eventos
            </h3>
            <div class="cardN shadow-sm border-0 border-start border-3 border-primary">
              <div class="card-body border-primary">
                <div id="eventosCarousel" class="carousel slide" data-bs-ride="carousel">
                  <div class="carousel-inner">${eventosItems}</div>
                  <button class="carousel-control-prev" type="button" data-bs-target="#eventosCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#eventosCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon"></span>
                  </button>
                </div>
              </div>
            </div>

            <h3 class="h5 text-primary border-3 ps-3 mb-2">
              <i class="fas fa-comment-dots me-2"></i>Nuestros Testimonios
            </h3>
            <div class="cardN shadow-sm border-0 border-start border-3 border-primary">
              <div class="card-body border-primary">
                <div id="testimoniosCarousel" class="carousel slide" data-bs-ride="carousel">
                  <div class="carousel-inner">${testimoniosItems}</div>
                  <button class="carousel-control-prev" type="button" data-bs-target="#testimoniosCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#testimoniosCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon"></span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  `;
}