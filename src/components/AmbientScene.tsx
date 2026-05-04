import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

const PETAL_COLORS = [
  { fill: '#E0A33D', glow: '#F2C76A' },  // marigold
  { fill: '#E8C5C0', glow: '#F4DAD6' },  // blush
  { fill: '#B07A75', glow: '#D4A5A0' },  // rose
  { fill: '#FAF3E7', glow: '#FFFBEF' },  // cream
]

function PetalSVG({ color, glow }: { color: string; glow: string }) {
  return (
    <svg viewBox="0 0 20 28" width="20" height="28">
      <defs>
        <radialGradient id={`g-${color}`} cx="40%" cy="30%">
          <stop offset="0%" stopColor={glow} />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <path
        d="M10 1 C 16 6, 19 14, 14 24 C 12 26, 8 26, 6 24 C 1 14, 4 6, 10 1 Z"
        fill={`url(#g-${color})`}
        opacity="0.85"
      />
    </svg>
  )
}

export default function AmbientScene({ active = true }: { active?: boolean }) {
  const reduced = useReducedMotion() ?? false

  const dustParticles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: rand(i) * 100,
        size: 1.5 + rand(i + 100) * 2.5,
        duration: 14 + rand(i + 200) * 12,
        delay: rand(i + 300) * 10,
        sway: 30 + rand(i + 400) * 50,
        opacity: 0.18 + rand(i + 500) * 0.25,
      })),
    []
  )

  const petals = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: rand(i + 1000) * 100,
        size: 14 + rand(i + 1100) * 14,
        duration: 18 + rand(i + 1200) * 14,
        delay: rand(i + 1300) * 18,
        rotation: 360 + rand(i + 1400) * 720,
        sway: 80 + rand(i + 1500) * 120,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
      })),
    []
  )

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
      aria-hidden
    >
      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(110,31,43,0.06) 100%)',
        }}
      />

      {!reduced && active && (
        <>
          {/* Gold dust */}
          {dustParticles.map((d) => (
            <motion.div
              key={`dust-${d.id}`}
              style={{
                position: 'absolute',
                left: `${d.left}%`,
                bottom: -20,
                width: d.size,
                height: d.size,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #F2C76A 0%, rgba(242,199,106,0) 70%)',
                opacity: d.opacity,
                boxShadow: '0 0 6px rgba(232,210,154,0.6)',
              }}
              animate={{
                y: [0, -window.innerHeight - 40],
                x: [0, d.sway, -d.sway / 2, d.sway / 3, 0],
                opacity: [0, d.opacity, d.opacity, 0],
              }}
              transition={{
                duration: d.duration,
                delay: d.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Drifting petals */}
          {petals.map((p) => (
            <motion.div
              key={`petal-${p.id}`}
              style={{
                position: 'absolute',
                left: `${p.left}%`,
                top: -40,
                width: p.size,
                height: p.size * 1.4,
                filter: 'drop-shadow(0 2px 4px rgba(110,31,43,0.15))',
              }}
              animate={{
                y: [0, window.innerHeight + 80],
                x: [0, p.sway, -p.sway / 1.5, p.sway / 2, 0],
                rotate: [0, p.rotation],
                opacity: [0, 0.85, 0.85, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <PetalSVG color={p.color.fill} glow={p.color.glow} />
            </motion.div>
          ))}
        </>
      )}
    </div>
  )
}
