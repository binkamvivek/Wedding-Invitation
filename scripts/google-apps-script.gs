// ================================================================
//  Wedding invitation — open counter (Google Apps Script)
//  1) Paste this whole file into Extensions > Apps Script, Save.
//  2) Pick  setupSheet  in the function dropdown, click Run (once).
//  3) Deploy > Manage deployments > pencil > Version: New version > Deploy.
// ================================================================

var LOG_SHEET = 'Opens';
var SUMMARY_SHEET = 'Summary';

// Called by the website every time an envelope is opened.
function doPost(e) {
  var device = '', browser = '', id = '';
  try {
    var d = JSON.parse(e.postData.contents);
    device = String(d.device || '').slice(0, 40);
    browser = String(d.browser || '').slice(0, 40);
    id = String(d.id || '').slice(0, 20);
  } catch (err) {}

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(LOG_SHEET) || ss.getSheets()[0];
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var now = new Date();
    var updated = false;

    // If this Device ID already exists in column D, update that row and increment column E
    if (id) {
      var lastRow = sheet.getLastRow();
      if (lastRow >= 2) {
        var ids = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
        for (var i = 0; i < ids.length; i++) {
          if (String(ids[i][0]).trim() === id) {
            var rowNum = i + 2;
            var currentCount = Number(sheet.getRange(rowNum, 5).getValue()) || 1;
            sheet.getRange(rowNum, 1).setValue(now);
            if (device) sheet.getRange(rowNum, 2).setValue(device);
            if (browser) sheet.getRange(rowNum, 3).setValue(browser);
            sheet.getRange(rowNum, 5).setValue(currentCount + 1);
            updated = true;
            break;
          }
        }
      }
    }

    if (!updated) {
      sheet.appendRow([now, device, browser, id, 1]);
    }
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}

// Run this ONCE. It tidies your sheet and builds the summary. Your old rows are kept.
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ---- Tab 1: the log ----
  var log = ss.getSheetByName(LOG_SHEET);
  if (!log) { log = ss.getSheets()[0]; log.setName(LOG_SHEET); }
  var extra = log.getMaxColumns() - 5;
  if (extra > 0) log.getRange(1, 6, log.getMaxRows(), extra).clear();   // remove old helper cells
  log.getRange('A1:E1').setValues([['Open at', 'Device', 'Browser', 'Device ID', 'Times it opened']])
     .setFontWeight('bold');
  log.setFrozenRows(1);
  log.getRange('A2:A').setNumberFormat('dd mmm yyyy, h:mm:ss am/pm');
  log.setColumnWidth(1, 190); log.setColumnWidth(2, 150); log.setColumnWidth(3, 130); log.setColumnWidth(4, 110); log.setColumnWidth(5, 130);

  // Backfill column E = 1 for any existing rows that don't have a count yet
  var lastRow = log.getLastRow();
  if (lastRow >= 2) {
    var colA = log.getRange(2, 1, lastRow - 1, 1).getValues();
    var colE = log.getRange(2, 5, lastRow - 1, 1).getValues();
    for (var i = 0; i < colA.length; i++) {
      if (colA[i][0] && !colE[i][0]) {
        colE[i][0] = 1;
      }
    }
    log.getRange(2, 5, lastRow - 1, 1).setValues(colE);
  }

  // ---- Tab 2: the summary ----
  var sum = ss.getSheetByName(SUMMARY_SHEET);
  if (sum) sum.clear(); else sum = ss.insertSheet(SUMMARY_SHEET);

  // Opens per device (left)
  sum.getRange('A1').setFormula(
    "=QUERY(Opens!B2:E,\"select B, sum(E) where B <> '' group by B order by sum(E) desc label B 'Device', sum(E) 'Opens'\",0)");
  // Totals (right next to it)
  sum.getRange('D1:D2').setValues([['Total opens'], ['Different devices']]);
  sum.getRange('E1').setFormula('=SUM(Opens!E2:E)');
  sum.getRange('E2').setFormula('=COUNTUNIQUE(Opens!D2:D)');
  // Opens per browser (far right)
  sum.getRange('G1').setFormula(
    "=QUERY(Opens!C2:E,\"select C, sum(E) where C <> '' group by C order by sum(E) desc label C 'Browser', sum(E) 'Opens'\",0)");

  // Look
  sum.getRange('A1:B1').setFontWeight('bold').setBorder(null, null, true, null, null, null);
  sum.getRange('G1:H1').setFontWeight('bold').setBorder(null, null, true, null, null, null);
  sum.getRange('D1:D2').setFontWeight('bold');
  sum.getRange('E1:E2').setFontWeight('bold').setFontSize(14).setHorizontalAlignment('left');
  sum.getRange('B:B').setHorizontalAlignment('left');
  sum.getRange('H:H').setHorizontalAlignment('left');
  sum.setColumnWidth(1, 160); sum.setColumnWidth(2, 70); sum.setColumnWidth(3, 40);
  sum.setColumnWidth(4, 140); sum.setColumnWidth(5, 70); sum.setColumnWidth(6, 40);
  sum.setColumnWidth(7, 150); sum.setColumnWidth(8, 70);
  sum.setHiddenGridlines(true);
  ss.setActiveSheet(sum);
}
