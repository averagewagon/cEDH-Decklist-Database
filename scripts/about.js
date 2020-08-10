---
---
(function() {"use strict";
window.addEventListener("load", init);

// Initialization function
function init() {
  qsa(".arrow").forEach(x => x.addEventListener("click", switchChangelog));
}

function switchChangelog() {
  const index = this.dataset.index;
  qsa(".update").forEach(x => {
    if (x.dataset.index !== index) {
      x.classList.add("hidden");
    } else {
      x.classList.remove("hidden");
    }
  });
}

/* HELPER FUNCTIONS */
{% include javascript/dom.js %}

})();
