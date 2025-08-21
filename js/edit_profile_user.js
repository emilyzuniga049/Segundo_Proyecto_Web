document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.profile-form');

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) { window.location.href = '../Index.html'; return; }
  const role = (currentUser.role || 'user').toLowerCase();
  if (role !== 'user') return; // solo users

  const firstName = byId('first-name');
  const lastName  = byId('last-name');
  const email     = byId('email');
  const password  = byId('password');
  const password2 = byId('password2');
  const address   = byId('address');
  const country   = byId('country');
  const state     = byId('state');
  const city      = byId('city');
  const phone     = byId('phone');
  firstName.value = currentUser.name || '';
  lastName.value  = currentUser.lastname  || '';
  email.value     = currentUser.email     || '';
  password.value = currentUser.password || '';
  password2.value = currentUser.password || '';
  address.value   = currentUser.address   || '';
  country.value   = currentUser.country   || '';
  state.value     = currentUser.state     || '';
  city.value      = currentUser.city      || '';
  phone.value     = currentUser.phone     || '';

  document.getElementById("vehicle-info").style.display = "none";
  document.getElementById("vehicle-info2").style.display = "none";

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let newPassword = currentUser.password || '';
    const p1 = password.value.trim();
    const p2 = password2.value.trim();
    if (p1 || p2) {
      if (p1 !== p2) { alert('Las contraseñas no coinciden'); return; }
      newPassword = p1;
    }

    const updated = {
      ...currentUser,
      name: firstName.value.trim(),
      lastname : lastName.value.trim(),
      password : newPassword,
      phone    : phone.value.trim(),
      role     : currentUser.role 
    };
    setOptional(updated, 'address', address.value);
    setOptional(updated, 'country', country.value);
    setOptional(updated, 'state',   state.value);
    setOptional(updated, 'city',    city.value);

    upsertUserByEmail(currentUser.email, updated);

    sessionStorage.setItem('currentUser', JSON.stringify(updated));
    window.location.href = '../Myrides/Index.html';
  });

 
  function byId(id){ return document.getElementById(id); }

  function setOptional(obj, key, rawVal) {
    const val = (rawVal ?? '').toString().trim();
    if (val) obj[key] = val; else delete obj[key];
  }

  function upsertUserByEmail(email, updatedUser) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const idx = users.findIndex(u => u.email === email);
    if (idx !== -1) users[idx] = updatedUser; else users.push(updatedUser);
    localStorage.setItem('users', JSON.stringify(users));
  }
});
