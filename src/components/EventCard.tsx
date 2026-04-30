import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, ChevronDown } from 'lucide-react'
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
      className="absolute top-full left-0 mt-2 card-glass rounded-sm overflow-hidden z-20 min-w-[180px]"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
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
      className="relative card-glass rounded-sm max-w-lg mx-auto p-8 sm:p-12 text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundImage: `
          radial-gradient(ellipse at top left, rgba(232,197,192,0.15) 0%, transparent 60%),
          radial-gradient(ellipse at bottom right, rgba(168,181,160,0.1) 0%, transparent 60%)
        `,
      }}
    >
      {/* Deckle top border */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 4px, #C9A96E33 4px, #C9A96E33 5px)',
        }}
        aria-hidden
      />

      {subtitle && <p className="section-sub mb-3">{subtitle}</p>}
      <h2 className="section-heading mb-8">{title}</h2>

      <div className="flex flex-col gap-3 items-center text-ink-soft mb-10">
        <p className="font-display text-2xl font-light text-ink">{date}</p>
        <p className="font-body text-sm tracking-[0.2em]">{time}</p>
        <div className="w-8 border-t border-gold/40 my-1" aria-hidden />
        <p className="font-display text-xl text-ink">{venue}</p>
        {address && <p className="font-body text-sm text-ink-soft">{address}</p>}
      </div>

      <div className="flex items-center justify-center gap-4 flex-wrap">
        {/* Add to Calendar */}
        <div className="relative">
          <button
            className="btn-gold flex items-center gap-2"
            onClick={() => setCalOpen((v) => !v)}
            aria-expanded={calOpen}
            aria-haspopup="listbox"
          >
            <Calendar size={15} />
            Add to Calendar
            <ChevronDown size={14} className={`transition-transform ${calOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {calOpen && (
              <CalendarDropdown event={calEvent} onClose={() => setCalOpen(false)} />
            )}
          </AnimatePresence>
        </div>

        {/* View Location */}
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold flex items-center gap-2"
        >
          <MapPin size={15} />
          View Location
        </a>
      </div>
    </motion.div>
  )
}
