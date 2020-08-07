---
---
(function() {"use strict";
window.addEventListener("load", init);

const LOGIN = "https://cedh-decklist-database.auth.us-west-2.amazoncognito.com/login?client_id=41o965ca7urqoiutm603p7khqc&response_type=token&scope=openid&redirect_uri=https://cedh-decklist-database.com/console/login";
const LOGOUT = "https://cedh-decklist-database.auth.us-west-2.amazoncognito.com/logout?client_id=41o965ca7urqoiutm603p7khqc&logout_uri=https://cedh-decklist-database.com/console/logout";

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
    cover();
    clear();
    id("motd").innerText = "You are not logged in. Log in to access curator controls. ";
    const a = document.createElement("a");
    a.setAttribute("href", "/");
    a.innerText = "Click here to navigate back to the Database.";
    id("motd").appendChild(a);
    qs("header").style.backgroundColor = "pink";
    id("nav-account").href = LOGIN;
  } 
}

// Covers the page when not logged in
function cover() {
  const div = document.createElement("div");
  div.id = "login-notice";
  id("content").appendChild(div);
}

function warn() {
  alert("Your session will expire in 5 minutes. If you would like to continue, please save your changes, log out, and log in again.");
}

function expire() {
  clear();
  id("motd").innerText = "You are not logged in. Log in to access curator controls.";
  qs("header").style.backgroundColor = "pink";
  id("nav-account").href = LOGIN;
  id("nav-account").innerText = "Curator Login";
  alert("Your session has expired. Your changes will not be saved. Please log in again to continue");
}

function getTime() {
  let now = Date.now().toString();
  return parseInt(now.substring(0, now.length - 3));
}

/* HELPER FUNCTIONS */
{% include javascript/dom.js %}
{% include javascript/backend.js %}

})();
