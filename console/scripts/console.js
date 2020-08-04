 (function() {
  "use strict";
    
  window.addEventListener("load", init);

  // Initialization function
  async function init() {
    if (get("jwt")) {
      const promises = [];
      promises.push(readRequests());
      promises.push(readDecks());
      await Promise.all(promises);
      id("show-deleted").addEventListener("change", toggleRequests);
      id("content").classList.remove("hidden");
      id("view-select").addEventListener("change", filterDecks);
    }
  }
  
  // Gets the list of decks from the API
  async function readDecks() {
    const jwt = get("jwt");
    const body = {
      "jwt": jwt,
      "method": "READ_DECKS"
    };
    const result = await sendToDDB(body);
    if (result.success) {
      const decks = result.data;
      populateDecks(decks);
    } else {
      console.error(result.message);
      if (result.data) {
        console.error(result.data);
      }
      alert(" There was an error while fetching decks:\n" + result.message);
    }
  }
  
  // Takes an array of decks and transforms it into HTML
  function populateDecks(decks) {
    const sortedDecks = decks.sort((a, b) => { return b.updated.localeCompare(a.updated); });
    for (let i = 0; i < sortedDecks.length; i++) {
      const deck = sortedDecks[i];
      const item = id("deck-template").cloneNode(true);
      build.deck(item, deck);
      filterDecks();
      id("decks").appendChild(item);
    }
  }
  
  function filterDecks() {
    const decks = qsa("#decks > li");
    const shown = id("view-select").value;
    for (let i = 0; i < decks.length; i++) {
      if (decks[i].dataset.show === shown) {
        decks[i].classList.remove("hidden");
      } else {
        decks[i].classList.add("hidden");
      }
    }
  }
  
  const build = {
    deck: function(item, deck) {
      let id = deck.id;
      item.id = "d" + id;
      item.classList.add(deck.status);
      iqs(item, ".main").id = "m" + id;
      iqs(item, ".sub").id = "s" + id;
      iqs(item, ".main").addEventListener("click", toggleSub);
      iqs(item, ".ddb-title").innerText = deck.title;
      iqs(item, ".ddb-edit").href = "/console/edit.html?id=" + id;
      iqs(item, ".ddb-section").innerText = deck.section;
      iqs(item, ".ddb-description").innerText = deck.description;
      iqs(item, ".ddb-date").innerText = deck.updated.substring(0, 10);
      build.status(item, deck);
      build.colors(item, deck);
      build.icons(item, deck);
      build.comments(item, deck);
      build.discord(item, deck);
      build.decklists(item, deck);
      build.commanders(item, deck);
      build.editor(item, deck);
    },
    
    status: function(item, deck) {
      item.classList.remove("RED", "BLUE", "GREEN");
      if (deck.status === "SUBMITTED" && deck.destination === "SUBMITTED") {
        item.classList.add("BLUE");
      } else if (deck.status === "SUBMITTED") {
        item.classList.add("GREEN");
      } else if (deck.status === "DELETED") {
        item.classList.add("RED");
      }
      
      let val = deck.status;
      item.dataset.status = deck.status;
      if (deck.destination) {
        item.dataset.destination = deck.destination;
        val = deck.destination;
      }
      item.dataset.show = val;
    
      const statuses = iqsa(item, ".ddb-status");
      for (let j = 0; j < statuses.length; j++) {
        statuses[j].innerText = val;
      }
    },
  
    colors: function(item, deck) {
      const colors = ["w", "u", "b", "r", "g"];
      const ddbColors = iqs(item, ".ddb-colors");
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
      }
      if (deck.decklists.every(d => d.primer === false)) {
        iqs(item, ".ddb-icons .primer-svg").classList.add("unavailable");
      }
      if (!deck.discord) {
        iqs(item, ".ddb-icons .discord-svg").classList.add("unavailable");
      }
    },
    
    comments: function(item, deck) {
      if (deck.comments !== "") {
        iqs(item, ".ddb-comments").innerText = deck.comments;
      } else {
        iqs(item, ".ddb-comments").innerText = "This deck does not have any Curator comments.";
      }
    },
  
    discord: function(item, deck) {
      if (deck.discord) {
        iqs(item, ".ddb-discord").href = deck.discord.link;
        iqs(item, ".ddb-discord-title").innerText = deck.discord.title;
      } else {
        iqs(item, ".ddb-discord").classList.add("disabled");
        iqs(item, ".ddb-discord-title").innerText = "[No Discord Server]";
        iqs(item, ".ddb-discord svg").classList.add("dark");
      }
    },
    
    decklists: function(item, deck) {
      const decklists = iqs(item, ".ddb-decklists");
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
      for (let i = 0; i < deck.commander.length; i++) {
        const commander = deck.commander[i];
        const a = document.createElement("a");
        a.innerText = commander.name;
        a.href = commander.link;
        
        const li = document.createElement("li");
        li.appendChild(a);
        commanders.appendChild(li);
      }
    },
  
    editor: function(item, deck) {
      if (deck.editor) {
        iqs(item, ".ddb-username").innerText = deck.editor;
      } else {
        iqs(item, ".ddb-username").innerText = "[Never Edited]";
      }
    }
  }
  
  function toggleSub() {
    const mainId = this.id;
    const subId = "s" + (mainId.substring(1, mainId.length));
    id(subId).classList.toggle("hidden");
  }
  
  function iqs(item, query) {
    return item.querySelector(query);
  }
  
  function iqsa(item, query) {
    return item.querySelectorAll(query);
  }
  
  async function readRequests() {
    const jwt = get("jwt");
    const body = {
      "jwt": jwt,
      "method": "READ_REQUESTS"
    };
    const result = await sendToDDB(body);
    if (result.success) {
      const requests = result.data;
      populateRequests(requests);
    } else {
      console.error(result.message);
      if (result.data) {
        console.error(result.data);
      }
      alert(" There was an error while fetching requests:\n" + result.message);
    }
  }
  
  function populateRequests(requests) {
    const sortedRequests = requests.sort((a, b) => { return b.date.localeCompare(a.date); });
    const requestList = id("requests");
    const template = id("req-template");
    for (let i = 0; i < sortedRequests.length; i++) {
      const req = sortedRequests[i];
      const item = template.cloneNode(true);
      if (req.deleted) {
        item.classList.add("deleted", "hidden");
        item.querySelector(".req-delete").classList.add("hidden");
      }
      item.classList.add("r" + req.id);
      item.querySelector(".req-category").innerText = req.category;
      item.querySelector(".req-description").innerText = req.description;
      item.querySelector(".req-date").innerText = req.date.substring(0, 10);
      item.querySelector(".req-delete").id = req.id;
      item.querySelector(".req-delete").addEventListener("click", deleteRequest);
      requestList.appendChild(item);
    }
  }
  
  function toggleRequests() {
    const reqs = qsa("#requests li");
    for (let i = 0; i < reqs.length; i++) {
      reqs[i].classList.toggle("hidden");
    }
  }
  
  async function deleteRequest() {
    const jwt = get("jwt");
    const id = this.id;
    const body = {
      "jwt": jwt,
      "method": "DELETE_REQUEST",
      "id": id
    };
    qs(".r" + id).style.backgroundColor = "darkred";
    const result = await sendToDDB(body);
    if (result.success) {
      console.log(result.message);
      console.log(result.data);
      qs(".r" + id).style.backgroundColor = "var(--canvas-color)";
      qs(".r" + id).classList.add("deleted", "hidden");
      qs(".r" + id + " .req-delete").classList.add("hidden");
    } else {
      console.error(result.message);
      if (result.data) {
        console.error(result.data);
      }
      alert(" There was an error while deleting that request:\n" + result.message);
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
