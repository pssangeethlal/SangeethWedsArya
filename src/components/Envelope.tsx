import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface EnvelopeProps {
  onOpen: () => void
}

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const PETAL_COUNT = 22
const FRAGMENT_COUNT = 7
const AMBIENT_COUNT = 5

const petals = Array.from({ length: PETAL_COUNT }, (_, i) => ({
  id: i,
  angle: (i / PETAL_COUNT) * 360 + seededRand(i) * 25,
  distance: 90 + seededRand(i + 10) * 180,
  size: 7 + seededRand(i + 20) * 9,
  duration: 2.8 + seededRand(i + 30) * 3,
  delay: seededRand(i + 40) * 0.7,
  drift: (seededRand(i + 50) - 0.5) * 50,
  rotation: seededRand(i + 60) * 720 - 360,
}))

const fragments = Array.from({ length: FRAGMENT_COUNT }, (_, i) => ({
  id: i,
  angle: (i / FRAGMENT_COUNT) * 360 + seededRand(i + 100) * 40,
  dist: 28 + seededRand(i + 110) * 55,
  size: 2 + seededRand(i + 120) * 3,
}))

const ambientParticles = Array.from({ length: AMBIENT_COUNT }, (_, i) => ({
  id: i,
  x: 15 + seededRand(i + 200) * 70,
  size: 2 + seededRand(i + 210) * 2,
  duration: 7 + seededRand(i + 220) * 5,
  delay: seededRand(i + 230) * 4,
}))

const EXPO_OUT = [0.16, 1, 0.3, 1] as const
const CINEMATIC = [0.65, 0, 0.35, 1] as const

