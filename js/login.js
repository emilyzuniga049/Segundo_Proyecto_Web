document.addEventListener('DOMContentLoaded', function() {
  // Ensure the DOM is fully loaded before attaching event listeners
  document.getElementById('login-Form')
    .addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    loginUser(); // Call the function to store inputs
  });
});

function loginUser() {
  // Get the input values from the form
  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Check if the user exists in localStorage
  const user = users.find(user => user.email == email & user.password == password);

  if (user) {
    window.location.href = 'Myrides/index.html';
  } else {
    alert('Invalid email or password. Please try again.');
  }
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}