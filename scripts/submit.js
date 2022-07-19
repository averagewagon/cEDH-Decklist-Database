---
---
(function() {"use strict";
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

/** Converts the form into a JSON object
  */
function scrapeForm(scry) {
  let body = {};
  let data = {};
  data.section = id("table-select").value;
  data.title = id("deck-title").value;
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

/* HELPER FUNCTIONS */
{% include javascript/dom.js %}
{% include javascript/backend.js %}
{% include javascript/scryfall.js %}

})();
