import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { groomPhoto, bridePhoto } from '../lib/images'
import BotanicalDivider from './BotanicalDivider'

const W = 220
const H = 296
const R = W / 2

const archPath = `M0,${H} L0,${R} A${R},${R} 0 0,1 ${W},${R} L${W},${H} Z`
const archInner = `M5,${H} L5,${R + 3} A${R - 5},${R - 5} 0 0,1 ${W - 5},${R + 3} L${W - 5},${H} Z`

interface PersonCardProps {
  photo: string | undefined
  name: string
  nameDisplay: string
  role: string
  parents: string
  home: string
  delay?: number
}

function ArchCrownFlourish() {
  const cx = W / 2
  return (
    <>
      <path
        d={`M${cx - 2},5 C${cx - 14},-2 ${cx - 26},2 ${cx - 22},10 C${cx - 16},6 ${cx - 8},5 ${cx - 2},5`}
        stroke="#A8842F" strokeWidth="0.95" fill="none" strokeLinecap="round"
      />
      <path
        d={`M${cx + 2},5 C${cx + 14},-2 ${cx + 26},2 ${cx + 22},10 C${cx + 16},6 ${cx + 8},5 ${cx + 2},5`}
        stroke="#A8842F" strokeWidth="0.95" fill="none" strokeLinecap="round"
      />
      <circle cx={cx} cy="5" r="2.4" fill="#C9A24B" />
      <circle cx={cx} cy="5" r="4.5" fill="none" stroke="#A8842F" strokeWidth="0.6" opacity="0.55" />
      <ellipse cx={cx - 14} cy="3" rx="3.5" ry="2" fill="#A8B5A0" stroke="#A8842F" strokeWidth="0.5"
        transform={`rotate(-22,${cx - 14},3)`} opacity="0.65" />
      <ellipse cx={cx + 14} cy="3" rx="3.5" ry="2" fill="#A8B5A0" stroke="#A8842F" strokeWidth="0.5"
        transform={`rotate(22,${cx + 14},3)`} opacity="0.65" />
    </>
  )
}

function PaisleyCorner({ flip = false, vflip = false }: { flip?: boolean; vflip?: boolean }) {
  const tx = `${flip ? 'scaleX(-1)' : ''} ${vflip ? 'scaleY(-1)' : ''}`.trim()
  return (
    <svg
      width="36" height="36" viewBox="0 0 36 36"
      style={{ transform: tx, opacity: 0.7 }}
      aria-hidden
    >
      <path
        d="M3 3 Q14 5 18 14 Q22 22 14 30 M3 3 Q5 13 13 14 M3 3 L10 3 M3 3 L3 10"
        stroke="#A8842F" strokeWidth="0.9" fill="none" strokeLinecap="round"
      />
      <circle cx="3" cy="3" r="1.4" fill="#C9A24B" />
      <circle cx="14" cy="30" r="1.6" fill="#C9A24B" opacity="0.85" />
    </svg>
  )
}

