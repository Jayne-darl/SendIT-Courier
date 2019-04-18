let newDelivery = document.getElementById("createDelivery");
newDelivery.addEventListener("click", function(event) {
  event.preventDefault();
  document.location.href = "user-dashboard.html";
});
let newAccount = document.getElementById("createAccount");
newAccount.addEventListener("click", function(event) {
  event.preventDefault();
  document.location.href = "user-dashboard.html";
});
let logIn = document.getElementById("logIn");
logIn.addEventListener("click", function(event) {
  event.preventDefault();
  document.location.href = "user-dashboard.html";
});
// let result = () => {
//   let name = document.getElementById("name").value;
//   let number = document.getElementById("number").value;
//   let destination = document.getElementById("destination").value;
//   document.getElementById("parcelDisplay").write(name);
//   document.getElementById("parcelDisplay").write(number);
//   document.getElementById("parcelDisplay").write(destination);
// };

// return result;
