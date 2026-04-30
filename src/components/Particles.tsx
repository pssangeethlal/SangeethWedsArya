import { useRef } from 'react'
import { motion } from 'framer-motion'

const PETAL_COUNT = 10

interface Petal {
  id: number
  x: number
  delay: number
  duration: number
  size: number
  rotate: number
}

export default function Particles() {
  const petals = useRef<Petal[]>(
    Array.from({ length: PETAL_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 8,
      size: 4 + Math.random() * 8,
      rotate: Math.random() * 360,
    }))
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {petals.current.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '-20px',
            width: p.size,
            height: p.size * 0.6,
            background: `radial-gradient(ellipse, rgba(232,197,192,0.6) 0%, rgba(201,169,110,0.3) 100%)`,
            borderRadius: '50% 50% 50% 0',
            rotate: p.rotate,
          }}
          animate={{
            y: [0, -window.innerHeight - 40],
            x: [0, (Math.random() - 0.5) * 120],
            rotate: [p.rotate, p.rotate + 180],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
