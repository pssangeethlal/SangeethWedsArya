import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { primaryEvent } from '../lib/invite'

interface EnvelopeProps {
  onOpen: () => void
}

type Phase = 'idle' | 'opening' | 'done'

const EASE = [0.22, 1, 0.36, 1] as const

const PAPER_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"

/* ---------------------------------------------------------------- botanicals */

// One sprig: stem, paired leaves, a small blossom at the tip.
function Sprig() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <path d="M0 34 C 2 22, -2 12, 0 0" />
      {[0, 1, 2].map((i) => {
        const y = 26 - i * 8
        const s = 1 - i * 0.18
        return (
          <g key={i}>
            <path d={`M0 ${y} C ${-7 * s} ${y - 2}, ${-10 * s} ${y - 7}, ${-4 * s} ${y - 9}
                      C ${-1 * s} ${y - 7}, ${-1 * s} ${y - 3}, 0 ${y}`} />
            <path d={`M0 ${y - 4} C ${7 * s} ${y - 6}, ${10 * s} ${y - 11}, ${4 * s} ${y - 13}
                      C ${1 * s} ${y - 11}, ${1 * s} ${y - 7}, 0 ${y - 4}`} />
          </g>
        )
      })}
      {/* blossom */}
      <g transform="translate(0,-3)">
        {Array.from({ length: 5 }).map((_, i) => (
          <ellipse key={i} cx="0" cy="-3.6" rx="2.1" ry="3.6" transform={`rotate(${i * 72})`} />
        ))}
        <circle cx="0" cy="0" r="1.1" />
      </g>
    </g>
  )
}

// Scattered, low-contrast blind emboss. The white drop-shadow under a faint
// warm stroke is what sells "pressed into the paper" rather than "printed on".
function EmbossBotanicals() {
  const placements = [
    { x: 74, y: 92, r: -18, s: 1.1 },
    { x: 226, y: 52, r: 12, s: 0.82 },
    { x: 386, y: 98, r: 24, s: 1.0 },
    { x: 512, y: 62, r: -10, s: 0.78 },
    { x: 128, y: 232, r: 8, s: 0.88 },
    { x: 336, y: 250, r: -14, s: 1.05 },
    { x: 500, y: 236, r: 18, s: 0.85 },
    { x: 240, y: 344, r: 4, s: 0.92 },
    { x: 52, y: 340, r: 32, s: 0.72 },
    { x: 428, y: 352, r: -28, s: 0.78 },
  ]

  return (
    <svg
      viewBox="0 0 580 400"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        color: 'rgba(146,124,96,0.30)',
        filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.9))',
        pointerEvents: 'none',
      }}
      aria-hidden
    >
      {placements.map((p, i) => (
        <g key={i} transform={`translate(${p.x},${p.y}) rotate(${p.r}) scale(${p.s})`}>
          <Sprig />
        </g>
      ))}
      {/* trailing vines */}
      <g fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.75">
        <path d="M8 168 C 68 148, 110 188, 172 164" />
        <path d="M312 214 C 372 194, 414 234, 476 210" />
        <path d="M196 394 C 228 368, 288 368, 320 394" />
        <path d="M436 128 C 478 112, 520 140, 566 122" />
      </g>
    </svg>
  )
}

/* --------------------------------------------------------------------- seal */

// Irregular perimeter + a couple of drips: pressed wax, not a stamped circle.
const WAX_BLOB =
  `M50 6
   C 66 5, 82 14, 89 29
   C 96 43, 95 55, 90 68
   C 85 81, 72 92, 56 94
   C 41 96, 25 91, 15 79
   C 5 67, 3 51, 7 37
   C 12 21, 27 8, 42 6
   Z`

