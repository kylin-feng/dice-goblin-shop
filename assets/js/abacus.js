/* Dice Goblin — anonymous counter analytics (same stack as Printable DM). */
(function () {
  var NS = "dicegoblin-x7q2v";
  var ENDPOINT = "https://abacus.jasoncameron.dev/hit/" + NS + "/";

  if (!/(^|\.)kylin-feng\.github\.io$/.test(location.hostname)) return;

  function send(key) {
    try {
      var url = ENDPOINT + encodeURIComponent(key) + "?t=" + Date.now() + Math.random().toString(36).slice(2, 6);
      fetch(url, { mode: "no-cors", keepalive: true, cache: "no-store" }).catch(function () {});
    } catch (e) {}
  }

  function pageKey() {
    var p = location.pathname.replace(/\/index\.html?$/, "/").replace(/^.*\/dice-goblin-shop/, "").replace(/^\/+/, "");
    return (p ? p.replace(/\/+$/, "") : "home").replace(/[^A-Za-z0-9_.-]/g, "-");
  }

  function refBucket() {
    var ref = document.referrer || "";
    if (!ref) return "direct";
    try {
      var h = new URL(ref).hostname.replace(/^www\./, "");
      if (/google\./.test(h)) return "google";
      if (/bing\.com/.test(h)) return "bing";
      if (/duckduckgo\.com/.test(h)) return "duckduckgo";
      if (/reddit\.com/.test(h)) return "reddit";
      if (/pinterest\./.test(h)) return "pinterest";
      if (/facebook\.com|instagram\.com/.test(h)) return "facebook";
      if (/twitter\.com|x\.com/.test(h)) return "x";
      if (/youtube\.com/.test(h)) return "youtube";
      if (/kylin-feng\.github\.io/.test(h)) return "internal";
      return "other-" + h.replace(/[^a-z0-9.-]/g, "").slice(0, 28);
    } catch (e) { return "other"; }
  }

  function langKey() {
    var l = (navigator.language || "unknown").toLowerCase();
    return l === "unknown" ? l : l.replace(/[^a-z-]/g, "");
  }

  send("pv." + pageKey());
  send("src." + refBucket());
  send("lng." + langKey());

  try {
    if (!localStorage.getItem("dg-uv")) {
      localStorage.setItem("dg-uv", "1");
      send("uv.all");
    }
  } catch (e) {}

  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("a[data-evt],button[data-evt]");
    if (!a) return;
    send("evt." + a.dataset.evt.replace(/[^A-Za-z0-9_.-]/g, "-"));
  }, true);
})();
