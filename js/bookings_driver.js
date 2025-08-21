document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) { window.location.href = '../Index.html'; return; }

  const role = (currentUser.role || 'user').toLowerCase();
  if (role !== 'driver') return; // este js solo aplica a drivers

  const theadTr = document.querySelector('.bookings-table thead tr');
  const tbody   = document.querySelector('.bookings-table tbody');

  theadTr.innerHTML = `
    <th>User</th>
    <th>Ride</th>
    <th>Accept / Reject</th>
  `;

  renderDriverBookings(currentUser.email, tbody);

  tbody.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-action]');
    if (!a) return;
    e.preventDefault();

    const id = Number(a.dataset.id);
    const action = a.dataset.action; // acept o reject
    if (!Number.isFinite(id)) return;

    updateRequestStatus(id, action === 'accept' ? 'accepted' : 'rejected');
    renderDriverBookings(currentUser.email, tbody);
  });
});

function renderDriverBookings(driverEmail, tbody) {
  const requests = JSON.parse(localStorage.getItem('requests')) || [];
  const rows = requests.filter(r => r.driverEmail === driverEmail);
  
  tbody.innerHTML = '';

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;opacity:.8;">No requests for your rides.</td></tr>`;
    return;
  }

  rows.forEach(req => {
    const rideText = req.rideText || req.ride || '';
    const status = (req.status || 'pending').toLowerCase();

    const actions = (status === 'accepted' || status === 'rejected')
      ? formatStatus(status)
      : `
        <a href="#" data-action="accept" data-id="${req.id}" class="accept-link">Accept</a> |
        <a href="#" data-action="reject" data-id="${req.id}" class="reject-link">Reject</a>
      `;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="user-info"><img src="../Img/user_icon.png" alt="User"><span>${req.userEmail || '-'}</span></div>
      </td>
      <td>${rideText}</td>
      <td>${actions}</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateRequestStatus(requestId, newStatus) {
  const requests = JSON.parse(localStorage.getItem('requests')) || [];
  const updated = requests.map(r => r.id === requestId ? { ...r, status: newStatus } : r);
  localStorage.setItem('requests', JSON.stringify(updated));
}

function formatStatus(status) {
  const st = (status || 'pending').toLowerCase();
  if (st === 'accepted') return `<span class="status accepted">Accepted</span>`;
  if (st === 'rejected') return `<span class="status rejected">Rejected</span>`;
  return `<span class="status pending">Pending</span>`;
}