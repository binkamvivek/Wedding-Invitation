// Paste this into Extensions > Apps Script in your Google Sheet.
// Row 1 of the sheet: A1 = "Opened at"   |   D1 = =COUNTA(A2:A)   <- this cell shows the total

function doPost() {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().appendRow([new Date()]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}
