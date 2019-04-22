// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("changeOrderDestination");

// Get the <span> element that closes the modal
var submit = document.getElementsByClassName("close")[0];
let cancel = document.getElementById("cancelOrder");
// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
submit.onclick = function() {
  modal.style.display = "none";
};
cancel.onclick = function() {
  document.location.href = "user-dashboard.html";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
