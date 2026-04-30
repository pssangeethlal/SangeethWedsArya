import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { heroPhoto } from '../lib/images'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -30])

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
          <div className="w-full h-full bg-gradient-to-br from-blush via-ivory to-sage/30" />
        )}
        <div className="absolute inset-0 bg-ink/40" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center text-ivory px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <motion.p
          className="font-body text-xs tracking-[0.35em] uppercase text-gold-light mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Together with their families
        </motion.p>

        <motion.h1
          className="font-display font-light text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-none mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Sangeeth{' '}
          <span className="font-script italic text-gold-light">&</span>
          {' '}Arya
        </motion.h1>

        <motion.p
          className="font-body font-light text-sm tracking-[0.3em] text-ivory/80 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          23 . 08 . 2026
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ivory/60"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  )
}
