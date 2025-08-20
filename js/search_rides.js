document.addEventListener('DOMContentLoaded', () => { 
  const fromSel  = document.getElementById('from');
  const toSel    = document.getElementById('to');
  const findBtn  = document.querySelector('.find-btn');
  const tbody    = document.querySelector('.rides-table tbody');
  const resultEl = document.querySelector('.search-result');

  const rides = JSON.parse(localStorage.getItem('rides')) || [];

  initLocationSelects(rides, fromSel, toSel);
  clearTable(tbody);
  updateResultMessage(resultEl, '', '');

  findBtn.addEventListener('click', () => {
    const selectedFrom = (fromSel.value || '').trim();
    const selectedTo   = (toSel.value || '').trim();
    const selectedDays = getSelectedDays(); 

    const filtered = rides.filter(r => {
      const matchFrom = !selectedFrom || r.from === selectedFrom;
      const matchTo   = !selectedTo   || r.to   === selectedTo;

      const rDays = (r.days || []).map(d => d.trim().toLowerCase());
      const sDays = selectedDays.map(d => d.trim().toLowerCase());
      const dayOK = sDays.length === 0 || rDays.some(d => sDays.includes(d));

      return matchFrom && matchTo && dayOK;
    });

    renderResults(filtered, tbody);
    resultEl.style.display = "block";  
    updateResultMessage(resultEl, selectedFrom, selectedTo);
    updateMap(selectedFrom, selectedTo); 
  });
});

function initLocationSelects(rides, from, to) {
  const fromSet = new Set();
  const toSet   = new Set();
  rides.forEach(r => {
    if (r.from) fromSet.add(r.from);
    if (r.to)   toSet.add(r.to);
  });

  from.innerHTML = '';
  to.innerHTML   = '';
  from.appendChild(new Option('- Select origin -', ''));
  to.appendChild(new Option('- Select destination -', ''));  

  Array.from(fromSet).sort().forEach(f => from.appendChild(new Option(f, f)));
  Array.from(toSet).sort().forEach(t => to.appendChild(new Option(t, t)));
}

function getSelectedDays() {
  const labels = document.querySelectorAll('.days-checkboxes label');
  const days = [];
  labels.forEach(l => {
    const input = l.querySelector('input[type="checkbox"]');
    if (input && input.checked) days.push(l.textContent.trim());
  });
  return days;
}

function clearTable(tbody) {
  tbody.innerHTML = `
    <tr>
      <td colspan="7" style="text-align:center; opacity:.8;">
      </td>
    </tr>`;
}

function renderResults(rows, tbody) {
  tbody.innerHTML = '';
  if (!rows.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; opacity:.8;">
          No rides found...
        </td>
      </tr>`;
    return;
  }

  rows.forEach(ride => {
    const driverEmail = ride.userEmail || 'driver';
    const from  = ride.from || '';
    const to    = ride.to   || '';
    const seats = ride.seats ?? '';
    const fee   = (ride.fee === 0 || ride.fee) ? `$${ride.fee}` : '--';
    const carMake  = ride.vehicle?.make || '';
    const carModel = ride.vehicle?.model || '';
    const carYear  = ride.vehicle?.year || '';
    const carText  = [carMake, carModel, carYear].filter(Boolean).join(' ');
    const detailsHref = `../RideDetails/Index.html?id=${ride.id}`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="../Img/user_icon.png" class="small-icon" alt="User"> ${driverEmail}</td>
      <td><a href="${detailsHref}">${from}</a></td>
      <td>${to}</td>
      <td>${seats}</td>
      <td>${carText}</td>
      <td>${fee}</td>
      <td><a href="${detailsHref}">Request</a></td>
    `;
    tbody.appendChild(tr);
  });
}

function updateResultMessage(el, from, to) {
  if (!el) return;
  const f = from ? `<b>${from}</b>` : '<b>Any</b>';
  const t = to   ? `<b>${to}</b>`   : '<b>Any</b>';
  el.innerHTML = `Rides found from ${f} to ${t}`;
}

function updateMap(from, to) {
  const iframe = document.querySelector('.map-iframe');
  if (!iframe) return;
  if (from && to) {
    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(from + ' to ' + to)}&z=11&output=embed`;
  } else if (from || to) {
    const place = from || to;
    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(place)}&z=12&output=embed`;
  } else {
    iframe.src = `https://www.google.com/maps?q=Costa%20Rica&z=7&output=embed`;
  }
}


