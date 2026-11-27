/* Black Friday Deal Finder — deal data.
 * Every price below was read from the store's own Black Friday listing or
 * from a deal roundup that cites the store, on 27 November 2026 (JST).
 * "was" is the store's own regular/list price. Prices can move during the
 * sale — the site tells shoppers to confirm on the store page.
 * Currency: USD deals are priced in dollars, JPY deals in yen.
 * FX_RATE is a fixed display rate only (150 yen = $1), labelled approximate. */
"use strict";

const FX_RATE = 150;

const STORES = {
  "Amazon":            { url: "https://www.amazon.com/", country: "US" },
  "Best Buy":          { url: "https://www.bestbuy.com/", country: "US" },
  "Nintendo Store":    { url: "https://www.nintendo.com/us/store/", country: "US" },
  "Google Store":      { url: "https://store.google.com/", country: "US" },
  "Target":            { url: "https://www.target.com/", country: "US" },
  "Costco":            { url: "https://www.costco.com/", country: "US" },
  "Kohl's":            { url: "https://www.kohls.com/", country: "US" },
  "Amazon.co.jp":      { url: "https://www.amazon.co.jp/", country: "JP" },
  "Yodobashi":         { url: "https://www.yodobashi.com/", country: "JP" },
  "Bic Camera":        { url: "https://www.biccamera.com/", country: "JP" },
  "HP Directplus":     { url: "https://jp.ext.hp.com/", country: "JP" },
  "RingConn":          { url: "https://www.ringconn.com/", country: "JP" }
};

const SALE_WINDOWS = [
  { store: "Amazon (US)", window: "Black Friday Week, 19–30 Nov" },
  { store: "Amazon.co.jp", window: "Advance sale 27–29 Nov; main sale 30 Nov–7 Dec" },
  { store: "Best Buy", window: "Black Friday Sale, 19–28 Nov; Cyber Sun–Mon 29–30 Nov" },
  { store: "Walmart", window: "Black Friday Deals, 23–29 Nov; Cyber Monday 30 Nov–2 Dec" },
  { store: "Target", window: "Black Friday, 22–29 Nov" },
  { store: "Costco", window: "Holiday savings, through 30 Nov" },
  { store: "Nintendo", window: "Bundle offer 22 Nov–5 Dec; games $20 off 22–29 Nov" },
  { store: "Yodobashi", window: "Black Friday SALE, 20 Nov–6 Dec" },
  { store: "Bic Camera", window: "Black Friday, 13–30 Nov" },
  { store: "Yahoo! Shopping", window: "Black Friday, 22–30 Nov (PayPay points up to 23%)" },
  { store: "Rakuten", window: "Black Friday ended 25 Nov (points up to 47.5x)" }
];