function PersonCard({ photo, name, nameDisplay, role, parents, home, delay = 0 }: PersonCardProps) {
  const clipId = `arch-${name.replace(/\s+/g, '-').toLowerCase()}`
  const wrapRef = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-1, 1], [6, -6]), { stiffness: 120, damping: 16 })
  const ry = useSpring(useTransform(mx, [-1, 1], [-6, 6]), { stiffness: 120, damping: 16 })

  const onMove = (e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mx.set(x * 2)
    my.set(y * 2)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <motion.div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="flex flex-col items-center text-center gap-7 relative"
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      {/* Card frame */}
      <motion.div
        style={{
          position: 'relative',
          width: W + 28,
          padding: 14,
          background: 'linear-gradient(160deg, rgba(255,250,235,0.85) 0%, rgba(248,234,200,0.55) 100%)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(201,162,75,0.45)',
          borderRadius: 6,
          boxShadow: '0 12px 36px -8px rgba(110,31,43,0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
          rotateX: rx,
          rotateY: ry,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Paisley corners */}
        <div style={{ position: 'absolute', top: 4, left: 4 }}><PaisleyCorner /></div>
        <div style={{ position: 'absolute', top: 4, right: 4 }}><PaisleyCorner flip /></div>
        <div style={{ position: 'absolute', bottom: 4, left: 4 }}><PaisleyCorner vflip /></div>
        <div style={{ position: 'absolute', bottom: 4, right: 4 }}><PaisleyCorner flip vflip /></div>

        {/* Arch frame */}
        <div style={{ position: 'relative', width: W, height: H, transform: 'translateZ(20px)' }}>
          <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden>
            <defs>
              <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                <path d={archPath} />
              </clipPath>
            </defs>
          </svg>

          {photo ? (
            <img
              src={photo}
              alt={`Portrait of ${nameDisplay}`}
              loading="lazy"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top',
                clipPath: `url(#${clipId})`,
                filter: 'sepia(0.05) saturate(0.96) contrast(1.02)',
                transition: 'filter 600ms ease, transform 800ms cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute', inset: 0,
                clipPath: `url(#${clipId})`,
                background: 'linear-gradient(160deg, #E8C5C0 0%, #A8B5A0 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span className="font-script text-5xl text-maroon/60">{nameDisplay[0]}</span>
            </div>
          )}

          {/* Arch border SVG overlay */}
          <svg
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            viewBox={`0 0 ${W} ${H}`}
            width={W}
            height={H}
            aria-hidden
          >
            <path d={archPath} fill="none" stroke="#A8842F" strokeWidth="1.5" opacity="0.85" />
            <path d={archInner} fill="none" stroke="#C9A24B" strokeWidth="0.8" opacity="0.55" />
            <ArchCrownFlourish />
          </svg>
        </div>

        {/* Warm shadow */}
        <div
          style={{
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70%',
            height: 24,
            background: 'radial-gradient(ellipse, rgba(110,31,43,0.18) 0%, transparent 70%)',
            filter: 'blur(8px)',
            pointerEvents: 'none',
          }}
          aria-hidden
        />
      </motion.div>

      {/* Info */}
      <div>
        <p className="section-sub mb-2" style={{ color: 'var(--maroon)' }}>{role}</p>
        <h3 className="font-script gold-foil text-5xl mb-3" style={{ lineHeight: 1 }}>{nameDisplay}</h3>
        <p className="font-display italic text-base text-ink-soft leading-relaxed max-w-[260px]">{parents}</p>
        <p className="font-heading text-[11px] text-gold-deep tracking-[0.32em] uppercase mt-3">{home}</p>
      </div>
    </motion.div>
  )
}

function PeacockFeather() {
  return (
    <motion.svg
      width="80"
      height="160"
      viewBox="0 0 80 160"
      fill="none"
      aria-hidden
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <defs>
        <radialGradient id="eye" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#6E1F2B" />
          <stop offset="40%" stopColor="#0F4C5C" />
          <stop offset="70%" stopColor="#C9A24B" />
          <stop offset="100%" stopColor="#A8B5A0" />
        </radialGradient>
      </defs>
      {/* Stem */}
      <motion.path
        d="M40 158 Q42 100 40 30"
        stroke="#A8842F"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      />
      {/* Plumes */}
      {Array.from({ length: 14 }).map((_, i) => {
        const t = i / 13
        const y = 30 + t * 110
        const len = 6 + Math.sin(t * Math.PI) * 18
        return (
          <g key={i} opacity={0.6}>
            <line x1={40} y1={y} x2={40 - len} y2={y - 2} stroke="#A8B5A0" strokeWidth="0.6" />
            <line x1={40} y1={y} x2={40 + len} y2={y - 2} stroke="#A8B5A0" strokeWidth="0.6" />
          </g>
        )
      })}
      {/* Eye */}
      <ellipse cx="40" cy="22" rx="14" ry="20" fill="url(#eye)" opacity="0.85" />
      <ellipse cx="40" cy="18" rx="6" ry="10" fill="#0F4C5C" opacity="0.9" />
      <ellipse cx="40" cy="16" rx="3" ry="5" fill="#6E1F2B" />
      <circle cx="40" cy="14" r="1.5" fill="#FBF7F2" />
    </motion.svg>
  )
}

export default function CoupleSection() {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto relative">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      >
        <p className="section-sub mb-3">With joy in their hearts</p>
        <h2 className="section-heading-script gold-foil">The Couple</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-16 md:gap-10 items-start justify-items-center">
        <PersonCard
          photo={groomPhoto}
          name="Sangeeth Lal P S"
          nameDisplay="Sangeeth Lal"
          role="The Groom"
          parents="Son of Suresh Lal & Shyla M N"
          home="Ponnarassery"
          delay={0.1}
        />

        <div className="hidden md:flex items-center justify-center self-center">
          <PeacockFeather />
        </div>
        <div className="md:hidden">
          <BotanicalDivider />
        </div>

        <PersonCard
          photo={bridePhoto}
          name="Arya"
          nameDisplay="Arya"
          role="The Bride"
          parents="Daughter of Sajeevan & Kiran"
          home="Kumaravilasam"
          delay={0.25}
        />
      </div>

      <BotanicalDivider className="mt-16" />
    </section>
  )
}