function WaxSeal() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="waxFill" cx="36%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#93374A" />
          <stop offset="48%" stopColor="#6E1F2B" />
          <stop offset="100%" stopColor="#45101B" />
        </radialGradient>
        <radialGradient id="waxRim" cx="50%" cy="50%" r="50%">
          <stop offset="72%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(38,8,14,0.55)" />
        </radialGradient>
      </defs>

      {/* melted drips */}
      <ellipse cx="18" cy="76" rx="7" ry="5" fill="#5C1723" opacity="0.9" />
      <ellipse cx="84" cy="40" rx="6" ry="4.4" fill="#5C1723" opacity="0.85" />

      <path d={WAX_BLOB} fill="url(#waxFill)" />
      <path d={WAX_BLOB} fill="url(#waxRim)" />

      {/* soft top-left sheen */}
      <ellipse cx="36" cy="30" rx="19" ry="14" fill="rgba(255,170,160,0.16)" transform="rotate(-24 36 30)" />

      {/* single-line floral emblem, debossed */}
      <g
        transform="translate(50,50)"
        fill="none"
        stroke="rgba(255,206,190,0.42)"
        strokeWidth="1.15"
        strokeLinecap="round"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <ellipse key={i} cx="0" cy="-11" rx="4.6" ry="10.5" transform={`rotate(${i * 60})`} />
        ))}
        <circle cx="0" cy="0" r="3.4" />
        <path d="M-19 17 C -9 12, 9 12, 19 17" strokeWidth="0.9" opacity="0.75" />
      </g>
    </svg>
  )
}

/* ----------------------------------------------------------------- envelope */

// X-fold: four triangles tile the square. Each flap is a full-size layer
// clipped to its triangle, so the emboss pattern stays continuous across
// the seams, and each hinges on its own outer edge.
// Flaps meet slightly ABOVE centre (46%), the way a real envelope back does —
// a dead-centre meet on a square reads as folded paper, not stationery.
const MEET = '46%'

