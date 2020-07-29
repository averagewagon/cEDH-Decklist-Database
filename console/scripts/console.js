 (function() {
  "use strict";
    
  window.addEventListener("load", init);

  // Initialization function
  function init() {
    if (get("jwt")) {
      readRequests();
    }
  }
  
  /** Makes sure the reCaptcha is checked
   */
  async function readRequests() {
    const jwt = get("jwt");
    const body = {
      "jwt": jwt,
      "method": "READ_REQUESTS"
    };
    const result = await sendToDDB(body);
    if (result.success) {
      console.log(result.message);
      console.log(result.data);
    } else {
      if (result.data) {
        console.error(result.data);
      }
      console.error(result.message);
      alert(" There was an error while fetching requests:\n" + result.message);
    }
  }
  
  /** Converts the form into a JSON object
   */
  
  /* HELPER FUNCTIONS */
  const API_URL = "https://3rxytinw28.execute-api.us-west-2.amazonaws.com/default/DDB-API-Function";
  
  // Sends the body to the DDB API
  async function sendToDDB(body) {
    try {
      let response;
      let result = fetch(API_URL, {
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
  
  function get(input) {
    return window.localStorage.getItem(input);
  }

  function set(key, value) {
    window.localStorage.setItem(key, value);
  }

  function clear() {
    window.localStorage.clear();
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
