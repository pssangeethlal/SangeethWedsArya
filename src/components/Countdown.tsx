import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WEDDING_DATE = new Date('2026-08-23T05:30:00Z') // 11:00 AM IST

interface TimeLeft {
  days: number; hours: number; minutes: number; seconds: number
}

function getTimeLeft(): TimeLeft {
  const diff = WEDDING_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function Digit({ value, label, pulse }: { value: number; label: string; pulse?: boolean }) {
  const str = String(value).padStart(2, '0')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        position: 'relative',
        width: 102,
        padding: '20px 0',
        textAlign: 'center',
        background: 'linear-gradient(160deg, rgba(255,244,220,0.55) 0%, rgba(232,210,154,0.18) 100%)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(201,162,75,0.45)',
        borderRadius: 10,
        boxShadow: '0 8px 28px -8px rgba(110,31,43,0.18), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -8px 18px rgba(232,210,154,0.18)',
        overflow: 'hidden',
      }}>
        {/* corner gold ticks */}
        <span style={cornerStyle('top', 'left')} />
        <span style={cornerStyle('top', 'right')} />
        <span style={cornerStyle('bottom', 'left')} />
        <span style={cornerStyle('bottom', 'right')} />

        {pulse && (
          <motion.div
            style={{ position: 'absolute', inset: 0, borderRadius: 10, pointerEvents: 'none' }}
            animate={{ boxShadow: [
              '0 0 0px rgba(201,162,75,0)',
              '0 0 22px rgba(232,210,154,0.45)',
              '0 0 0px rgba(201,162,75,0)',
            ]}}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={str}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'Marcellus, serif',
              fontSize: 44,
              lineHeight: 1,
              color: 'var(--maroon)',
              fontFeatureSettings: '"tnum", "lnum", "kern"',
              fontVariantNumeric: 'tabular-nums lining-nums',
              letterSpacing: '0.04em',
              display: 'block',
              textShadow: '0 1px 0 rgba(255,255,255,0.6)',
            }}
          >
            {str}
          </motion.span>
        </AnimatePresence>
      </div>

      <span style={{
        fontFamily: 'Marcellus, serif',
        fontSize: 10,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'var(--ink-soft)',
        marginTop: 12,
        display: 'block',
      }}>
        {label}
      </span>
    </div>
  )
}

function cornerStyle(v: 'top' | 'bottom', h: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    [v]: 4, [h]: 4,
    width: 8, height: 8,
    borderTop: v === 'top' ? '1px solid rgba(168,132,47,0.7)' : 'none',
    borderBottom: v === 'bottom' ? '1px solid rgba(168,132,47,0.7)' : 'none',
    borderLeft: h === 'left' ? '1px solid rgba(168,132,47,0.7)' : 'none',
    borderRight: h === 'right' ? '1px solid rgba(168,132,47,0.7)' : 'none',
  } as React.CSSProperties
}

const SEP: React.CSSProperties = {
  fontFamily: '"Cormorant Garamond", serif',
  fontSize: 26,
  color: 'rgba(168,132,47,0.7)',
  fontWeight: 300,
  lineHeight: 1,
  flexShrink: 0,
  marginBottom: 30,
}

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft>(getTimeLeft())

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{ padding: '96px 16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Faint mandala backdrop */}
      <div
        className="mandala-bg"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 560,
          height: 560,
          marginLeft: -280,
          marginTop: -280,
          opacity: 0.5,
          pointerEvents: 'none',
        }}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative' }}
      >
        <p className="section-sub" style={{ marginBottom: 14 }}>Until forever begins</p>
        <h2 className="section-heading-script gold-foil" style={{ marginBottom: 8 }}>Counting down</h2>
        <p className="font-display italic text-ink-soft text-lg" style={{ marginBottom: 48 }}>to forever</p>

        {/* Single row on desktop, 2×2 on mobile */}
        <div className="countdown-wrapper">
          <div className="countdown-row">
            <Digit value={time.days}    label="Days" />
            <span style={SEP} aria-hidden>·</span>
            <Digit value={time.hours}   label="Hours" />
          </div>
          <div className="countdown-row">
            <Digit value={time.minutes} label="Minutes" />
            <span style={SEP} aria-hidden>·</span>
            <Digit value={time.seconds} label="Seconds" pulse />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
