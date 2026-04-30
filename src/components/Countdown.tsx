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

const FONT_SIZE = 56 // px — explicit size so 'em' resolves correctly

function Digit({ value, label, pulse }: { value: number; label: string; pulse?: boolean }) {
  const str = String(value).padStart(2, '0')

  return (
    <div className="text-center">
      {/* Double gold border: outer → ivory gap → inner */}
      <div style={{ padding: 1, background: 'rgba(201,169,110,0.4)', borderRadius: 4, display: 'inline-block' }}>
        <div style={{ padding: 3, background: 'var(--ivory)', borderRadius: 3 }}>
          <div
            style={{
              border: '1px solid rgba(201,169,110,0.3)',
              borderRadius: 2,
              padding: '22px 26px 18px',
              minWidth: 82,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Fixed-height flip container */}
            <div
              style={{
                position: 'relative',
                height: FONT_SIZE,
                overflow: 'hidden',
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={str}
                  className="font-display font-light text-ink"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: FONT_SIZE,
                    lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                  initial={{ y: FONT_SIZE, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -FONT_SIZE, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {str}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Seconds pulse glow */}
            {pulse && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ borderRadius: 2 }}
                animate={{
                  boxShadow: [
                    '0 0 0px rgba(201,169,110,0)',
                    '0 0 14px rgba(201,169,110,0.28)',
                    '0 0 0px rgba(201,169,110,0)',
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
        </div>
      </div>

      <span className="font-body text-[10px] text-ink-soft tracking-[0.28em] uppercase mt-2.5 block">
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
    <section className="py-24 px-6 text-center">
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
          <span className="font-display text-2xl text-gold/50 font-light mt-10" aria-hidden>·</span>
          <Digit value={time.hours} label="Hours" />
          <span className="font-display text-2xl text-gold/50 font-light mt-10" aria-hidden>·</span>
          <Digit value={time.minutes} label="Minutes" />
          <span className="font-display text-2xl text-gold/50 font-light mt-10" aria-hidden>·</span>
          <Digit value={time.seconds} label="Seconds" pulse />
        </div>
      </motion.div>
    </section>
  )
}
