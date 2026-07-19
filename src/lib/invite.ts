// Invite variants:
//
//   /              -> both wedding and reception  (default)
//   /wedding/      -> wedding only
//   /reception/    -> reception only
//
// Each path is a real HTML file (see vite.config.ts) so link previews carry
// the right details — scrapers never run the app. ?invite= is kept as an
// equivalent alias.
//
// Anything unrecognised falls back to showing both, so a mistyped or
// stripped URL can never hide an event from a guest.

export type InviteKind = 'all' | 'wedding' | 'reception'

interface EventInfo {
  /** Matches the styling used across the invitation. */
  dateDisplay: string
  /** UTC instant for the countdown (IST is UTC+5:30). */
  countdownUTC: string
  mapUrl: string
}

export const WEDDING: EventInfo = {
  dateDisplay: '23 . 08 . 2026',
  countdownUTC: '2026-08-23T06:30:00Z', // 12:00 noon IST
  mapUrl: 'https://maps.app.goo.gl/FqXUdBE8PCmXdsFX9',
}

export const RECEPTION: EventInfo = {
  dateDisplay: '29 . 08 . 2026',
  countdownUTC: '2026-08-29T12:30:00Z', // 6:00 PM IST
  mapUrl: 'https://maps.app.goo.gl/ttzpEpnTZAcriK617',
}

function readKind(): InviteKind {
  if (typeof window === 'undefined') return 'all'

  // Path wins — /reception/ and /wedding/ are the shareable links.
  const path = window.location.pathname.toLowerCase()
  if (path.startsWith('/reception')) return 'reception'
  if (path.startsWith('/wedding')) return 'wedding'

  const raw = new URLSearchParams(window.location.search).get('invite')
  switch (raw?.trim().toLowerCase()) {
    case 'wedding':
      return 'wedding'
    case 'reception':
      return 'reception'
    default:
      return 'all'
  }
}

export const inviteKind: InviteKind = readKind()

export const showWedding = inviteKind !== 'reception'
export const showReception = inviteKind !== 'wedding'

/**
 * The event this invite leads with. Drives the hero date, the envelope,
 * the countdown, the footer and the map button — so a reception-only
 * guest is never shown the wedding date as though it were theirs.
 */
export const primaryEvent: EventInfo =
  inviteKind === 'reception' ? RECEPTION : WEDDING
