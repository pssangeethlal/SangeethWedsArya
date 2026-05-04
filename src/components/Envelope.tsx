import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface EnvelopeProps {
  onOpen: () => void
}

type Phase = 'idle' | 'pressing' | 'cracking' | 'flapping' | 'sliding' | 'inkWriting' | 'petals' | 'done'

const ENV_W = 460
const ENV_H = 300

function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

const PETAL_COLORS = ['#E0A33D', '#F2C76A', '#E8C5C0', '#B07A75', '#C9A24B', '#FAF3E7']

const petalsBurst = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  angle: (i / 32) * 360 + rand(i) * 22,
  distance: 140 + rand(i + 10) * 240,
  size: 8 + rand(i + 20) * 10,
  duration: 2.6 + rand(i + 30) * 2.4,
  delay: rand(i + 40) * 0.5,
  drift: (rand(i + 50) - 0.5) * 80,
  rotation: rand(i + 60) * 720 - 360,
  color: PETAL_COLORS[i % PETAL_COLORS.length],
  shape: i % 3,
}))

const shards = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  angle: (i / 6) * 360 + rand(i + 100) * 30,
  dist: 38 + rand(i + 110) * 60,
  rot: rand(i + 120) * 540 - 270,
  size: 9 + rand(i + 130) * 6,
}))

const dust = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 8 + rand(i + 200) * 84,
  y: 60 + rand(i + 210) * 30,
  size: 1.5 + rand(i + 220) * 2,
  duration: 8 + rand(i + 230) * 6,
  delay: rand(i + 240) * 5,
}))

function Petal({ p, scaleMul = 1 }: { p: typeof petalsBurst[number]; scaleMul?: number }) {
  const rad = (p.angle * Math.PI) / 180
  const tx = Math.cos(rad) * p.distance + p.drift
  const ty = Math.sin(rad) * p.distance + p.distance * 0.4
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: p.size * scaleMul,
        height: p.size * scaleMul * 1.4,
        marginLeft: -(p.size * scaleMul) / 2,
        marginTop: -(p.size * scaleMul) / 2,
        background: `radial-gradient(ellipse at 35% 30%, ${p.color}, ${p.color}cc 65%, transparent 100%)`,
        borderRadius: p.shape === 0 ? '50% 50% 50% 50% / 60% 60% 40% 40%' : p.shape === 1 ? '40% 60% 50% 50%' : '50%',
        boxShadow: `0 0 6px ${p.color}66`,
        pointerEvents: 'none',
      }}
      initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.4 }}
      animate={{
        x: tx,
        y: ty,
        opacity: [0, 1, 1, 0],
        rotate: p.rotation,
        scale: [0.4, 1, 1, 0.7],
      }}
      transition={{
        duration: p.duration,
        delay: p.delay,
        ease: [0.16, 1, 0.3, 1],
        times: [0, 0.15, 0.7, 1],
      }}
    />
  )
}

