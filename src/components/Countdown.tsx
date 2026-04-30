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

// Responsive font size — stays in one row on mobile
const FS = 44

function Digit({ value, label, pulse }: { value: number; label: string; pulse?: boolean }) {
  const str = String(value).padStart(2, '0')

  return (
    <div className="flex flex-col items-center">
      {/* Outer gold border */}
      <div style={{
        padding: 1,
        background: 'rgba(201,169,110,0.45)',
        borderRadius: 5,
      }}>
        {/* Ivory gap */}
        <div style={{ padding: 3, background: 'var(--ivory)', borderRadius: 4 }}>
          {/* Inner gold border + content */}
          <div style={{
            border: '1px solid rgba(201,169,110,0.28)',
            borderRadius: 3,
            padding: '18px 20px 14px',
            minWidth: 72,
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(160deg, rgba(255,244,236,0.6) 0%, transparent 100%)',
          }}>
            {/* Flip container — fixed height in px so no 1lh ambiguity */}
            <div style={{ position: 'relative', height: FS, overflow: 'hidden' }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={str}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: FS,
                    lineHeight: 1,
                    fontFamily: '"Cormorant Garamond", serif',
                    fontWeight: 300,
                    color: 'var(--ink)',
                    // Override global onum — use lining tabular numerals
                    fontFeatureSettings: '"tnum", "lnum", "kern"',
                    fontVariantNumeric: 'tabular-nums lining-nums',
                  }}
                  initial={{ y: FS, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -FS, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {str}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Seconds pulse glow */}
            {pulse && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ borderRadius: 3 }}
                animate={{ boxShadow: [
                  '0 0 0px rgba(201,169,110,0)',
                  '0 0 16px rgba(201,169,110,0.32)',
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
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: 'var(--ink-soft)',
        marginTop: 10,
      }}>
        {label}
      </span>
    </div>
  )
}

function Separator() {
  return (
    <span style={{
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 28,
      color: 'rgba(201,169,110,0.45)',
      fontWeight: 300,
      lineHeight: 1,
      marginTop: FS * 0.5 - 4, // vertically align with digit midpoint
      flexShrink: 0,
    }} aria-hidden>
      ·
    </span>
  )
}

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft>(getTimeLeft())

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="py-24 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-sub mb-4">Until forever begins</p>
        <h2 className="section-heading mb-12">Counting down to forever</h2>

        {/* Single row always — px values, no wrapping */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 8,
          flexWrap: 'nowrap',
        }}>
          <Digit value={time.days} label="Days" />
          <Separator />
          <Digit value={time.hours} label="Hours" />
          <Separator />
          <Digit value={time.minutes} label="Minutes" />
          <Separator />
          <Digit value={time.seconds} label="Seconds" pulse />
        </div>
      </motion.div>
    </section>
  )
}
