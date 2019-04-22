let newOrder = document.getElementById("createOrder");
newOrder.addEventListener("click", function(event) {
  event.preventDefault();
  document.location.href = "user-dashboard.html";
  return false;
});
