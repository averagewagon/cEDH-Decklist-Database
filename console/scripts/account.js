---
---
(function() {"use strict";
window.addEventListener("load", init);

const LOGIN = "https://cedh-decklist-database.auth.us-west-2.amazoncognito.com/login?client_id=41o965ca7urqoiutm603p7khqc&response_type=token&scope=openid&redirect_uri=https://cedh-decklist-database.com/console/login";
const LOGOUT = "https://cedh-decklist-database.auth.us-west-2.amazoncognito.com/logout?client_id=41o965ca7urqoiutm603p7khqc&logout_uri=https://cedh-decklist-database.com/console/logout";

// Initialization function
function init() {
  set("expire", 1597706773);
  set("username", "averagedragon");
  set("jwt", "eyJraWQiOiJHU2IzS1JEQjRyMjVmRUYxSnFKUUI3VXJpdFFjNDd0OGorcjRtdkdZM3ZnPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiWFhwdW5uVnFKam1MSFBFMkpScTdDdyIsInN1YiI6IjA1OTQwMDhjLTk3MTMtNGJjNi1hZWUxLTEyMTIzYjI1ZGU4NCIsImF1ZCI6IjQxbzk2NWNhN3VycW9pdXRtNjAzcDdraHFjIiwiZXZlbnRfaWQiOiIxMWRjZmFkMi00MmVjLTQ1NTctYjU0Mi0wNTZmNjlkNjY4NzEiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU5NzcwMzE3MywiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfMUdxZzZKQUpFIiwiY29nbml0bzp1c2VybmFtZSI6ImF2ZXJhZ2VkcmFnb24iLCJleHAiOjE1OTc3MDY3NzMsImlhdCI6MTU5NzcwMzE3MywiZW1haWwiOiJqb2huLnIuaGVuZHJpY0BnbWFpbC5jb20ifQ.B05phd7KdQIY3-a8Xz3pOAG9mYwUuyDMiDT4kEomG0CyRLjqmfZ4N80IeZ0vMJ35l-VxU6r0mybjysziHbbpSx5gzVSwrf0CS3AcZ_VIDyqHDEcStefOIuMijmO19vTFx_MTtopw3BIidBZxqBkYnspWmMqMR-4dpLJXOG0-9lZEiMHKX8ptCDyEP4ch26iSeWjD3DxHFjUG3MMMQKE-zO_Vt6mvyIxiYW4PlKJm-GtVp8Xc3XXXJ5X2HrMbF4erfyoew6Q6RSHPihQC9ZfcYSlJ5VRh3SkyeGeECU062UBPBXAWG78PAPi3frbrLOiQj74CRwJWMQZEDdxEJtAw_w");
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
