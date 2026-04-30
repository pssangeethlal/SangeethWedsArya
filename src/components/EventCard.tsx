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

// Elegant modal-style calendar chooser
function CalendarModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    // slight delay so the click that opened it doesn't immediately close it
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 50)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handler) }
  }, [onClose])

  const options = [
    {
      label: 'Google Calendar',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M1 6h14" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M5 1v2M11 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M8 9.5v2M7 10.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
      action: () => window.open(googleCalendarUrl(event), '_blank'),
    },
    {
      label: 'Outlook',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M1 6h14" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M5 1v2M11 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="8" cy="10" r="2" stroke="currentColor" strokeWidth="1.1"/>
        </svg>
      ),
      action: () => window.open(outlookCalendarUrl(event), '_blank'),
    },
    {
      label: 'Apple / iCal (.ics)',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M1 6h14" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M5 1v2M11 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M8 8v4M6 10l2 2 2-2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      action: () => { downloadICS(event); onClose() },
    },
  ]

  return (
    <motion.div
      ref={ref}
      className="absolute left-1/2 z-30"
      style={{ top: 'calc(100% + 16px)', transform: 'translateX(-50%)' }}
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Upward-pointing caret */}
      <div style={{
        position: 'absolute',
        top: -7,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderBottom: '7px solid rgba(201,169,110,0.35)',
      }} />
      <div style={{
        position: 'absolute',
        top: -5.5,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderBottom: '6px solid #FBF7F2',
      }} />

      {/* Panel */}
      <div style={{
        background: '#FBF7F2',
        border: '1px solid rgba(201,169,110,0.35)',
        borderRadius: 6,
        boxShadow: '0 8px 32px rgba(58,47,42,0.12), 0 2px 8px rgba(58,47,42,0.06)',
        overflow: 'hidden',
        minWidth: 200,
      }}>
        {/* Panel header */}
        <div style={{
          padding: '10px 16px 8px',
          borderBottom: '1px solid rgba(201,169,110,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 9,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--ink-soft)',
          }}>
            Add to calendar
          </span>
          <button
            onClick={onClose}
            style={{ color: 'var(--ink-soft)', lineHeight: 1, padding: 2, opacity: 0.6 }}
            aria-label="Close"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M1 1l10 10M11 1L1 11"/>
            </svg>
          </button>
        </div>

        {/* Options */}
        {options.map(({ label, icon, action }, i) => (
          <button
            key={label}
            onClick={() => { action(); onClose() }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '11px 16px',
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 15,
              fontWeight: 400,
              color: 'var(--ink)',
              background: 'transparent',
              borderBottom: i < options.length - 1 ? '1px solid rgba(201,169,110,0.12)' : 'none',
              transition: 'background 200ms ease',
              textAlign: 'left',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,169,110,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ color: 'var(--gold)', flexShrink: 0 }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// Info row with circular icon
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(201,169,110,0.15)',
      borderRadius: 14,
      padding: '12px 14px',
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'rgba(201,169,110,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, color: 'var(--gold)',
      }}>
        {icon}
      </span>
      <div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 9,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'rgba(107,93,84,0.65)', fontWeight: 600, marginBottom: 2,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 15, fontWeight: 400, color: 'var(--ink)',
        }}>
          {value}
        </div>
      </div>
    </div>
  )
}

// Circular button — gold fill active, white default
function ActionBtn({
  href, onClick, icon, label, active,
}: {
  href?: string; onClick?: () => void
  icon: React.ReactNode; label: string; active?: boolean
}) {
  const circleStyle: React.CSSProperties = {
    width: 56, height: 56, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 300ms ease',
    background: active ? 'var(--gold)' : 'white',
    color: active ? 'white' : 'var(--gold)',
    border: '1px solid rgba(201,169,110,0.3)',
    boxShadow: active
      ? '0 4px 16px rgba(201,169,110,0.4)'
      : '0 2px 8px rgba(58,47,42,0.1)',
  }
  const labelStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif', fontSize: 9,
    letterSpacing: '0.22em', textTransform: 'uppercase',
    color: 'var(--ink-soft)', fontWeight: 600, marginTop: 8,
  }

  const inner = (
    <>
      <div style={circleStyle}>{icon}</div>
      <div style={labelStyle}>{label}</div>
    </>
  )

  const wrapStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    cursor: 'pointer', background: 'none', border: 'none', padding: 0,
  }

  if (href) return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={wrapStyle}>{inner}</a>
  )
  return <button onClick={onClick} style={wrapStyle}>{inner}</button>
}

export default function EventCard({
  title, subtitle, date, time, venue, address, mapUrl, calEvent,
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
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(201,169,110,0.4) 4px, rgba(201,169,110,0.4) 5px)' }}
        aria-hidden
      />

      {/* Wedding rings */}
      <div className="flex justify-center mb-5" aria-hidden>
        <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
          <circle cx="23" cy="20" r="16" stroke="#C9A96E" strokeWidth="2" opacity="0.75"/>
          <circle cx="41" cy="20" r="16" stroke="#C9A96E" strokeWidth="2" opacity="0.75"/>
          <circle cx="23" cy="20" r="10" stroke="rgba(201,169,110,0.35)" strokeWidth="1"/>
          <circle cx="41" cy="20" r="10" stroke="rgba(201,169,110,0.35)" strokeWidth="1"/>
        </svg>
      </div>

      {subtitle && <p className="section-sub mb-2">{subtitle}</p>}
      <h2 className="section-heading mb-7">{title}</h2>

      {/* Info rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28, textAlign: 'left' }}>
        <InfoRow label="Date" value={date}
          icon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="2" width="13" height="12" rx="1.5"/><path d="M1 6h13M5 1v2M10 1v2"/></svg>}
        />
        <InfoRow label="Time" value={time}
          icon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="7.5" r="6"/><path d="M7.5 4v4l2.5 2"/></svg>}
        />
        <InfoRow label="Venue" value={address ? `${venue}, ${address}` : venue}
          icon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 1C5.015 1 3 3.015 3 5.5c0 3.5 4.5 8.5 4.5 8.5S12 9 12 5.5C12 3.015 9.985 1 7.5 1z"/><circle cx="7.5" cy="5.5" r="1.5"/></svg>}
        />
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <ActionBtn
            onClick={() => setCalOpen((v) => !v)}
            label="Add to Calendar"
            active={calOpen}
            icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="1.5" y="2.5" width="15" height="14" rx="2"/><path d="M1.5 7h15M6 1v3M12 1v3M9 10.5v3M7.5 12h3"/></svg>}
          />
          <AnimatePresence>
            {calOpen && <CalendarModal event={calEvent} onClose={() => setCalOpen(false)} />}
          </AnimatePresence>
        </div>

        <ActionBtn
          href={mapUrl}
          label="View Location"
          icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 1.5C6.515 1.5 4.5 3.515 4.5 6c0 4 4.5 10.5 4.5 10.5S13.5 10 13.5 6c0-2.485-2.015-4.5-4.5-4.5z"/><circle cx="9" cy="6" r="1.8"/></svg>}
        />
      </div>
    </motion.div>
  )
}
