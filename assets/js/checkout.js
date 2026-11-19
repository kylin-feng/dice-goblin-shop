/* Dice Goblin checkout — PayPal Smart Buttons (client-side) with graceful fallback.
   Configure in assets/js/shop-config.js. No backend required. */
(function () {
  var box = document.getElementById("checkout");
  if (!box) return;
  var cfg = window.DG_CONFIG || {};
  var sku = box.dataset.sku, name = box.dataset.name, price = box.dataset.price;

  function fire(evt) {
    try {
      var url = "https://abacus.jasoncameron.dev/hit/dicegoblin-x7q2v/evt." + evt + "?t=" + Date.now();
      fetch(url, { mode: "no-cors", keepalive: true }).catch(function () {});
    } catch (e) {}
  }
  fire("checkout-view." + sku);

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  function fallback() {
    var bits = ['<div class="co-fallback"><strong>Online checkout is launching.</strong><br>',
      'Secure PayPal checkout is being connected. To reserve your set now:'].join("");
    if (cfg.CONTACT_EMAIL) {
      bits += '<br><a class="btn btn-primary" data-evt="reserve-email.' + sku + '" href="mailto:' + cfg.CONTACT_EMAIL +
        '?subject=' + encodeURIComponent("Order: " + name) + '&body=' + encodeURIComponent("Hi! I'd like to order: " + name + " ($" + price + ").\nMy shipping address:\n") + '">&#9993;&#65039; Order by email</a>';
    }
    if (cfg.PAYPAL_ME) {
      bits += ' <a class="btn btn-gold" data-evt="reserve-paypalme.' + sku + '" href="https://paypal.me/' + cfg.PAYPAL_ME + '/' + price +
        '" target="_blank" rel="noopener">Pay via PayPal.Me</a>';
    }
    if (!cfg.CONTACT_EMAIL && !cfg.PAYPAL_ME) {
      bits += '<br><em>Store owner: set PAYPAL_CLIENT_ID (or PAYPAL_ME / CONTACT_EMAIL) in assets/js/shop-config.js to activate payments.</em>';
    }
    bits += "</div>";
    box.insertAdjacentHTML("beforeend", bits);
  }

  if (!cfg.PAYPAL_CLIENT_ID) { fallback(); return; }

  loadScript("https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(cfg.PAYPAL_CLIENT_ID) +
    "&currency=" + (cfg.CURRENCY || "USD"))
    .then(function () {
      if (!window.paypal) throw new Error("sdk");
      window.paypal.Buttons({
        style: { layout: "vertical", label: "checkout", shape: "rect" },
        createOrder: function (data, actions) {
          fire("buy-click." + sku);
          return actions.order.create({
            purchase_units: [{
              description: name + " [" + sku + "]",
              amount: { value: price, currency_code: cfg.CURRENCY || "USD" }
            }]
          });
        },
        onApprove: function (data, actions) {
          fire("buy-success." + sku);
          return actions.order.capture().then(function (det) {
            box.innerHTML = '<div class="co-fallback"><strong>&#127881; Thank you, adventurer!</strong><br>Order received' +
              (det && det.payer && det.payer.email_address ? " — a confirmation is on its way to <b>" + det.payer.email_address + "</b>" : "") +
              ". We ship within 2&ndash;4 business days and email your tracking number. Questions? Use the contact page.</div>";
          });
        }
      }).render("#paypal-button-container").catch(fallback);
    })
    .catch(fallback);
})();
