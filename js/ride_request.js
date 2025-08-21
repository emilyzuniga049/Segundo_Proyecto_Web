document.addEventListener("DOMContentLoaded", () => {
  const requestBtn = document.getElementById("request-btn");

  const params = new URLSearchParams(window.location.search);
  const rideId = parseInt(params.get("id"), 10);

  const rides = JSON.parse(localStorage.getItem("rides")) || [];
  const ride = rides.find(r => r.id === rideId);

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  if (!ride || !currentUser) {
    console.warn("No ride or user found.");
    return;
  }

  requestBtn.addEventListener("click", () => {
    const requests = JSON.parse(localStorage.getItem("requests")) || [];

    const newRequest = {
      id: Date.now(), 
      userEmail: currentUser.email,
      driverEmail: ride.userEmail,
      rideId: ride.id,
      ride: `${ride.from} - ${ride.to}`,
      date: new Date().toISOString(),
      status: "pending"
    };

    requests.push(newRequest);
    localStorage.setItem("requests", JSON.stringify(requests));

    alert("Request sent successfully!");
    window.location.href = "../Search Rides/Index.html"; 
  });
});

