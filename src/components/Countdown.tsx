import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

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
      {/* Outer gold border */}
      <div style={{
        padding: 1,
        background: 'rgba(201,169,110,0.45)',
        borderRadius: 6,
      }}>
        {/* Ivory gap */}
        <div style={{ padding: 3, background: 'var(--ivory)', borderRadius: 5 }}>
          {/* Inner box */}
          <div style={{
            border: '1px solid rgba(201,169,110,0.25)',
            borderRadius: 4,
            padding: '14px 20px',
            minWidth: 72,
            textAlign: 'center',
            background: 'linear-gradient(160deg, rgba(255,244,236,0.5) 0%, transparent 100%)',
            position: 'relative',
          }}>
            {pulse && (
              <motion.div
                style={{ position: 'absolute', inset: 0, borderRadius: 4, pointerEvents: 'none' }}
                animate={{ boxShadow: [
                  '0 0 0px rgba(201,169,110,0)',
                  '0 0 14px rgba(201,169,110,0.28)',
                  '0 0 0px rgba(201,169,110,0)',
                ]}}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <span style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 40,
              fontWeight: 300,
              lineHeight: 1,
              color: 'var(--ink)',
              fontFeatureSettings: '"tnum", "lnum", "kern"',
              fontVariantNumeric: 'tabular-nums lining-nums',
              letterSpacing: '0.04em',
              display: 'block',
            }}>
              {str}
            </span>
          </div>
        </div>
      </div>

      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 9,
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        color: 'var(--ink-soft)',
        marginTop: 10,
        display: 'block',
      }}>
        {label}
      </span>
    </div>
  )
}

const SEP: React.CSSProperties = {
  fontFamily: '"Cormorant Garamond", serif',
  fontSize: 24,
  color: 'rgba(201,169,110,0.45)',
  fontWeight: 300,
  lineHeight: 1,
  flexShrink: 0,
  marginBottom: 24, // space for label below digit
}

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft>(getTimeLeft())

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{ padding: '96px 16px', textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-sub" style={{ marginBottom: 16 }}>Until forever begins</p>
        <h2 className="section-heading" style={{ marginBottom: 48 }}>Counting down to forever</h2>

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
