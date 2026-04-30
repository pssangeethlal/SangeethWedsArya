import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="py-16 px-6 text-center border-t border-gold/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-4"
      >
        <span className="font-script text-5xl text-gold">S & A</span>
        <div className="w-24 border-t border-gold/30" aria-hidden />
        <p className="font-display italic text-ink-soft text-lg">With love, 23.08.2026</p>
        <p className="font-body text-xs text-ink-soft/50 tracking-[0.2em] mt-2">
          Made with love for Sangeeth & Arya
        </p>
      </motion.div>
    </footer>
  )
}
