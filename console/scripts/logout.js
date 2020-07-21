window.addEventListener("load", init);

// Initialization function
function init() {
  firebase.auth().onAuthStateChanged(function(user) {
     if (!user) {
      window.location.replace("/console/login.html");
    } else {
      firebase.auth().signOut()
        .then(() => {
          alert("Successfully logged out.");
          window.location.replace("/console/login.html");
        })
        .catch(function(error) {
          console.error(error);
          alert("Failed to log out.");
        });
    }
  });
} 
