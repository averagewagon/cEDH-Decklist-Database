(function() {
  "use strict";

  // MTG Color ordering converted to binary
  const COLOR_ORDER = [
    0,
    1,2,4,8,16,
    3,6,12,24,17,
    5,10,20,9,18,
    19,7,14,28,25,
    13,26,21,11,22,
    15,23,27,29,30,
    31
  ]
    
  window.addEventListener("load", init);

  // Initialization function
  function init() {
    
  }

  //TODO: Hide subrow on click
  
  //TODO: Helper function to hide entry
  
  //TODO: Sorting
  
  //TODO: 
  
  /* HELPER FUNCTIONS */

  /** Prints and error's content to the webpage
  * @param {string} info - the error information that should be passed
  */
  function printError(info) {
    id("entries").innerHTML = "";
    let error = document.createElement("td");
    error.innerText = "Sorry, the request to our database failed with the error:\n"
                      + info;
    error.colSpan = "4";
    let row = document.createElement("tr");
    row.appendChild(error);
    id("entries").appendChild(row);
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