function WaxSeal({ phase, parallax }: { phase: Phase; parallax: { x: number; y: number } }) {
  const cracked = phase === 'cracking' || phase === 'flapping' || phase === 'sliding' || phase === 'inkWriting' || phase === 'petals' || phase === 'done'
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '52%',
        width: 92,
        height: 92,
        marginLeft: -46,
        marginTop: -46,
        zIndex: 26,
        transform: `translate(${parallax.x * 0.4}px, ${parallax.y * 0.4}px)`,
        transition: 'transform 220ms ease-out',
      }}
    >
      {/* Glow ring on idle */}
      {phase === 'idle' && (
        <motion.div
          style={{
            position: 'absolute',
            inset: -14,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,162,75,0.35) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Wax seal — left half */}
      <motion.div
        style={{ position: 'absolute', inset: 0, transformOrigin: 'right center' }}
        animate={cracked ? { x: -shards[0].dist, y: 22, rotate: -50, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.5, 0, 0.7, 1] }}
      >
        <svg viewBox="0 0 92 92" width="92" height="92" style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id="waxL" cx="38%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#C8443B" />
              <stop offset="55%" stopColor="#8E1F26" />
              <stop offset="100%" stopColor="#4A0F14" />
            </radialGradient>
            <filter id="waxBevel">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
          </defs>
          <clipPath id="leftHalf">
            <rect x="0" y="0" width="46" height="92" />
          </clipPath>
          <g clipPath="url(#leftHalf)">
            {/* Irregular blob shape */}
            <path
              d="M46,8 C28,8 12,22 8,42 C6,56 14,76 28,84 C36,88 46,86 46,86 Z"
              fill="url(#waxL)"
            />
            {/* Highlight */}
            <path
              d="M22,22 C16,28 14,38 18,46"
              stroke="rgba(255,180,160,0.35)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              filter="url(#waxBevel)"
            />
          </g>
        </svg>
      </motion.div>

      {/* Wax seal — right half */}
      <motion.div
        style={{ position: 'absolute', inset: 0, transformOrigin: 'left center' }}
        animate={cracked ? { x: shards[1].dist, y: 22, rotate: 50, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.5, 0, 0.7, 1] }}
      >
        <svg viewBox="0 0 92 92" width="92" height="92" style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id="waxR" cx="38%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#C8443B" />
              <stop offset="55%" stopColor="#8E1F26" />
              <stop offset="100%" stopColor="#4A0F14" />
            </radialGradient>
          </defs>
          <clipPath id="rightHalf">
            <rect x="46" y="0" width="46" height="92" />
          </clipPath>
          <g clipPath="url(#rightHalf)">
            <path
              d="M46,8 C64,8 80,22 84,42 C86,56 78,76 64,84 C56,88 46,86 46,86 Z"
              fill="url(#waxR)"
            />
            <path
              d="M70,22 C76,28 78,38 74,46"
              stroke="rgba(60,0,8,0.45)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </motion.div>

      {/* Monogram on top */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
        animate={cracked ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span
          className="gold-foil"
          style={{
            fontFamily: '"Pinyon Script", cursive',
            fontSize: 38,
            lineHeight: 1,
            transform: 'translateY(2px)',
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))',
          }}
        >
          S&amp;A
        </span>
      </motion.div>

      {/* Shards burst on crack */}
      {cracked && shards.slice(2).map((s) => {
        const rad = (s.angle * Math.PI) / 180
        const tx = Math.cos(rad) * s.dist
        const ty = Math.sin(rad) * s.dist + 30
        return (
          <motion.div
            key={s.id}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: s.size,
              height: s.size * 0.8,
              marginLeft: -s.size / 2,
              marginTop: -s.size / 2,
              background: 'radial-gradient(circle at 30% 30%, #C8443B, #4A0F14)',
              borderRadius: '40% 60% 50% 50%',
              pointerEvents: 'none',
            }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: tx, y: ty, opacity: 0, rotate: s.rot }}
            transition={{ duration: 0.9, ease: [0.5, 0, 0.7, 1] }}
          />
        )
      })}

      {/* Crack flash */}
      {cracked && (
        <motion.div
          style={{
            position: 'absolute',
            inset: -20,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,220,140,0.9) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 1, 0], scale: [0.3, 1.4, 1.6] }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      )}
    </div>
  )
}

