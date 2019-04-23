// Get the modal
let modal = document.getElementById("myModal");
let status = document.getElementById("orderStatus");

// Get the button that opens the modal
let btn = document.getElementById("changeOrderStatus");

// Get the <span> element that closes the modal
let submit = document.getElementsByClassName("close")[0];
// if (containsClass) {
// }
status.onchange = function(event) {
  status.innerText = event.target.value;
  // status.onclick = function() {
  //   // let status = document.createElement("SPAN");
  //   status.value = status.innerText;
  //   // document.body.appendChild("stat");
  // };
};

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
};

submit.onclick = function() {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
