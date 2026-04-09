document.addEventListener('DOMContentLoaded', function () {
  // Validación del formulario
  (function () {
    const form = document.getElementById('form-contacto');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nombre = (document.getElementById('nombre') || {}).value?.trim() || '';
      const correo = (document.getElementById('correo') || {}).value?.trim() || '';
      const mensaje = (document.getElementById('mensaje') || {}).value?.trim() || '';
      const fecha = (document.getElementById('fecha') || {}).value?.trim() || '';
      const personas = (document.getElementById('personas') || {}).value?.trim() || '';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Limpia alertas previas
      Array.from(form.querySelectorAll('.alert')).forEach(a => a.remove());

      if (!nombre || !correo || !fecha || !personas) {
        const alerta = document.createElement('div');
        alerta.className = 'alert alert-warning alert-dismissible fade show';
        alerta.setAttribute('role', 'alert');
        alerta.innerHTML = '<strong>⚠ Atención:</strong> Por favor completa todos los campos obligatorios.' +
          '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>';
        form.prepend(alerta);
        return;
      }

      if (!emailRegex.test(correo)) {
        const alerta = document.createElement('div');
        alerta.className = 'alert alert-warning alert-dismissible fade show';
        alerta.setAttribute('role', 'alert');
        alerta.innerHTML = '<strong>⚠ Atención:</strong> Por favor ingresa un email válido.' +
          '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>';
        form.prepend(alerta);
        return;
      }

      const num = Number(personas);
      if (isNaN(num) || num < 1) {
        const alerta = document.createElement('div');
        alerta.className = 'alert alert-warning alert-dismissible fade show';
        alerta.setAttribute('role', 'alert');
        alerta.innerHTML = '<strong>⚠ Atención:</strong> Ingresa una cantidad de personas válida.' +
          '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>';
        form.prepend(alerta);
        return;
      }

      const modalMensaje = `Gracias <strong>${nombre}</strong>, tu reserva ha sido enviada. Te contactaremos a <strong>${correo}</strong>.`;
      const modalMensajeEl = document.getElementById('modalMensaje');
      if (modalMensajeEl) modalMensajeEl.innerHTML = modalMensaje;

      const modal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
      modal.show();

      form.reset();
      Array.from(form.querySelectorAll('.alert')).forEach(a => a.remove());
    });
  })();

  // Scroll suave y cierra el menú en móvil
  document.querySelectorAll('.navbar a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      const destino = document.querySelector(hash);
      if (!destino) return;
      e.preventDefault();

      const offsetNavbar = 80;
      const destinoTop = destino.getBoundingClientRect().top + window.pageYOffset - offsetNavbar;

      window.scrollTo({ top: destinoTop, behavior: 'smooth' });

      const menu = document.getElementById('navbarNav');
      if (menu && menu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  // Sombra en navbar cuando haces scroll
  const navbar = document.querySelector('.navbar');
  function toggleNavbarShadow() {
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', toggleNavbarShadow);
  toggleNavbarShadow();

  // Botón para volver arriba
  const btnTop = document.getElementById('btnTop');
  function toggleBtnTop() {
    if (!btnTop) return;
    if (window.scrollY > 300) btnTop.classList.add('show'); else btnTop.classList.remove('show');
  }
  window.addEventListener('scroll', toggleBtnTop);
  if (btnTop) {
    btnTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    toggleBtnTop();
  }

  // Animaciones fade-in cuando ves los elementos
  function checkFadeIn() {
    document.querySelectorAll('.fade-in').forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) el.classList.add('visible');
    });
  }
  window.addEventListener('scroll', checkFadeIn);
  window.addEventListener('resize', checkFadeIn);
  checkFadeIn();

  // Carga el mapa de Google
  const latitud = -37.4662;
  const longitud = -72.3731;
  
  const iframe = document.getElementById('mapaGoogle');
  const btnMaps = document.getElementById('btnMaps');

  if (iframe) {
    const urlMapa = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27313.36310440928!2d-72.37313208738618!3d-37.4662291046558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x966bdd4669523657%3A0x8318f6229d680877!2zTG9zIEFuZ2VsZXMsIExvcyDDgW5nZWxlcywgQsOtbyBCw61v!5e1!3m2!1ses!2scl!4v1767902173649!5m2!1ses!2scl';
    
    iframe.src = urlMapa;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = '0';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframe.title = 'Ubicación de Café Nómada en Los Ángeles, Biobío, Chile';
  }
  
  if (btnMaps) {
    btnMaps.href = `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`;
    btnMaps.setAttribute('aria-label', 'Abrir ubicación de Café Nómada en Google Maps');
    
    if (!btnMaps.textContent || btnMaps.textContent.trim() === '') {
      btnMaps.textContent = 'Abrir en Google Maps';
    }
  }
});