function LetterCard({ phase, reduced }: { phase: Phase; reduced: boolean }) {
  const visible = phase === 'sliding' || phase === 'inkWriting' || phase === 'petals'
  const inkActive = phase === 'inkWriting' || phase === 'petals'

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: ENV_W * 0.86,
        height: ENV_H * 1.05,
        marginLeft: -(ENV_W * 0.86) / 2,
        marginTop: -(ENV_H * 1.05) / 2,
        background: 'linear-gradient(135deg, #FBF3DF 0%, #F5E8C8 100%)',
        boxShadow: '0 18px 50px -8px rgba(58,30,26,0.45), 0 4px 14px rgba(58,30,26,0.2), inset 0 0 80px rgba(110,31,43,0.05)',
        border: '1px solid rgba(201,162,75,0.5)',
        borderRadius: 4,
        zIndex: 14,
        transformOrigin: 'bottom center',
      }}
      initial={{ y: 30, opacity: 0, scale: 0.92 }}
      animate={
        visible
          ? { y: -ENV_H * 0.55, opacity: 1, scale: 1, filter: 'blur(0px)' }
          : { y: 30, opacity: 0, scale: 0.92 }
      }
      transition={{ duration: reduced ? 0.2 : 1.0, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Inner gold border */}
      <div
        style={{
          position: 'absolute',
          inset: 12,
          border: '1px solid rgba(168,132,47,0.55)',
          borderRadius: 2,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 16,
          border: '0.5px solid rgba(168,132,47,0.3)',
          borderRadius: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Decorative paisley corners */}
      {[
        { top: 14, left: 14, rot: 0 },
        { top: 14, right: 14, rot: 90 },
        { bottom: 14, right: 14, rot: 180 },
        { bottom: 14, left: 14, rot: 270 },
      ].map((c, i) => (
        <svg
          key={i}
          width="34"
          height="34"
          viewBox="0 0 34 34"
          style={{ position: 'absolute', ...c, transform: `rotate(${c.rot}deg)` }}
          aria-hidden
        >
          <path
            d="M2 2 Q14 4 18 14 Q22 22 14 28 M2 2 Q4 12 12 14 M2 2 L8 2 M2 2 L2 8"
            stroke="#A8842F"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle cx="14" cy="28" r="1.5" fill="#C9A24B" opacity="0.8" />
        </svg>
      ))}

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          padding: '40px 30px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'Marcellus, serif',
            fontSize: 11,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: 'rgba(110,31,43,0.7)',
          }}
        >
          You are invited
        </p>

        <div style={{ width: 60, height: 1, background: 'rgba(168,132,47,0.5)' }} />

        {/* Names — ink writing */}
        <div style={{ position: 'relative', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.span
            className="gold-foil"
            style={{
              fontFamily: '"Pinyon Script", cursive',
              fontSize: 56,
              lineHeight: 1,
              filter: 'drop-shadow(0 2px 3px rgba(110,31,43,0.18))',
            }}
            initial={{ opacity: 0, y: 6, clipPath: 'inset(0 100% 0 0)' }}
            animate={
              inkActive
                ? { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)' }
                : { opacity: 0, y: 6, clipPath: 'inset(0 100% 0 0)' }
            }
            transition={{ duration: reduced ? 0.2 : 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Sangeeth &amp; Arya
          </motion.span>
        </div>

        {/* Underline draw */}
        <svg width="180" height="10" viewBox="0 0 180 10" aria-hidden>
          <motion.path
            d="M2 5 Q40 1 90 5 T178 5"
            stroke="#A8842F"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inkActive ? { pathLength: 1, opacity: 0.9 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.9, delay: reduced ? 0 : 0.7, ease: 'easeInOut' }}
          />
        </svg>

        <motion.p
          style={{
            fontFamily: 'Marcellus, serif',
            fontSize: 13,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--maroon)',
            marginTop: 6,
          }}
          initial={{ opacity: 0 }}
          animate={inkActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: reduced ? 0 : 1.2 }}
        >
          23 . 08 . 2026
        </motion.p>
      </div>
    </motion.div>
  )
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() ?? false

  const stage = useMemo(() => petalsBurst, [])

  const onMove = useCallback((e: React.MouseEvent) => {
    if (phase !== 'idle' || reduced) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - (rect.left + rect.width / 2)) / rect.width
    const py = (e.clientY - (rect.top + rect.height / 2)) / rect.height
    setParallax({ x: px * 18, y: py * 14 })
  }, [phase, reduced])

  const onLeave = useCallback(() => setParallax({ x: 0, y: 0 }), [])

  const handleOpen = useCallback(() => {
    if (phase !== 'idle') return
    if (reduced) {
      setPhase('done')
      setTimeout(onOpen, 260)
      return
    }
    setPhase('pressing')
    setTimeout(() => setPhase('cracking'), 120)
    setTimeout(() => setPhase('flapping'), 600)
    setTimeout(() => setPhase('sliding'), 1200)
    setTimeout(() => setPhase('inkWriting'), 2150)
    setTimeout(() => setPhase('petals'), 2800)
    setTimeout(() => setPhase('done'), 4400)
    setTimeout(onOpen, 4800)
  }, [phase, reduced, onOpen])

  // Initial loading reveal
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), reduced ? 50 : 700)
    return () => clearTimeout(t)
  }, [reduced])

  const flapOpen = phase === 'flapping' || phase === 'sliding' || phase === 'inkWriting' || phase === 'petals' || phase === 'done'

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #2a1a16 0%, #0f0807 75%)',
        overflow: 'hidden',
        perspective: 1600,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Vignette mandala */}
      <div
        className="mandala-bg"
        style={{
          position: 'absolute',
          inset: '-10%',
          opacity: 0.35,
          pointerEvents: 'none',
          filter: 'blur(0.5px) sepia(0.3) hue-rotate(-15deg) saturate(1.5)',
        }}
        aria-hidden
      />

      {/* Ambient gold dust inside envelope scene */}
      {!reduced && dust.map((d) => (
        <motion.div
          key={d.id}
          style={{
            position: 'absolute',
            left: `${d.x}%`,
            bottom: `${d.y}%`,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #F2C76A 0%, transparent 70%)',
            boxShadow: '0 0 8px #E8D29A',
            pointerEvents: 'none',
          }}
          animate={{
            y: [-20, -200, -380],
            x: [0, 12, -10, 6],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Envelope scene */}
      <motion.div
        style={{
          position: 'relative',
          width: `min(${ENV_W}px, 92vw)`,
          height: `min(${ENV_H}px, 60vw)`,
          maxWidth: ENV_W,
          maxHeight: ENV_H,
          transformStyle: 'preserve-3d',
          cursor: phase === 'idle' ? 'pointer' : 'default',
        }}
        initial={{ opacity: 0, scale: 0.85, rotateX: 18 }}
        animate={
          ready
            ? phase === 'done'
              ? { opacity: 0, scale: 1.05, y: -40 }
              : {
                  opacity: 1,
                  scale: 1,
                  rotateX: parallax.y * -0.3,
                  rotateY: parallax.x * 0.3,
                }
            : { opacity: 0, scale: 0.85, rotateX: 18 }
        }
        transition={{ duration: phase === 'done' ? 0.7 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        onClick={handleOpen}
      >
        {/* Soft attention bounce on idle */}
        {phase === 'idle' && !reduced && (
          <motion.div
            style={{ position: 'absolute', inset: 0 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          />
        )}

        {/* Drop shadow under envelope */}
        <div
          style={{
            position: 'absolute',
            left: '5%',
            right: '5%',
            bottom: -28,
            height: 28,
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%)',
            filter: 'blur(8px)',
            pointerEvents: 'none',
          }}
          aria-hidden
        />

        {/* Envelope body (back / interior) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(150deg, #FBF3DF 0%, #EDD9A8 50%, #D8B970 100%)',
            borderRadius: 4,
            boxShadow: 'inset 0 0 60px rgba(110,31,43,0.1), 0 12px 30px rgba(0,0,0,0.45)',
          }}
          aria-hidden
        />

        {/* Subtle paper texture */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
          <defs>
            <filter id="paperFiber">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
              <feColorMatrix values="0 0 0 0 0.65  0 0 0 0 0.55  0 0 0 0 0.35  0 0 0 0.18 0" />
            </filter>
          </defs>
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'url(#paperFiber)',
            mixBlendMode: 'overlay',
            opacity: 0.4,
            borderRadius: 4,
            pointerEvents: 'none',
          }}
          aria-hidden
        />

        {/* Letter card slides out from inside */}
        <LetterCard phase={phase} reduced={reduced} />

        {/* Bottom V flap (front-facing, in front of letter) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '60%',
            background: 'linear-gradient(165deg, #F2DDA7 0%, #D8B970 60%, #B8943E 100%)',
            clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 50% 60%, 0 0)',
            zIndex: 18,
            boxShadow: 'inset 0 -2px 8px rgba(110,31,43,0.18)',
          }}
          aria-hidden
        />

        {/* Side flaps */}
        <div
          style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: '50%',
            background: 'linear-gradient(90deg, #E8CE8A 0%, #C9A24B 100%)',
            clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
            zIndex: 17,
            opacity: 0.85,
          }}
          aria-hidden
        />
        <div
          style={{
            position: 'absolute',
            right: 0, top: 0, bottom: 0,
            width: '50%',
            background: 'linear-gradient(270deg, #E8CE8A 0%, #C9A24B 100%)',
            clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
            zIndex: 17,
            opacity: 0.85,
          }}
          aria-hidden
        />

        {/* TOP triangular flap (this is what opens) */}
        <motion.div
          style={{
            position: 'absolute',
            left: 0, right: 0, top: 0,
            height: '60%',
            background: 'linear-gradient(180deg, #F5E2A8 0%, #D8B970 70%, #B8943E 100%)',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            zIndex: 22,
            boxShadow: 'inset 0 4px 14px rgba(110,31,43,0.2), 0 4px 8px rgba(0,0,0,0.25)',
          }}
          animate={{
            rotateX: flapOpen ? -178 : 0,
          }}
          transition={{ duration: reduced ? 0.2 : 0.85, ease: [0.34, 1.56, 0.64, 1], delay: phase === 'cracking' ? 0.2 : 0 }}
        >
          {/* Inner side of flap (visible when open) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, #FBF3DF 0%, #F0DCA8 100%)',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              transform: 'rotateX(180deg)',
              backfaceVisibility: 'hidden',
            }}
            aria-hidden
          />
          {/* Outer flap deckle */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(45deg, transparent 0 8px, rgba(110,31,43,0.04) 8px 9px)',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              pointerEvents: 'none',
            }}
            aria-hidden
          />
        </motion.div>

        {/* Wax seal — sits on the flap join */}
        <WaxSeal phase={phase} parallax={parallax} />

        {/* Calligraphic addressing — on envelope front above flap point */}
        <motion.div
          style={{
            position: 'absolute',
            top: '14%',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 16,
            pointerEvents: 'none',
          }}
          animate={{ opacity: phase === 'idle' || phase === 'pressing' ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <p
            style={{
              fontFamily: '"Pinyon Script", cursive',
              fontSize: 'clamp(20px, 4.5vw, 30px)',
              color: '#6E1F2B',
              opacity: 0.78,
              margin: 0,
              filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))',
            }}
          >
            To you, with love
          </p>
        </motion.div>

        {/* Petal burst layer — at envelope center */}
        {(phase === 'petals' || phase === 'done') &&
          stage.map((p) => <Petal key={p.id} p={p} />)}
      </motion.div>

      {/* Tap prompt */}
      <AnimatePresence>
        {phase === 'idle' && (
          <motion.div
            style={{
              position: 'absolute',
              bottom: '11%',
              left: 0,
              right: 0,
              textAlign: 'center',
              pointerEvents: 'none',
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.p
              style={{
                fontFamily: 'Marcellus, serif',
                fontSize: 11,
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
                color: '#E8D29A',
              }}
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              Tap to open
            </motion.p>
            <p
              style={{
                fontFamily: '"Pinyon Script", cursive',
                fontSize: 18,
                color: '#C9A24B',
                marginTop: 4,
                opacity: 0.7,
              }}
            >
              ~ Sangeeth &amp; Arya ~
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading monogram */}
      <AnimatePresence>
        {!ready && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#0f0807',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 80,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="gold-foil"
              style={{ fontFamily: '"Pinyon Script", cursive', fontSize: 64 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              S &amp; A
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
