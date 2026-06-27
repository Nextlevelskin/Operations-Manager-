import type { Contact } from './types';

function daysFromToday(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export const mockContacts: Contact[] = [
  {
    id: 'bloom-apothecary',
    name: 'Jordan Lee',
    organization: 'Bloom Apothecary',
    category: 'wholesale',
    email: 'jordan@bloomapothecary.com',
    phone: '555-010-2231',
    firstContact: daysFromToday(-40),
    lastContact: daysFromToday(-11),
    nextFollowup: daysFromToday(-4),
    status: 'Responded — in progress',
    notes: 'Wants samples of the calendula line before committing to a first wholesale order.',
    history: [
      { date: daysFromToday(-40), note: 'Introduced the brand at the local market.' },
      { date: daysFromToday(-11), note: 'Sent wholesale pricing sheet.' },
    ],
    topic: 'wholesale samples',
    followBody:
      'I wanted to check back in on the calendula line samples we discussed — happy to get a box out to you this week if you are ready to take a closer look.',
    followShort: 'Just checking in on the calendula samples — want me to send a box this week?',
  },
  {
    id: 'riverside-clinic',
    name: 'Dr. Priya Anand',
    organization: 'Riverside Wellness Clinic',
    category: 'clinical',
    email: 'priya@riversidewellness.ca',
    phone: '555-010-7744',
    firstContact: daysFromToday(-60),
    lastContact: daysFromToday(-14),
    nextFollowup: daysFromToday(0),
    status: 'Called — left voicemail',
    notes: 'Interested in a clinical-grade lavender balm for post-treatment care.',
    history: [
      { date: daysFromToday(-60), note: 'Met at the wellness expo.' },
      { date: daysFromToday(-14), note: 'Left a voicemail to follow up on samples.' },
    ],
    topic: 'clinical balm trial',
    followBody:
      'I wanted to follow up on the lavender balm trial for your post-treatment care line — let me know if the samples have been useful and if you would like to move ahead.',
    followShort: 'Following up on the balm trial — any feedback so far?',
  },
  {
    id: 'maple-and-co',
    name: 'Sam Whitfield',
    organization: 'Maple & Co. Boutique',
    category: 'partnership',
    email: 'sam@mapleandco.ca',
    phone: '555-010-3392',
    firstContact: daysFromToday(-25),
    lastContact: daysFromToday(-8),
    nextFollowup: daysFromToday(-1),
    status: null,
    notes: 'Open to a co-branded gift box for the holiday season.',
    history: [
      { date: daysFromToday(-25), note: 'Reached out about a holiday collaboration.' },
      { date: daysFromToday(-8), note: 'Shared mockups for the gift box.' },
    ],
    topic: 'holiday gift box partnership',
    followBody:
      'I wanted to circle back on the holiday gift box idea — I would love to finalize details with you soon so we can have everything ready in time.',
    followShort: 'Circling back on the gift box partnership — ready to finalize?',
  },
  {
    id: 'morgan-t',
    name: 'Morgan Tate',
    organization: 'Independent client',
    category: 'massage',
    email: 'morgan.tate@example.com',
    phone: '555-010-9981',
    firstContact: daysFromToday(-90),
    lastContact: daysFromToday(-20),
    nextFollowup: daysFromToday(2),
    status: 'Booked / confirmed',
    notes: 'Prefers evening appointments, deep tissue focus.',
    history: [
      { date: daysFromToday(-90), note: 'First session booked.' },
      { date: daysFromToday(-20), note: 'Rebooked for a follow-up session.' },
    ],
    topic: 'next appointment',
    followBody:
      'It has been a little while since your last session — would you like to get something booked in for this month?',
    followShort: 'Want to get your next session on the calendar?',
  },
  {
    id: 'cedar-clinic',
    name: 'Alex Romero',
    organization: 'Cedar Physiotherapy',
    category: 'clinical',
    email: 'alex@cedarphysio.ca',
    phone: '555-010-5567',
    firstContact: daysFromToday(-15),
    lastContact: daysFromToday(-2),
    nextFollowup: daysFromToday(6),
    status: 'Responded — in progress',
    notes: 'Considering a recurring contract for in-office treatments.',
    history: [{ date: daysFromToday(-2), note: 'Discussed contract terms over the phone.' }],
    topic: 'recurring contract',
    followBody:
      'Wanted to follow up on the recurring contract details we discussed — happy to send over a draft whenever works for you.',
    followShort: 'Following up on the recurring contract — ready for a draft?',
  },
];
