 (function() {
  "use strict";
    
  window.addEventListener("load", init);

  // Initialization function
  async function init() {
    //if (get("jwt")) {
      await readRequests();
      await readDecks();
      id("show-deleted").addEventListener("change", toggleRequests);
      id("content").classList.remove("hidden");
    //}
  }
  
  // Gets the list of decks from the API
  async function readDecks() {
    /*
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
    }*/
    populateDecks([{"updated": "2020-07-30T23:13:49.260Z","commander": ["Godo, Bandit Warlord"],"section": "DEPRECATED","decklists": [{"link": "https://discord.gg/BXPyu2P","title": "fewfrsdfewsrsdf","primer": false}],"colors": ["r"],"status": "SUBMITTED","comments": "","discord": null,"description": "https://discord.gg/BXPyu2P https://discord.gg/BXPyu2P https://discord.gg/BXPyu2Phttps://discord.gg/BXPyu2Phttps://discord.gg/ XP yu2Phttps:/ /discord.gg/BXP yu2Phttps://discord.gg/BXPyu2 Phttps://discord.gg/BXPyu2Phttps://discord.gg/ XPyu2Phttp s://discord.gg /BXPyu2Phttps://discord .gg/BXPyu2Phttps://discord.gg/BXPyu2P   ","id": "1596150829260ehk7","recommended": false,"title": "A deprecated deck that's very boring indeed"},{"updated": "2020-07-30T23:14:56.080Z","commander": ["Sram, Senior Edificer"],"section": "MEME","decklists": [{"link": "https://discord.gg/BXPyu2P","title": "resdfsefdfes","primer": false}],"colors": ["w"],"status": "SUBMITTED","comments": "","discord": {"title": "fdsasefcsdfcds","link": "https://discord.gg/BXPyu2P"},"description": "https://discord.gg/BXPyu2P https://discord.gg/BXPyu2P","id": "1596150896080g3l6","recommended": false,"title": "Sram Meme"},{"updated": "2020-07-30T23:10:28.687Z","commander": ["Tymna the Weaver","Thrasios, Triton Hero"],"section": "COMPETITIVE","decklists": [{"link": "https://tappedout.gg/BXPyu2P","title": "Deck title","primer": false}],"colors": ["w","u","b","g"],"status": "SUBMITTED","comments": "","discord": {"title": "dsaffdsdsaffdsafdsa","link": "https://discord.gg/BXPyu2P"},"description": "Testetstetset","id": "1596150628687o4fc","recommended": false,"title": "Deck title for testing"},{"updated": "2020-07-30T23:12:48.980Z","commander": ["Tymna the Weaver","Tana, the Bloodsower"],"section": "COMPETITIVE","decklists": [{"link": "https://discord.gg/BXPyu2P","title": "fsdaewfdsdf","primer": false},{"link": "https://erwfefefw.gg/BXPyu2P","title": "https://discord.gg/BXPyu2Psdaerseaf","primer": false}],"colors": ["W","R","B","G"],"status": "SUBMITTED","comments": "","discord": null,"description": "https://discord.gg/BXPyu2Phttps://discord.gg/BXPyu2Phttps://discord.gg/BXPyu2Phttps://discord.gg/BXPyu2Phttps://discord.gg/BXPyu2Phttps://discord.gg/BXPyu2Phttps://discord.gg/BXPyu2Phttps://discord.gg/BXPyu2Phttps://discord.gg/BXPyu2P","id": "15961507689801h23","recommended": false,"title": "Deck with only one decklist"},{"updated": "2020-07-30T23:14:29.520Z","commander": ["Grand Arbiter Augustin IV"],"section": "DEPRECATED","decklists": [{"link": "https://discord.gg/BXPyu2P","title": "ewfsdfesfdfesff","primer": true}],"colors": ["w","u"],"status": "SUBMITTED","comments": "","discord": null,"description": "https://discord.gg/BXPyu2P https://discord.gg/BXPyu2P https://discord.gg/BXPyu2Pte. oo this update perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaqu","id": "1596150869520rt4f","recommended": false,"title": "Another Deprecated"},{"updated": "2020-07-30T23:11:38.699Z","commander": ["Arcum Dagsson"],"section": "COMPETITIVE","decklists": [{"link": "https://fdsfdsfdsafdsa.gg/BXPyu2P","title": "Multiple Decklists","primer": true},{"link": "https://discord.gg/BXPyu2P","title": "fdsfdsae","primer": false},{"link": "https://discord.gg/BXPyu2P","title": "refdfgftgtr","primer": false},{"link": "https://discord.gg/BXPyu2P","title": "ertdfgrdsg","primer": false},{"link": "https://discord.gg/BXPyu2P","title": "dfsafdew343545t6r","primer": false}],"colors": ["u"],"status": "SUBMITTED","comments": "","discord": null,"description": "this is a big fat deck description, you know","id": "1596150698699hva8","recommended": false,"title": "Name of deck with multiple decklists"},{"updated": "2020-07-30T23:15:26.841Z","commander": ["Momir Vig, Simic Visionary"],"section": "COMPETITIVE","decklists": [{"link": "https://discord.gg/BXPyu2P","title": "asdasdrrtdf","primer": true},{"link": "https://discord.gg/BXPyu2P","title": "fwefef43fd","primer": false}],"colors": ["u","g"],"status": "SUBMITTED","comments": "","discord": {"title": "dasdasdas","link": "https://discord.gg/BXPyu2P"},"description": "https://discord.gg/BXPyu2P https://discord.gg/BXPyu2P https://discord.gg/BXPyu2P https://discord.gg/BXPyu2P","id": "1596150926841c1hc","recommended": false,"title": "One More Meme"}]);
  }
  
  // Takes an array of decks and transforms it into HTML
  function populateDecks(decks) {
    
  }
  
  async function readRequests() {
    /*const jwt = get("jwt");
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
    }*/
    populateRequests([{"deleted": false,"category": "Request that a deck is removed","date": "2020-07-30T23:09:41.279Z","description": "adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat ","id": "1596150581279krbl"},{"deleted": true,"category": "Add, modify, or remove an entry's decklists","date": "2020-07-30T23:07:38.798Z","description": "inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.","id": "1596150458798hwru"},{"deleted": false,"category": "Make a correction to a submission","date": "2020-07-30T23:07:22.019Z","description": "This is an example request. inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciu","id": "15961504420193acm"},{"deleted": false,"category": "Add, modify, or remove an entry's decklists","date": "2020-07-30T23:08:30.618Z","description": "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciu","id": "1596150510618mrlx"}]);
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
