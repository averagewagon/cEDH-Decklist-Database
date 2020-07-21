window.addEventListener("load", init);

// Initialization function
function init() {
  firebase.auth().onAuthStateChanged(user => {
     if (!user) {
      alert("You aren't logged in. You must log in to make any changes.");
    } else {
      id("nav-login").innerText = user.email;
      id("nav-login").href = "/console/logout.html";
    }
  });
}

/* HELPER FUNCTIONS */
/**
  * Returns the element that has the ID attribute with the specified value.
  * @param {string} idName - element ID
  * @returns {object} DOM object associated with id.
  */
function id(idName) {
  return document.getElementById(idName);
}
/**
* Returns the first element that matches the given CSS selector.
* @param {string} query - CSS query selector.
* @returns {object} The first DOM object matching the query.
*/
function qs(query) {
  return document.querySelector(query);
}

/**
  * Returns the array of elements that match the given CSS selector.
  * @param {string} query - CSS query selector
  * @returns {object[]} array of DOM objects matching the query.
  */
function qsa(query) {
  return document.querySelectorAll(query);
}
