/* Functions which help interface with the backend */
const API_URL = "https://3rxytinw28.execute-api.us-west-2.amazonaws.com/default/DDB-API-Function";

// Sends the body to the DDB API
async function sendToDDB(body) {
  try {
    showLoad();
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
      info.status = response.status;
      return info;
    }).then(hideLoad);
    return result;
  } catch (error) {
    hideLoad();
    return { success: false, message: error.message };
  }
}

// Getting a value in local storage
function get(input) {
  return window.localStorage.getItem(input);
}

// Setting a value in local storage
function set(key, value) {
  window.localStorage.setItem(key, value);
}

// Clearing local storage
function clear() {
  window.localStorage.clear();
}
