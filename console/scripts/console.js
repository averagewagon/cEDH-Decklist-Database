---
---
(function() {"use strict";
window.addEventListener("load", init);

async function init() {
  if (get("jwt")) {
    const deckRead = readDecks().then(() => {
      showLoad();
    });
    const reqRead = readRequests().then(() => {
      id("show-deleted").addEventListener("change", toggleRequests);
      showLoad();
    });
    await Promise.all([deckRead, reqRead]);
    id("delete-old-submissions").addEventListener("click", deleteOldSubmissions);
    hideLoad();
  }
}

async function deleteOldSubmissions() {
  const date = id("delete-cutoff").value;
  if (!date) {
    alert("Please pick a cutoff date first.");
    return;
  }
  const warning = "This will permanently delete every submitted deck that was last updated before " + date + ".\n\nThere is no way to recover them afterward.\n\nAre you absolutely sure?";
  if (!confirm(warning)) {
    return;
  }
  const cutoff = new Date(date + "T00:00:00.000Z").toISOString();
  const body = {
    "jwt": get("jwt"),
    "method": "DELETE_OLD_SUBMISSIONS",
    "cutoff": cutoff
  };
  const result = await sendToDDB(body);
  if (result.success) {
    alert(result.message);
    await readDecks();
  } else {
    console.error(result.message);
    alert("There was an error while deleting old submissions:\n" + result.message);
  }
}

async function readDecks() {
  const jwt = get("jwt");
  const body = {
    "jwt": jwt,
    "method": "READ_DECKS"
  };
  const result = await sendToDDB(body);
  if (result.success) {
    try {
      id("db-json").value = JSON.stringify(JSON.parse(result.data), null, 2);
    } catch (e) {
      id("db-json").value = result.data;
    }
  } else {
    console.error(result.message);
    if (result.data) {
      console.error(result.data);
    }
    alert(" There was an error while fetching decks:\n" + result.message);
  }
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
    iqs(item, ".req-username").innerText = req.username ? req.username : "";
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
