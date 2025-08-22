document.addEventListener('DOMContentLoaded', () => {
  const form       = document.querySelector('.configuration-form');
  const publicName = document.getElementById('public-name');
  const publicBio  = document.getElementById('public-bio');

  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = '../Index.html';
    return;
  }

  const name = currentUser.name || '';
  publicName.value = name;  
  publicBio.value  = currentUser.publicBio || '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    currentUser = {
      ...currentUser,
      publicBio: publicBio.value.trim() 
    };

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) users[idx] = currentUser; 
    else users.push(currentUser);
    localStorage.setItem('users', JSON.stringify(users));

    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

    window.location.href = '../Search Rides/Index.html';
  });
});
