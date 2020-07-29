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
    if (confirm("Are you sure you want to submit this deck for review?")) {
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
    let data = {};
    data.section = id("table-select").value;
    data.name = id("deck-title").value;
    data.colors = scrapeColors();
    data.commander = scrapeCommanders();
    data.description = id("description").value;
    data.discord = scrapeDiscord();
    data.decklists = scrapeDecklists();
    
    body.data = data;
    body.recaptcha = grecaptcha.getResponse();
    body.method = "SUBMIT_DECK";
    return body;
  }
  
  /** Helpers that scrape the form **/
  function scrapeColors() {
    const colors = [];
    let colorElems = qsa("#color-select input");
    for (let i = 0; i < colorElems.length; i++) {
      let c = colorElems[i];
      if (c.checked) {
        colors.push(c.id.charAt(c.id.length - 1));
      }
    }
    return colors;
  }
  
  function scrapeCommanders() {
    const commanders = [];
    commanders.push(id("commander").value);
    if (id("two-commanders").checked) {
      commanders.push(id("commander2").value);
    }
    return commanders;
  }
  
  function scrapeDecklists() {
    const decklists = [];
    let lists = qsa(".list-entry");
    for (let i = 0; i < lists.length; i++) {
      let list = lists[i];
      let d = {};
      d.primer = list.querySelector(".has-primer").checked;
      d.title = list.querySelector(".list-title").value;
      d.link = list.querySelector(".list-link").value;
      decklists.push(d);
    }
    return decklists;
  }
  
  function scrapeDiscord() {
    if (id("has-discord").checked) {
      const discord = {};
      discord.title = id("discord-title").value;
      discord.link = id("discord-link").value;
      return discord;
    } else {
      return null;
    }
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
  
  /** Removes a decklist entry option from the form
   */
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
