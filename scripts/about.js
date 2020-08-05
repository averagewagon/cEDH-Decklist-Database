---
---
(function() {"use strict";
window.addEventListener("load", init);

// Initialization function
function init() {
  id("update-select").addEventListener("change", swapChangelog);
  swapChangelog();
}

function swapChangelog() {
  let changelog = id("update-select").value;
  let updates = qsa(".update");
  for (let i = 0; i < updates.length; i++) {
    let update = updates[i];
    if (update.id.includes(changelog)) {
      update.classList.remove("hidden");
    } else {
      update.classList.add("hidden");
    }
  }
}

/* HELPER FUNCTIONS */
{% include javascript/dom.js %}

})();
