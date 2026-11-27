// Paste this into Extensions > Apps Script in your Google Sheet (replace the old code).
// Sheet headers:  A1 = "Open at"   B1 = "Device"   C1 = "Browser"   D1 = "Device ID"
// (the totals and tables live in columns F to J, see the steps)

function doPost(e) {
  var device = '', browser = '', id = '';
  try {
    var d = JSON.parse(e.postData.contents);
    device = String(d.device || '').slice(0, 40);
    browser = String(d.browser || '').slice(0, 40);
    id = String(d.id || '').slice(0, 20);
  } catch (err) {}

  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().appendRow([new Date(), device, browser, id]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}
