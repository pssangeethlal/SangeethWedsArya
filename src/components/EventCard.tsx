import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { googleCalendarUrl, outlookCalendarUrl, downloadICS } from '../lib/calendar'
import type { CalendarEvent } from '../lib/calendar'

interface EventCardProps {
  title: string
  subtitle?: string
  date: string
  time: string
  venue: string
  address?: string
  mapUrl: string
  calEvent: CalendarEvent
}

function CalendarDropdown({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <motion.div
      ref={ref}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 card-glass rounded-sm overflow-hidden z-20 min-w-[190px] shadow-lg"
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.18 }}
    >
      {[
        { label: 'Google Calendar', href: googleCalendarUrl(event) },
        { label: 'Outlook', href: outlookCalendarUrl(event) },
      ].map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block px-5 py-3 font-body text-sm text-ink hover:bg-gold/10 transition-colors border-b border-gold/10 last:border-0"
          onClick={onClose}
        >
          {label}
        </a>
      ))}
      <button
        className="block w-full text-left px-5 py-3 font-body text-sm text-ink hover:bg-gold/10 transition-colors"
        onClick={() => { downloadICS(event); onClose() }}
      >
        Apple / iCal (.ics)
      </button>
    </motion.div>
  )
}

// Info row with circular icon
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-gold/15 rounded-2xl px-4 py-3.5 shadow-sm text-left">
      <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 text-gold">
        {icon}
      </span>
      <div>
        <div className="font-body text-[9px] tracking-[0.32em] uppercase text-ink-soft/70 font-semibold mb-0.5">{label}</div>
        <div className="font-display text-[15px] font-light text-ink">{value}</div>
      </div>
    </div>
  )
}

// Circular action button with color inversion on hover
function ActionBtn({
  href,
  onClick,
  icon,
  label,
}: {
  href?: string
  onClick?: () => void
  icon: React.ReactNode
  label: string
}) {
  const cls = 'flex flex-col items-center gap-2 group cursor-pointer'
  const inner = (
    <>
      <span className="w-14 h-14 rounded-full bg-white border border-gold/25 shadow-md flex items-center justify-center text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-ivory group-hover:shadow-[0_6px_20px_rgba(201,169,110,0.35)] group-active:scale-95">
        {icon}
      </span>
      <span className="font-body text-[9px] tracking-[0.22em] uppercase text-ink-soft font-semibold opacity-80">
        {label}
      </span>
    </>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    )
  }
  return (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}

export default function EventCard({
  title,
  subtitle,
  date,
  time,
  venue,
  address,
  mapUrl,
  calEvent,
}: EventCardProps) {
  const [calOpen, setCalOpen] = useState(false)

  return (
    <motion.div
      className="relative card-glass rounded-sm max-w-md mx-auto p-8 sm:p-10 text-center"
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundImage: `
          radial-gradient(ellipse at top left, rgba(232,197,192,0.12) 0%, transparent 60%),
          radial-gradient(ellipse at bottom right, rgba(168,181,160,0.08) 0%, transparent 60%)
        `,
      }}
    >
      {/* Deckle top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(201,169,110,0.4) 4px, rgba(201,169,110,0.4) 5px)' }}
        aria-hidden
      />

      {/* Wedding rings SVG */}
      <div className="flex justify-center mb-5" aria-hidden>
        <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
          <circle cx="23" cy="20" r="16" stroke="#C9A96E" strokeWidth="2" opacity="0.8"/>
          <circle cx="41" cy="20" r="16" stroke="#C9A96E" strokeWidth="2" opacity="0.8"/>
          <circle cx="23" cy="20" r="10" stroke="rgba(201,169,110,0.4)" strokeWidth="1" />
          <circle cx="41" cy="20" r="10" stroke="rgba(201,169,110,0.4)" strokeWidth="1" />
        </svg>
      </div>

      {subtitle && <p className="section-sub mb-2">{subtitle}</p>}
      <h2 className="section-heading mb-7">{title}</h2>

      {/* Info rows */}
      <div className="flex flex-col gap-2.5 mb-8 text-left">
        <InfoRow
          label="Date"
          value={date}
          icon={
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="2" width="13" height="12" rx="1.5"/>
              <path d="M1 6h13M5 1v2M10 1v2"/>
            </svg>
          }
        />
        <InfoRow
          label="Time"
          value={time}
          icon={
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7.5" cy="7.5" r="6"/>
              <path d="M7.5 4v4l2.5 2"/>
            </svg>
          }
        />
        <InfoRow
          label="Venue"
          value={address ? `${venue}, ${address}` : venue}
          icon={
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.5 1C5.015 1 3 3.015 3 5.5c0 3.5 4.5 8.5 4.5 8.5S12 9 12 5.5C12 3.015 9.985 1 7.5 1z"/>
              <circle cx="7.5" cy="5.5" r="1.5"/>
            </svg>
          }
        />
      </div>

      {/* Circular action buttons */}
      <div className="flex items-center justify-center gap-8 relative">
        <div className="relative">
          <ActionBtn
            onClick={() => setCalOpen((v) => !v)}
            label="Add to Calendar"
            icon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1.5" y="2.5" width="15" height="14" rx="2"/>
                <path d="M1.5 7h15M6 1v3M12 1v3M9 10.5v3M7.5 12h3"/>
              </svg>
            }
          />
          <AnimatePresence>
            {calOpen && <CalendarDropdown event={calEvent} onClose={() => setCalOpen(false)} />}
          </AnimatePresence>
        </div>

        <ActionBtn
          href={mapUrl}
          label="View Location"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 1.5C6.515 1.5 4.5 3.515 4.5 6c0 4 4.5 10.5 4.5 10.5S13.5 10 13.5 6c0-2.485-2.015-4.5-4.5-4.5z"/>
              <circle cx="9" cy="6" r="1.8"/>
            </svg>
          }
        />
      </div>
    </motion.div>
  )
}
