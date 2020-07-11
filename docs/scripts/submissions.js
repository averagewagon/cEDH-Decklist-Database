 (function() {
  "use strict";
    
  window.addEventListener("load", init);

  // Initialization function
  function init() {
    prepareListeners();
    togglePartner();
    toggleDiscord();
  }
  
  /** Adds a click listener for all the clickable elements
   */
  function prepareListeners() {
    id("two-commanders").addEventListener("change", togglePartner);
    
    id("has-discord").addEventListener("change", toggleDiscord);
    
    qs(".delete-list").addEventListener("click", deleteDecklist);
    
    id("add-deck").addEventListener("click", addDecklist);
    
    qs("form").addEventListener("submit", submitForm);
  }
  
  /** Makes sure the reCaptcha is checked
   */
  function submitForm(event) {
    event.preventDefault();
    if (!grecaptcha.getResponse()) {
      alert("Please complete the reCaptcha.");
    } else if (confirm("Are you sure you want to submit this deck for review?")) {
      let data = scrapeForm();
      var submitDeck = firebase.functions().httpsCallable("submitDeck");
      submitDeck(data).then((result) => {
        showResults(result);
      });
    }
  }
  
  /** Converts the form into a JSON object that can be submitted to Firebase
   */
  function scrapeForm() {
    let data = {};
    data.section = id("table-select").value;
    data.name = id("deck-title").value;
    data.colors = [];
    let colors = qsa("#color-select input");
    for (let i = 0; i < colors.length; i++) {
      let c = colors[i];
      if (c.checked) {
        data.colors.push(c.id.charAt(c.id.length - 1));
      }
    }
    data.commander = [];
    data.commander.push(id("commander").value);
    if (id("two-commanders").checked) {
      data.commander.push(id("commander2").value);
    }
    data.description = id("description").value;

    if (id("has-discord").checked) {
      data["discord-title"] = id("discord-title").value;
      data["discord-link"] = id("discord-link").value;
    } else {
      data["discord-title"] = "";
      data["discord-link"] = "";
    }
    
    data.lists = [];
    let lists = qsa(".list-entry");
    for (let i = 0; i < lists.length; i++) {
      let list = lists[i];
      let d = {};
      d.primer = list.querySelector(".has-primer").checked;
      d.description = list.querySelector(".list-title").value;
      d.link = list.querySelector(".list-link").value;
      data.lists.push(d);
    }
    
    return data;
  }
  
  /** Gets the result from Firebase and puts it on the site
   */
  function showResults(result) {
    alert(result);
  }
  
  /** Activates or deactivates the partner text box
   */
  function togglePartner() {
    if (id("two-commanders").checked) {
      id("commander2").classList.remove("hidden");
      id("commander2").required = true;
    } else {
      id("commander2").classList.add("hidden");
      id("commander2").required = false;
    }
  }
  
  /** Activates or deactivates the Discord server text boxes
   */
  function toggleDiscord() {
    if (id("has-discord").checked) {
      id("discord-info").classList.remove("hidden");
      id("discord-title").required = true;
      id("discord-link").required = true;
    } else {
      id("discord-info").classList.add("hidden");
      id("discord-title").required = false;
      id("discord-link").required = false;
    }
  }
  
  function deleteDecklist() {
    this.parentElement.parentElement.remove();
  }
  
  /** Adds a new decklist entry to the list of decks
   */
  function addDecklist() {
    let newList = qs("#list-wrap ul li:first-child").cloneNode(true);
    newList.querySelector(".list-title").value = "";
    newList.querySelector(".list-link").value = "";
    newList.querySelector(".has-primer").checked = false;
    newList.querySelector(".delete-list").addEventListener("click", deleteDecklist);
    qs("#list-wrap ul").appendChild(newList);
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
