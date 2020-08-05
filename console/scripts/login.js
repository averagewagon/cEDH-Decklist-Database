---
---
(function() { "use strict";
window.addEventListener("load", init);

// Initialization function
async function init() {
  try {
    let jwt = getJWT();
    let decoded = jwt_decode(jwt);
    set("jwt", jwt);
    set("username", decoded["cognito:username"]);
    set("expire", decoded["exp"]);
    window.location.replace("/console/");
  } catch (error) {
    clear();
    console.error(error.message);
    alert(error.message);
    window.location.replace("/console/");
  }
}

function getJWT() {
  let url = window.location.href;
  let start = url.indexOf("=") + 1;
  let end = url.indexOf("&");
  let jwt = url.substring(start, end);
  return jwt;
}

/* HELPER FUNCTIONS */
{% include javascript/dom.js %}
{% include javascript/backend.js %}

})();
