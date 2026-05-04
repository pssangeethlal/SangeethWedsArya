import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface Spark {
  id: number
  x: number
  y: number
  size: number
  color: string
  isPetal: boolean
}

const COLORS = ['#F2C76A', '#E8D29A', '#E0A33D', '#E8C5C0']

export default function CursorTrail() {
  const reduced = useReducedMotion() ?? false
  const [sparks, setSparks] = useState<Spark[]>([])
  const idRef = useRef(0)
  const lastEmitRef = useRef(0)
  const isTouchRef = useRef(false)

  useEffect(() => {
    if (reduced) return
    isTouchRef.current = window.matchMedia('(pointer: coarse)').matches
    if (isTouchRef.current) return

    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastEmitRef.current < 38) return
      lastEmitRef.current = now

      const isPetal = Math.random() < 0.12
      const size = isPetal ? 9 + Math.random() * 6 : 3 + Math.random() * 3
      const id = idRef.current++
      const newSpark: Spark = {
        id,
        x: e.clientX + (Math.random() - 0.5) * 8,
        y: e.clientY + (Math.random() - 0.5) * 8,
        size,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        isPetal,
      }
      setSparks((prev) => [...prev.slice(-22), newSpark])

      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== id))
      }, isPetal ? 1400 : 800)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced])

  if (reduced) return null

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 70 }} aria-hidden>
      <AnimatePresence>
        {sparks.map((s) => (
          <motion.div
            key={s.id}
            style={{
              position: 'absolute',
              left: s.x - s.size / 2,
              top: s.y - s.size / 2,
              width: s.size,
              height: s.size * (s.isPetal ? 1.4 : 1),
              borderRadius: s.isPetal ? '50% 50% 50% 50% / 60% 60% 40% 40%' : '50%',
              background: s.isPetal
                ? `radial-gradient(ellipse at 35% 30%, ${s.color}, ${s.color}80 70%, transparent)`
                : `radial-gradient(circle, ${s.color} 0%, transparent 70%)`,
              boxShadow: `0 0 ${s.isPetal ? 6 : 8}px ${s.color}`,
            }}
            initial={{ opacity: 0.85, scale: 0.6, rotate: 0 }}
            animate={{
              opacity: 0,
              scale: s.isPetal ? 1.2 : 1.6,
              y: s.isPetal ? 30 : -10,
              rotate: s.isPetal ? 180 : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: s.isPetal ? 1.4 : 0.8, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
