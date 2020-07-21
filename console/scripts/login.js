const uiParams = {
  "signInSuccessUrl": "/console/",
  "signInOptions": [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  "credentialHelper": firebaseui.auth.CredentialHelper.NONE,
  "signInFlow": 'popup',
  "callbacks": {
    "signInSuccessWithAuthResult": function(authResult, redirectUrl) {
      try {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        let user = firebase.auth().currentUser;
        return true;
      } catch (error) {
        alert("Something went wrong");
        console.error(error);
        return false;
      };
    }
  }
};

window.addEventListener("load", init);

// Initialization function
function init() {
  startUI();
}

function startUI() {
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start("#firebaseUI", uiParams);
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

