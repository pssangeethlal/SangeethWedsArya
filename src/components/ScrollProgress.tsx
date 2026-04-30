import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

export function ScrollProgressTrack() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? scrolled / total : 0)
      setVisible(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setVisible(false), 1500)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [shouldReduceMotion])

  if (shouldReduceMotion) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center"
          style={{ height: 60 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden
        >
          {/* Track */}
          <div
            className="w-px rounded-full"
            style={{ height: 60, background: 'rgba(201,169,110,0.15)' }}
          >
            {/* Thumb */}
            <div
              className="w-px rounded-full bg-gold/50 transition-all duration-150"
              style={{ height: `${progress * 100}%` }}
            />
          </div>
          {/* Dot */}
          <div
            className="w-1.5 h-1.5 rounded-full bg-gold/60 mt-1 transition-all duration-150"
            style={{ marginTop: -6 + progress * 54 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ScrollIndicator() {
  const [visible, setVisible] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(false)
    window.addEventListener('scroll', onScroll, { once: true, passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (shouldReduceMotion) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <span className="font-body text-[9px] tracking-[0.38em] uppercase text-ink-soft/60">
            Scroll to explore
          </span>
          <motion.div
            style={{ color: 'rgba(201,169,110,0.65)' }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="1" x2="8" y2="13" stroke="currentColor" strokeWidth="1.2" />
              <polyline points="4,9 8,14 12,9" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function MapFAB({ mapUrl }: { mapUrl: string }) {
  return (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-white border border-gold/25 shadow-[0_4px_20px_rgba(58,47,42,0.15)] flex items-center justify-center text-gold transition-all duration-300 hover:bg-gold hover:text-ivory hover:shadow-[0_8px_28px_rgba(201,169,110,0.35)] hover:scale-[1.07] active:scale-95"
      aria-label="View venue on map"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 1.5C7.239 1.5 5 3.739 5 6.5c0 4 5 12 5 12s5-8 5-11.5c0-2.761-2.239-5-5-5z"/>
        <circle cx="10" cy="6.5" r="2"/>
      </svg>
    </a>
  )
}
