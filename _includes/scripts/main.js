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
  prepareAd();
  sortTable();
  setupEventListeners();
}

function setupEventListeners() {
  id("db-sort").addEventListener("change", sortTable);
  id("db-search").addEventListener("change", applyFilters);
  id("db-section").addEventListener("change", changeSection);
  id("mobile-desc").addEventListener("click", toggleMobileDescription);
  id("db-search").addEventListener("click", mobileSearchInput);
  
  setupColorFilters();
  setupEntryFilters();
}

function setupColorFilters() {
  qsa("#color-filters > div").forEach(item => {
    item.addEventListener("click", () => {
      item.classList.toggle("color-inactive");
      item.classList.toggle("color-active");
      applyFilters();
    });
  });
}

function setupEntryFilters() {
  qsa("#entry-filters > li").forEach(item => {
    item.addEventListener("click", () => {
      item.classList.toggle("filter-inactive");
      item.classList.toggle("filter-active");
      applyFilters();
    });
  });
}

function prepareAd() {
  if (window.innerWidth > 1200) {
    id("desktop-ad").classList.add("adsbygoogle");
    id("mobile-ad").classList.add("hidden");
  } else {
    id("desktop-ad").classList.add("hidden");
    id("mobile-ad").classList.add("adsbygoogle");
  }
  try {
    (adsbygoogle = window.adsbygoogle || []).push({});
  } catch (error) {
    console.log("Adblocker detected");
  }
}

function applyFilters() {
  const filters = {
    primer: id("primer-only").classList.contains("filter-active"),
    discord: id("discord-only").classList.contains("filter-active"),
    section: id("db-section").value,
    colors: [...qsa(".color-active")].map(color => color.dataset.c)
  };

  const searchTerm = id("db-search").value.toLowerCase();
  const isMainPage = filters.section === 'COMPETITIVE';
  const hasActiveFilters = filters.primer || filters.discord || filters.colors.length > 0 || searchTerm;

  qsa("#decks > li").forEach(deck => {
    if (isMainPage && !hasActiveFilters) {
      // Show all decks on the main page when no filters are active
      deck.classList.remove("hidden");
    } else {
      const matchesFilters = !isHidden(deck, filters);
      const matchesSearch = searchAllCategories(deck, searchTerm);
      const showDeck = matchesFilters && matchesSearch;
      deck.classList.toggle("hidden", !showDeck);
    }
  });
}

function searchAllCategories(deck, searchTerm) {
  if (!searchTerm) {
    return true; // return all on empty search
  }
  
  const searchableContent = [
    deck.dataset.title,
    deck.querySelector('.ddb-description').textContent,
    deck.dataset.colors,
    Array.from(iqsa(deck, '.ddb-commanders li')).map(c => c.textContent).join(' '),
    Array.from(iqsa(deck, '.ddb-decklists li')).map(d => d.textContent).join(' '),
    iqs(deck, ".ddb-discord-title") ? iqs(deck, ".ddb-discord-title").textContent : ''
  ].join(' ').toLowerCase();

  return searchableContent.includes(searchTerm);
}

function isHidden(deck, filters) {
  if (filters.primer && iqs(deck, ".ddb-icons .primer-svg").classList.contains("unavailable")) {
    return true;
  }
  if (filters.discord && iqs(deck, ".ddb-icons .discord-svg").classList.contains("unavailable")) {
    return true;
  }
  if (filters.colors.length && !filters.colors.every(color => deck.dataset.colors.includes(color))) {
    return true;
  }
  return false;
}

function changeSection() {
  applyFilters();
  const section = id("db-section").value.toLowerCase();
  id("mobile-desc").innerText = section === 'all' ? "All Decks" : section.charAt(0).toUpperCase() + section.slice(1) + " Decks";
  qsa("#db-description > div").forEach(item => {
    if (section === 'all') {
      item.classList.remove("hidden");
    } else {
      item.id.includes(section) ? item.classList.remove("hidden") : item.classList.add("hidden");
    }
  });
}

/* HELPER FUNCTIONS */
{% include javascript/dom.js %}

})();
