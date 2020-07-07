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
    prepareToggles();
    applyFilters();
  }
  
  /** Adds a click listener for row toggling to each row
   */
  function prepareToggles() {
    let colorFilters = qsa("#color-filters img");
    for (let i = 0; i < colorFilters.length; i++) {
      colorFilters[i].addEventListener("click", toggleColor);
    }
    
    let buttonFilters = qsa(".filter-option");
    for (let i = 0; i < buttonFilters.length; i++) {
      buttonFilters[i].addEventListener("click", toggleFilter);
    }
    
    let mainRows = qsa(".main");
    for (let i = 0; i < mainRows.length; i++) {
      mainRows[i].addEventListener("click", toggleSub);
    }
  }
  
  /** Iterates through the table and applies the currently-selected filters
   */
  function applyFilters() {
    let fs = checkFilterState();
    let rows = qsa(".main");
    for (let i = 0; i < rows.length; i++) {
      let entryId = rows[i].dataset.id;
      if (determineFilterCompliance(entryId, fs)) {
        showEntry(entryId);
      } else {
        hideEntry(entryId);
      }
    }
  }
  
  //TODO: "Update Rows" function which adds/removes .filtered based on state of filters
  
  //TODO: Helper function which takes a row and returns its state relative to filters
  
  //TODO: Sort function
  
  /* HELPER FUNCTIONS */

  /** Hides an entry
   * @param {string} entryId - The entry ID which is to be hidden
   */
  function hideEntry(entryId) {
    qs(".m" + entryId).classList.add("filtered");
    qs(".s" + entryId).classList.add("filtered");
  }
  
  /** Shows an entry
   * @param {string} entryId - The entry ID which is to be shown
   */
  function showEntry(entryId) {
    qs(".m" + entryId).classList.remove("filtered");
    qs(".s" + entryId).classList.remove("filtered");
  }
  
  /** Turns a color filter on or off
   */
  function toggleColor() {
    this.classList.toggle("color-inactive");
    this.classList.toggle("color-active");
    applyFilters();
  }
  
  /** Turns a button filter on or off
   */
  function toggleFilter() {
    this.classList.toggle("filter-active");
    this.classList.toggle("filter-inactive");
    applyFilters();
  }
  
  /** Toggles the visibility of a subrow and fetches card images
   */
  function toggleSub() {
    let entryId = ".s" + this.dataset.id;
    if (!qs(entryId).classList.toggle("sub-hide")) {
      //TODO: fetchCommanders(entryId);
    }
  }
  
  /** Determines if a given row should be hidden or shown based on state of the filters
   * @param {string} entryId - The entry which is being inspected
   * @param {Object} filterState - The current state of the filters and searches on the page
   * @returns {boolean} - If true, then the entry should be visible, else false
   */
  function determineFilterCompliance(entryId, fs) {
    let show = true;
    let entry = qs(".m" + entryId).dataset;
    console.log("liftoff");
    
    if (fs.section != entry.section) {
      show = false;
    } else if (fs.rec && entry.recommended == "false") {
      show = false;
    } else if (fs.primer && entry.primer == "noprimer") {
      show = false;
    } else if (fs.discord && entry.discordLink == "") {
      show = false;
    } else {
      for (let i = 0; i < fs.colors.length; i++) {
        let color = fs.colors[i];
        if (!entry.colors.includes(color)) {
          show = false;
          break;
        }
      }
      
      if (show) {
        let match = entry.updated + " " 
          + entry.name + " "
          + entry.commander + " "
          + entry.description + " "
          + entry.discordTitle + " "
          + entry.decks;
        if (fs.search && !match.toUpperCase().includes(fs.search)) {
          show = false;
        }
      }
    }
    
    return show;
  }
  
  /** Returns an object which holds the current state of the filters
   * @returns {Object} filterState - An Object describing the currently-active filters
   */
  function checkFilterState() {
    let filterState = {};
    filterState.rec = id("rec-only").classList.contains("filter-active");
    filterState.primer = id("primer-only").classList.contains("filter-active");
    filterState.discord = id("discord-only").classList.contains("filter-active");
    filterState.search = id("search-box").innerText.trim().toUpperCase();
    filterState.section = id("db-select").value;
    
    let colorFilters = qsa(".color-filters img");
    filterState.colors = [];
    for (let i = 0; i < colorFilters.length; i++) {
      let color = colorFilters[i];
      if (color.classList.contains("color-active")) {
        filterState.colors.push(color.alt.charAt(0));
      }
    }
    
    return filterState;
  }
  
  /** Prints and error's content to the webpage
  * @param {string} info - the error information that should be passed
  */
  function printError(info) {
    id("motd").innerText = "Sorry, something went wrong: " + info;
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
