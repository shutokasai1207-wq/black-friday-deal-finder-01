/* Black Friday Deal Finder — view rendering (no state, no events). */
"use strict";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* One deal card. cur is the display currency ("USD" or "JPY"). */
function cardHTML(d, cur) {
  const price = toDisplay(d.price, d.cur, cur);
  const was = toDisplay(d.was, d.cur, cur);
  const save = toDisplay(saving(d), d.cur, cur);
  const pct = discountPct(d);
  return `<article class="deal-card" tabindex="0" data-id="${esc(d.id)}" role="button"
      aria-label="${esc(d.name)}, ${fmtMoney(price, cur)}, ${pct}% off at ${esc(d.store)}">
    <span class="cat">${esc(d.category)} · ${esc(d.store)}</span>
    <h3>${esc(d.name)}</h3>
    <div class="prices">
      <span class="price">${fmtMoney(price, cur)}</span>
      <span class="was">${fmtMoney(was, cur)}</span>
      <span class="badge-off">−${pct}%</span>
    </div>
    <div class="save-line">You save ${fmtMoney(save, cur)}${d.cur !== cur ? " (approx.)" : ""}</div>
    <div class="meta">Checked 27 Nov 2026 · Ends ${esc(d.ends)}</div>
    <a class="store-btn" href="${esc(STORES[d.store].url)}" target="_blank" rel="noopener"
       data-stop="1">Shop at ${esc(d.store)} ↗</a>
  </article>`;
}

function gridHTML(deals, cur) {
  if (!deals.length) {
    return `<p class="empty">No deals match. Try clearing the search or filters.</p>`;
  }
  return deals.map(d => cardHTML(d, cur)).join("");
}

/* Top-3 biggest discounts, for the hero strip. */
function heroHTML(cur) {
  const top = [...DEALS].sort((a, b) => discountPct(b) - discountPct(a)).slice(0, 3);
  return top.map(d => cardHTML(d, cur)).join("");
}

/* Summary numbers for the stats bar. */
function statsHTML(deals, cur) {
  const n = deals.length;
  const avg = n ? Math.round(deals.reduce((s, d) => s + discountPct(d), 0) / n) : 0;
  const totalSave = deals.reduce((s, d) => s + toDisplay(saving(d), d.cur, cur), 0);
  const stores = new Set(deals.map(d => d.store)).size;
  return `
    <div class="stat-card"><div class="num">${n}</div><div class="lbl">verified deals</div></div>
    <div class="stat-card"><div class="num">${avg}%</div><div class="lbl">average discount</div></div>
    <div class="stat-card"><div class="num">${fmtMoney(totalSave, cur)}</div><div class="lbl">total savings on this page</div></div>
    <div class="stat-card"><div class="num">${stores}</div><div class="lbl">stores covered</div></div>`;
}

function windowsHTML() {
  return SALE_WINDOWS.map(w =>
    `<li><strong>${esc(w.store)}:</strong> ${esc(w.window)}</li>`).join("");
}

/* Full detail view for one deal, with similar deals in its category. */
function detailHTML(d, cur) {
  const price = toDisplay(d.price, d.cur, cur);
  const was = toDisplay(d.was, d.cur, cur);
  const save = toDisplay(saving(d), d.cur, cur);
  const pct = discountPct(d);
  const similar = DEALS.filter(x => x.category === d.category && x.id !== d.id).slice(0, 3);
  return `
  <div class="detail-card">
    <span class="cat">${esc(d.category)} · ${esc(d.store)}</span>
    <h2>${esc(d.name)}</h2>
    <p>${esc(d.note)}</p>
    <div class="big-price">${fmtMoney(price, cur)}
      <span class="badge-off">−${pct}%</span></div>
    <div class="big-was">Regular price <span class="strike">${fmtMoney(was, cur)}</span> · You save ${fmtMoney(save, cur)}</div>
    <dl class="detail-facts">
      <div><dt>Store</dt><dd>${esc(d.store)} (${esc(STORES[d.store].country)})</dd></div>
      <div><dt>Brand</dt><dd>${esc(d.brand)}</dd></div>
      <div><dt>Price checked</dt><dd>27 November 2026</dd></div>
      <div><dt>Deal ends</dt><dd>${esc(d.ends)}</dd></div>
      <div><dt>Original currency</dt><dd>${d.cur === "USD" ? "US dollars" : "Japanese yen"}</dd></div>
      <div><dt>Currency note</dt><dd>${d.cur === cur ? "Shown in its own currency"
        : "Converted at ¥150 = $1 (approx.)"}</dd></div>
    </dl>
    <a class="store-btn" href="${esc(STORES[d.store].url)}" target="_blank" rel="noopener">
      Shop at ${esc(d.store)} ↗</a>
    <p class="meta">Prices can change during the sale — confirm on the store page before you buy.</p>
  </div>
  ${similar.length ? `<div class="similar"><h3>More in ${esc(d.category)}</h3>
    <div class="similar-grid">${similar.map(x => cardHTML(x, cur)).join("")}</div></div>` : ""}`;
}

/* Category quick-filter chips. */
function chipsHTML(active) {
  const all = ["All", ...CATEGORIES];
  return all.map(c =>
    `<button type="button" class="chip${c === active ? " active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`
  ).join("");
}

