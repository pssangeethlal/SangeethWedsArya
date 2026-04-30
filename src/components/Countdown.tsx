import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const WEDDING_DATE = new Date('2026-08-23T05:30:00Z') // 11:00 AM IST = 05:30 UTC

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

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="card-glass rounded-sm p-6 sm:p-8 text-center min-w-[72px] sm:min-w-[100px]">
      <motion.span
        key={value}
        className="font-display text-4xl sm:text-6xl font-light text-ink block"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="font-body text-xs text-ink-soft tracking-[0.25em] uppercase mt-2 block">
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
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-sub mb-4">Until forever begins</p>
        <h2 className="section-heading mb-12">Counting down to forever</h2>

        <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
          <Digit value={time.days} label="Days" />
          <span className="font-display text-3xl text-gold font-light self-start mt-6" aria-hidden>:</span>
          <Digit value={time.hours} label="Hours" />
          <span className="font-display text-3xl text-gold font-light self-start mt-6" aria-hidden>:</span>
          <Digit value={time.minutes} label="Minutes" />
          <span className="font-display text-3xl text-gold font-light self-start mt-6" aria-hidden>:</span>
          <Digit value={time.seconds} label="Seconds" />
        </div>
      </motion.div>
    </section>
  )
}
