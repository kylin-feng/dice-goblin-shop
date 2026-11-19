/* build.mjs — renders Dice Goblin shop pages. Run: node tools/build.mjs */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

const SITE = "https://kylin-feng.github.io/dice-goblin-shop";
const BUILT = "2026-11-19";
const INDEXNOW_KEY = "b4e82d17f6a0935c2d7e4a8f10c56d92";
const YEAR = "2026";
const PRINTABLE_DM = "https://kylin-feng.github.io/printable-dm/";

const SKUS = [
  {
    slug: "metal-dice-bundle", name: "Metal Dice Bundle — 7-Piece Set + Folding Tray + Pouch",
    short: "Metal Dice Bundle", price: "29.99", was: "44.99", badge: "Best value",
    img: "metal-dice-bundle.svg",
    cardDesc: "Solid zinc-alloy 7-piece set in antique gold & bronze, a folding leather-look tray and a velvet pouch — everything a table needs.",
    feat: [
      "Complete 7-piece set: d4, d6, d8, d10, d12, d20 and percentile d%",
      "Solid zinc-alloy castings — satisfying weight (approx. 130 g per set)",
      "Antique gold &amp; bronze finish, numbers etched and inked",
      "Snapping folding dice tray (PU leather-look, snaps flat for travel)",
      "Black velvet drawstring pouch with Dice Goblin clasp beads",
      "Free worldwide shipping — tracking number included",
    ],
  },
  {
    slug: "resin-dice-set", name: "Glimmerstone Resin Dice — 7-Piece Set",
    short: "Glimmerstone Resin Dice", price: "12.99", was: "19.99", badge: "Starter pick",
    img: "resin-dice-set.svg",
    cardDesc: "Sharp-edged resin dice with a deep sapphire-to-violet shimmer — the easiest way to look like a pro on a budget.",
    feat: [
      "Full 7-piece set: d4 through d% with sharp, crisp edges",
      "Layered resin pour — sapphire blue fading to violet glimmer",
      "Big, readable numbers painted in crisp white",
      "Lightweight and table-friendly — safe for wooden tables",
      "Arrives in a protective velvet pouch",
      "Free worldwide shipping — tracking number included",
    ],
  },
  {
    slug: "folding-dice-tray", name: "Folding Dice Tray — Snapping Octagon",
    short: "Folding Dice Tray", price: "9.99", was: "14.99", badge: "Add-on",
    img: "folding-dice-tray.svg",
    cardDesc: "An octagon tray that snaps together in one move and folds flat into any bag. Saves your table, saves your dice.",
    feat: [
      "Snaps from flat to tray in one motion — no assembly",
      "Octagon walls keep metal dice from escaping the table",
      "PU leather-look exterior, soft velvet-feel rolling surface",
      "Folds to pocket size (approx. 18 &times; 11 cm folded)",
      "Gold-stitched Dice Goblin branding",
      "Free worldwide shipping — tracking number included",
    ],
  },
];

const NAV = [
  ["#shop", "Shop"],
  ["/faq/", "FAQ"],
  ["/shipping/", "Shipping"],
  ["/returns/", "Returns"],
  ["/contact/", "Contact"],
];

function header(base, isHome) {
  const nav = NAV.map(([href, label]) =>
    `<a href="${href.startsWith("#") ? href : base + href.slice(1)}">${label}</a>`).join("\n          ");
  return `<div class="announce">&#129054;#127922; FREE worldwide shipping on every order &middot; tracking included &middot; secure PayPal checkout</div>
<header class="site-header">
      <div class="wrap">
        <a class="brand" href="${base ? base + "index.html" : "index.html"}">
          <img src="${base}assets/favicon.svg" alt="" aria-hidden="true">
          Dice&nbsp;Goblin
        </a>
        <nav class="site-nav" aria-label="Main">
          ${nav}
        </nav>
      </div>
    </header>`;
}

