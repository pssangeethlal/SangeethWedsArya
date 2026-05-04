import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { heroPhoto } from '../lib/images'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -40])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.7])

  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with Ken Burns */}
      <motion.div className="absolute inset-0" style={{ y }}>
        {heroPhoto ? (
          <img
            src={heroPhoto}
            alt="Sangeeth and Arya"
            className="w-full h-full object-cover animate-kenburns"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blush via-cream to-sage/30" />
        )}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: overlayOpacity,
            background:
              'radial-gradient(ellipse at center, rgba(42,30,26,0.3) 0%, rgba(42,30,26,0.7) 100%), linear-gradient(180deg, rgba(110,31,43,0.15) 0%, transparent 30%, rgba(42,30,26,0.5) 100%)',
          }}
        />
      </motion.div>

      {/* Decorative top corner ornaments */}
      <div className="absolute top-6 left-6 opacity-70" aria-hidden>
        <CornerOrnament />
      </div>
      <div className="absolute top-6 right-6 opacity-70 scale-x-[-1]" aria-hidden>
        <CornerOrnament />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <motion.p
          className="font-heading text-[11px] tracking-[0.5em] uppercase text-gold-light mb-8"
          initial={{ opacity: 0, y: 20, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.5em' }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          Together with their families
        </motion.p>

        <motion.h1
          className="font-script gold-foil text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] leading-none mb-6"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: 'drop-shadow(0 4px 18px rgba(110,31,43,0.4))' }}
        >
          Sangeeth &amp; Arya
        </motion.h1>

        {/* Animated divider */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <span className="block h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-gold-light to-gold-light" />
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M7 1 L8 6 L13 7 L8 8 L7 13 L6 8 L1 7 L6 6 Z" fill="#E8D29A" opacity="0.9" />
          </svg>
          <span className="block h-px w-16 sm:w-24 bg-gradient-to-l from-transparent via-gold-light to-gold-light" />
        </motion.div>

        <motion.p
          className="font-heading text-sm sm:text-base tracking-[0.42em] uppercase text-ivory/95 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
        >
          are getting married
        </motion.p>

        <motion.p
          className="font-display italic text-lg sm:text-xl text-gold-light/90 mt-5 tracking-[0.25em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.4 }}
        >
          23 . 08 . 2026
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold-light/80"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  )
}

function CornerOrnament() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
      <path
        d="M4 4 L20 4 M4 4 L4 20 M4 4 Q24 8 32 24 Q40 32 56 32"
        stroke="#E8D29A"
        strokeWidth="0.8"
        opacity="0.6"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="20" cy="4" r="1.2" fill="#E8D29A" opacity="0.7" />
      <circle cx="4" cy="20" r="1.2" fill="#E8D29A" opacity="0.7" />
      <path
        d="M14 14 Q20 10 26 16 Q22 22 14 14 Z"
        fill="#E8D29A"
        opacity="0.4"
      />
    </svg>
  )
}
