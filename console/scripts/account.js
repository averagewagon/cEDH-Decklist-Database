"use strict";
  
const LOGIN = "https://cedh-decklist-database.auth.us-west-2.amazoncognito.com/login?client_id=41o965ca7urqoiutm603p7khqc&response_type=token&scope=openid&redirect_uri=https://cedh-decklist-database.com/console/login.html";
const LOGOUT = "https://cedh-decklist-database.auth.us-west-2.amazoncognito.com/logout?client_id=41o965ca7urqoiutm603p7khqc&logout_uri=https://cedh-decklist-database.com/console/logout.html";
const API_URL = "https://3rxytinw28.execute-api.us-west-2.amazonaws.com/default/DDB-API-Function";

window.addEventListener("load", init);

// Initialization function
function init() {
  if (get("expire") > getTime()) {
    let warnTime = (get("expire") - getTime() - 310) * 1000;
    window.setTimeout(warn, warnTime);
    let expireTime = (get("expire") - getTime() - 10) * 1000;
    window.setTimeout(expire, expireTime);
    
    id("nav-account").innerText = get("username") + " - Log Out";
    id("nav-account").href = LOGOUT;
  } else {
    clear();
    id("motd").innerText = "You are not logged in. Log in to access curator controls.";
    qs("header").backgroundColor = "pink";
    id("nav-account").href = LOGIN;
  } 
}

function warn() {
  alert("Your session will expire in 5 minutes. If you would like to continue, please save your changes, log out, and log in again.");
}

function expire() {
  clear();
  id("nav-account").href = LOGIN;
  id("nav-account").innerText = "Curator Login";
  alert("Your session has expired. Your changes will not be saved. Please log in again to continue");
}

function getTime() {
  let now = Date.now().toString();
  return parseInt(now.substring(0, now.length - 3));
}

/* HELPER FUNCTIONS */
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
