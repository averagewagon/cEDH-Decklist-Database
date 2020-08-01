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
  async function submitForm(event) {
    event.preventDefault();
    let scry = await getCommanderInfo();
    if (!scry.success) {
      alert(scry.message);
    } else if (confirm("Are you sure you want to submit this deck for review?")) {
      if (!grecaptcha.getResponse()) {
        alert("Please complete the reCaptcha.");
      } else {
        let body = scrapeForm(scry);
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
  
  // Checks that the commanders are actual cards
  async function getCommanderInfo() {
    try {
      const commanders = qsa("#commander-wrap input");
      const value = { success: true, commanders: [], colors: [] };
      
      const promises = []
      
      for (let i = 0; i < commanders.length; i++) {
        const commander = commanders[i];
        if (!commander.classList.contains("hidden")) {
          const res = checkCommander(commander.value).then(check => {
            if (!check.success) {
              return { success: false, message: commander.value + " is not a valid card name." };
            }
            const scry = check.data;
            commander.value = scry.name;
            const obj = {};
            obj.name = scry.name;
            obj.link = scry.image_uris.normal;
            const colors = [];
            for (let j = 0; j < scry.color_identity.length; j++) {
              colors.push(scry.color_identity[j].toLowerCase());
            }
            return { commander: obj, colors: colors, success: true };
          });
          promises.push(res);
        }
      }
      
      const results = await Promise.all(promises);
      for (let i = 0; i < results.length; i++) {
        const res = results[i];
        if (!res.success) {
          return res;
        }
        value.commanders.push(res.commander);
        for (let j = 0; j < res.colors.length; j++) {
          if (!value.colors.includes(res.colors[j])) {
            value.colors.push(res.colors[j]);
          }
        }
      }
      return value;
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }
  
  /** Converts the form into a JSON object
   */
  function scrapeForm(scry) {
    let body = {};
    let data = {};
    data.section = id("table-select").value;
    data.title = id("deck-title").value;
    data.commander = scrapeCommanders();
    data.description = id("description").value;
    data.discord = scrapeDiscord();
    data.decklists = scrapeDecklists();
    data.commander = scry.commanders;
    data.colors = scry.colors;
    
    body.data = data;
    body.rc = grecaptcha.getResponse();
    body.method = "SUBMIT_DECK";
    return body;
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
  
  // Checks that a commander is valid
  async function checkCommander(name) {
    try {
      const url = SCRYFALL_URL + encodeURI(name);
      let response;
      
      const result = await fetch(url)
      .then(resp => {
        response = resp;
        return response.json();
      })
      .then(info => {
        let body = {}
        body.success = (response.status >= 200 && response.status < 300);
        body.info = info;
        return body;
      });
      
      if (result.success) {
        return { success: true, data: result.info };
      } else {
        return { success: false, message: result.info.details };
      }
    } catch (error) {
      console.error(error.message);
      return { success: false, message: "Error fetching from scryfall." };
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
