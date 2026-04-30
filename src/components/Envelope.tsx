import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface EnvelopeProps {
  onOpen: () => void
}

// Seeded random helpers so SSR/hydration is stable
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const PETAL_COUNT = 24
const FRAGMENT_COUNT = 7
const AMBIENT_COUNT = 5

const petals = Array.from({ length: PETAL_COUNT }, (_, i) => ({
  id: i,
  angle: (i / PETAL_COUNT) * 360 + seededRand(i) * 30,
  distance: 80 + seededRand(i + 10) * 160,
  size: 6 + seededRand(i + 20) * 10,
  duration: 2.5 + seededRand(i + 30) * 3,
  delay: seededRand(i + 40) * 0.8,
  drift: (seededRand(i + 50) - 0.5) * 40,
  rotation: seededRand(i + 60) * 720 - 360,
}))

const fragments = Array.from({ length: FRAGMENT_COUNT }, (_, i) => ({
  id: i,
  angle: (i / FRAGMENT_COUNT) * 360 + seededRand(i + 100) * 40,
  dist: 30 + seededRand(i + 110) * 60,
  size: 2 + seededRand(i + 120) * 3,
  rotation: seededRand(i + 130) * 90 - 45,
}))

const ambientParticles = Array.from({ length: AMBIENT_COUNT }, (_, i) => ({
  id: i,
  x: 15 + seededRand(i + 200) * 70,
  size: 2 + seededRand(i + 210) * 2,
  duration: 6 + seededRand(i + 220) * 5,
  delay: seededRand(i + 230) * 4,
}))