function footer(base) {
  return `<footer class="site-footer">
      <div class="wrap cols">
        <div>
          <h4>Shop</h4>
          <ul>
            ${SKUS.map(s => `<li><a href="${base}products/${s.slug}/">${s.short}</a></li>`).join("\n            ")}
          </ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul>
            <li><a href="${base}faq/">FAQ</a></li>
            <li><a href="${base}shipping/">Shipping policy</a></li>
            <li><a href="${base}returns/">Returns &amp; refunds</a></li>
            <li><a href="${base}contact/">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Friends of the hoard</h4>
          <ul>
            <li><a href="${PRINTABLE_DM}" target="_blank" rel="noopener" data-evt="out.printable-dm">Free printable DM tools &#8599;</a></li>
          </ul>
        </div>
      </div>
      <div class="wrap fine">
        <p>&copy; ${YEAR} Dice Goblin. Unofficial tabletop accessories; not affiliated with Wizards of the Coast. Payments are processed by PayPal — we never see your card details.</p>
      </div>
    </footer>`;
}

function layout({ base = "", path = "/", title, desc, h1Block, bodyHTML, crumbs = [], noindex = false }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  ${noindex ? '<meta name="robots" content="noindex,nofollow">' : `<link rel="canonical" href="${SITE}${path}">`}
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${SITE}${path}">
  <meta name="twitter:card" content="summary">
  <link rel="icon" type="image/svg+xml" href="${base}assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Source+Sans+3:wght@0,400;0,600;0,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${base}assets/css/style.css">
</head>
<body>
  ${header(base, path === "/")}
  ${h1Block}
  <main>
    ${bodyHTML}
  </main>
  ${footer(base)}
  <script src="${base}assets/js/shop-config.js"></script>
  <script src="${base}assets/js/checkout.js" defer></script>
  <script src="${base}assets/js/abacus.js" defer></script>
</body>
</html>`;
}

const urls = [];
function writePage(file, html, path) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  urls.push(path);
  console.log("wrote", file);
}

function skuCard(s, base) {
  return `<article class="card">
    <a href="${base}products/${s.slug}/" aria-label="${s.short}"><img src="${base}assets/img/${s.img}" alt="${s.short} product rendering" loading="lazy"></a>
    <div class="body">
      <span class="badge">${s.badge}</span>
      <h3><a href="${base}products/${s.slug}/">${s.short}</a></h3>
      <p>${s.cardDesc}</p>
      <div class="price">$${s.price}<s>$${s.was}</s></div>
      <a class="btn btn-primary" href="${base}products/${s.slug}/" data-evt="view.${s.slug}">View &amp; buy</a>
    </div>
  </article>`;
}

function productPage(s) {
  const base = "../../";
  return layout({
    base, path: `/products/${s.slug}/`,
    title: `${s.short} — Dice Goblin`,
    desc: `${s.cardDesc} $${s.price} with free worldwide shipping and PayPal buyer protection. Ships in 2-4 business days.`,
    h1Block: `<div class="page-head"><div class="wrap"><h1>${s.short}</h1><p>${s.cardDesc}</p></div></div>`,
    bodyHTML: `
    <section class="block"><div class="wrap">
      <div class="pd">
        <div class="shot"><img src="${base}assets/img/${s.img}" alt="${s.name} product rendering"></div>
        <div>
          <h1 style="font-size:1.55rem">${s.name}</h1>
          <div class="stars" aria-label="Rated 5 out of 5">&#9733;&#9733;&#9733;&#9733;&#9733; <span style="color:var(--ink-soft);letter-spacing:0">— loved by new tables everywhere</span></div>
          <div class="price-row"><span class="price">$${s.price}</span><s style="color:var(--ink-soft)">$${s.was}</s><span class="badge">${s.badge}</span></div>
          <ul class="feat">${s.feat.map(f => `<li>${f}</li>`).join("\n            ")}</ul>
          <p class="stock-note">&#128293; Small-batch stock — sets ship on a first-ordered, first-served basis.</p>
          <p class="ship-note"><b>Free worldwide shipping</b> &middot; processing 2&ndash;4 business days &middot; 7&ndash;15 days to the US, 8&ndash;18 to EU/UK &middot; PayPal buyer protection</p>
          <div id="checkout" data-sku="${s.slug}" data-name="${s.name}" data-price="${s.price}">
            <div class="co-title">Secure checkout</div>
            <div id="paypal-button-container"></div>
          </div>
          <p style="margin-top:14px;font-size:.85rem;color:var(--ink-soft)">Product rendering shown; your set is inspected and packed by hand before shipping.</p>
        </div>
      </div>
    </div></section>
    <section class="block alt"><div class="wrap">
      <div class="trust">
        <div><b>&#129054;#127922; Free worldwide shipping</b>Tracking number emailed for every order — no surprise fees at checkout.</div>
        <div><b>&#128274; PayPal buyer protection</b>Pay with PayPal balance or card; your payment details never touch our store.</div>
        <div><b>&#128260; 14-day easy returns</b>Not the hoard you dreamed of? Return unused sets within 14 days for a refund.</div>
        <div><b>&#127919; Inspected by hand</b>Every set is rolled, checked and packed by an actual dice goblin before it ships.</div>
      </div>
    </div></section>`,
  });
}

/* ---------------- home ---------------- */
writePage("index.html", layout({
  path: "/",
  title: "Dice Goblin — Premium D&D Dice Sets with Free Worldwide Shipping",
  desc: "Solid metal and shimmering resin 7-piece D&D dice sets with folding trays and pouches. $9.99-$29.99, free worldwide shipping, PayPal checkout, ships in 2-4 days.",
  h1Block: "",
  bodyHTML: `
    <section class="hero">
      <div class="wrap">
        <p class="kicker">Premium dice hoards for tabletop adventurers</p>
        <h1>Heavy metal dice that roll like they mean it</h1>
        <p class="lead">Solid zinc-alloy and layered-resin 7-piece sets, bundled with a snapping folding tray and velvet pouch — priced for real tables, shipped free anywhere on Earth.</p>
        <div class="cta-row">
          <a class="btn btn-gold" href="#shop">Shop the hoard</a>
          <a class="btn btn-ghost" href="faq/">Why metal dice?</a>
        </div>
      </div>
    </section>
    <section class="block" id="shop">
      <div class="wrap">
        <h2 class="section-title">The hoard</h2>
        <p class="section-sub">Every set is hand-inspected and ships free with a tracking number. Pay securely with PayPal.</p>
        <div class="card-grid">
          ${SKUS.map(s => skuCard(s, "")).join("\n          ")}
        </div>
      </div>
    </section>
    <section class="block alt">
      <div class="wrap">
        <div class="trust">
          <div><b>Free worldwide shipping</b>Every order, every country. Tracking number emailed when we pack it.</div>
          <div><b>2&ndash;4 day dispatch</b>Small-batch stock, packed and rolled by hand before it leaves.</div>
          <div><b>PayPal buyer protection</b>Card or balance — full protection on every purchase.</div>
          <div><b>14-day returns</b>Unused sets come back for a full refund, no interrogation.</div>
        </div>
      </div>
    </section>`,
}), "/");

/* products */
for (const s of SKUS) writePage(join("products", s.slug, "index.html"), productPage(s), `/products/${s.slug}/`);

/* ---------------- policy pages ---------------- */
const policies = [
  {
    slug: "shipping", title: "Shipping Policy — Dice Goblin",
    desc: "Free worldwide shipping, 2-4 business day processing, 7-25 day delivery by destination, tracking numbers for every order.",
    h1: "Shipping Policy", lead: "Free worldwide shipping on every order — here is exactly how it moves.",
    body: `
      <h2>Processing</h2>
      <p>Orders are packed within <strong>2&ndash;4 business days</strong> (Monday&ndash;Friday, excluding holidays). You receive a tracking number by email the moment your parcel is handed to the carrier.</p>
      <h2>Delivery times (after dispatch)</h2>
      <ul>
        <li>United States: 7&ndash;15 business days</li>
        <li>United Kingdom &amp; European Union: 8&ndash;18 business days</li>
        <li>Canada &amp; Australia: 10&ndash;20 business days</li>
        <li>Rest of world: 10&ndash;25 business days</li>
      </ul>
      <h2>Tracking</h2>
      <p>Every parcel ships with a trackable service. Tracking activates within 48&ndash;72 hours of dispatch (the first carrier scan can lag behind the label creation — that is normal).</p>
      <h2>Customs &amp; import duties</h2>
      <p>Parcels are dispatched from China and declared honestly at order value. Most destinations do not charge import duty on low-value parcels like dice sets; where your country does, any import tax is the buyer's responsibility as per local law.</p>
      <h2>Lost or stuck parcels</h2>
      <p>If tracking shows no movement for 30 days, contact us — we reship or refund, your choice. Your purchase is also covered by PayPal buyer protection.</p>`,
  },
  {
    slug: "returns", title: "Returns & Refunds — Dice Goblin",
    desc: "14-day returns on unused dice sets, damaged-in-transit items replaced free, refunds issued to the original payment method.",
    h1: "Returns &amp; Refunds", lead: "14 days, no interrogation. Here is the deal.",
    body: `
      <h2>Change of heart</h2>
      <p>You may return any <strong>unused, complete</strong> set within <strong>14 days of delivery</strong> for a full refund of the product price. Message us first via the <a href="../contact/">contact page</a> so we can expect the parcel; return shipping is at the buyer's cost.</p>
      <h2>Damaged in transit</h2>
      <p>Photo the damage and the packaging, send it to us within 7 days of delivery, and we ship a free replacement — no need to return the damaged set.</p>
      <h2>Wrong or missing dice</h2>
      <p>Mistakes happen (the goblin gets excited). We reship the missing piece or the correct set at our cost.</p>
      <h2>Refund timing</h2>
      <p>Refunds are issued to the original payment method within 3 business days of the return being accepted (or immediately for transit damage); PayPal typically posts them within 1&ndash;5 business days.</p>`,
  },
  {
    slug: "privacy", title: "Privacy Policy — Dice Goblin",
    desc: "Dice Goblin privacy policy: anonymous usage counts, no cookies, payments handled entirely by PayPal, order data used only to fulfil orders.",
    h1: "Privacy Policy", lead: "Short version: anonymous counters, no cookies, PayPal handles your payment, and your address is used only to ship your dice.",
    body: `
      <h2>What we collect</h2>
      <p>Anonymous, aggregated counts of which page was viewed and which site referred the visit. No IP logging, no accounts, no advertising trackers.</p>
      <h2>Cookies</h2>
      <p>None. A single local-storage key on your own device remembers that we have counted your browser once (unique-visitor counting); it never leaves your device and contains nothing personal.</p>
      <h2>Payments</h2>
      <p>All payments are processed by PayPal. We never see or store your card number. PayPal shares your shipping address and email with us solely to fulfil your order and send tracking updates.</p>
      <h2>Order data</h2>
      <p>Order emails and addresses are kept only as long as needed to ship, support returns, and meet tax obligations, then deleted.</p>
      <h2>Contact</h2>
      <p>Questions: see the <a href="../contact/">contact page</a>.</p>`,
  },
  {
    slug: "contact", title: "Contact Dice Goblin",
    desc: "Order questions, wholesale inquiries or dice emergencies — message the goblin and get a reply within 1-2 business days.",
    h1: "Contact the goblin", lead: "Order questions, wholesale, bulk-for-your-club pricing — all welcome.",
    body: `
      <h2>Fastest channel</h2>
      <p>Open an issue on the shop's GitHub repository — the goblin checks it daily and replies within 1&ndash;2 business days.</p>
      <div style="margin:20px 0"><a class="btn btn-primary" data-evt="out.github-contact" href="https://github.com/kylin-feng/dice-goblin-shop/issues" target="_blank" rel="noopener">&#128172; Message us on GitHub</a></div>
      <h2>For order emails</h2>
      <p>When online checkout is live, order confirmations and tracking numbers come from our orders mailbox (set up during PayPal activation — see the store announcement at the top of the page for the current status).</p>
      <h2>Wholesale &amp; clubs</h2>
      <p>Buying 10+ sets for a club, school or convention? Message us for bundle pricing.</p>`,
  },
  {
    slug: "faq", title: "Dice FAQ — Metal vs Resin, Care, Shipping — Dice Goblin",
    desc: "Metal vs resin dice, rolling etiquette, care tips, shipping times and everything else buyers ask before adopting a dice hoard.",
    h1: "FAQ", lead: "Everything adventurers ask before they adopt a hoard.",
    body: `
      <h2>Metal or resin — which should I get?</h2>
      <p>Metal dice feel amazing and roll with authority — best paired with the folding tray (they are heavy enough to dent a bare table). Resin sets are light, table-friendly and sharper-edged for the price. Most players end up with one of each: resin for the tavern, metal for the boss fight.</p>
      <h2>Are metal dice safe for my table?</h2>
      <p>Not on bare wood — that is exactly why the bundle includes a folding tray. Rolling metal dice in the tray protects both the table and the dice's finish.</p>
      <h2>How do I care for metal dice?</h2>
      <p>Keep them dry, wipe occasionally with a soft cloth, and store them in the pouch. Avoid leaving them in a damp backpack; the plating does not like long baths.</p>
      <h2>How long does shipping take?</h2>
      <p>Packed in 2&ndash;4 business days, then 7&ndash;15 days to the US, 8&ndash;18 to UK/EU, up to 25 elsewhere. Every order gets a tracking number by email. Full details on the <a href="../shipping/">shipping page</a>.</p>
      <h2>What if a die arrives damaged or missing?</h2>
      <p>Photo it within 7 days and we replace it free — keep the damaged one. See <a href="../returns/">returns &amp; refunds</a>.</p>
      <h2>Do you do discounts for clubs or bulk orders?</h2>
      <p>Yes — 10+ sets gets bundle pricing. Hit the <a href="../contact/">contact page</a>.</p>
      <h2>Free printable tools?</h2>
      <p>Our sibling site <a href="${PRINTABLE_DM}" target="_blank" rel="noopener" data-evt="out.printable-dm-faq">Printable DM</a> gives away free initiative trackers, DM screen inserts and session sheets — grab a stack while you wait for your dice. &#129054;#127922;</p>`,
  },
];

for (const p of policies) {
  writePage(join(p.slug, "index.html"), layout({
    base: "../", path: `/${p.slug}/`,
    title: p.title, desc: p.desc,
    h1Block: `<div class="page-head"><div class="wrap"><h1>${p.h1}</h1><p>${p.lead}</p></div></div>`,
    bodyHTML: `<section class="block"><div class="wrap"><div class="article">${p.body}</div></div></section>`,
  }), `/${p.slug}/`);
}

/* sitemap / robots / indexnow */
writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE}${u === "/" ? "/" : u}</loc><lastmod>${BUILT}</lastmod><priority>${u === "/" ? "1.0" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`);
writeFileSync("robots.txt", `User-agent: *
Allow: /
Disallow: /stats.html

Sitemap: ${SITE}/sitemap.xml
`);
writeFileSync(`${INDEXNOW_KEY}.txt`, INDEXNOW_KEY);
console.log(`\nDone: ${urls.length} pages + sitemap/robots/indexnow.`);