/* id, name, brand, store, category, price, was, currency, ends, note */
const DEALS = [
  { id: "airpods-pro-3", name: "Apple AirPods Pro 3", brand: "Apple",
    store: "Amazon", category: "Audio", price: 149, was: 249, cur: "USD",
    ends: "30 Nov", note: "Amazon's headline audio deal; $100 off." },
  { id: "macbook-air-m5", name: "Apple MacBook Air 13-inch (M5, 16GB / 512GB)", brand: "Apple",
    store: "Best Buy", category: "Laptops", price: 1049, was: 1299, cur: "USD",
    ends: "28 Nov", note: "New M5 Air; $989 reported at Amazon." },
  { id: "tcl-65-tv", name: "TCL 65-inch 4K UHD HDR Smart TV with Fire TV (2026)", brand: "TCL",
    store: "Best Buy", category: "TVs", price: 229.99, was: 469.99, cur: "USD",
    ends: "28 Nov", note: "Best Buy's doorbuster TV, $240 off." },
  { id: "sony-xm5", name: "Sony WH-1000XM5 Noise-Cancelling Headphones", brand: "Sony",
    store: "Best Buy", category: "Audio", price: 169, was: 399.99, cur: "USD",
    ends: "28 Nov", note: "Last-gen flagship Sony cans, 58% off." },
  { id: "switch2-mkw", name: "Nintendo Switch 2 + Mario Kart World Bundle", brand: "Nintendo",
    store: "Nintendo Store", category: "Gaming", price: 499.99, was: 549.99, cur: "USD",
    ends: "5 Dec", note: "Console + Mario Kart World download + 3 months Switch Online." },
  { id: "hp-omnibook5", name: "HP OmniBook 5 14-inch 2K OLED Laptop", brand: "HP",
    store: "Best Buy", category: "Laptops", price: 449.99, was: 799.99, cur: "USD",
    ends: "28 Nov", note: "OLED laptop, $350 off." },
  { id: "apple-watch-s12", name: "Apple Watch Series 12 (GPS, 42mm)", brand: "Apple",
    store: "Amazon", category: "Wearables", price: 329, was: 399, cur: "USD",
    ends: "30 Nov", note: "New Series 12, $70 off at Amazon and Best Buy." },
  { id: "kindle-paperwhite", name: "Kindle Paperwhite (16GB)", brand: "Amazon",
    store: "Amazon", category: "Electronics", price: 129, was: 199, cur: "USD",
    ends: "30 Nov", note: "35% off the latest Paperwhite." },
  { id: "fire-stick-4k", name: "Fire TV Stick 4K Plus", brand: "Amazon",
    store: "Amazon", category: "Electronics", price: 29, was: 69, cur: "USD",
    ends: "30 Nov", note: "58% off Amazon's 4K streamer." },
  { id: "echo-spot", name: "Echo Spot (2024)", brand: "Amazon",
    store: "Amazon", category: "Smart Home", price: 44, was: 109, cur: "USD",
    ends: "30 Nov", note: "Smart alarm clock with Alexa, 60% off." },
  { id: "bose-qc", name: "Bose QuietComfort Headphones", brand: "Bose",
    store: "Amazon", category: "Audio", price: 169, was: 359, cur: "USD",
    ends: "30 Nov", note: "Bose's flagship noise-cancelling cans, 53% off." },
  { id: "sony-xm6", name: "Sony WH-1000XM6 Noise-Cancelling Headphones", brand: "Sony",
    store: "Amazon", category: "Audio", price: 348, was: 459, cur: "USD",
    ends: "30 Nov", note: "The newest Sony flagship, $111 off." },
  { id: "ninja-blendsense", name: "Ninja Kitchen System with BlendSense", brand: "Ninja",
    store: "Amazon", category: "Kitchen", price: 179, was: 249, cur: "USD",
    ends: "30 Nov", note: "Blender + food processor system, $70 off." },
  { id: "keurig-kexpress", name: "Keurig K-Express Coffee Maker", brand: "Keurig",
    store: "Amazon", category: "Kitchen", price: 59, was: 89, cur: "USD",
    ends: "30 Nov", note: "Single-serve brewer, 34% off." },
  { id: "dyson-v9", name: "Dyson V9 Motorbar Cordless Vacuum", brand: "Dyson",
    store: "Amazon", category: "Home", price: 269.95, was: 599.99, cur: "USD",
    ends: "30 Nov", note: "55% off; Target lists the same $269.95." },
  { id: "pixel-watch-5", name: "Google Pixel Watch 5 (41mm, Wi-Fi)", brand: "Google",
    store: "Google Store", category: "Wearables", price: 300, was: 400, cur: "USD",
    ends: "30 Nov", note: "$100 off the new Pixel Watch 5." },
  { id: "google-home-speaker", name: "Google Home Speaker", brand: "Google",
    store: "Best Buy", category: "Smart Home", price: 79.99, was: 100, cur: "USD",
    ends: "28 Nov", note: "Lowest price ever for the new Home Speaker." },
  { id: "smarttag-3", name: "Samsung Galaxy SmartTag 3", brand: "Samsung",
    store: "Amazon", category: "Electronics", price: 20, was: 29.99, cur: "USD",
    ends: "30 Nov", note: "Item tracker, 33% off; first deal on the new tag." },
  { id: "lego-red-fox", name: "LEGO Creator 3-in-1 Forest Animals: Red Fox", brand: "LEGO",
    store: "Amazon", category: "Toys", price: 34.99, was: 49.99, cur: "USD",
    ends: "30 Nov", note: "30% off the 3-in-1 fox set." },
  { id: "lego-eevee", name: "LEGO Pokémon Eevee", brand: "LEGO",
    store: "Amazon", category: "Toys", price: 47.49, was: 59.99, cur: "USD",
    ends: "30 Nov", note: "Buildable Eevee, $12.50 off." },
  { id: "lego-landspeeder", name: "LEGO Star Wars Luke's Landspeeder Set", brand: "LEGO",
    store: "Target", category: "Toys", price: 22.74, was: 30.74, cur: "USD",
    ends: "29 Nov", note: "SMART Play landspeeder, 26% off at Target." },
  { id: "shark-robot", name: "Shark PowerDetect 2-in-1 Robot Vacuum & Mop", brand: "Shark",
    store: "Costco", category: "Home", price: 399.99, was: 499.99, cur: "USD",
    ends: "30 Nov", note: "Robot vacuum + mop with NeverTouch Pro base, $100 off." },
  { id: "dyson-airwrap", name: "Dyson Airwrap i.d. Multi-Styler & Dryer", brand: "Dyson",
    store: "Costco", category: "Beauty", price: 499.99, was: 649.99, cur: "USD",
    ends: "30 Nov", note: "Airwrap with serum, $150 off at Costco." },
  { id: "fc-27", name: "EA Sports FC 27 (PS5)", brand: "EA Sports",
    store: "Amazon", category: "Gaming", price: 29, was: 69.99, cur: "USD",
    ends: "30 Nov", note: "59% off the new FC on PS5 ($27 on Switch 2)." },
  { id: "dkb", name: "Donkey Kong Bananza (Switch 2)", brand: "Nintendo",
    store: "Amazon", category: "Gaming", price: 49.99, was: 69.99, cur: "USD",
    ends: "29 Nov", note: "$20 off at Amazon, Best Buy, GameStop, Target and Walmart." },
  { id: "pyrex-set", name: "Pyrex 22-Piece Glass Food Storage Set", brand: "Pyrex",
    store: "Kohl's", category: "Kitchen", price: 23.99, was: 59.99, cur: "USD",
    ends: "28 Nov", note: "60% off with code TAKE20 at Kohl's." },
  { id: "watch-se3-jp", name: "Apple Watch SE 3 (40mm, GPS)", brand: "Apple",
    store: "Amazon.co.jp", category: "Wearables", price: 35400, was: 41800, cur: "JPY",
    ends: "7 Dec", note: "15% off; Series 12 from ¥61,000 at Amazon Japan." },
  { id: "airpods-pro-3-jp", name: "AirPods Pro 3", brand: "Apple",
    store: "Amazon.co.jp", category: "Audio", price: 33800, was: 39800, cur: "JPY",
    ends: "7 Dec", note: "¥6,000 off at Amazon Japan." },
  { id: "iphone-air-jp", name: "iPhone Air (512GB)", brand: "Apple",
    store: "Amazon.co.jp", category: "Electronics", price: 145900, was: 189800, cur: "JPY",
    ends: "7 Dec", note: "23% off; a Black Friday headliner in Japan." },
  { id: "watch-ultra3-jp", name: "Apple Watch Ultra 3 (GPS + Cellular, 49mm)", brand: "Apple",
    store: "Yodobashi", category: "Wearables", price: 119800, was: 129800, cur: "JPY",
    ends: "6 Dec", note: "Yodobashi Black Friday SALE price; 10% Gold points." },
  { id: "dyson-supersonic-jp", name: "Dyson Supersonic Nural Lite", brand: "Dyson",
    store: "Bic Camera", category: "Beauty", price: 37800, was: 47800, cur: "JPY",
    ends: "30 Nov", note: "Bic Camera eye-catcher, 1,600 units only." },
  { id: "deebot-t20-jp", name: "ECOVACS DEEBOT T20 OMNI Robot Vacuum", brand: "ECOVACS",
    store: "Bic Camera", category: "Home", price: 29800, was: 79800, cur: "JPY",
    ends: "30 Nov", note: "63% off; 400 units only at Bic Camera." },
  { id: "hp-omnibook3-jp", name: "HP OmniBook 3 16 Laptop", brand: "HP",
    store: "HP Directplus", category: "Laptops", price: 109800, was: 264000, cur: "JPY",
    ends: "14 Dec", note: "58% off at HP's own store." },
  { id: "ringconn-gen2-jp", name: "RingConn Gen 2 Smart Ring", brand: "RingConn",
    store: "RingConn", category: "Wearables", price: 34320, was: 52800, cur: "JPY",
    ends: "11 Dec", note: "Biggest-ever 35% off, direct from RingConn." }
];

/* ---- derived helpers (pure functions, no DOM) ---- */
function discountPct(d) { return Math.round((1 - d.price / d.was) * 100); }
function saving(d) { return d.was - d.price; }
/* Convert a deal's price into the display currency (fixed rate, approximate). */
function toDisplay(amount, fromCur, toCur) {
  if (fromCur === toCur) return amount;
  return fromCur === "USD" ? amount * FX_RATE : amount / FX_RATE;
}
function fmtMoney(amount, cur) {
  if (cur === "JPY") return "¥" + Math.round(amount).toLocaleString("en-US");
  return "$" + (Number.isInteger(amount) ? amount.toLocaleString("en-US")
    : amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
}
const CATEGORIES = [...new Set(DEALS.map(d => d.category))].sort();
const STORE_NAMES = [...new Set(DEALS.map(d => d.store))].sort();

