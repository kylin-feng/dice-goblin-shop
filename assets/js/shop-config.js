/* Dice Goblin — shop configuration. THIS IS THE ONLY FILE YOU EDIT to go live.
   1) Register PayPal (see README-运营手册.md), copy your Client ID into PAYPAL_CLIENT_ID.
   2) Your PayPal.Me username (the part after paypal.me/) into PAYPAL_ME.
   3) Orders/contact mailbox into CONTACT_EMAIL. */
window.DG_CONFIG = {
  PAYPAL_CLIENT_ID: "",          // e.g. "AeJ2x..." — empty = checkout shows fallback
  PAYPAL_ME: "",                 // e.g. "yourname" → https://paypal.me/yourname/29.99
  CURRENCY: "USD",
  CONTACT_EMAIL: "",             // e.g. "orders@yourmail.com"
  FREE_SHIPPING_THRESHOLD: 0,    // 0 = free worldwide shipping (built into price)
};
