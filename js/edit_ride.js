document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = '../Index.html';
    return;
  }

  const rideId = Number(new URLSearchParams(window.location.search).get('id'));
  if (!Number.isFinite(rideId)) {
    alert('Ride inválido.');
    window.location.href = '../Myrides/Index.html';
    return;
  }
  const form = document.querySelector('.new-ride-form');
  const rides = JSON.parse(localStorage.getItem('rides')) || [];
  const ride = rides.find(r => r.id === rideId && r.userEmail === currentUser.email);
  if (!ride) {
    alert('No se encontró el ride.');
    window.location.href = '../Myrides/Index.html';
    return;
  }


  document.getElementById('from').value = ride.from || '';
  document.getElementById('to').value   = ride.to || '';
  document.getElementById('time').value = ride.time || '';
  document.getElementById('seats').value = ride.seats ?? 1;
  document.getElementById('fee').value   = ride.fee ?? 0;

  document.getElementById('make').value  = ride.vehicle?.make || '';
  document.getElementById('model').value = ride.vehicle?.model || '';
  document.getElementById('year').value  = ride.vehicle?.year || '';


  const dayChecks = document.querySelectorAll('.days-options label');
  const daysSet = new Set((ride.days || []).map(d => d.trim().toLowerCase()));
  dayChecks.forEach(label => {
    const txt = label.textContent.trim().toLowerCase(); 
    const input = label.querySelector('input[type="checkbox"]');
    if (input) input.checked = daysSet.has(txt);
  });


  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const updated = {
      ...ride,
      from:  document.getElementById('from').value.trim(),
      to:    document.getElementById('to').value.trim(),
      time:  document.getElementById('time').value,
      seats: Number(document.getElementById('seats').value),
      fee:   Number(document.getElementById('fee').value),
      vehicle: {
        make:  document.getElementById('make').value,
        model: document.getElementById('model').value.trim(),
        year:  document.getElementById('year').value
      },
      days: Array.from(document.querySelectorAll('.days-options input:checked'))
                 .map(chk => chk.parentElement.textContent.trim())
    };

    const newRides = rides.map(r => r.id === rideId ? updated : r);
    localStorage.setItem('rides', JSON.stringify(newRides));

    window.location.href = '../Myrides/Index.html';
  });
});