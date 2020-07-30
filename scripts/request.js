 (function() {
  "use strict";
    
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
    
    body.rc = grecaptcha.getResponse();
    body.method = "SUBMIT_REQUEST";
    return body;
  }
  
  /* HELPER FUNCTIONS */
  const API_URL = "https://3rxytinw28.execute-api.us-west-2.amazonaws.com/default/DDB-API-Function";
  const SCRYFALL_URL = "https://api.scryfall.com/cards/named?fuzzy=";
  
  // Sends the body to the DDB API
  async function sendToDDB(body) {
    try {
      let response;
      let result = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      .then(resp => {
        response = resp;
        return response.json();
      })
      .then(info => {
        info.success = (response.status >= 200 && response.status < 300);
        return info;
      });
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

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
})();
