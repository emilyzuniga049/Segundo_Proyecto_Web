document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  // Si no hay sesión, manda al login
  if (!currentUser) {
    window.location.href = '../Index.html';
    return;
  }

  // Normaliza rol: 'user' (pasajero), 'driver' (conductor), 'admin'
  const role = (currentUser.role || 'user').toLowerCase();

  // Ocultar el item del navbar "Rides" para usuarios sin permiso
  const navMyRides = document.getElementById('nav-myrides');
  if (navMyRides && role === 'user') {
    navMyRides.classList.add('hidden');
    // Si estás actualmente en MyRides y no debes verlo, redirige
    if (location.pathname.toLowerCase().includes('/myrides/')) {
      window.location.href = '../Search rides/index.html';
      return;
    }
  }

  const pageMyRides = document.getElementById('page-myrides');
  if (pageMyRides && role === 'user') {
    pageMyRides.classList.add('hidden');
    // (opcional) muestra un aviso
    alert('No tienes permiso para ver "My rides".');
    window.location.href = '../Home/index.html';
  }

  const requestBtn = document.querySelector('.request-btn');
  if (requestBtn && role === 'driver') {
    requestBtn.style.display = 'none';
  }

});