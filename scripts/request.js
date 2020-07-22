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
  function submitForm(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to make this request?")) {
      if (!grecaptcha.getResponse()) {
        alert("Please complete the reCaptcha.");
      } else {
        let data = scrapeForm();
        console.log(data);
        //TODO: Migrate from Firebase to AWS Amplify
      }
    }
  }
  
  /** Converts the form into a JSON object
   */
  function scrapeForm() {
    let data = {};
    data.info = {};
    data.info.action = id("edit-select").value;
    data.info.request = id("request-title").value;
    data.info.deck = id("deck-title").value;
    data.info.description = id("description").value;
    
    data.recaptcha = grecaptcha.getResponse();
    return data;
  }
  
  /* HELPER FUNCTIONS */
  
  /** Prints and error's content to the webpage
  * @param {string} info - the error information that should be passed
  */
  function printError(info) {
    console.error(info);
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

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      console.log(response);
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
})();
