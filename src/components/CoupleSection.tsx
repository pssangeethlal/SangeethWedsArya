import { motion } from 'framer-motion'
import { groomPhoto, bridePhoto } from '../lib/images'
import BotanicalDivider from './BotanicalDivider'

interface PersonCardProps {
  photo: string | undefined
  name: string
  role: string
  parents: string
  home: string
  delay?: number
}

function PersonCard({ photo, name, role, parents, home, delay = 0 }: PersonCardProps) {
  return (
    <motion.div
      className="flex flex-col items-center text-center gap-5"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-gold/40 shadow-[0_4px_32px_rgba(201,169,110,0.2)]">
          {photo ? (
            <img
              src={photo}
              alt={`Portrait of ${name}`}
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blush to-sage/30 flex items-center justify-center">
              <span className="font-display italic text-2xl text-ink-soft">{name[0]}</span>
            </div>
          )}
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border border-gold bg-ivory flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-gold/60" />
        </div>
      </div>

      <div>
        <p className="section-sub mb-1">{role}</p>
        <h3 className="font-display text-3xl font-light text-ink mb-3">{name}</h3>
        <p className="font-body text-sm text-ink-soft leading-relaxed">{parents}</p>
        <p className="font-body text-xs text-gold tracking-[0.2em] uppercase mt-2">{home}</p>
      </div>
    </motion.div>
  )
}

export default function CoupleSection() {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="section-sub mb-3">With joy in their hearts</p>
        <h2 className="section-heading">The Couple</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-start">
        <PersonCard
          photo={groomPhoto}
          name="Sangeeth Lal P S"
          role="The Groom"
          parents="Son of Suresh Lal & Shyla M N"
          home="Ponnarassery"
          delay={0.1}
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
        />
      </div>

      <BotanicalDivider className="mt-8" />
    </section>
  )
}
