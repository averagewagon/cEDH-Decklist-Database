---
---
(function() {"use strict";
window.addEventListener("load", init);

const LOGIN = "https://cedh-decklist-database.auth.us-west-2.amazoncognito.com/login?client_id=41o965ca7urqoiutm603p7khqc&response_type=token&scope=openid&redirect_uri=https://cedh-decklist-database.com/console/login";
const LOGOUT = "https://cedh-decklist-database.auth.us-west-2.amazoncognito.com/logout?client_id=41o965ca7urqoiutm603p7khqc&logout_uri=https://cedh-decklist-database.com/console/logout";

// Initialization function
function init() {
  set("expire", 1597710131);
  set("username", "averagedragon");
  set("jwt", "eyJraWQiOiJHU2IzS1JEQjRyMjVmRUYxSnFKUUI3VXJpdFFjNDd0OGorcjRtdkdZM3ZnPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiQ2VIcHUzWGVfQWFVaUNFWVRjQTIydyIsInN1YiI6IjA1OTQwMDhjLTk3MTMtNGJjNi1hZWUxLTEyMTIzYjI1ZGU4NCIsImF1ZCI6IjQxbzk2NWNhN3VycW9pdXRtNjAzcDdraHFjIiwiZXZlbnRfaWQiOiIxOTQyODc2Zi1lMGFjLTQ2OTktOGUzZC00YTcwZjQyNTQ3MTEiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU5NzcwNjUzMSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfMUdxZzZKQUpFIiwiY29nbml0bzp1c2VybmFtZSI6ImF2ZXJhZ2VkcmFnb24iLCJleHAiOjE1OTc3MTAxMzEsImlhdCI6MTU5NzcwNjUzMSwiZW1haWwiOiJqb2huLnIuaGVuZHJpY0BnbWFpbC5jb20ifQ.Jpz_KM1QWvcYZc0PF1vzRAmVwgqjf9C5ABsassqzRNk-7JutyaSoNc5BzLC81fhH3RibdxBoSM87lCDBQdPwEoOWgXNWI9U2nlKf7tDMa7nc3b-QlMphUSi-So_PBzDfFapKn_b5ihhCI-iSKRau8jqjba_kRciT_8IhBg2W7V7hSuXNSTW_reIntee190rn2xKHwmsZdob5mR_rmUiWaenrGzdmuDYO7V9gsmEF1LldEBsiSr5agO1Vr4vQxrr_-AGJIbG7QJxnA7QWpeekCfaZ_iPYQaudSiC79Pec2UDetREK1XRhmZDR_4Ezf5mbAWw0fxttDr0SZ2ziMbUHtA");
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
