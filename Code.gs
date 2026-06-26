/**
 * ══════════════════════════════════════════════════════════
 *  WEDDING RSVP — Google Apps Script
 *  File: Code.gs
 *
 *  HOW TO DEPLOY:
 *  1. Go to https://script.google.com → New Project
 *  2. Paste this entire file into the editor
 *  3. Replace SPREADSHEET_ID with your Google Sheets ID
 *     (found in the sheet URL: .../spreadsheets/d/SPREADSHEET_ID/...)
 *  4. Click "Deploy" → "New Deployment"
 *  5. Type: Web App
 *  6. Execute as: Me
 *  7. Who has access: Anyone
 *  8. Click Deploy → Authorize → Copy the Web App URL
 *  9. Paste that URL into script.js as SCRIPT_URL
 * ══════════════════════════════════════════════════════════
 */

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME     = 'RSVP Responses';

function doPost(e) {
  try {
    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    let   sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet + header row if it doesn't exist yet
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp',
        'First Name',
        'Last Name',
        'Full Name',
        'Attendance',
        'Dietary Notes',
      ]);

      // Style the header
      const headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setBackground('#A8B5A0');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 160);
      sheet.setColumnWidth(4, 180);
    }

    const params = e.parameter;

    const timestamp  = params.timestamp  || new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' });
    const firstName  = (params.firstName  || '').trim();
    const lastName   = (params.lastName   || '').trim();
    const fullName   = `${firstName} ${lastName}`.trim();
    const attendance = params.attendance  || '';
    const dietary    = params.dietary     || '';

    // Append the RSVP row
    sheet.appendRow([timestamp, firstName, lastName, fullName, attendance, dietary]);

    // Colour-code by attendance
    const lastRow = sheet.getLastRow();
    const rowRange = sheet.getRange(lastRow, 1, 1, 6);
    if (attendance.includes('Accepts')) {
      rowRange.setBackground('#EAF4E9');  // soft green
    } else if (attendance.includes('Declines')) {
      rowRange.setBackground('#FAE9E9');  // soft red
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', name: fullName }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET (for testing in browser)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Wedding RSVP script is live!' }))
    .setMimeType(ContentService.MimeType.JSON);
}
