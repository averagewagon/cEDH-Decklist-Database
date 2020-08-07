---
---
(function() { "use strict";
window.addEventListener("load", init);

// Initialization function
function init() {
  if (get("jwt")) {
    id("input").addEventListener("keyup", generatePreview);
    id("input").addEventListener("change", generatePreview);
    qs("form").addEventListener("submit", submit);
    qsa("#changelog-posts li").forEach(item => item.addEventListener("click", switchLog));
    generatePreview();
    id("content").classList.remove("hidden");
  }
}

function generatePreview() {
  id("preview").innerHTML = snarkdown(id("input").value);
}

function switchLog() {
  qsa("#changelog-posts li").forEach(item => item.classList.remove("active"));
  this.classList.add("active");
  
  id("title").value = iqs(this, ".title").innerText;
  id("input").value = iqs(this, ".markdown").innerText;
  generatePreview();
}

async function submit(event) {
  event.preventDefault();
  
  if (!confirm("Are you sure you want to update the changelog?")) {
    return;
  }
  if (!get("jwt")) {
    alert("You are not logged in. You must be logged in to make these changes.");
    return;
  }
  const updateId = qs("#changelog-posts .active").id;
  const body = {
    "jwt": get("jwt"),
    "method": "UPDATE_CHANGELOG",
    "file": updateId,
    "title": base64.encode(utf8.encode(id("title").value)),
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
