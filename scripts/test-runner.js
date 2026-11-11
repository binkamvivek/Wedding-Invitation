import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import http from 'http';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DIST_DIR = path.resolve('dist');
const SCREENSHOTS_DIR = path.resolve('screenshots');

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

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
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
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

  console.log('Launching Chrome for Redesigned 6-Panel Quality Validation...');
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
    // VIEWPORT TEST 1: Mobile Phone (390x844 - iPhone 14)
    // ========================================================
    console.log('\n=======================================');
    console.log('TESTING VIEWPORT 390x844 (Mobile iPhone 14)');
    console.log('=======================================');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle0' });

    // Panel 1: Closed Envelope
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '390x844-panel1-envelope-closed.png') });
    console.log('Captured: 390x844-panel1-envelope-closed.png');

    // Tap wax seal to open
    const sealBtn = await page.$('#wax-seal-btn');
    if (!sealBtn) throw new Error('#wax-seal-btn not found');
    await sealBtn.click();
    await new Promise(r => setTimeout(r, 2200));

    // Panel 1: Opened state
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '390x844-panel1-envelope-opened.png') });
    console.log('Captured: 390x844-panel1-envelope-opened.png');

    const isScrollLocked = await page.evaluate(() => document.body.classList.contains('scroll-locked'));
    results['Gate 1: Envelope Opening & Scroll Unlock'] = (!isScrollLocked) ? 'PASS' : 'FAIL';

    // Panel 2: Invitation Card
    await page.evaluate(() => document.getElementById('panel-invitation').scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '390x844-panel2-invitation-card.png') });
    console.log('Captured: 390x844-panel2-invitation-card.png');

    // Panel 3: The Couple
    await page.evaluate(() => document.getElementById('panel-couple').scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '390x844-panel3-the-couple.png') });
    console.log('Captured: 390x844-panel3-the-couple.png');

    // Panel 4: The Celebration
    await page.evaluate(() => document.getElementById('panel-celebration').scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '390x844-panel4-celebration.png') });
    console.log('Captured: 390x844-panel4-celebration.png');

    // Panel 5: Countdown
    await page.evaluate(() => document.getElementById('panel-countdown').scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '390x844-panel5-countdown.png') });
    console.log('Captured: 390x844-panel5-countdown.png');

    // Panel 6: RSVP & Blessings
    await page.evaluate(() => document.getElementById('panel-rsvp').scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '390x844-panel6-rsvp-blessings.png') });
    console.log('Captured: 390x844-panel6-rsvp-blessings.png');

    // ========================================================
    // VIEWPORT TEST 2: Desktop (1440x900)
    // ========================================================
    console.log('\n=======================================');
    console.log('TESTING VIEWPORT 1440x900 (Desktop Luxury)');
    console.log('=======================================');
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    
    // Panel 1: Desktop
    await page.evaluate(() => document.getElementById('panel-envelope').scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '1440x900-panel1-envelope.png') });
    console.log('Captured: 1440x900-panel1-envelope.png');

    // Panel 2: Desktop Invitation Card
    await page.evaluate(() => document.getElementById('panel-invitation').scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '1440x900-panel2-invitation-card.png') });
    console.log('Captured: 1440x900-panel2-invitation-card.png');

    // Panel 3: Desktop Couple
    await page.evaluate(() => document.getElementById('panel-couple').scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '1440x900-panel3-the-couple.png') });
    console.log('Captured: 1440x900-panel3-the-couple.png');

    // Panel 4: Desktop Celebration
    await page.evaluate(() => document.getElementById('panel-celebration').scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '1440x900-panel4-celebration.png') });
    console.log('Captured: 1440x900-panel4-celebration.png');

    // Panel 5: Desktop Countdown
    await page.evaluate(() => document.getElementById('panel-countdown').scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '1440x900-panel5-countdown.png') });
    console.log('Captured: 1440x900-panel5-countdown.png');

    // Panel 6: Desktop RSVP
    await page.evaluate(() => document.getElementById('panel-rsvp').scrollIntoView({ behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '1440x900-panel6-rsvp-blessings.png') });
    console.log('Captured: 1440x900-panel6-rsvp-blessings.png');

    // ========================================================
    // VERIFY QUALITY CRITERIA
    // ========================================================
    console.log('\nValidating Functional Gates...');

    // 1. No dead links (no href="#")
    const deadLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.filter(a => a.getAttribute('href') === '#').map(a => a.outerHTML);
    });
    results['Quality: No Dead Links (no href="#")'] = deadLinks.length === 0 ? 'PASS' : `FAIL: ${deadLinks.join(', ')}`;

    // 2. No filler text ("amore, eternity...")
    const pageHtml = await page.content();
    const hasAmoreFiller = /amore/i.test(pageHtml);
    results['Quality: No Filler Repeated Text ("amore...")'] = (!hasAmoreFiller) ? 'PASS' : 'FAIL';

    // 3. No Emoji
    const emojiRegex = /\p{Extended_Pictographic}/u;
    const bodyText = await page.evaluate(() => document.body.innerText);
    results['Quality: No Emoji'] = (!emojiRegex.test(bodyText)) ? 'PASS' : 'FAIL';

    // 4. No horizontal overflow on mobile
    await page.setViewport({ width: 390, height: 844 });
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    results['Quality: No Horizontal Scroll at 390px'] = (!hasHorizontalOverflow) ? 'PASS' : 'FAIL';

    // 5. Calendar RFC 5545 generator
    const { CalendarManager } = await import('../src/modules/calendar.js');
    const cal = new CalendarManager();
    const icsText = cal.buildIcsContent();
    const allLinesWithin75 = icsText.split('\r\n').every(l => Buffer.byteLength(l, 'utf8') <= 75);
    const hasVTimeZone = icsText.includes('BEGIN:VTIMEZONE') && icsText.includes('TZID:Asia/Kolkata');
    results['Quality: Calendar RFC 5545 & Timezone'] = (allLinesWithin75 && hasVTimeZone) ? 'PASS' : 'FAIL';

    // 6. Directions Link
    const mapsHref = await page.$eval('#link-maps', el => el.getAttribute('href'));
    results['Quality: Maps Directions Link Valid'] = mapsHref.includes('destination=All+Saints+Church+Secunderabad') ? 'PASS' : 'FAIL';

    // 7. RSVP Submission & Ticker
    await page.type('#rsvp-name', 'Marcus Sterling');
    await page.type('#rsvp-wish', 'May your marriage be anchored in steadfast devotion and unending delight!');
    await page.$eval('#rsvp-submit-btn', b => b.click());
    await new Promise(r => setTimeout(r, 600));
    const isSuccessShown = await page.$eval('#rsvp-success-card', el => !el.classList.contains('hidden'));
    const tickerHasMarcus = await page.$eval('#wishes-ticker-track', el => el.textContent.includes('Marcus Sterling'));
    results['Quality: RSVP Form Submission & Storage'] = (isSuccessShown && tickerHasMarcus) ? 'PASS' : 'FAIL';

    // 8. Console errors
    results['Quality: Console Clean (Zero Errors)'] = consoleErrors.length === 0 ? 'PASS' : `FAIL: ${consoleErrors.join(', ')}`;

    console.log('\n=======================================');
    console.log('REDESIGNED TEST RESULTS:');
    console.log('=======================================');
    for (const [k, v] of Object.entries(results)) {
      console.log(`- ${k}: ${v}`);
    }

    // Write updated TEST_REPORT.md
    let reportMd = '# TEST REPORT: Redesigned 6-Panel Vertical Presentation\n\n';
    reportMd += `Executed on: ${new Date().toISOString()}\n`;
    reportMd += 'Architecture: CSS Scroll-Snap (100dvh Vertical Panels), IntersectionObserver, Hardware Accelerated Transforms\n\n';
    reportMd += '| Test Suite | Verification | Status |\n';
    reportMd += '|---|---|---|\n';
    for (const [k, v] of Object.entries(results)) {
      reportMd += `| ${k} | Automated Verification | **${v}** |\n`;
    }
    reportMd += '\n## Captured Screenshots\n';
    reportMd += '### Mobile (390×844):\n';
    reportMd += '- `390x844-panel1-envelope-closed.png`\n';
    reportMd += '- `390x844-panel1-envelope-opened.png`\n';
    reportMd += '- `390x844-panel2-invitation-card.png`\n';
    reportMd += '- `390x844-panel3-the-couple.png`\n';
    reportMd += '- `390x844-panel4-celebration.png`\n';
    reportMd += '- `390x844-panel5-countdown.png`\n';
    reportMd += '- `390x844-panel6-rsvp-blessings.png`\n\n';
    reportMd += '### Desktop (1440×900):\n';
    reportMd += '- `1440x900-panel1-envelope.png`\n';
    reportMd += '- `1440x900-panel2-invitation-card.png`\n';
    reportMd += '- `1440x900-panel3-the-couple.png`\n';
    reportMd += '- `1440x900-panel4-celebration.png`\n';
    reportMd += '- `1440x900-panel5-countdown.png`\n';
    reportMd += '- `1440x900-panel6-rsvp-blessings.png`\n';

    fs.writeFileSync('TEST_REPORT.md', reportMd, 'utf8');
    console.log('\nUpdated TEST_REPORT.md written successfully.');

  } finally {
    await browser.close();
    server.close();
  }
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
