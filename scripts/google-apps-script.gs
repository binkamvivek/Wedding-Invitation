// Paste this into Extensions > Apps Script in your Google Sheet (replace the old code).
// Sheet headers:  A1 = "Open at"   B1 = "Device"   C1 = "Browser"
// D1 keeps your total:  =COUNTA(A2:A)

function doPost(e) {
  var device = '', browser = '';
  try {
    var d = JSON.parse(e.postData.contents);
    device = String(d.device || '').slice(0, 40);
    browser = String(d.browser || '').slice(0, 40);
  } catch (err) {}

  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().appendRow([new Date(), device, browser]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}
