import { motion } from 'framer-motion'
import { groomPhoto, bridePhoto } from '../lib/images'
import BotanicalDivider from './BotanicalDivider'

// Arch frame dimensions
const W = 200
const H = 268
const R = W / 2 // full semicircle top

// SVG arch path: flat bottom, straight sides, semicircle arch at top
const archPath = `M0,${H} L0,${R} A${R},${R} 0 0,1 ${W},${R} L${W},${H} Z`
// Inner border slightly inset
const archInner = `M4,${H} L4,${R + 2} A${R - 4},${R - 4} 0 0,1 ${W - 4},${R + 2} L${W - 4},${H} Z`

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
      {/* Left tendril */}
      <path
        d={`M${cx - 2},4 C${cx - 12},-2 ${cx - 22},2 ${cx - 18},8 C${cx - 14},6 ${cx - 8},4 ${cx - 2},4`}
        stroke="#C9A96E" strokeWidth="0.85" fill="none" strokeLinecap="round"
      />
      {/* Right tendril */}
      <path
        d={`M${cx + 2},4 C${cx + 12},-2 ${cx + 22},2 ${cx + 18},8 C${cx + 14},6 ${cx + 8},4 ${cx + 2},4`}
        stroke="#C9A96E" strokeWidth="0.85" fill="none" strokeLinecap="round"
      />
      {/* Centre diamond */}
      <circle cx={cx} cy="4" r="2" fill="#C9A96E" opacity="0.65" />
      <circle cx={cx} cy="4" r="3.5" fill="none" stroke="#C9A96E" strokeWidth="0.6" opacity="0.4" />
      {/* Small leaves on tendrils */}
      <ellipse cx={cx - 12} cy="3" rx="3" ry="1.8" fill="none" stroke="#C9A96E" strokeWidth="0.6"
        transform={`rotate(-20,${cx - 12},3)`} opacity="0.6" />
      <ellipse cx={cx + 12} cy="3" rx="3" ry="1.8" fill="none" stroke="#C9A96E" strokeWidth="0.6"
        transform={`rotate(20,${cx + 12},3)`} opacity="0.6" />
    </>
  )
}

function PersonCard({ photo, name, nameDisplay, role, parents, home, delay = 0 }: PersonCardProps) {
  // Sanitise name for SVG id — no spaces or special chars
  const clipId = `arch-${name.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <motion.div
      className="flex flex-col items-center text-center gap-6"
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Arch frame */}
      <div style={{ position: 'relative', width: W, height: H }}>
        {/* SVG clipPath definition */}
        <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden>
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path d={archPath} />
            </clipPath>
          </defs>
        </svg>

        {/* Photo clipped to arch */}
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
              filter: 'sepia(0.08) saturate(0.94)',
              transition: 'filter 400ms ease, transform 600ms cubic-bezier(0.22,1,0.36,1)',
            }}
            onMouseEnter={(e) => {
              const img = e.currentTarget as HTMLImageElement
              img.style.filter = 'sepia(0) saturate(1)'
              img.style.transform = 'scale(1.04)'
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget as HTMLImageElement
              img.style.filter = 'sepia(0.08) saturate(0.94)'
              img.style.transform = 'scale(1)'
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
            <span className="font-display italic text-3xl text-ink-soft">{nameDisplay[0]}</span>
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
          {/* Outer arch border */}
          <path d={archPath} fill="none" stroke="#C9A96E" strokeWidth="1.3" opacity="0.65" />
          {/* Inner arch border (double-line stationery detail) */}
          <path d={archInner} fill="none" stroke="#C9A96E" strokeWidth="0.7" opacity="0.3" />
          {/* Crown flourish */}
          <ArchCrownFlourish />
          {/* Bottom corner ticks */}
          <line x1="0" y1={H - 12} x2="0" y2={H} stroke="#C9A96E" strokeWidth="1" opacity="0.4" />
          <line x1="0" y1={H} x2="12" y2={H} stroke="#C9A96E" strokeWidth="1" opacity="0.4" />
          <line x1={W} y1={H - 12} x2={W} y2={H} stroke="#C9A96E" strokeWidth="1" opacity="0.4" />
          <line x1={W - 12} y1={H} x2={W} y2={H} stroke="#C9A96E" strokeWidth="1" opacity="0.4" />
        </svg>

        {/* Warm ambient shadow beneath */}
        <div
          style={{
            position: 'absolute',
            bottom: -16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70%',
            height: 20,
            background: 'radial-gradient(ellipse, rgba(201,169,110,0.18) 0%, transparent 70%)',
            filter: 'blur(6px)',
            pointerEvents: 'none',
          }}
          aria-hidden
        />
      </div>

      {/* Info */}
      <div>
        <p className="section-sub mb-2">{role}</p>
        <h3 className="font-display text-3xl font-light text-ink mb-3">{nameDisplay}</h3>
        <p className="font-body text-sm text-ink-soft leading-relaxed max-w-[240px]">{parents}</p>
        <p className="font-body text-xs text-gold tracking-[0.22em] uppercase mt-2">{home}</p>
      </div>
    </motion.div>
  )
}

export default function CoupleSection() {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      >
        <p className="section-sub mb-3">With joy in their hearts</p>
        <h2 className="section-heading">The Couple</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-8 items-start justify-items-center">
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
          <BotanicalDivider className="rotate-90" />
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
          delay={0.2}
        />
      </div>

      <BotanicalDivider className="mt-12" />
    </section>
  )
}
