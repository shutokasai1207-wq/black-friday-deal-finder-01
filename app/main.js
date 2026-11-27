/* Black Friday Deal Finder — state, filtering, events. */
"use strict";

const state = {
  query: "",
  category: "All",
  store: "All",
  sort: "discount",
  cur: "USD"
};

const $ = id => document.getElementById(id);

function applyFilters() {
  const q = state.query.trim().toLowerCase();
  let list = DEALS.filter(d => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (q) {
      const hay = (d.name + " " + d.brand + " " + d.store + " " + d.category).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const by = {
    "discount": (a, b) => discountPct(b) - discountPct(a),
    "savings": (a, b) => toDisplay(saving(b), b.cur, state.cur) - toDisplay(saving(a), a.cur, state.cur),
    "price-asc": (a, b) => toDisplay(a.price, a.cur, state.cur) - toDisplay(b.price, b.cur, state.cur),
    "price-desc": (a, b) => toDisplay(b.price, b.cur, state.cur) - toDisplay(a.price, a.cur, state.cur),
    "name": (a, b) => a.name.localeCompare(b.name)
  };
  list = [...list].sort(by[state.sort] || by.discount);
  return list;
}

function render() {
  const list = applyFilters();
  $("deal-grid").innerHTML = gridHTML(list, state.cur);
  $("hero-grid").innerHTML = heroHTML(state.cur);
  $("stats").innerHTML = statsHTML(DEALS, state.cur);
  $("chips").innerHTML = chipsHTML(state.category);
  $("result-count").textContent =
    `Showing ${list.length} of ${DEALS.length} deals` +
    (state.query ? ` for “${state.query}”` : "") +
    (state.category !== "All" ? ` in ${state.category}` : "") +
    (state.store !== "All" ? ` at ${state.store}` : "");
  $("header-stats").innerHTML =
    `<span class="stat-pill">${DEALS.length} deals</span>` +
    `<span class="stat-pill">Avg −${Math.round(DEALS.reduce((s, d) => s + discountPct(d), 0) / DEALS.length)}%</span>` +
    `<span class="stat-pill">Ends 30 Nov</span>`;
}

function fillSelects() {
  const cat = $("category");
  cat.innerHTML = `<option>All</option>` +
    CATEGORIES.map(c => `<option>${c}</option>`).join("");
  const st = $("store");
  st.innerHTML = `<option>All</option>` +
    STORE_NAMES.map(s => `<option>${s}</option>`).join("");
}

/* ---- detail view (hash route #/deal/<id>) ---- */
function showDetail(id) {
  const d = DEALS.find(x => x.id === id);
  const panel = $("deal-detail");
  if (!d) { panel.hidden = true; $("deal-grid").hidden = false; return; }
  $("detail-body").innerHTML = detailHTML(d, state.cur);
  panel.hidden = false;
  $("deal-grid").hidden = true;
  // Bring the detail card into view (the hero sits above it).
  panel.scrollIntoView({ behavior: "instant", block: "start" });
}

function hideDetail() {
  $("deal-detail").hidden = true;
  $("deal-grid").hidden = false;
}

function route() {
  const m = location.hash.match(/^#\/deal\/([\w-]+)$/);
  if (m) showDetail(m[1]); else hideDetail();
}

/* ---- events ---- */
function bindEvents() {
  $("search").addEventListener("input", e => { state.query = e.target.value; render(); });
  $("category").addEventListener("change", e => { state.category = e.target.value; render(); });
  $("store").addEventListener("change", e => { state.store = e.target.value; render(); });
  $("sort").addEventListener("change", e => { state.sort = e.target.value; render(); });

  $("chips").addEventListener("click", e => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.dataset.cat;
    $("category").value = state.category;
    render();
  });

  // Currency toggle: re-render everything in the other currency.
  $("cur-usd").addEventListener("click", () => setCurrency("USD"));
  $("cur-jpy").addEventListener("click", () => setCurrency("JPY"));
  function setCurrency(cur) {
    state.cur = cur;
    $("cur-usd").classList.toggle("active", cur === "USD");
    $("cur-jpy").classList.toggle("active", cur === "JPY");
    $("cur-usd").setAttribute("aria-pressed", String(cur === "USD"));
    $("cur-jpy").setAttribute("aria-pressed", String(cur === "JPY"));
    render();
    route();
  }

  // Card click opens the detail view; store links still navigate out.
  document.addEventListener("click", e => {
    if (e.target.closest("[data-stop]")) return;
    const card = e.target.closest("[data-id]");
    if (card) location.hash = "#/deal/" + card.dataset.id;
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.matches("[data-id]")) {
      location.hash = "#/deal/" + e.target.dataset.id;
    }
  });
  $("back-link").addEventListener("click", e => {
    e.preventDefault();
    location.hash = "";
  });
  window.addEventListener("hashchange", route);
}

/* ---- init ---- */
fillSelects();
$("sale-windows").innerHTML = windowsHTML();
bindEvents();
render();
route();

