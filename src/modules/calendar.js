/**
 * Calendar Module — RFC 5545 Compliant .ICS Generator
 * 
 * Generates standards-compliant iCalendar files with VTIMEZONE (Asia/Kolkata),
 * CRLF line endings, 75-octet folding, character escaping, and multi-stage alarms.
 * Also generates Google Calendar web direct links.
 */

import { weddingConfig } from '../config/wedding.js';

export class CalendarManager {
  constructor() {
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;
    const downloadBtn = document.getElementById('btn-add-calendar');
    const gCalLink = document.getElementById('link-gcal');

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadIcs());
    }

    if (gCalLink) {
      gCalLink.href = this.buildGoogleCalendarUrl();
    }
  }

  /**
   * Escapes special characters per RFC 5545 Section 3.3.11
   */
  escapeText(str) {
    if (!str) return '';
    return str
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\r\n|\n|\r/g, '\\n');
  }

  /**
   * Folds lines longer than 75 octets per RFC 5545 Section 3.1
   */
  foldLine(line) {
    const encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
    const decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8') : null;
    const bytes = encoder ? encoder.encode(line) : (typeof Buffer !== 'undefined' ? Buffer.from(line, 'utf8') : line);

    if (bytes.length <= 75) return line;

    const chunks = [];
    let offset = 0;

    let end = Math.min(bytes.length, 75);
    chunks.push(decoder ? decoder.decode(bytes.slice(offset, end)) : line.substring(offset, end));
    offset = end;

    while (offset < bytes.length) {
      end = Math.min(bytes.length, offset + 74);
      chunks.push(' ' + (decoder ? decoder.decode(bytes.slice(offset, end)) : line.substring(offset, end)));
      offset = end;
    }

    return chunks.join('\r\n');
  }

  /**
   * Builds the formatted RFC 5545 iCalendar content
   */
  buildIcsContent() {
    const { couple, event, venue } = weddingConfig;
    const nowUtc = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const uid = `wedding-${couple.groom.name.toLowerCase()}-${couple.bride.name.toLowerCase()}-20261228@dheerajangel.wedding`;

    const summary = this.escapeText(event.title);
    const location = this.escapeText(`${venue.name}, ${venue.city}`);
    const description = this.escapeText(
      `Together with their families, ${couple.groom.name} & ${couple.bride.name} invite you to celebrate their sacred wedding ceremony at ${venue.name}, ${venue.city}.\\n\\nDirections: https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.mapsDestination)}`
    );

    const rawLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Isaac Dheeraj & Angel Priscilla//Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE',
      'TZID:Asia/Kolkata',
      'TZURL:http://tzurl.org/zoneinfo-outlook/Asia/Kolkata',
      'X-LIC-LOCATION:Asia/Kolkata',
      'BEGIN:STANDARD',
      'TZOFFSETFROM:+0530',
      'TZOFFSETTO:+0530',
      'TZNAME:IST',
      'DTSTART:19700101T000000',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${nowUtc}`,
      'DTSTART;TZID=Asia/Kolkata:20261228T110000',
      'DTEND;TZID=Asia/Kolkata:20261228T130000',
      `SUMMARY:${summary}`,
      `LOCATION:${location}`,
      `DESCRIPTION:${description}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      // Reminder Alarm: 1 day prior
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${summary} tomorrow`,
      'END:VALARM',
      // Reminder Alarm: 2 hours prior
      'BEGIN:VALARM',
      'TRIGGER:-PT2H',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${summary} in 2 hours`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ];

    return rawLines.map(line => this.foldLine(line)).join('\r\n') + '\r\n';
  }

  downloadIcs() {
    const icsContent = this.buildIcsContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'Isaac-Dheeraj-and-Angel-Priscilla-Wedding.ics';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 150);
  }

  buildGoogleCalendarUrl() {
    const { event, venue } = weddingConfig;
    const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const text = encodeURIComponent(event.title);
    const dates = '20261228T110000/20261228T130000';
    const ctz = 'Asia/Kolkata';
    const details = encodeURIComponent(
      `Celebrating the marriage of Isaac Dheeraj & Angel Priscilla at ${venue.name}, ${venue.city}.`
    );
    const location = encodeURIComponent(`${venue.name}, ${venue.city}`);

    return `${base}&text=${text}&dates=${dates}&ctz=${ctz}&details=${details}&location=${location}`;
  }
}

