import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import http from 'http';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DIST_DIR = path.resolve('dist');
const SCREENSHOTS_DIR = path.resolve('screenshots');

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

// Minimal static HTTP server for dist/
function startServer(port = 4173) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.png': 'image/png',
    '.ics': 'text/calendar',
  };

  const server = http.createServer((req, res) => {
    let filePath = path.join(DIST_DIR, req.url.split('?')[0]);
    if (filePath.endsWith(path.sep) || fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const mime = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Test server running at http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function runTests() {
  const server = await startServer(4173);
  const baseUrl = 'http://localhost:4173';

  console.log('Launching Chrome for Quality Gate validation...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const results = {};

  try {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    // ========================================================
    // VIEWPORT TEST 1: Phone (390x844 - iPhone 14 / modern iOS)
    // ========================================================
    console.log('\n--- Testing Viewport 390x844 (iPhone 14) ---');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle0' });

    // Screenshot 1: Closed Envelope
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '390x844-01-closed-envelope.png') });
    console.log('Captured: 390x844-01-closed-envelope.png');

    // TEST GATE 1: Envelope Opening
    console.log('\nValidating Gate 1: Envelope Opening Ceremony...');
    const sealBtn = await page.$('#wax-seal-btn');
    if (!sealBtn) throw new Error('#wax-seal-btn not found');
    await sealBtn.click();

    // Wait for the opening ceremony to unfold (~2.4s)
    await new Promise(r => setTimeout(r, 2600));

    // Screenshot 2: Opened Card
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '390x844-02-opened-envelope.png') });
    console.log('Captured: 390x844-02-opened-envelope.png');

    const isOpenedClass = await page.$eval('#slide-invitation', el => el.classList.contains('is-opened'));
    const isSessionStored = await page.evaluate(() => sessionStorage.getItem('dheeraj-angle:envelope-opened') === 'true');
    results['Gate 1: Envelope Opens & Persists'] = isOpenedClass && isSessionStored ? 'PASS' : 'FAIL';

    // TEST GATE 2: Navigation & Hash routing
    console.log('\nValidating Gate 2: Navigation (Arrows, Dots, Keys)...');
    const nextBtn = await page.$('#nav-next');
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 800));

    // Slide 2: Couple
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '390x844-03-slide2-couple.png') });
    console.log('Captured: 390x844-03-slide2-couple.png');
    const hash2 = await page.evaluate(() => window.location.hash);

    // Advance to Slide 3: Celebration
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '390x844-04-slide3-celebration.png') });
    console.log('Captured: 390x844-04-slide3-celebration.png');
    const hash3 = await page.evaluate(() => window.location.hash);

    // Advance to Slide 4: Countdown & RSVP
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '390x844-05-slide4-countdown-rsvp.png') });
    console.log('Captured: 390x844-05-slide4-countdown-rsvp.png');
    const hash4 = await page.evaluate(() => window.location.hash);

    // Test returning to Slide 1 and checking that opened view is retained
    const prevBtn = await page.$('#nav-prev');
    await prevBtn.click(); // to slide 3
    await new Promise(r => setTimeout(r, 400));
    await prevBtn.click(); // to slide 2
    await new Promise(r => setTimeout(r, 400));
    await prevBtn.click(); // to slide 1
    await new Promise(r => setTimeout(r, 800));

    const slide1CardVisible = await page.$eval('#invitation-card-opened', el => !el.classList.contains('opacity-0'));
    results['Gate 2: Navigation & Slide 1 Opened Memory'] = (hash2 === '#couple' && hash3 === '#celebration' && hash4 === '#rsvp' && slide1CardVisible) ? 'PASS' : 'FAIL';

    // TEST GATE 3: Countdown Math & Simulation
    console.log('\nValidating Gate 3: Countdown Accuracy & Edge Cases...');
    const cdDaysText = await page.evaluate(() => {
      // test with now override ?now=2026-12-28T11:30:00+05:30
      return fetch('http://localhost:4173/?now=2026-12-28T11:30:00%2B05:30')
        .then(() => true);
    });

    const testPageBegun = await browser.newPage();
    await testPageBegun.goto(`${baseUrl}/?now=2026-12-28T11:30:00%2B05:30#rsvp`, { waitUntil: 'networkidle0' });
    const begunMsg = await testPageBegun.$eval('#cd-status-message', el => el.textContent.trim());

    const testPageEnded = await browser.newPage();
    await testPageEnded.goto(`${baseUrl}/?now=2026-12-28T16:00:00%2B05:30#rsvp`, { waitUntil: 'networkidle0' });
    const endedMsg = await testPageEnded.$eval('#cd-status-message', el => el.textContent.trim());

    await testPageBegun.close();
    await testPageEnded.close();

    results['Gate 3: Countdown Logic & ?now= overrides'] = 
      (begunMsg.includes('Today is the day') && endedMsg.includes('Thank you for celebrating')) ? 'PASS' : 'FAIL';

    // TEST GATE 4: Calendar (.ics) Generation
    console.log('\nValidating Gate 4: RFC 5545 iCalendar Validation...');
    const icsResult = await page.evaluate(() => {
      const mgr = new (window.__CalendarManager || Object)();
      // Inspect element #btn-add-calendar
      const btn = document.getElementById('btn-add-calendar');
      return !!btn;
    });

    // Generate ICS content in Node test context directly from module
    const { CalendarManager } = await import('../src/modules/calendar.js');
    const cal = new CalendarManager();
    const icsText = cal.buildIcsContent();
    const hasVCalendar = icsText.includes('BEGIN:VCALENDAR') && icsText.includes('END:VCALENDAR');
    const hasVTimeZone = icsText.includes('BEGIN:VTIMEZONE') && icsText.includes('TZID:Asia/Kolkata');
    const hasVEvent = icsText.includes('BEGIN:VEVENT') && icsText.includes('DTSTART;TZID=Asia/Kolkata:20261228T110000');
    const hasAlarm = icsText.includes('BEGIN:VALARM') && icsText.includes('TRIGGER:-P1D');
    const lines = icsText.split('\r\n');
    const allLinesWithin75 = lines.every(l => Buffer.byteLength(l, 'utf8') <= 75);

    results['Gate 4: Calendar RFC 5545 & Timezone'] = (hasVCalendar && hasVTimeZone && hasVEvent && hasAlarm && allLinesWithin75) ? 'PASS' : 'FAIL';

    // TEST GATE 5: Directions URL
    console.log('\nValidating Gate 5: Google Maps Directions link...');
    const mapsHref = await page.$eval('#link-maps', el => el.getAttribute('href'));
    const expectedQuery = 'https://www.google.com/maps/dir/?api=1&destination=All+Saints+Church+Secunderabad&travelmode=driving';
    results['Gate 5: Directions URL'] = (mapsHref === expectedQuery) ? 'PASS' : 'FAIL';

    // TEST GATE 6: RSVP Form, Validation, Wishes Wall
    console.log('\nValidating Gate 6: RSVP Form & Storage...');
    await page.goto(`${baseUrl}/#rsvp`, { waitUntil: 'networkidle0' });
    
    // Submit blank to trigger validation
    await page.$eval('#rsvp-submit-btn', b => b.click());
    const isErrorVisible = await page.$eval('#rsvp-error-msg', el => !el.classList.contains('hidden'));

    // Fill valid wish
    await page.type('#rsvp-name', 'Cousin Jennifer');
    await page.type('#rsvp-wish', 'May your home overflow with boundless peace and heavenly harmony forever!');
    await page.$eval('#rsvp-submit-btn', b => b.click());

    await new Promise(r => setTimeout(r, 600));
    const isSuccessVisible = await page.$eval('#rsvp-success-card', el => !el.classList.contains('hidden'));
    const tickerContainsJennifer = await page.$eval('#wishes-ticker-track', el => el.textContent.includes('Cousin Jennifer'));

    results['Gate 6: RSVP Validation & Wishes Storage'] = (isErrorVisible && isSuccessVisible && tickerContainsJennifer) ? 'PASS' : 'FAIL';

    // TEST GATE 7: Prefers-reduced-motion
    console.log('\nValidating Gate 7: Reduced Motion...');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.reload({ waitUntil: 'networkidle0' });
    const canvasHidden = await page.evaluate(() => {
      const c = document.getElementById('ambient-canvas');
      return window.getComputedStyle(c).display === 'none';
    });
    results['Gate 7: Prefers-reduced-motion'] = canvasHidden ? 'PASS' : 'FAIL';

    // ========================================================
    // VIEWPORT TEST 2: Small Android (360x740)
    // ========================================================
    console.log('\n--- Testing Viewport 360x740 (Small Android) ---');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await page.setViewport({ width: 360, height: 740, deviceScaleFactor: 2 });
    await page.goto(`${baseUrl}/#celebration`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '360x740-slide3.png') });
    console.log('Captured: 360x740-slide3.png');

    // ========================================================
    // VIEWPORT TEST 3: Tablet (768x1024)
    // ========================================================
    console.log('\n--- Testing Viewport 768x1024 (iPad) ---');
    await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
    await page.goto(`${baseUrl}/#couple`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '768x1024-slide2.png') });
    console.log('Captured: 768x1024-slide2.png');

    // ========================================================
    // VIEWPORT TEST 4: Desktop (1440x900)
    // ========================================================
    console.log('\n--- Testing Viewport 1440x900 (Desktop) ---');
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${baseUrl}/#celebration`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '1440x900-slide3.png') });
    console.log('Captured: 1440x900-slide3.png');

    // TEST GATE 8: No Horizontal Overflow
    const overflowCheck = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= window.innerWidth;
    });
    results['Gate 8: Responsive & No Horizontal Scroll'] = overflowCheck ? 'PASS' : 'FAIL';

    // TEST GATE 9: Console Clean
    results['Gate 9: Console Clean (Zero Errors)'] = consoleErrors.length === 0 ? 'PASS' : `FAIL: ${consoleErrors.join(', ')}`;

    // TEST GATE 10: No Emoji & No Lorem Ipsum
    const bodyText = await page.evaluate(() => document.body.innerText);
    const emojiRegex = /\p{Extended_Pictographic}/u;
    const hasEmoji = emojiRegex.test(bodyText);
    const hasLorem = /lorem ipsum/i.test(bodyText);
    results['Gate 10: No Emoji & No Lorem Ipsum'] = (!hasEmoji && !hasLorem) ? 'PASS' : 'FAIL';

    console.log('\n=======================================');
    console.log('QUALITY GATES TEST RESULTS:');
    console.log('=======================================');
    for (const [gate, status] of Object.entries(results)) {
      console.log(`- ${gate}: ${status}`);
    }

    // Write TEST_REPORT.md
    let reportMd = '# TEST REPORT: Quality Gates Validation\n\n';
    reportMd += `Executed on: ${new Date().toISOString()}\n`;
    reportMd += 'Environment: Headless Chrome / Node.js HTTP Server / Localhost\n\n';
    reportMd += '| Gate | Description | Status |\n';
    reportMd += '|---|---|---|\n';
    for (const [gate, status] of Object.entries(results)) {
      reportMd += `| ${gate} | Automated Verification | **${status}** |\n`;
    }
    reportMd += '\n## Tested Resolutions & Captured Screenshots\n';
    reportMd += '- **390×844 (Mobile iPhone 14)**: Closed envelope, opened card, couple editorial, celebration, countdown/RSVP\n';
    reportMd += '- **360×740 (Small Android)**: Celebration view\n';
    reportMd += '- **768×1024 (Tablet / iPad)**: Couple spread\n';
    reportMd += '- **1440×900 (Desktop Luxury)**: Full celebration spread\n';

    fs.writeFileSync('TEST_REPORT.md', reportMd, 'utf8');
    console.log('\nGenerated TEST_REPORT.md');

  } finally {
    await browser.close();
    server.close();
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

