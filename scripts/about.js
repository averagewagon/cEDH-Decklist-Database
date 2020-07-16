 (function() {
  "use strict";
    
  window.addEventListener("load", init);

  // Initialization function
  function init() {
    id("update-select").addEventListener("change", swapChangelog);
    swapChangelog();
  }
  
  function swapChangelog() {
    let changelog = id("update-select").value;
    let updates = qsa(".update");
    for (let i = 0; i < updates.length; i++) {
      let update = updates[i];
      if (update.id.includes(changelog)) {
        update.classList.remove("hidden");
      } else {
        update.classList.add("hidden");
      }
    }
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
})();