// ── Floral corner SVG path (drawn inline, gold stroke only) ──
function FloralCorner({ flip }: { flip: boolean }) {
  const s = flip ? 'scale(-1,1)' : ''
  return (
    <g transform={s} opacity="0.75">
      {/* Main stem */}
      <path d="M0,60 C8,48 18,36 22,18" stroke="#C9A96E" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Left leaf */}
      <path d="M10,46 C4,38 2,28 10,26 C14,34 14,42 10,46Z" stroke="#C9A96E" strokeWidth="0.8" fill="none" />
      {/* Right leaf */}
      <path d="M16,34 C22,26 28,20 26,14 C20,18 16,26 16,34Z" stroke="#C9A96E" strokeWidth="0.8" fill="none" />
      {/* Small bloom top */}
      <circle cx="22" cy="14" r="4" stroke="#C9A96E" strokeWidth="0.8" fill="rgba(201,169,110,0.12)" />
      <circle cx="22" cy="14" r="1.5" fill="#C9A96E" opacity="0.5" />
      {/* Tiny side bloom */}
      <circle cx="8" cy="52" r="3" stroke="#C9A96E" strokeWidth="0.7" fill="rgba(201,169,110,0.1)" />
      {/* Curling tendril */}
      <path d="M18,30 C24,24 28,22 26,18" stroke="#C9A96E" strokeWidth="0.6" fill="none" strokeLinecap="round" />
    </g>
  )
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [phase, setPhase] = useState<
    'idle' | 'pressing' | 'cracking' | 'flapping' | 'sliding' | 'petals' | 'done'
  >('idle')
  const [attentionMode, setAttentionMode] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // Trigger attention mode after 2s
  useEffect(() => {
    const t = setTimeout(() => setAttentionMode(true), 2000)
    return () => clearTimeout(t)
  }, [])

  // Mouse parallax
  const containerRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [sealShift, setSealShift] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || phase !== 'idle') return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      setTilt({ x: nx, y: ny })
      setSealShift({ x: nx * 4, y: ny * 4 })
    },
    [shouldReduceMotion, phase]
  )

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setSealShift({ x: 0, y: 0 })
  }, [])

  const handleOpen = useCallback(() => {
    if (phase !== 'idle') return
    setAttentionMode(false)
    setPhase('pressing')
    setTimeout(() => setPhase('cracking'),  160)  // wax cracks
    setTimeout(() => setPhase('flapping'),  620)  // flap begins rotating
    setTimeout(() => setPhase('sliding'),  1700)  // card slides up (after flap fully opens ~1.2s)
    setTimeout(() => setPhase('petals'),   2400)  // petals burst
    setTimeout(() => {
      setPhase('done')
      onOpen()
    }, shouldReduceMotion ? 300 : 4000)
  }, [phase, onOpen, shouldReduceMotion])

  const glowOpacity =
    phase === 'idle' || phase === 'pressing' ? 0.35
      : phase === 'cracking' || phase === 'flapping' || phase === 'sliding' ? 0.95
        : phase === 'petals' ? 0.65
          : 0.35

  const sealCracked = phase !== 'idle' && phase !== 'pressing'
  const flapOpen = ['flapping', 'sliding', 'petals', 'done'].includes(phase)
  const cardSliding = ['sliding', 'petals', 'done'].includes(phase)
  const showPetals = ['petals', 'done'].includes(phase)
  const showPrompt = phase === 'idle'

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Paper grain */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.04] mix-blend-multiply z-0" aria-hidden>
        <filter id="env-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#env-paper)" />
      </svg>

      {/* Radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={{ opacity: glowOpacity }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, #FFE8D6 0%, transparent 72%)' }}
        aria-hidden
      />

      {/* Ambient specks */}
      {!shouldReduceMotion && (
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
          {ambientParticles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`, bottom: 0,
                width: p.size, height: p.size,
                background: 'radial-gradient(circle, rgba(201,169,110,0.75) 0%, transparent 100%)',
              }}
              animate={{ y: [0, -700], opacity: [0, 0.55, 0] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>
      )}

      <LoadingScreen />

      <AnimatePresence>
        {phase !== 'done' && (
          <motion.div
            className="flex flex-col items-center gap-6 z-10"
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.8, ease: EXPO_OUT }}
          >
            <motion.p
              className="font-display italic text-ink-soft text-lg tracking-wide"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              You're invited to celebrate
            </motion.p>

            {/* Envelope container */}
            <motion.div
              ref={containerRef}
              className="relative cursor-pointer select-none"
              style={{ width: 'clamp(270px, 82vw, 430px)', perspective: 1500, perspectiveOrigin: '50% 50%' }}
              initial={{ opacity: 0, y: 28 }}
              animate={{
                opacity: 1,
                y: attentionMode && !shouldReduceMotion && phase === 'idle'
                  ? [0, -7, 2, -4, 0]
                  : 0,
              }}
              transition={attentionMode && phase === 'idle'
                ? { y: { duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }, opacity: { delay: 1.0, duration: 0.9, ease: EXPO_OUT } }
                : { delay: 1.0, duration: 0.9, ease: EXPO_OUT }
              }
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleOpen}
              role="button"
              aria-label="Open the wedding invitation"
            >
              <motion.div
                style={{ transformStyle: 'preserve-3d' }}
                animate={shouldReduceMotion ? {} : { rotateY: tilt.x * 8, rotateX: tilt.y * -8 }}
                transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
              >
                <svg
                  viewBox="0 0 430 290"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full"
                  style={{ filter: 'drop-shadow(0 16px 48px rgba(58,47,42,0.2)) drop-shadow(0 4px 10px rgba(58,47,42,0.12))' }}
                >
                  <defs>
                    {/* Deckle edge filter */}
                    <filter id="deckle" x="-5%" y="-10%" width="110%" height="120%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.04 0.08" numOctaves="3" seed="12" result="noise" />
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
                    </filter>

                    {/* Wax: deep convex gold-red */}
                    <radialGradient id="waxGrad" cx="33%" cy="28%" r="68%">
                      <stop offset="0%" stopColor="#C8423B" />
                      <stop offset="40%" stopColor="#A2302A" />
                      <stop offset="100%" stopColor="#6B1F1A" />
                    </radialGradient>

                    {/* Wax sheen */}
                    <radialGradient id="waxSheen" cx="28%" cy="22%" r="38%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>

                    {/* Envelope body gradient */}
                    <linearGradient id="envBody" x1="0" y1="0" x2="0.4" y2="1">
                      <stop offset="0%" stopColor="#FDFAF6" />
                      <stop offset="100%" stopColor="#F0E6D8" />
                    </linearGradient>

                    {/* Flap gradient */}
                    <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FEFCF8" />
                      <stop offset="100%" stopColor="#F4EAE0" />
                    </linearGradient>

                    {/* Inner shimmer on envelope body */}
                    <linearGradient id="envShimmer" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="rgba(201,169,110,0.12)" />
                      <stop offset="50%" stopColor="rgba(201,169,110,0)" />
                      <stop offset="100%" stopColor="rgba(232,197,192,0.08)" />
                    </linearGradient>

                    {/* Left flap gradient */}
                    <linearGradient id="leftFlap" x1="0" y1="0.5" x2="1" y2="0.5">
                      <stop offset="0%" stopColor="#F5EDE0" />
                      <stop offset="100%" stopColor="#EDE3D5" />
                    </linearGradient>

                    {/* Right flap gradient */}
                    <linearGradient id="rightFlap" x1="1" y1="0.5" x2="0" y2="0.5">
                      <stop offset="0%" stopColor="#F5EDE0" />
                      <stop offset="100%" stopColor="#EDE3D5" />
                    </linearGradient>

                    {/* Bottom flap gradient */}
                    <linearGradient id="bottomFlap" x1="0.5" y1="0" x2="0.5" y2="1">
                      <stop offset="0%" stopColor="#EDE3D4" />
                      <stop offset="100%" stopColor="#E5D8C8" />
                    </linearGradient>

                    {/* Interior warm lining gradient — glows when flap opens */}
                    <linearGradient id="interiorGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                      <stop offset="0%" stopColor="#FFF0DC" stopOpacity="0.95"/>
                      <stop offset="50%" stopColor="#FAF0E0" stopOpacity="0.7"/>
                      <stop offset="100%" stopColor="#F5E8D0" stopOpacity="0.3"/>
                    </linearGradient>

                    {/* Botanical sprig (shown on back of flap) */}
                    <g id="botanical">
                      <path d="M215 108 C218 96 228 90 224 80" stroke="#C9A96E" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
                      <ellipse cx="226" cy="83" rx="5.5" ry="3" fill="none" stroke="#C9A96E" strokeWidth="0.8" transform="rotate(-30 226 83)"/>
                      <path d="M215 108 C212 95 202 88 205 77" stroke="#C9A96E" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
                      <ellipse cx="202" cy="80" rx="5.5" ry="3" fill="none" stroke="#C9A96E" strokeWidth="0.8" transform="rotate(30 202 80)"/>
                      <path d="M215 108 C220 94 237 87 238 73" stroke="#C9A96E" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
                      <ellipse cx="239" cy="76" rx="4" ry="2.5" fill="none" stroke="#C9A96E" strokeWidth="0.7" transform="rotate(-42 239 76)"/>
                      <path d="M215 108 C210 93 193 84 191 70" stroke="#C9A96E" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
                      <ellipse cx="189" cy="73" rx="4" ry="2.5" fill="none" stroke="#C9A96E" strokeWidth="0.7" transform="rotate(42 189 73)"/>
                      <circle cx="215" cy="108" r="2" fill="rgba(201,169,110,0.4)" />
                    </g>
                  </defs>

                  {/* ── LAYER 1: Inner card — rises dramatically ── */}
                  <motion.g
                    animate={cardSliding
                      ? { translateY: -72, opacity: 1 }
                      : { translateY: 0, opacity: 0 }}
                    transition={{ duration: 1.1, ease: EXPO_OUT, delay: 0.15 }}
                  >
                    {/* Card shadow beneath */}
                    <ellipse cx="215" cy="298" rx="130" ry="8"
                      fill="rgba(58,47,42,0.12)" style={{ filter: 'blur(6px)' }}
                    />
                    {/* Card body */}
                    <rect x="55" y="88" width="320" height="210" rx="3"
                      fill="#FEFCF8"
                      stroke="rgba(201,169,110,0.5)" strokeWidth="1"
                    />
                    {/* Inner double border */}
                    <rect x="63" y="96" width="304" height="194" rx="1"
                      fill="none" stroke="rgba(201,169,110,0.22)" strokeWidth="0.8"
                    />
                    {/* Corner flourishes */}
                    <path d="M63,110 L63,96 L77,96" fill="none" stroke="rgba(201,169,110,0.45)" strokeWidth="0.8" strokeLinecap="round"/>
                    <path d="M353,110 L353,96 L339,96" fill="none" stroke="rgba(201,169,110,0.45)" strokeWidth="0.8" strokeLinecap="round"/>
                    <path d="M63,278 L63,290 L77,290" fill="none" stroke="rgba(201,169,110,0.45)" strokeWidth="0.8" strokeLinecap="round"/>
                    <path d="M353,278 L353,290 L339,290" fill="none" stroke="rgba(201,169,110,0.45)" strokeWidth="0.8" strokeLinecap="round"/>
                    {/* Names */}
                    <text x="215" y="158" fontFamily="Pinyon Script, cursive" fontSize="28" textAnchor="middle" fill="rgba(107,95,84,0.35)">Sangeeth</text>
                    <text x="215" y="186" fontFamily="Pinyon Script, cursive" fontSize="18" textAnchor="middle" fill="rgba(201,169,110,0.4)">&amp;</text>
                    <text x="215" y="215" fontFamily="Pinyon Script, cursive" fontSize="28" textAnchor="middle" fill="rgba(107,95,84,0.35)">Arya</text>
                    {/* Date */}
                    <text x="215" y="248" fontFamily="Cormorant Garamond, serif" fontSize="10" textAnchor="middle"
                      fill="rgba(201,169,110,0.55)" letterSpacing="4">23 · 08 · 2026</text>
                    {/* Small divider */}
                    <line x1="175" y1="233" x2="255" y2="233" stroke="rgba(201,169,110,0.3)" strokeWidth="0.6"/>
                  </motion.g>

                  {/* ── LAYER 2: Envelope back panel ── */}
                  <rect x="2" y="90" width="426" height="198" rx="4" fill="url(#envBody)" stroke="#C9A96E" strokeWidth="1.2" />
                  {/* Shimmer overlay */}
                  <rect x="2" y="90" width="426" height="198" rx="4" fill="url(#envShimmer)" />
                  {/* Inner gold inset */}
                  <rect x="8" y="96" width="414" height="186" rx="2" fill="none" stroke="rgba(201,169,110,0.18)" strokeWidth="0.8" />

                  {/* ── LAYER 3: Left flap ── */}
                  <path d="M2 94 L2 288 L215 200 Z" fill="url(#leftFlap)" />
                  <path d="M2 94 L2 288 L215 200 Z" fill="none" stroke="#C9A96E" strokeWidth="0.9" />
                  <path d="M7 102 L7 276 L211 200 Z" fill="none" stroke="rgba(201,169,110,0.2)" strokeWidth="0.6" />

                  {/* ── LAYER 3: Right flap ── */}
                  <path d="M428 94 L428 288 L215 200 Z" fill="url(#rightFlap)" />
                  <path d="M428 94 L428 288 L215 200 Z" fill="none" stroke="#C9A96E" strokeWidth="0.9" />
                  <path d="M423 102 L423 276 L219 200 Z" fill="none" stroke="rgba(201,169,110,0.2)" strokeWidth="0.6" />

                  {/* ── LAYER 3: Bottom flap ── */}
                  <path d="M2 288 L215 200 L428 288 Z" fill="url(#bottomFlap)" />
                  <path d="M2 288 L215 200 L428 288 Z" fill="none" stroke="#C9A96E" strokeWidth="0.9" />

                  {/* ── Interior warm lining — glows as flap opens ── */}
                  <motion.rect
                    x="2" y="90" width="426" height="198" rx="4"
                    fill="url(#interiorGrad)"
                    animate={flapOpen ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  />

                  {/* ── Flap lift shadow — appears as wax cracks, before flap completes ── */}
                  <motion.ellipse
                    cx="215" cy="92" rx="160" ry="10"
                    fill="rgba(58,47,42,0.18)"
                    style={{ filter: 'blur(8px)' }}
                    animate={
                      sealCracked && !flapOpen
                        ? { opacity: 1, scaleX: 1 }
                        : { opacity: 0, scaleX: 0.5 }
                    }
                    transition={{ duration: 0.5 }}
                  />

                  {/* Calligraphy address — only on closed envelope */}
                  <AnimatePresence>
                    {!flapOpen && (
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.55 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        transform="rotate(-2, 310, 248)"
                      >
                        <text x="310" y="248" fontFamily="Pinyon Script, cursive" fontSize="14" textAnchor="middle" fill="#6B5D54">To our beloved guest</text>
                        <text x="310" y="268" fontFamily="Pinyon Script, cursive" fontSize="11.5" textAnchor="middle" fill="#6B5D54">with love, S &amp; A</text>
                      </motion.g>
                    )}
                  </AnimatePresence>

                  {/* ── Floral corners on envelope face ── */}
                  <AnimatePresence>
                    {!flapOpen && (
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                        {/* Top-left */}
                        <g transform="translate(16, 98)">
                          <FloralCorner flip={false} />
                        </g>
                        {/* Top-right */}
                        <g transform="translate(414, 98) scale(-1,1)">
                          <FloralCorner flip={true} />
                        </g>
                      </motion.g>
                    )}
                  </AnimatePresence>

                  {/* ── LAYER 4: Top flap (3D opens) ── */}
                  <motion.g
                    style={{ transformOrigin: '215px 90px', transformBox: 'fill-box' }}
                    animate={flapOpen ? { rotateX: -180 } : { rotateX: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.01 : 1.2, ease: CINEMATIC }}
                  >
                    <path
                      d="M2 90 L215 206 L428 90 L215 4 Z"
                      fill="url(#flapGrad)"
                      stroke="#C9A96E"
                      strokeWidth="1.2"
                      filter="url(#deckle)"
                    />
                    <path d="M14 90 L215 200 L416 90" stroke="rgba(201,169,110,0.28)" strokeWidth="0.7" fill="none" />
                    {/* Botanical on reverse of flap */}
                    <use href="#botanical" />
                  </motion.g>

                  {/* ── LAYER 5: Wax seal — left half cracks ── */}
                  <motion.g
                    style={{ transformOrigin: '215px 176px', transformBox: 'fill-box' }}
                    animate={sealCracked
                      ? { rotateZ: -28, translateX: -12, translateY: 20, opacity: 0 }
                      : { rotateZ: 0, translateX: 0, translateY: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.55, 0, 1, 0.45] }}
                  >
                    <clipPath id="sl">
                      <rect x="182" y="144" width="33" height="64" />
                    </clipPath>
                    <circle cx="215" cy="176" r="32" fill="url(#waxGrad)" clipPath="url(#sl)" />
                    <circle cx="215" cy="176" r="27" fill="none" stroke="rgba(107,31,26,0.4)" strokeWidth="1.3" clipPath="url(#sl)" />
                    <circle cx="215" cy="176" r="32" fill="url(#waxSheen)" clipPath="url(#sl)" />
                  </motion.g>

                  {/* Wax seal — right half cracks */}
                  <motion.g
                    style={{ transformOrigin: '215px 176px', transformBox: 'fill-box' }}
                    animate={sealCracked
                      ? { rotateZ: 28, translateX: 12, translateY: 20, opacity: 0 }
                      : { rotateZ: 0, translateX: 0, translateY: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.55, 0, 1, 0.45] }}
                  >
                    <clipPath id="sr">
                      <rect x="215" y="144" width="33" height="64" />
                    </clipPath>
                    <circle cx="215" cy="176" r="32" fill="url(#waxGrad)" clipPath="url(#sr)" />
                    <circle cx="215" cy="176" r="27" fill="none" stroke="rgba(107,31,26,0.4)" strokeWidth="1.3" clipPath="url(#sr)" />
                    <circle cx="215" cy="176" r="32" fill="url(#waxSheen)" clipPath="url(#sr)" />
                  </motion.g>

                  {/* Wax seal shadow beneath (physical lift) */}
                  <AnimatePresence>
                    {!sealCracked && (
                      <motion.ellipse cx="216" cy="210" rx="22" ry="5" fill="rgba(107,31,26,0.15)"
                        initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Wax fragments */}
                  <AnimatePresence>
                    {sealCracked && !shouldReduceMotion && fragments.map((f) => {
                      const rad = (f.angle * Math.PI) / 180
                      return (
                        <motion.circle key={f.id} cx={215} cy={176} r={f.size} fill="#A0312C"
                          initial={{ opacity: 0.9 }}
                          animate={{ cx: 215 + Math.cos(rad) * f.dist, cy: 176 + Math.sin(rad) * f.dist, opacity: 0, r: f.size * 0.4 }}
                          transition={{ duration: 0.65, ease: [0.2, 0, 0.8, 1] }}
                        />
                      )
                    })}
                  </AnimatePresence>

                  {/* Monogram text */}
                  <motion.g
                    animate={sealCracked ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <text x="215" y="183" fontFamily="Pinyon Script, cursive" fontSize="19" textAnchor="middle"
                      fill="#8A2820" style={{ filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.35))' }}>
                      S &amp; A
                    </text>
                  </motion.g>
                </svg>

                {/* Wax seal parallax float overlay */}
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    bottom: '22%', left: '50%',
                    width: 68, height: 68, marginLeft: -34,
                    borderRadius: '50%',
                    boxShadow: sealCracked ? 'none' : '0 5px 10px rgba(107,31,26,0.3), 0 1px 3px rgba(0,0,0,0.18)',
                  }}
                  animate={shouldReduceMotion ? {} : { x: sealShift.x, y: sealShift.y }}
                  transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
                />
              </motion.div>
            </motion.div>

            {/* Wax seal LIVE ring: rotating text + breathing aura */}
            <AnimatePresence>
              {phase === 'idle' && !shouldReduceMotion && (
                <motion.div
                  className="absolute pointer-events-none z-20"
                  style={{
                    width: 'clamp(270px, 82vw, 430px)',
                    aspectRatio: '430/290',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 2, duration: 0.6 }}
                >
                  <WaxSealAura attentionMode={attentionMode} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tap prompt */}
            <AnimatePresence>
              {showPrompt && (
                <motion.div
                  className="flex flex-col items-center gap-3 cursor-pointer select-none"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 1.5, duration: 0.8, ease: EXPO_OUT }}
                  onClick={handleOpen}
                  role="button"
                  aria-label="Open the wedding invitation"
                >
                  {/* Dashes + text */}
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.6))' }} />
                    <motion.span
                      className="font-body text-ink-soft tracking-[0.4em] uppercase text-[10px]"
                      animate={{ opacity: [0.5, 0.9, 0.5] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      Tap to open
                    </motion.span>
                    <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, rgba(201,169,110,0.6), transparent)' }} />
                  </div>
                  {/* Bouncing arrow */}
                  <motion.div
                    style={{ color: 'rgba(201,169,110,0.75)' }}
                    animate={{ y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="9" y1="2" x2="9" y2="11" stroke="currentColor" strokeWidth="1.2" />
                      <polyline points="5,8 9,13 13,8" stroke="currentColor" strokeWidth="1.2" fill="none" />
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Petal burst */}
      <AnimatePresence>
        {showPetals && !shouldReduceMotion && (
          <div className="fixed inset-0 pointer-events-none z-20" aria-hidden>
            {petals.map((p) => {
              const rad = (p.angle * Math.PI) / 180
              return (
                <motion.div key={p.id} className="absolute"
                  style={{
                    left: '50%', top: '50%',
                    width: p.size, height: p.size * 0.55,
                    borderRadius: '50% 50% 50% 0',
                    background: 'radial-gradient(ellipse, rgba(232,197,192,0.9) 0%, rgba(201,169,110,0.45) 100%)',
                    marginLeft: -p.size / 2, marginTop: -p.size * 0.275,
                  }}
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 0.9, scale: 1 }}
                  animate={{ x: Math.cos(rad) * p.distance + p.drift, y: Math.sin(rad) * p.distance + 100, rotate: p.rotation, opacity: 0, scale: 0.4 }}
                  transition={{ duration: p.duration, delay: p.delay, ease: [0.2, 0, 0.8, 1] }}
                />
              )
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Wax seal: breathing aura + rotating ring text ──
function WaxSealAura({ attentionMode }: { attentionMode: boolean }) {
  return (
    <div
      className="absolute"
      style={{
        /* Position over seal: ~60.7% from top, centered */
        bottom: '21.5%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 80, height: 80,
        marginLeft: -4,
      }}
    >
      {/* Breathing glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ inset: -18, background: 'radial-gradient(circle, rgba(201,169,110,0.35) 0%, transparent 65%)' }}
        animate={attentionMode
          ? { scale: [0.88, 1.22, 0.88], opacity: [0.4, 0.92, 0.4] }
          : { scale: [0.92, 1.12, 0.92], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Expanding pulse ring */}
      <motion.div
        className="absolute rounded-full"
        style={{ inset: -6, border: '1.5px solid rgba(201,169,110,0.4)' }}
        animate={attentionMode
          ? { scale: [0.95, 1.5, 1.5], opacity: [0.6, 0, 0] }
          : { scale: [0.95, 1.35, 1.35], opacity: [0.5, 0, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
      />
      {/* Rotating text ring */}
      <motion.svg
        width="110" height="110" viewBox="0 0 110 110"
        className="absolute"
        style={{ top: -15, left: -15 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <path id="ring-path" d="M55,55 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
        </defs>
        <text fontFamily="Montserrat, Inter, sans-serif" fontSize="6.2" fontWeight="600" letterSpacing="1.8" fill="#C9A96E" opacity="0.9">
          <textPath href="#ring-path">
            TAP TO OPEN ✦ TAP TO OPEN ✦ TAP TO OPEN ✦&nbsp;
          </textPath>
        </text>
      </motion.svg>
    </div>
  )
}

// ── Loading screen: monogram draws itself ──
function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), shouldReduceMotion ? 200 : 900)
    return () => clearTimeout(t)
  }, [shouldReduceMotion])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ivory"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: EXPO_OUT }}
        >
          <svg viewBox="0 0 160 90" width="160" height="90" fill="none" aria-hidden>
            <motion.text
              x="80" y="62"
              fontFamily="Pinyon Script, cursive"
              fontSize="58"
              textAnchor="middle"
              fill="none"
              stroke="#C9A96E"
              strokeWidth="1.4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.72, ease: 'easeOut' }}
            >
              S &amp; A
            </motion.text>
          </svg>
          <div className="w-24 h-px bg-gold/20 mt-5 overflow-hidden relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gold"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.72, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
