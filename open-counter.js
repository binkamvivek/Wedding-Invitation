// open-counter.js
// Counts how many times the invitation envelope is opened. No names, no personal data:
// each open adds ONE row (date + time) to your Google Sheet.
//
// Paste your Google Apps Script "Web app URL" below. Leave it empty to switch counting off.
const ENDPOINT = 'https://script.google.com/macros/s/AKfycbwziLKneUa8zXUZmbeo9uzGpO6aTlrmH-AUnOtPZUQIqMmEhq2GRIDPPceOTxl8bvkp/exec';

(function () {
  if (!ENDPOINT) return;
  const s1 = document.getElementById('s1');
  if (!s1) return;

  let sent = false;
  function send() {
    if (sent) return;
    sent = true;
    try {
      fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body: 'open' })
        .catch(function () {});
    } catch (e) {}
  }

  // The envelope adds the class "open" when a guest taps it.
  // When a visitor refreshes, the site restores the opened state with "open skip" together,
  // so that is NOT counted again.
  new MutationObserver(function () {
    if (s1.classList.contains('open') && !s1.classList.contains('skip')) send();
  }).observe(s1, { attributes: true, attributeFilter: ['class'] });
})();
