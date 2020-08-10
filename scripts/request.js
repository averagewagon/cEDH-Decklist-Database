---
---
(function() {"use strict";
window.addEventListener("load", init);

// Initialization function
function init() {
  prepareListeners();
}

/** Adds a click listener for all the clickable elements
  */
function prepareListeners() {
  qs("form").addEventListener("submit", submitForm);
}

/** Makes sure the reCaptcha is checked
  */
async function submitForm(event) {
  event.preventDefault();
  if (confirm("Are you sure you want to make this request?")) {
    if (!grecaptcha.getResponse()) {
      alert("Please complete the reCaptcha.");
    } else {
      let body = scrapeForm();
      let result = await sendToDDB(body);
      if (result.success) {
        alert(result.message);
        window.location.replace("/");
      } else {
        if (result.data) {
          console.error(result.data);
        }
        console.error(result.message);
        alert(" There was an error:\n" + result.message);
      }
    }
  }
}

/** Converts the form into a JSON object
  */
function scrapeForm() {
  let body = {};
  body.data = {};
  body.data.category = id("category-select").value;
  body.data.description = id("description").value;
  body.data.username = id("username").value;
  
  body.rc = grecaptcha.getResponse();
  body.method = "SUBMIT_REQUEST";
  return body;
}

/* HELPER FUNCTIONS */
{% include javascript/dom.js %}
{% include javascript/backend.js %}

})();