// Easing curves — expo-out feel, no spring
const EXPO_OUT = [0.16, 1, 0.3, 1] as const
const CINEMATIC = [0.65, 0, 0.35, 1] as const

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [phase, setPhase] = useState<
    'idle' | 'pressing' | 'cracking' | 'flapping' | 'sliding' | 'petals' | 'done'
  >('idle')
  const shouldReduceMotion = useReducedMotion()

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
      setSealShift({ x: nx * 3, y: ny * 3 })
    },
    [shouldReduceMotion, phase]
  )

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setSealShift({ x: 0, y: 0 })
  }, [])

  const handleOpen = useCallback(() => {
    if (phase !== 'idle') return
    setPhase('pressing')
    setTimeout(() => setPhase('cracking'), 200)
    setTimeout(() => setPhase('flapping'), 700)
    setTimeout(() => setPhase('sliding'), 1100)
    setTimeout(() => setPhase('petals'), 1900)
    setTimeout(() => {
      setPhase('done')
      onOpen()
    }, shouldReduceMotion ? 300 : 3800)
  }, [phase, onOpen, shouldReduceMotion])

  // glow opacity based on phase
  const glowOpacity =
    phase === 'idle' || phase === 'pressing' ? 0.35
    : phase === 'cracking' || phase === 'flapping' || phase === 'sliding' ? 0.9
    : phase === 'petals' ? 0.6
    : 0.35

  const showPetals = phase === 'petals' || phase === 'done'
  const sealCracked = phase !== 'idle' && phase !== 'pressing'
  const flapOpen = phase === 'flapping' || phase === 'sliding' || phase === 'petals' || phase === 'done'
  const cardSliding = phase === 'sliding' || phase === 'petals' || phase === 'done'
  const showButton = phase === 'idle' || phase === 'pressing'

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Paper grain texture */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.04] mix-blend-multiply z-0" aria-hidden>
        <filter id="env-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#env-paper)" />
      </svg>

      {/* Radial glow behind envelope */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={{ opacity: glowOpacity }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(ellipse 55% 45% at 50% 50%, #FFE8D6 0%, transparent 70%)',
        }}
        aria-hidden
      />

      {/* Ambient golden specks */}
      {!shouldReduceMotion && (
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
          {ambientParticles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                bottom: 0,
                width: p.size,
                height: p.size,
                background: 'radial-gradient(circle, rgba(201,169,110,0.8) 0%, transparent 100%)',
              }}
              animate={{ y: [0, -600], opacity: [0, 0.5, 0] }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {/* Loading monogram draws in on mount */}
      <LoadingScreen />

      <AnimatePresence>
        {phase !== 'done' && (
          <motion.div
            className="flex flex-col items-center gap-8 z-10"
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.8, ease: EXPO_OUT }}
          >
            <motion.p
              className="font-display italic text-ink-soft text-lg tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              You're invited to celebrate
            </motion.p>

            {/* Envelope container — parallax tilt */}
            <motion.div
              ref={containerRef}
              className="relative select-none"
              style={{
                width: 'clamp(260px, 80vw, 420px)',
                perspective: 1500,
                perspectiveOrigin: '50% 50%',
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.9, ease: EXPO_OUT }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                style={{ transformStyle: 'preserve-3d' }}
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        rotateY: tilt.x * 8,
                        rotateX: tilt.y * -8,
                      }
                }
                transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
              >
                <svg
                  viewBox="0 0 420 280"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full"
                  style={{
                    filter: 'drop-shadow(0 12px 40px rgba(58,47,42,0.18)) drop-shadow(0 2px 6px rgba(58,47,42,0.1))',
                  }}
                >
                  <defs>
                    {/* Deckle-edge displacement for flap */}
                    <filter id="deckle" x="-5%" y="-5%" width="110%" height="110%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.04 0.07" numOctaves="3" seed="8" result="noise" />
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                    </filter>

                    {/* Wax seal gradient — bulge illusion */}
                    <radialGradient id="waxGrad" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#C0403A" />
                      <stop offset="55%" stopColor="#A0312C" />
                      <stop offset="100%" stopColor="#6B1F1A" />
                    </radialGradient>

                    {/* Wax seal sheen highlight */}
                    <radialGradient id="waxSheen" cx="30%" cy="25%" r="40%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>

                    {/* Paper texture gradient */}
                    <linearGradient id="paperBack" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FBF7F2" />
                      <stop offset="100%" stopColor="#F3ECE2" />
                    </linearGradient>
                    <linearGradient id="flapBack" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FDFAF6" />
                      <stop offset="100%" stopColor="#F5EDE3" />
                    </linearGradient>

                    {/* Botanical sprig on flap reverse */}
                    <g id="laurel-sprig">
                      <path d="M210 100 C215 90, 225 85, 220 75" stroke="#C9A96E" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
                      <ellipse cx="222" cy="78" rx="5" ry="3" fill="none" stroke="#C9A96E" strokeWidth="0.7" transform="rotate(-30 222 78)"/>
                      <path d="M210 100 C205 88, 195 83, 200 73" stroke="#C9A96E" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
                      <ellipse cx="198" cy="76" rx="5" ry="3" fill="none" stroke="#C9A96E" strokeWidth="0.7" transform="rotate(30 198 76)"/>
                      <path d="M210 100 C213 88, 230 82, 232 70" stroke="#C9A96E" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
                      <ellipse cx="234" cy="73" rx="4" ry="2.5" fill="none" stroke="#C9A96E" strokeWidth="0.6" transform="rotate(-40 234 73)"/>
                      <path d="M210 100 C207 88, 190 80, 188 68" stroke="#C9A96E" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
                      <ellipse cx="186" cy="71" rx="4" ry="2.5" fill="none" stroke="#C9A96E" strokeWidth="0.6" transform="rotate(40 186 71)"/>
                    </g>
                  </defs>

                  {/* ── LAYER 1: Inner card (peeks out) ── */}
                  <motion.g
                    animate={cardSliding ? { translateY: -50, opacity: cardSliding ? 1 : 0 } : { translateY: 0, opacity: 0 }}
                    transition={{ duration: 0.9, ease: EXPO_OUT, delay: 0.1 }}
                  >
                    <rect x="60" y="90" width="300" height="190" rx="2" fill="#FDFAF5" stroke="rgba(201,169,110,0.35)" strokeWidth="1" />
                    {/* Names on inner card */}
                    <text x="210" y="145" fontFamily="Pinyon Script, cursive" fontSize="20" textAnchor="middle" fill="rgba(107,95,84,0.25)">Sangeeth</text>
                    <text x="210" y="168" fontFamily="Pinyon Script, cursive" fontSize="14" textAnchor="middle" fill="rgba(201,169,110,0.2)">&amp;</text>
                    <text x="210" y="192" fontFamily="Pinyon Script, cursive" fontSize="20" textAnchor="middle" fill="rgba(107,95,84,0.25)">Arya</text>
                  </motion.g>

                  {/* ── LAYER 2: Envelope back panel ── */}
                  <rect x="2" y="88" width="416" height="190" rx="4" fill="url(#paperBack)" stroke="#C9A96E" strokeWidth="1.2" />
                  {/* inner gold inset line */}
                  <rect x="8" y="94" width="404" height="178" rx="2" fill="none" stroke="rgba(201,169,110,0.2)" strokeWidth="0.8" />

                  {/* ── LAYER 3: Side & bottom flaps ── */}
                  {/* Left flap */}
                  <path d="M2 92 L2 278 L210 195 Z" fill="#F5EDE0" stroke="#C9A96E" strokeWidth="0.9" />
                  <path d="M6 96 L6 268 L206 196 Z" fill="none" stroke="rgba(201,169,110,0.25)" strokeWidth="0.6" />
                  {/* Right flap */}
                  <path d="M418 92 L418 278 L210 195 Z" fill="#EEE5D6" stroke="#C9A96E" strokeWidth="0.9" />
                  <path d="M414 96 L414 268 L214 196 Z" fill="none" stroke="rgba(201,169,110,0.25)" strokeWidth="0.6" />
                  {/* Bottom flap */}
                  <path d="M2 278 L210 195 L418 278 Z" fill="#E8DFCF" stroke="#C9A96E" strokeWidth="0.9" />
                  <path d="M6 274 L210 198 L414 274 Z" fill="none" stroke="rgba(201,169,110,0.25)" strokeWidth="0.6" />

                  {/* Calligraphy address — front of closed envelope */}
                  <AnimatePresence>
                    {!flapOpen && (
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.55 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ transformOrigin: '310px 240px' }}
                        transform="rotate(-2, 310, 240)"
                      >
                        <text x="290" y="238" fontFamily="Pinyon Script, cursive" fontSize="13" textAnchor="middle" fill="#6B5D54">To our beloved guest</text>
                        <text x="290" y="256" fontFamily="Pinyon Script, cursive" fontSize="11" textAnchor="middle" fill="#6B5D54">with love, S &amp; A</text>
                      </motion.g>
                    )}
                  </AnimatePresence>

                  {/* ── LAYER 4: Top flap (animates open) ── */}
                  <motion.g
                    style={{ transformOrigin: '210px 88px', transformBox: 'fill-box' }}
                    animate={flapOpen ? { rotateX: -180 } : { rotateX: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.01 : 1.2, ease: CINEMATIC, delay: 0 }}
                  >
                    {/* Flap with deckle edge */}
                    <path
                      d="M2 88 L210 200 L418 88 L210 6 Z"
                      fill="url(#flapBack)"
                      stroke="#C9A96E"
                      strokeWidth="1.2"
                      filter="url(#deckle)"
                    />
                    {/* Inner crease line */}
                    <path d="M14 88 L210 194 L406 88" stroke="rgba(201,169,110,0.3)" strokeWidth="0.7" fill="none" />

                    {/* Botanical sprig on back of flap (visible when open) */}
                    <use href="#laurel-sprig" />
                  </motion.g>

                  {/* ── LAYER 5: Wax seal ── */}
                  {/* Wax seal left half (cracks left) */}
                  <motion.g
                    style={{ transformOrigin: '210px 172px', transformBox: 'fill-box' }}
                    animate={
                      sealCracked
                        ? { rotateZ: -25, translateX: -10, translateY: 18, opacity: 0 }
                        : { rotateZ: 0, translateX: 0, translateY: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.5, ease: [0.55, 0, 1, 0.45] }}
                  >
                    {/* Clip left half of seal */}
                    <clipPath id="seal-left">
                      <rect x="178" y="142" width="32" height="60" />
                    </clipPath>
                    <circle cx="210" cy="172" r="30" fill="url(#waxGrad)" clipPath="url(#seal-left)" />
                    <circle cx="210" cy="172" r="25.5" fill="none" stroke="rgba(107,31,26,0.45)" strokeWidth="1.2" clipPath="url(#seal-left)" />
                    <circle cx="210" cy="172" r="30" fill="url(#waxSheen)" clipPath="url(#seal-left)" />
                  </motion.g>

                  {/* Wax seal right half (cracks right) */}
                  <motion.g
                    style={{ transformOrigin: '210px 172px', transformBox: 'fill-box' }}
                    animate={
                      sealCracked
                        ? { rotateZ: 25, translateX: 10, translateY: 18, opacity: 0 }
                        : { rotateZ: 0, translateX: 0, translateY: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.5, ease: [0.55, 0, 1, 0.45] }}
                  >
                    <clipPath id="seal-right">
                      <rect x="210" y="142" width="32" height="60" />
                    </clipPath>
                    <circle cx="210" cy="172" r="30" fill="url(#waxGrad)" clipPath="url(#seal-right)" />
                    <circle cx="210" cy="172" r="25.5" fill="none" stroke="rgba(107,31,26,0.45)" strokeWidth="1.2" clipPath="url(#seal-right)" />
                    <circle cx="210" cy="172" r="30" fill="url(#waxSheen)" clipPath="url(#seal-right)" />
                  </motion.g>

                  {/* Monogram — fades with seal */}
                  <motion.g
                    animate={sealCracked ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: '210px 172px', transformBox: 'fill-box' }}
                  >
                    <text
                      x="210"
                      y="179"
                      fontFamily="Pinyon Script, cursive"
                      fontSize="18"
                      textAnchor="middle"
                      fill="#8A2820"
                      style={{ filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.4))' }}
                    >
                      S &amp; A
                    </text>
                  </motion.g>

                  {/* Drop shadow beneath wax seal — gives physical lift */}
                  <AnimatePresence>
                    {!sealCracked && (
                      <motion.ellipse
                        cx="211" cy="204" rx="22" ry="5"
                        fill="rgba(107,31,26,0.18)"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Wax fragments fly out on crack */}
                  <AnimatePresence>
                    {sealCracked && !shouldReduceMotion && fragments.map((f) => {
                      const rad = (f.angle * Math.PI) / 180
                      const tx = Math.cos(rad) * f.dist
                      const ty = Math.sin(rad) * f.dist
                      return (
                        <motion.circle
                          key={f.id}
                          cx={210}
                          cy={172}
                          r={f.size}
                          fill="#A0312C"
                          initial={{ cx: 210, cy: 172, opacity: 0.9 }}
                          animate={{ cx: 210 + tx, cy: 172 + ty, opacity: 0, r: f.size * 0.5 }}
                          transition={{ duration: 0.6, ease: [0.2, 0, 0.8, 1] }}
                        />
                      )
                    })}
                  </AnimatePresence>
                </svg>

                {/* Seal parallax shift — independent from envelope tilt */}
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    bottom: '21%',
                    left: '50%',
                    width: 64,
                    height: 64,
                    marginLeft: -32,
                    boxShadow: sealCracked ? 'none' : '0 4px 8px rgba(107,31,26,0.35), 0 1px 2px rgba(0,0,0,0.2)',
                    borderRadius: '50%',
                  }}
                  animate={
                    shouldReduceMotion
                      ? {}
                      : { x: sealShift.x, y: sealShift.y }
                  }
                  transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
                />
              </motion.div>
            </motion.div>

            {/* Open button */}
            <AnimatePresence>
              {showButton && (
                <motion.button
                  className="envelope-btn z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: phase === 'pressing' ? 0.97 : 1,
                  }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ delay: phase === 'idle' ? 1.4 : 0, duration: 0.8, ease: EXPO_OUT }}
                  onClick={handleOpen}
                  disabled={phase !== 'idle'}
                  aria-label="Open the wedding invitation"
                >
                  Open Invitation
                </motion.button>
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
              const tx = Math.cos(rad) * p.distance
              const ty = Math.sin(rad) * p.distance
              return (
                <motion.div
                  key={p.id}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: p.size,
                    height: p.size * 0.55,
                    borderRadius: '50% 50% 50% 0',
                    background: `radial-gradient(ellipse, rgba(232,197,192,0.85) 0%, rgba(201,169,110,0.5) 100%)`,
                    marginLeft: -p.size / 2,
                    marginTop: -p.size * 0.275,
                  }}
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 0.9, scale: 1 }}
                  animate={{
                    x: tx + p.drift,
                    y: ty + 120,
                    rotate: p.rotation,
                    opacity: 0,
                    scale: 0.5,
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    ease: [0.2, 0, 0.8, 1],
                  }}
                />
              )
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Loading screen — draws monogram then fades ──
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
          transition={{ duration: 0.6, ease: EXPO_OUT }}
        >
          <svg viewBox="0 0 140 80" width="140" height="80" fill="none" aria-hidden>
            <motion.text
              x="70" y="52"
              fontFamily="Pinyon Script, cursive"
              fontSize="52"
              textAnchor="middle"
              fill="none"
              stroke="#C9A96E"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              S &amp; A
            </motion.text>
          </svg>

          {/* Progress line */}
          <div className="w-24 h-px bg-gold/20 mt-6 overflow-hidden relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gold"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
