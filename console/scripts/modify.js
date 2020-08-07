---
---
(function() { "use strict";
window.addEventListener("load", init);

// Initialization function
function init() {
  if (get("jwt")) {
    id("input").addEventListener("keyup", generatePreview);
    id("input").addEventListener("change", generatePreview);
    id("file-select").addEventListener("change", swapText);
    id("submit").addEventListener("click", submit);
    generatePreview();
  }
}

function generatePreview() {
  if (id("file-select").value === "MOTD") {
    id("preview").innerText = id("input").value;
  } else {
    id("preview").innerHTML = snarkdown(id("input").value);
  }
}

function swapText() {
  const file = id("file-select").value;
  if (file === "MOTD") {
    id("preview-label").innerText = "Preview Text";
  } else {
    id("preview-label").innerText = "Preview Markdown";
  }
  
  id("input").value = qs("#texts ." + file.toLowerCase()).innerText;
  generatePreview();
}

async function submit() {
  if (!confirm("Are you sure you want to submit your changes to: " + id("file-select").value)) {
    return;
  }
  if (!get("jwt")) {
    alert("You are not logged in. You must be logged in to make these changes.");
    return;
  }
  
  const body = {
    "jwt": get("jwt"),
    "method": "MODIFY_SITE",
    "file": id("file-select").value,
    "content": base64.encode(utf8.encode(id("input").value))
  }
  const result = await sendToDDB(body);
  if (result.success) {
    alert(result.message);
  } else {
    if (result.data) {
      console.error(result.data);
    }
    console.error(result.message);
    alert(result.message);
  }
}

/* HELPER FUNCTIONS */
{% include javascript/dom.js %}
{% include javascript/backend.js %}

})();
