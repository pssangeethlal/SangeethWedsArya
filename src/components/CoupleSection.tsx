import { motion } from 'framer-motion'
import { groomPhoto, bridePhoto } from '../lib/images'
import BotanicalDivider from './BotanicalDivider'

// Random rotations cycled per card (scrapbook feel)
const ROTATIONS = [3, -4, 2, -3]

interface PersonCardProps {
  photo: string | undefined
  name: string
  role: string
  parents: string
  home: string
  mapUrl?: string
  delay?: number
  rotIdx?: number
}

function PersonCard({ photo, name, role, parents, home, mapUrl, delay = 0, rotIdx = 0 }: PersonCardProps) {
  const rot = ROTATIONS[rotIdx % ROTATIONS.length]

  return (
    <motion.div
      className="flex flex-col items-center text-center gap-6"
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Rotated double-border frame */}
      <div className="relative" style={{ width: 220, height: 220 }}>
        {/* Outer rotated border */}
        <div
          className="absolute"
          style={{
            inset: -14,
            border: '1px solid rgba(201,169,110,0.55)',
            transform: `rotate(${rot}deg)`,
            borderRadius: 4,
          }}
          aria-hidden
        />
        {/* Inner rotated border */}
        <div
          className="absolute"
          style={{
            inset: -8,
            border: '1px solid rgba(201,169,110,0.35)',
            transform: `rotate(${-rot * 0.7}deg)`,
            borderRadius: 4,
          }}
          aria-hidden
        />
        {/* Photo */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ borderRadius: 6 }}
        >
          {photo ? (
            <img
              src={photo}
              alt={`Portrait of ${name}`}
              className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
              loading="lazy"
              style={{ filter: 'sepia(0.1) saturate(0.92)' }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blush to-sage/30 flex items-center justify-center">
              <span className="font-display italic text-3xl text-ink-soft">{name[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="section-sub mb-2">{role}</p>
        <h3 className="font-display text-3xl font-light text-ink mb-3">{name}</h3>
        <p className="font-body text-sm text-ink-soft leading-relaxed max-w-[260px]">{parents}</p>

        {/* Home location button */}
        {mapUrl ? (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full border border-gold/30 bg-white/80 backdrop-blur-sm text-ink text-[10px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 hover:bg-gold hover:text-ivory hover:border-gold hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(201,169,110,0.25)] group"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
              <path d="M6.5 1C4.567 1 3 2.567 3 4.5c0 2.5 3.5 7.5 3.5 7.5S10 7 10 4.5C10 2.567 8.433 1 6.5 1z"/>
              <circle cx="6.5" cy="4.5" r="1.2"/>
            </svg>
            {home}
          </a>
        ) : (
          <p className="font-body text-xs text-gold tracking-[0.2em] uppercase mt-2">{home}</p>
        )}
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
          role="The Groom"
          parents="Son of Suresh Lal & Shyla M N"
          home="Ponnarassery"
          delay={0.1}
          rotIdx={0}
        />

        <div className="hidden md:flex items-center justify-center">
          <BotanicalDivider className="rotate-90" />
        </div>

        <div className="md:hidden">
          <BotanicalDivider />
        </div>

        <PersonCard
          photo={bridePhoto}
          name="Arya"
          role="The Bride"
          parents="Daughter of Sajeevan & Kiran"
          home="Kumaravilasam"
          delay={0.2}
          rotIdx={1}
        />
      </div>

      <BotanicalDivider className="mt-8" />
    </section>
  )
}
