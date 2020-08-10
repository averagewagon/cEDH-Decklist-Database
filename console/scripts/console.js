---
---
(function() {"use strict";
window.addEventListener("load", init);

// Initialization function
async function init() {
  if (get("jwt")) {
    readDecks().then(() => {
      filterDecks();
    });
    readRequests().then(() => {
      id("show-deleted").addEventListener("change", toggleRequests);
    });
    id("view-select").addEventListener("change", filterDecks);
    id("publish-changes").addEventListener("click", publishChanges);
  }
}

function changeSection() {
  const section = id("db-section").value;
  qsa("#decks > li").forEach(deck => {
    if (section !== iqs(deck, ".ddb-section").innerText.trim()) {
      deck.classList.add("hidden")
    }
  });
}

// Sends the request to the API that initiates a Github commit
async function publishChanges() {
  if (!get("jwt")) {
    alert("You are not logged in. You must be logged in to do this.");
  } else if (confirm("Are you sure you want to publish all changes? This cannot be reversed, and it will take several minutes. If you haven't already, you should confirm this decision with the other curators.")) {
    if (!get("jwt")) {
      alert("You are not logged in. You must be logged in to do this.");
    } else {
      const jwt = get("jwt");
      const body = {
        "jwt": jwt,
        "method": "PUBLISH_CHANGES"
      };
      const result = await sendToDDB(body);
      if (result.success) {
        alert("Success! The changes should be visible on the website in a few minutes.");
        window.location.reload();
      } else {
        console.error(result.message);
        if (result.data) {
          console.error(result.data);
        }
        alert(" There was an error while publishing changes:\n" + result.message);
      }
    }
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
    id("decks").appendChild(item);
  }
}

function filterDecks() {
  const decks = qsa("#decks > li");
  const shown = id("view-select").value;
  const section = id("db-section").value;
  for (let i = 0; i < decks.length; i++) {
    const sec = iqs(decks[i], ".ddb-section").innerText.trim();
    if (decks[i].dataset.show === shown && sec === section) {
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
    if (deck.destination === "PUBLISHED" && deck.status === "PUBLISHED") {
      item.classList.add("BLUE");
    } else if (deck.destination === "PUBLISHED") {
      item.classList.add("GREEN");
    } else if (deck.destination || deck.status === "DELETED") {
      item.classList.add("RED");
    }
    
    item.dataset.status = deck.status;
    item.dataset.destination = deck.destination;
    let val = deck.destination ? deck.destination : deck.status;
    if (deck.status === "PUBLISHED" || deck.destination === "PUBLISHED") {
      item.dataset.show = "PUBLISHED";
    } else {
      item.dataset.show = val;
    }
  
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
      iqs(li, "a").href = decklist.link;
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
      li.classList.add("btn");
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

/* HELPER FUNCTIONS */
{% include javascript/dom.js %}
{% include javascript/backend.js %}

})();
