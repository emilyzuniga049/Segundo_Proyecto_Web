document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const userMenu = document.querySelector('.user-menu');
  if (userMenu){
    const icon = userMenu.querySelector('.user-icon');
    const dropdown = userMenu.querySelector('.user-dropdown');
    if (icon && dropdown){
      icon.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.style.display = (dropdown.style.display === 'flex' ? 'none' : 'flex');
        dropdown.style.flexDirection = 'column';
      });
      document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target)) dropdown.style.display = 'none';
      });
    }
  }

  // Si no hay sesión, manda al login
  if (!currentUser) {
    window.location.href = '../Index.html';
    return;
  }

  const role = (currentUser.role || 'user').toLowerCase();


  const navMyRides = document.getElementById('nav-myrides');
  if (navMyRides && role === 'user') {
    navMyRides.classList.add('hidden');
    // redirige
    if (location.pathname.toLowerCase().includes('/myrides/')) {
      window.location.href = '../Search rides/index.html';
      return;
    }
  }

  const pageMyRides = document.getElementById('page-myrides');
  if (pageMyRides && role === 'user') {
    pageMyRides.classList.add('hidden');
    alert('No tienes permiso para ver "My rides".');
    window.location.href = '../Home/index.html';
  }

  const requestBtn = document.querySelector('.request-btn');
  if (requestBtn && role === 'driver') {
    requestBtn.style.display = 'none';
  }

  const logoutBtn = document.getElementById('Logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('currentUser'); 
      window.location.href = '../Index.html';   
    });
  }

});