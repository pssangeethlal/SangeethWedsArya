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

// Font size for the digits — small enough to always fit in one row on 375px mobile
// Card total width ≈ FS*1.8 + padding; 4 cards + 3 separators must fit in ~320px
const FS = 36        // digit font size px
const CARD_H = 52    // inner clip height — larger than FS to fully contain ascenders

function Digit({ value, label, pulse }: { value: number; label: string; pulse?: boolean }) {
  const str = String(value).padStart(2, '0')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Outer gold line */}
      <div style={{
        padding: 1,
        background: 'rgba(201,169,110,0.45)',
        borderRadius: 5,
      }}>
        {/* Ivory gap */}
        <div style={{ padding: 3, background: 'var(--ivory)', borderRadius: 4 }}>
          {/* Inner line + content */}
          <div style={{
            border: '1px solid rgba(201,169,110,0.25)',
            borderRadius: 3,
            // Generous padding so digits never touch the border
            padding: '14px 18px 12px',
            // Wide enough for two digits at FS with comfortable margin
            minWidth: Math.ceil(FS * 1.9),
            position: 'relative',
            background: 'linear-gradient(160deg,rgba(255,244,236,0.5) 0%,transparent 100%)',
          }}>
            {/* Clip window — taller than FS to hold Cormorant's tall ascenders */}
            <div style={{ position: 'relative', height: CARD_H, overflow: 'hidden' }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={str}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // Fully explicit — inherited nothing from body
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: FS,
                    fontWeight: 300,
                    lineHeight: 1,
                    color: 'var(--ink)',
                    fontFeatureSettings: '"tnum", "lnum", "kern"',
                    fontVariantNumeric: 'tabular-nums lining-nums',
                    letterSpacing: '0.04em',
                  }}
                  initial={{ y: CARD_H, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -CARD_H, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {str}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Seconds pulse */}
            {pulse && (
              <motion.div
                style={{
                  position: 'absolute', inset: 0, borderRadius: 3, pointerEvents: 'none',
                }}
                animate={{ boxShadow: [
                  '0 0 0px rgba(201,169,110,0)',
                  '0 0 14px rgba(201,169,110,0.28)',
                  '0 0 0px rgba(201,169,110,0)',
                ]}}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
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

        {/* nowrap — always one row; gap scales with screen */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 'clamp(4px, 1.5vw, 16px)',
          flexWrap: 'nowrap',
        }}>
          <Digit value={time.days}    label="Days" />

          <span style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 24,
            color: 'rgba(201,169,110,0.45)',
            fontWeight: 300,
            lineHeight: 1,
            // Align vertically to the middle of the card area
            marginTop: 14 + (CARD_H - 24) / 2,
            flexShrink: 0,
          }} aria-hidden>·</span>

          <Digit value={time.hours}   label="Hours" />

          <span style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 24,
            color: 'rgba(201,169,110,0.45)',
            fontWeight: 300,
            lineHeight: 1,
            marginTop: 14 + (CARD_H - 24) / 2,
            flexShrink: 0,
          }} aria-hidden>·</span>

          <Digit value={time.minutes} label="Minutes" />

          <span style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 24,
            color: 'rgba(201,169,110,0.45)',
            fontWeight: 300,
            lineHeight: 1,
            marginTop: 14 + (CARD_H - 24) / 2,
            flexShrink: 0,
          }} aria-hidden>·</span>

          <Digit value={time.seconds} label="Seconds" pulse />
        </div>
      </motion.div>
    </section>
  )
}
