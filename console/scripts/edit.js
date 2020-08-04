 (function() {
  "use strict";
    
  window.addEventListener("load", init);

  // Initialization function
  async function init() {
    if (get("jwt")) {
      prepareListeners();
      await getDeck();
      id("content").classList.remove("hidden");
    }
  }
  
  function prepareListeners() {
    id("two-commanders").addEventListener("change", togglePartner);
    
    id("has-discord").addEventListener("change", toggleDiscord);
    
    qs(".delete-list").addEventListener("click", deleteDecklist);
    
    id("add-deck").addEventListener("click", addDecklist);
    
    id("preview-toggle").addEventListener("change", togglePreview);
    
    qs("form").addEventListener("submit", submitForm);
    
    qs("form").addEventListener("change", updatePreview);
    
    qs("form").addEventListener("keyup", updatePreview);
  }
  
  // Activates or deactivates the partner text box
  function togglePartner() {
    if (id("two-commanders").checked) {
      id("commander2").classList.remove("hidden");
      id("commander2").required = true;
    } else {
      id("commander2").classList.add("hidden");
      id("commander2").required = false;
    }
  }
  
  // Activates or deactivates the Discord server text boxes
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
  
  // Removes a decklist entry option from the form
  function deleteDecklist() {
    if (this.parentElement.parentElement.parentElement.childElementCount > 1) {
      this.parentElement.parentElement.remove();
    }
  }
  
  async function updatePreview() {
    build.preview(scrape.form());
  }
  
  // Adds a new decklist entry to the list of decks
  function addDecklist() {
    let newList = qs("#list-wrap ul li:first-child").cloneNode(true);
    newList.querySelector(".list-title").value = "";
    newList.querySelector(".list-link").value = "";
    newList.querySelector(".has-primer").checked = false;
    newList.querySelector(".delete-list").addEventListener("click", deleteDecklist);
    qs("#list-wrap ul").appendChild(newList);
  }
  
  function togglePreview() {
    if (this.checked) {
      id("old-deck").classList.remove("hidden");
      id("preview-deck").classList.add("hidden");
      id("deck-label").innerText = "Original Listing";
    } else {
      id("preview-deck").classList.remove("hidden");
      id("old-deck").classList.add("hidden");
      id("deck-label").innerText = "Preview";
    }
  }
  
  // Gets the list of decks from the API
  async function getDeck() {
    const jwt = get("jwt");
    const id = new URLSearchParams(window.location.search).get("id");
    const body = {
      "jwt": jwt,
      "method": "GET_DECK",
      "id": id
    };
    const result = await sendToDDB(body);
    if (result.success) {
      const deck = result.data;
      qs("form").dataset.timestamp = deck.updated;
      build.old(deck);
      build.preview(deck);
      fill.form(deck);
    } else {
      console.error(result.message);
      if (result.data) {
        console.error(result.data);
      }
      alert(" There was an error while fetching decks:\n" + result.message);
    }
  }
  
  async function submitForm() {
    event.preventDefault();
    let scry = await getCommanderInfo();
    if (!scry.success) {
      alert(scry.message);
    } else if (!confirm("Are you sure you want to submit these changes?")) {
      
    } else if (!get("jwt")) {
      alert("You are logged out. You must be logged in to submit the form.");
    } else {
      let body = scrape.body(scry);
      let result = await sendToDDB(body);
      if (result.success) {
        alert(result.message);
        if (result.data) {
          id("preview-toggle").checked = true;
          togglePreview();
          build.old(result.data);
        } else {
          window.location.replace("/console/");
        }
      } else {
        if (result.data) {
          console.error(result.data);
        }
        console.error(result.message);
        alert(" There was an error:\n" + result.message);
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
  
  const scrape = {
    form: function(scry = null) {
      const data = {};
      data.comments = id("comments").value;
      data.status = id("old-deck").dataset.status;
      data.destination = id("in-destination").value;
      data.editor = get("username");
      data.updated = new Date().toISOString();
      data.recommended = scrape.recommendation();
      data.id = id("old-deck").dataset.id;
      
      data.section = id("in-section").value;
      data.title = id("deck-title").value;
      data.description = id("description").value;
      data.discord = scrape.discord();
      data.decklists = scrape.decklists();
      if (scry) {
        data.commander = scry.commanders;
        data.colors = scry.colors;
      } else {
        data.commander = scrape.commanders();
        data.colors = scrape.colors();
      }
      
      return data;
    },
  
    body: function(scry) {
      const body = {};
      body.data = scrape.form(scry);
      body.jwt = get("jwt");
      body.method = "UPDATE_DECK";
      body.timestamp = qs("form").dataset.timestamp;
      return body;
    },
  
    decklists: function() {
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
    },
  
    discord: function() {
      if (id("has-discord").checked) {
        const discord = {};
        discord.title = id("discord-title").value;
        discord.link = id("discord-link").value;
        return discord;
      } else {
        return null;
      }
    },
  
    commanders: function() {
      const commanders = [];
      commanders.push({ name: id("commander").value, link: "example.com" });
      if (id("two-commanders").checked) {
        commanders.push({ name: id("commander2").value, link: "example2.com" });
      }
      return commanders;
    },
  
    colors: function() {
      return id("preview-deck").dataset.colors;
    },
  
    recommendation: function() {
      return id("in-recommend").value === "RECOMMEND" ? true : false;
    }
  }
  
  // Helper object which fills out the form
  const fill = {
    form: function(deck) {
      id("deck-title").value = deck.title;
      id("description").value = deck.description;
      fill.section(deck);
      fill.edit(deck);
      fill.commander(deck);
      fill.discord(deck);
      fill.decklists(deck);
      fill.recommendation(deck);
    },
    
    section: function(deck) {
      id("in-section").value = deck.section;
      if (!deck.destination) {
        id("in-destination").value = deck.status;
      } else {
        id("in-destination").value = deck.destination;
      }
    },
  
    edit: function(deck) {
      let edit = " on " + deck.updated.substring(0, 10);
      edit = deck.editor ? "<i>" + deck.editor + "</i> Edited" + edit : "Submitted" + edit;
      id("edit-info").innerHTML = edit;
      
      id("comments").value = deck.comments;
      id("edit-comments").innerText = deck.comments;
    },
  
    commander: function(deck) {
      id("commander").value = deck.commander[0].name;
      if (deck.commander.length > 1) {
        id("two-commanders").checked = true;
        togglePartner();
        id("commander2").value = deck.commander[1].name;
      }
    },
    
    discord: function(deck) {
      if (deck.discord) {
        id("has-discord").checked = true;
        toggleDiscord();
        id("discord-title").value = deck.discord.title;
        id("discord-link").value = deck.discord.link;
      }
    },
  
    decklists: function(deck) {
      for (let i = 0; i < deck.decklists.length; i++) {
        const decklist = deck.decklists[i];
        if (i > 0) {
          addDecklist();
        }
        const item = qs(".list-entry:nth-child(" + (i + 1) + ")");
        iqs(item, ".list-title").value = decklist.title;
        iqs(item, ".list-link").value = decklist.link;
        iqs(item, ".has-primer").checked = decklist.primer;
      }
    },
  
    recommendation: function(deck) {
      if (deck.recommended) {
        id("in-recommend").value = "RECOMMEND";
      } else {
        id("in-recommend").value = "NO_RECOMMEND";
      }
    }
  }
  
  // Helper object which builds a deck entry
  const build = {
      deck: function(item, deck) {
      let id = deck.id;
      item.dataset.id = id;
      item.dataset.status = deck.status;
      if (deck.destination) {
        item.dataset.destination = deck.destination;
      }
      iqs(item, ".main").id = "m" + id;
      iqs(item, ".sub").id = "s" + id;
      iqs(item, ".ddb-title").innerText = deck.title;
      iqs(item, ".ddb-section").innerText = deck.section;
      iqs(item, ".ddb-description").innerText = deck.description;
      iqs(item, ".ddb-date").innerText = deck.updated.substring(0, 10);
      build.status(item, deck);
      build.colors(item, deck);
      build.icons(item, deck);
      build.discord(item, deck);
      build.decklists(item, deck);
      build.commanders(item, deck);
    },
   
    old: function(deck) {
      const item = id("old-deck");
      build.deck(item, deck);
    },
  
    preview: function(deck) {
      const item = id("preview-deck");
      build.deck(item, deck);
    },
    
    status: function(item, deck) {
      item.classList.remove("RED", "BLUE", "GREEN");
      if (deck.destination === "PUBLISHED") {
        if (deck.status === "PUBLISHED") {
          item.classList.add("BLUE");
        } else {
          item.classList.add("GREEN");
        }
      } else if (deck.destination === "DELETED") {
        item.classList.add("RED");
      } else if (deck.destination !== "SUBMITTED" deck.status === "DELETED") {
        item.classList.add("RED");
      }
      
      item.dataset.status = deck.status;
      item.dataset.destination = deck.destination;
      let val = deck.destination ? deck.destination : deck.status;
      item.dataset.show = val;
    
      const statuses = iqsa(item, ".ddb-status");
      for (let j = 0; j < statuses.length; j++) {
        statuses[j].innerText = val;
      }
    },
  
    colors: function(item, deck) {
      const colors = ["w", "u", "b", "r", "g"];
      const ddbColors = iqs(item, ".ddb-colors");
      ddbColors.innerHTML = "";
      item.dataset.colors = deck.colors;
      for (let j = 0; j < colors.length; j++) {
        let symbol;
        if (deck.colors.includes(colors[j])) {  
          symbol = qs("#template-" + colors[j] + " svg").cloneNode(true);
        } else {
          symbol = qs("#template-x svg").cloneNode(true);
        }
        ddbColors.appendChild(symbol);
      }
    },
  
    icons: function(item, deck) {
      if (!deck.recommended) {
        iqs(item, ".ddb-icons .recommend-svg").classList.add("unavailable");
      } else {
        iqs(item, ".ddb-icons .recommend-svg").classList.remove("unavailable");
      }
      if (deck.decklists.every(d => d.primer === false)) {
        iqs(item, ".ddb-icons .primer-svg").classList.add("unavailable");
      } else {
        iqs(item, ".ddb-icons .primer-svg").classList.remove("unavailable");
      }
      if (!deck.discord) {
        iqs(item, ".ddb-icons .discord-svg").classList.add("unavailable");
      } else {
        iqs(item, ".ddb-icons .discord-svg").classList.remove("unavailable");
      }
    },
  
    discord: function(item, deck) {
      if (deck.discord) {
        iqs(item, ".ddb-discord").href = deck.discord.link;
        iqs(item, ".ddb-discord-title").innerText = deck.discord.title;
        iqs(item, ".ddb-discord").classList.remove("disabled");
        iqs(item, ".ddb-discord svg").classList.remove("dark");
      } else {
        iqs(item, ".ddb-discord").classList.add("disabled");
        iqs(item, ".ddb-discord-title").innerText = "[No Discord Server]";
        iqs(item, ".ddb-discord svg").classList.add("dark");
      }
    },
    
    decklists: function(item, deck) {
      const decklists = iqs(item, ".ddb-decklists");
      decklists.innerHTML = "";
      for (let i = 0; i < deck.decklists.length; i++) {
        const decklist = deck.decklists[i];
        const li = id("decklist-template").cloneNode(true);
        li.id = "";
        if (!decklist.primer) {
          iqs(li, ".primer-svg").classList.add("unavailable");
        }
        iqs(li, ".ddb-decklist-title").innerText = decklist.title;
        li.href = decklist.link;
        decklists.appendChild(li);
      }
    },
    
    commanders: function(item, deck) {
      const commanders = iqs(item, ".ddb-commanders");
      commanders.innerHTML = "";
      for (let i = 0; i < deck.commander.length; i++) {
        const commander = deck.commander[i];
        const a = document.createElement("a");
        a.innerText = commander.name;
        a.href = commander.link;
        
        const li = document.createElement("li");
        li.appendChild(a);
        commanders.appendChild(li);
      }
    }
  }
   
  /** Converts the form into a JSON object
   */
  
  /* HELPER FUNCTIONS */
  const API_URL = "https://3rxytinw28.execute-api.us-west-2.amazonaws.com/default/DDB-API-Function";
  const SCRYFALL_URL = "https://api.scryfall.com/cards/named?fuzzy=";
  
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
        info.status = response.status;
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

  // Getting a value in local storage
  function get(input) {
    return window.localStorage.getItem(input);
  }

  // Setting a value in local storage
  function set(key, value) {
    window.localStorage.setItem(key, value);
  }

  // Clearing local storage
  function clear() {
    window.localStorage.clear();
  }
  
  // Query Selector which searches an input element
  function iqs(item, query) {
    return item.querySelector(query);
  }
  
  // Query Selector All which searches an input element
  function iqsa(item, query) {
    return item.querySelectorAll(query);
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
