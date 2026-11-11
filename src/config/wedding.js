/**
 * Dheeraj & Angel — Wedding Configuration
 * 
 * Edit this single configuration file to customize all details of the wedding.
 * Modifying this file never requires touching component or presentation code.
 */

export const weddingConfig = {
  // Couple Information
  couple: {
    groom: {
      name: 'Dheeraj',
      fullName: 'Dheeraj',
      role: 'The Groom',
      tagline: 'An architect of warmth, quiet devotion, and lifelong joy.',
      photo: '/assets/couple/dheeraj.jpg',
      initial: 'D',
    },
    bride: {
      name: 'Angel',
      fullName: 'Angel',
      role: 'The Bride',
      tagline: 'A spirit of grace, laughter, and radiant wonder.',
      photo: '/assets/couple/angle.jpg',
      initial: 'A',
    },
    combined: 'Dheeraj & Angel',
    monogram: 'D & A',
  },

  // Event Schedule & Timing
  event: {
    title: 'Wedding Ceremony of Dheeraj & Angel',
    subTitle: 'Wedding Ceremony & Nuptials',
    isoDate: '2026-12-28T11:00:00+05:30', // IST target timestamp
    displayDate: 'Monday · 28 December 2026',
    displayDay: 'Monday',
    displayDayNum: '28',
    displayMonth: 'December',
    displayYear: '2026',
    displayTime: '11:00 AM',
    timeLabel: 'Morning Nuptials',
    durationHours: 2, // ceremony duration for calendar events
    timezone: 'Asia/Kolkata',
  },

  // Venue & Location
  venue: {
    name: 'All Saints Church',
    fullAddress: 'All Saints Church, Trimulgherry, Secunderabad, Telangana, India',
    city: 'Secunderabad',
    // The query string for Google Maps Directions API:
    // https://www.google.com/maps/dir/?api=1&destination=All+Saints+Church+Secunderabad&travelmode=driving
    mapsDestination: 'All Saints Church Secunderabad',
    travelMode: 'driving',
  },

  // Quotes & Editorial Captions
  editorial: {
    invitationPreamble: 'Together with their families',
    invitationDeclaration: 'are getting married',
    coupleHeadline: 'Two Hearts, One Beautiful Story',
    coupleCaption: 'Two souls, one journey, and a lifetime of beautiful memories.',
    celebrationHeadline: 'The Celebration',
    countdownHeadline: 'Counting Down to Forever',
    countdownMessage: 'We can’t wait to celebrate our special day with you!',
    closingSignoff: 'With love, Dheeraj & Angel',
    begunMessage: 'Today is the day. Join us in celebration.',
    endedMessage: 'Thank you for celebrating with us.',
  },

  // Storage and Backend Sync
  // 'local': Save wishes locally in browser LocalStorage
  // 'remote': POST/GET wishes to a Google Apps Script web app connected to Google Sheets
  storage: {
    mode: 'local', // 'local' | 'remote'
    remoteUrl: '',  // Paste your published Google Apps Script Web App URL here
    localStorageKey: 'dheeraj-angel:wishes:v1',
    maxLocalEntries: 50,
  },

  // Initial Curated Sample Wishes
  sampleWishes: [
    {
      id: 'sample-1',
      name: 'Uncle Thomas & Family',
      rsvp: 'Joyfully accepting',
      message: 'May God shower His choicest blessings upon you both as you begin this sacred journey together.',
      timestamp: '2026-11-10T10:15:00.000Z',
      isSample: true,
    },
    {
      id: 'sample-2',
      name: 'Priya & Rahul Sharma',
      rsvp: 'Joyfully accepting',
      message: 'Wishing you both a lifetime of uncontainable laughter, deep adventures, and endless love!',
      timestamp: '2026-11-09T16:40:00.000Z',
      isSample: true,
    },
    {
      id: 'sample-3',
      name: 'Grace & David',
      rsvp: 'Joyfully accepting',
      message: 'So utterly delighted for you, Dheeraj and Angel! Can’t wait to raise a toast in Secunderabad.',
      timestamp: '2026-11-08T09:20:00.000Z',
      isSample: true,
    },
    {
      id: 'sample-4',
      name: 'Vikram Reddy',
      rsvp: 'Joyfully accepting',
      message: 'From college days to your wedding altar — heartiest congratulations my dear brother!',
      timestamp: '2026-11-07T14:05:00.000Z',
      isSample: true,
    },
  ],
};

