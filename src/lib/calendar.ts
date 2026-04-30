export interface CalendarEvent {
  title: string
  startIST: string   // "20260823T110000" local IST
  endIST: string     // "20260823T140000"
  location: string
  description: string
}

function istToUtc(ist: string): string {
  // IST is UTC+5:30, subtract 5h30m
  const y = ist.slice(0, 4), mo = ist.slice(4, 6), d = ist.slice(6, 8)
  const h = parseInt(ist.slice(9, 11)), m = parseInt(ist.slice(11, 13))
  const date = new Date(Date.UTC(+y, +mo - 1, +d, h - 5, m - 30))
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export function googleCalendarUrl(event: CalendarEvent): string {
  const start = istToUtc(event.startIST)
  const end = istToUtc(event.endIST)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    location: event.location,
    details: event.description,
    ctz: 'Asia/Kolkata',
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

export function outlookCalendarUrl(event: CalendarEvent): string {
  const start = istToUtc(event.startIST)
  const end = istToUtc(event.endIST)
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: start,
    enddt: end,
    location: event.location,
    body: event.description,
  })
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`
}

export function downloadICS(event: CalendarEvent): void {
  const start = istToUtc(event.startIST)
  const end = istToUtc(event.endIST)
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sangeeth & Arya Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `DTSTAMP:${now}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.location}`,
    `DESCRIPTION:${event.description}`,
    `UID:${now}-wedding@sangeeth-arya.love`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.title.replace(/\s+/g, '-')}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

export const weddingEvent: CalendarEvent = {
  title: 'Sangeeth & Arya — Wedding Ceremony',
  startIST: '20260823T110000',
  endIST: '20260823T140000',
  location: 'M K Convention Centre, Eramalloor',
  description: 'Join us to celebrate the wedding of Sangeeth Lal P S & Arya',
}

// TODO: Update reception time when confirmed. Currently defaulting to 6:00 PM IST.
export const receptionEvent: CalendarEvent = {
  title: 'Sangeeth & Arya — Wedding Reception',
  startIST: '20260829T180000',
  endIST: '20260829T210000',
  location: 'Reception Venue — see invitation for details',
  description: 'Join us for the wedding reception of Sangeeth Lal P S & Arya',
}
