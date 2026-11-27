// open-counter.js
// Counts how many times the invitation envelope is opened.
// No names, no personal data: each open adds ONE row (date + device + browser + anonymous device ID) to your Google Sheet.
//
// Paste your Google Apps Script "Web app URL" below. Leave it empty to switch counting off.
const ENDPOINT = 'https://script.google.com/macros/s/AKfycbw5kHNlWA3jBRNJG2FtrVZJVLeoYe2lQZE87J2nsDtJqMGcEeNmGFfcZU6yH23O_0yM/exec';

(function () {
  if (!ENDPOINT) return;
  const s1 = document.getElementById('s1');
  if (!s1) return;

  function detect() {
    const ua = navigator.userAgent || '';
    let device = 'Other';
    if (/iPhone/.test(ua)) device = 'iPhone';
    else if (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) device = 'iPad';
    else if (/Android/.test(ua)) device = /Mobile/.test(ua) ? 'Android phone' : 'Android tablet';
    else if (/Windows/.test(ua)) device = 'Windows computer';
    else if (/Macintosh/.test(ua)) device = 'Mac computer';
    else if (/CrOS/.test(ua)) device = 'Chromebook';
    else if (/Linux/.test(ua)) device = 'Linux computer';

    let browser = 'Other';
    if (/Instagram/.test(ua)) browser = 'Instagram app';
    else if (/FBAN|FBAV/.test(ua)) browser = 'Facebook app';
    else if (/EdgA|EdgiOS|Edg\//.test(ua)) browser = 'Edge';
    else if (/OPR\/|OPiOS|Opera/.test(ua)) browser = 'Opera';
    else if (/SamsungBrowser/.test(ua)) browser = 'Samsung Internet';
    else if (/Firefox|FxiOS/.test(ua)) browser = 'Firefox';
    else if (/Chrome|CriOS/.test(ua)) browser = 'Chrome';
    else if (/Safari/.test(ua)) browser = 'Safari';
    return { device: device, browser: browser };
  }

  // Anonymous ID for this phone/computer (random, stored in the browser, no name or number).
  function deviceId() {
    try {
      let id = localStorage.getItem('oc-id');
      if (!id) {
        id = (window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()).replace(/-/g, '').slice(0, 8);
        localStorage.setItem('oc-id', id);
      }
      return id;
    } catch (e) { return ''; }
  }

  let sent = false;
  function send() {
    if (sent) return;
    sent = true;
    try {
      fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign(detect(), { id: deviceId() })) })
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
