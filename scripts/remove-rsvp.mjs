// scripts/remove-rsvp.mjs
// Removes the "RSVP & Blessings" form and the "Wishes & Blessings" wall from index.html.
// Nothing else is changed. A backup is saved as index.html.bak.
//
// Run from the project root:   node scripts/remove-rsvp.mjs
// (optional) another file:     node scripts/remove-rsvp.mjs path/to/index.html
import fs from 'node:fs';

const file = process.argv[2] || 'index.html';
const html = fs.readFileSync(file, 'utf8');

// From the start of the RSVP block up to (not including) the "With love" line.
const pattern = /[ \t]*<div class="rsvp rv"[\s\S]*?(?=[ \t]*<p class="sign rv")/;

if (!pattern.test(html)) {
  console.log('Nothing to remove: the RSVP block was not found in ' + file + ' (already removed?).');
  process.exit(0);
}

const out = html.replace(pattern, '');
fs.writeFileSync(file + '.bak', html);
fs.writeFileSync(file, out);

const removed = html.length - out.length;
console.log('Done. Removed ' + removed + ' characters from ' + file + '. Backup: ' + file + '.bak');
