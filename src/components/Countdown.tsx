import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WEDDING_DATE = new Date('2026-08-23T05:30:00Z') // 11:00 AM IST

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
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
    <div
      className="relative text-center"
      style={{
        // Double gold border: outer 1px, gap 3px, inner 1px
        padding: '2px',
        background: 'rgba(201,169,110,0.35)',
        borderRadius: 4,
      }}
    >
      {/* Gap layer */}
      <div
        style={{
          padding: '3px',
          background: 'var(--ivory)',
          borderRadius: 3,
        }}
      >
        {/* Inner border */}
        <div
          style={{
            border: '1px solid rgba(201,169,110,0.35)',
            borderRadius: 2,
            padding: '24px 28px 20px',
            minWidth: 80,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Digit flip */}
          <div style={{ height: '1lh', overflow: 'hidden', position: 'relative' }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={str}
                className="font-display font-light text-ink block text-center"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                  display: 'block',
                }}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {str}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Seconds pulse glow */}
          {pulse && (
            <motion.div
              className="absolute inset-0 rounded-sm pointer-events-none"
              animate={{ boxShadow: ['0 0 0px rgba(201,169,110,0)', '0 0 14px rgba(201,169,110,0.3)', '0 0 0px rgba(201,169,110,0)'] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </div>
      </div>

      <span className="font-body text-[10px] text-ink-soft tracking-[0.28em] uppercase mt-2 block">
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
    <section className="py-24 px-6 bg-ivory text-center">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-sub mb-4">Until forever begins</p>
        <h2 className="section-heading mb-12">Counting down to forever</h2>

        <div className="flex items-start justify-center gap-3 sm:gap-5 flex-wrap">
          <Digit value={time.days} label="Days" />
          <span className="font-display text-3xl text-gold/60 font-light mt-8" aria-hidden>·</span>
          <Digit value={time.hours} label="Hours" />
          <span className="font-display text-3xl text-gold/60 font-light mt-8" aria-hidden>·</span>
          <Digit value={time.minutes} label="Minutes" />
          <span className="font-display text-3xl text-gold/60 font-light mt-8" aria-hidden>·</span>
          <Digit value={time.seconds} label="Seconds" pulse />
        </div>
      </motion.div>
    </section>
  )
}