// Only the top flap opens — the other three are the sealed envelope back and
// stay put. `shade` fakes their real fold order: sides tuck in first
// (darkest), bottom folds over them, top flap closes last on top.
const FLAPS = [
  { key: 'left', clip: `polygon(0 0, 0 100%, 50% ${MEET})`, origin: 'left center', opens: false, shade: 0.955 },
  { key: 'right', clip: `polygon(100% 0, 100% 100%, 50% ${MEET})`, origin: 'right center', opens: false, shade: 0.955 },
  { key: 'bottom', clip: `polygon(0 100%, 100% 100%, 50% ${MEET})`, origin: 'center bottom', opens: false, shade: 0.982 },
  { key: 'top', clip: `polygon(0 0, 100% 0, 50% ${MEET})`, origin: 'center top', opens: true, shade: 1 },
] as const

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  // Opened flaps fold behind the envelope body.
  const [flapsBehind, setFlapsBehind] = useState(false)
  const reduced = useReducedMotion() ?? false
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  const handleOpen = useCallback(() => {
    if (phase !== 'idle') return
    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms))

    setPhase('opening')

    if (reduced) {
      setFlapsBehind(true)
      at(220, () => setPhase('done'))
      at(440, onOpen)
      return
    }

    at(620, () => setFlapsBehind(true))
    at(1700, () => setPhase('done'))
    at(2000, onOpen)
  }, [phase, reduced, onOpen])

  const open = phase === 'opening' || phase === 'done'

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 36,
        background: 'radial-gradient(ellipse at 50% 42%, #F2EADD 0%, #E3D9C8 62%, #D6CAB6 100%)',
        overflow: 'hidden',
        perspective: 1500,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        role="button"
        tabIndex={phase === 'idle' ? 0 : -1}
        aria-label="Open the wedding invitation"
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (phase === 'idle' && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleOpen()
          }
        }}
        style={{
          position: 'relative',
          width: 'min(450px, 88vw)',
          aspectRatio: '1.45 / 1',
          transformStyle: 'preserve-3d',
          cursor: phase === 'idle' ? 'pointer' : 'default',
          filter: 'drop-shadow(0 18px 30px rgba(120,100,78,0.28))',
        }}
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        animate={
          phase === 'done'
            ? { opacity: 0, y: -22, scale: 1.02 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: reduced ? 0.2 : 0.7, ease: EASE }}
      >
        {/* Envelope body */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: 'linear-gradient(155deg, #F6EFE1 0%, #EDE3D0 100%)',
            backgroundImage: `${PAPER_GRAIN}, linear-gradient(155deg, #F6EFE1 0%, #EDE3D0 100%)`,
            backgroundBlendMode: 'multiply, normal',
            borderRadius: 3,
          }}
          aria-hidden
        />

        {/* Letter */}
        <motion.div
          style={{
            position: 'absolute',
            left: '6%',
            top: '7%',
            width: '88%',
            height: '86%',
            zIndex: 2,
            background: 'linear-gradient(150deg, #FDF8EC 0%, #F7EFDD 100%)',
            border: '1px solid rgba(168,142,100,0.35)',
            borderRadius: 2,
            boxShadow: '0 10px 22px -12px rgba(90,70,50,0.45)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(8px, 2.4vw, 14px)',
            padding: 'clamp(16px, 5vw, 30px)',
            textAlign: 'center',
          }}
          initial={{ y: 0 }}
          animate={{ y: open ? '-72%' : 0 }}
          transition={{ duration: reduced ? 0.2 : 0.85, delay: reduced ? 0 : 0.62, ease: EASE }}
          aria-hidden
        >
          <div
            style={{
              position: 'absolute',
              inset: 9,
              border: '1px solid rgba(168,142,100,0.28)',
              borderRadius: 1,
              pointerEvents: 'none',
            }}
          />

          <p
            style={{
              fontFamily: 'Marcellus, serif',
              fontSize: 'clamp(8px, 2.2vw, 10px)',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'rgba(110,31,43,0.7)',
              margin: 0,
            }}
          >
            You are invited
          </p>

          <p
            className="gold-foil"
            style={{
              fontFamily: '"Pinyon Script", cursive',
              fontSize: 'clamp(26px, 7.2vw, 42px)',
              lineHeight: 1.1,
              margin: 0,
              whiteSpace: 'nowrap',
            }}
          >
            Sangeeth &amp; Arya
          </p>

          <div style={{ width: 52, height: 1, background: 'rgba(168,142,100,0.5)' }} />

          <p
            style={{
              fontFamily: 'Marcellus, serif',
              fontSize: 'clamp(10px, 2.6vw, 12px)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--maroon)',
              margin: 0,
            }}
          >
            {primaryEvent.dateDisplay}
          </p>
        </motion.div>

        {/* Four X-fold flaps */}
        {FLAPS.map((f) => (
          <motion.div
            key={f.key}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: f.opens && flapsBehind ? 0 : 5,
              clipPath: f.clip,
              transformOrigin: f.origin,
              backgroundImage: `${PAPER_GRAIN}, linear-gradient(155deg, #F8F1E4 0%, #EFE5D2 55%, #E7DBC5 100%)`,
              backgroundBlendMode: 'multiply, normal',
              filter: `brightness(${f.shade}) drop-shadow(0 1px 2px rgba(126,104,78,0.30))`,
            }}
            animate={{ rotateX: open && f.opens ? -180 : 0 }}
            transition={{ duration: reduced ? 0.2 : 0.8, delay: reduced ? 0 : 0.14, ease: EASE }}
            aria-hidden
          >
            <EmbossBotanicals />
          </motion.div>
        ))}

        {/* Wax seal at the fold centre */}
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            top: MEET,
            width: 'clamp(54px, 15vw, 76px)',
            height: 'clamp(54px, 15vw, 76px)',
            zIndex: 6,
            pointerEvents: 'none',
            filter: 'drop-shadow(0 3px 5px rgba(70,30,30,0.35))',
          }}
          initial={{ x: '-50%', y: '-50%', opacity: 1, scale: 1 }}
          animate={{ x: '-50%', y: '-50%', opacity: open ? 0 : 1, scale: open ? 0.78 : 1 }}
          transition={{ duration: reduced ? 0.15 : 0.34, ease: 'easeOut' }}
          aria-hidden
        >
          <WaxSeal />
        </motion.div>
      </motion.div>

      {/* Prompt */}
      <motion.p
        style={{
          fontFamily: 'Marcellus, serif',
          fontSize: 10,
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          color: '#8A7359',
          margin: 0,
          pointerEvents: 'none',
        }}
        animate={{ opacity: phase === 'idle' ? [0.5, 1, 0.5] : 0 }}
        transition={
          phase === 'idle'
            ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
      >
        Tap to open
      </motion.p>
    </motion.div>
  )
}
