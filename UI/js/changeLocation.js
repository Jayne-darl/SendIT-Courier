let changeLocation = document.getElementById("changeOrderLocation");
changeLocation.addEventListener("click", function(event) {
  event.preventDefault();
  document.location.href = "admin-dashboard.html";
  return false;
});
