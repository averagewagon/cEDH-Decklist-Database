(function() {"use strict";
window.addEventListener("load", init);

// MTG Color ordering converted to binary
const COLOR_ORDER = [
  0,
  1,2,4,8,16,
  3,6,12,24,17,
  5,10,20,9,18,
  19,7,14,28,25,
  13,26,21,11,22,
  15,30,29,27,23,
  31
]

// Initialization function
function init() {
  sortTable();
  id("db-sort").addEventListener("change", sortTable);
  id("db-search").addEventListener("change", applyFilters);
  id("db-section").addEventListener("change", changeSection);
  qsa(".main").forEach(item => item.addEventListener("click", toggleSub));
  id("mobile-filters").addEventListener("click", toggleMobileFilters);
  id("mobile-desc").addEventListener("click", toggleMobileDescription);
  id("db-search").addEventListener("click", mobileSearchInput);
  
  qsa("#color-filters > div").forEach(item => item.addEventListener("click", () => {
    item.classList.toggle("color-inactive");
    item.classList.toggle("color-active");
    applyFilters();
  }));
  
  qsa("#entry-filters > li").forEach(item => item.addEventListener("click", () => {
    item.classList.toggle("filter-inactive");
    item.classList.toggle("filter-active");
    applyFilters();
  }));
}

function mobileSearchInput() {
  const search = id("db-search");
  if (window.innerWidth <= 800) {
    search.value = prompt("Search the Database:");
    search.blur();
    applyFilters();
  }
}

function toggleMobileDescription() {
  id("db-description").classList.toggle("mhide");
}

function toggleMobileFilters() {
  if (id("mobile-filters").classList.contains("shown")) {
    id("mobile-filters").classList.remove("shown");
    id("filter-wrap").classList.add("mhide");
    id("database-controls").classList.add("mhide");
    id("mobile-filters").innerText = "+ Show Filters";
  } else {
    id("mobile-filters").classList.add("shown");
    id("filter-wrap").classList.remove("mhide");
    id("database-controls").classList.remove("mhide");
    id("mobile-filters").innerText = "- Hide Filters";
  } 
}

// Toggles the visibility of a subrow
function toggleSub() {
  const entry = iqs(this.parentElement, ".sub");
  entry.classList.toggle("hidden");
  iqsa(entry, ".ddb-images img").forEach(card => {
    if (!card.src && window.innerWidth > 1200) {
      card.src = card.dataset.src;
    }
  });
}

// Sorts a table with the available sort values being: NEW, TITLE, COLOR
function sortTable() {
  const sort = id("db-sort").value;
  const entries = [...qsa("#decks > li")];
  
  const sorted = entries.sort((a, b) => {
    if (sort === "NEW")   { return b.dataset.updated.localeCompare(a.dataset.updated); }
    if (sort === "TITLE") { return a.dataset.title.localeCompare(b.dataset.title); }
    if (sort === "COLOR") { return convertColor(a.dataset.colors) - convertColor(b.dataset.colors); }
    return 0;
  });
  
  const decks = id("decks");
  sorted.forEach(item => decks.appendChild(item));
}

// Converts a color array or color string into a number for sorting purposes
function convertColor(colors) {
  let val = 0;
  if (colors.includes("w")) { val += 1 }
  if (colors.includes("u")) { val += 2 }
  if (colors.includes("b")) { val += 4 }
  if (colors.includes("r")) { val += 8 }
  if (colors.includes("g")) { val += 16 }
  return COLOR_ORDER.indexOf(val);
}

function applyFilters() {
  const recommended = id("rec-only").classList.contains("filter-active");
  const primer = id("primer-only").classList.contains("filter-active");
  const discord = id("discord-only").classList.contains("filter-active");
  const section = id("db-section").value;
  const search = id("db-search").value.toLowerCase();
  const colors = [];
  qsa(".color-active").forEach(color => colors.push(color.dataset.c));
  
  qsa("#decks > li").forEach(deck => {
    let hide = false;
    if (recommended && iqs(deck, ".ddb-icons .recommend-svg").classList.contains("unavailable")) {
      hide = true;
    } else if (primer && iqs(deck, ".ddb-icons .primer-svg").classList.contains("unavailable")) {
      hide = true;
    } else if (discord && iqs(deck, ".ddb-icons .discord-svg").classList.contains("unavailable")) {
      hide = true;
    } else if (section !== iqs(deck, ".ddb-section").innerText.trim()) {
      hide = true;
    } else if (search && !deck.textContent.toLowerCase().includes(search)) {
      hide = true;
    } else if (colors) {
      colors.forEach(color => {
        if (!deck.dataset.colors.includes(color)) {
          hide = true;
          return;
        }
      });
    }
    
    hide ? deck.classList.add("hidden") : deck.classList.remove("hidden");
  });
}

function changeSection() {
  applyFilters();
  const section = id("db-section").value.toLowerCase();
  id("mobile-desc").innerText = section.charAt(0).toUpperCase() + section.slice(1) + " Decks";
  qsa("#db-description > div").forEach(item => {
    item.id.includes(section) ? item.classList.remove("hidden") : item.classList.add("hidden");
  });
}

/* HELPER FUNCTIONS */
{% include javascript/dom.js %}

})();
