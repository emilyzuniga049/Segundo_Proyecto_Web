document.addEventListener('DOMContentLoaded', () => {
  const rideId = Number(new URLSearchParams(window.location.search).get('id'));
  const rides = JSON.parse(localStorage.getItem('rides')) || [];
  const ride = rides.find(r => r.id === rideId);

  if (!ride) {
    alert("Ride no encontrado");
    window.location.href = "../Myrides/Index.html";
    return;
  }

  fillRideDetails(ride);
});

function fillRideDetails(ride) {
  const usernameEl = document.querySelector('.ride-profile .username');
  if (usernameEl) {
    usernameEl.textContent = ride.userEmail || 'Sin user';
  }

  const spans = document.querySelectorAll('.route-info label span');
  if (spans[0]) spans[0].textContent = ride.from || '';
  if (spans[1]) spans[1].textContent = ride.to || '';


  const daysSet = new Set((ride.days || []).map(d => d.trim().toLowerCase()));
  document.querySelectorAll('.days-checkboxes label').forEach(label => {
    const txt = label.textContent.trim().toLowerCase();
    const input = label.querySelector('input[type="checkbox"]');
    if (input) input.checked = daysSet.has(txt);
  });

  // Hora, asientos, tarifa
  const timeInput  = document.querySelector('.ride-fields input[type="time"]');
  const numberInputs = document.querySelectorAll('.ride-fields input[type="number"]');
  const seatsInput = numberInputs[0]; 
  const feeInput   = numberInputs[1]; 

  if (timeInput)  timeInput.value  = toTimeValue(ride.time || '');
  if (seatsInput) seatsInput.value = ride.seats ?? 1;
  if (feeInput)   feeInput.value   = ride.fee ?? 0;


  const makeEl  = document.getElementById('make');
  const modelEl = document.getElementById('model');
  const yearEl  = document.getElementById('year');

  if (makeEl)  makeEl.value  = ride.vehicle?.make  || '';
  if (modelEl) modelEl.value = ride.vehicle?.model || '';
  if (yearEl)  yearEl.value  = ride.vehicle?.year  || '';


  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.setAttribute('disabled', 'disabled');
  });
}


function toTimeValue(str) {
  if (/^\d{2}:\d{2}$/.test(str)) return str;
  const m = String(str).trim().match(/^(\d{1,2}):?(\d{2})?\s*([ap]\.?m\.?)$/i);
  if (!m) return '10:00';
  let hour = parseInt(m[1], 10);
  const min = m[2] || '00';
  const mer = m[3].toLowerCase();
  if (mer.startsWith('p') && hour < 12) hour += 12;
  if (mer.startsWith('a') && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}:${min}`;
}
