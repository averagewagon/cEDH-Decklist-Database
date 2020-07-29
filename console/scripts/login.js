"use strict";

const API_URL = "https://3rxytinw28.execute-api.us-west-2.amazonaws.com/default/DDB-API-Function";

window.addEventListener("load", init);

// Initialization function
async function init() {
  try {
    let jwt = getJWT();
    
    let resp = fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "jwt": jwt, "method": "LOGIN" })
    })
    .then(response => {
      info = response.json();
      if (checkStatus(response)) {
        set("jwt", response.info.jwt);
        set("username", response.info.username);
        set("expire", response.info.exp);
        window.href.replace("/console");
      } else {
        console.error(info);
        throw new Error(response.status + ": " + response.statusText
          + "\n" + info.message);
        );
      }
    });
  } catch (error) {
    clear();
    console.error(error.message);
    alert(error.message);
    window.href.replace("/console");
  }
}

function getJWT() {
  let url = window.location.href;
  let start = url.indexOf("=") + 1;
  let end = url.indexOf("&");
  let jwt = url.substring(start, end);
  return jwt;
}

/* HELPER FUNCTIONS */
function getTime() {
  let now = Date.now().toString();
  return parseInt(now.substring(0, now.length - 3));
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

function checkStatus(response) {
  return (response.status >= 200 && response.status < 300);
}
