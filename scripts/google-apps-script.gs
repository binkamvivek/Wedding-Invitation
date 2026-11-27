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
    sheet.appendRow([new Date(), device, browser, id]);
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
  var extra = log.getMaxColumns() - 4;
  if (extra > 0) log.getRange(1, 5, log.getMaxRows(), extra).clear();   // remove old helper cells
  log.getRange('A1:D1').setValues([['Open at', 'Device', 'Browser', 'Device ID']])
     .setFontWeight('bold');
  log.setFrozenRows(1);
  log.getRange('A2:A').setNumberFormat('dd mmm yyyy, h:mm:ss am/pm');
  log.setColumnWidth(1, 190); log.setColumnWidth(2, 150); log.setColumnWidth(3, 130); log.setColumnWidth(4, 110);

  // ---- Tab 2: the summary ----
  var sum = ss.getSheetByName(SUMMARY_SHEET);
  if (sum) sum.clear(); else sum = ss.insertSheet(SUMMARY_SHEET);

  // Opens per device (left)
  sum.getRange('A1').setFormula(
    "=QUERY(Opens!B2:B,\"select B, count(B) where B <> '' group by B order by count(B) desc label B 'Device', count(B) 'Opens'\",0)");
  // Totals (right next to it)
  sum.getRange('D1:D2').setValues([['Total opens'], ['Different devices']]);
  sum.getRange('E1').setFormula('=COUNTA(Opens!A2:A)');
  sum.getRange('E2').setFormula('=COUNTUNIQUE(Opens!D2:D)');
  // Opens per browser (far right)
  sum.getRange('G1').setFormula(
    "=QUERY(Opens!C2:C,\"select C, count(C) where C <> '' group by C order by count(C) desc label C 'Browser', count(C) 'Opens'\",0)");

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
