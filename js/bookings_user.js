document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) { window.location.href = '../Index.html'; return; }

  const role = (currentUser.role || 'user').toLowerCase();
  if (role !== 'user') return; // este js solo aplica a users

  const theadTr = document.querySelector('.bookings-table thead tr');
  const tbody   = document.querySelector('.bookings-table tbody');

  theadTr.innerHTML = `
    <th>Driver</th>
    <th>Ride</th>
    <th>Status</th>
  `;

  seeUserBookings(currentUser.email, tbody);
});

function seeUserBookings(userEmail, tbody) {
  const requests = JSON.parse(localStorage.getItem('requests')) || [];
  const rows = requests.filter(r => r.userEmail === userEmail);

  tbody.innerHTML = '';

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;opacity:.8;">No bookings found.</td></tr>`;
    return;
  }

  rows.forEach(req => {
    const rideText = req.rideText || req.ride || '';
    const status = formatStatus(req.status);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="user-info"><img src="../Img/user_icon.png" alt="Driver"><span>${req.driverEmail || '-'}</span></div>
      </td>
      <td>${rideText}</td>
      <td>${status}</td>
    `;
    tbody.appendChild(tr);
  });
}

function formatStatus(status) {
  const st = (status || 'pending').toLowerCase();
  if (st === 'accepted') return `<span class="status accepted">Accepted</span>`;
  if (st === 'rejected') return `<span class="status rejected">Rejected</span>`;
  return `<span class="status pending">Pending</span>`;
}
