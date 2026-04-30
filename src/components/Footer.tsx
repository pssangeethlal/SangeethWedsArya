import { motion } from 'framer-motion'

function MonogramWreath() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      {/* Wreath SVG */}
      <svg
        viewBox="0 0 120 120"
        width="120"
        height="120"
        fill="none"
        className="absolute inset-0 opacity-55"
        aria-hidden
      >
        {/* Left wreath arc */}
        <path d="M22,90 C10,72 8,50 20,34" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" fill="none"/>
        <path d="M18,86 C6,68 4,46 16,30" stroke="#C9A96E" strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.5"/>
        {/* Right wreath arc */}
        <path d="M98,90 C110,72 112,50 100,34" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" fill="none"/>
        <path d="M102,86 C114,68 116,46 104,30" stroke="#C9A96E" strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.5"/>

        {/* Left leaves */}
        <ellipse cx="17" cy="72" rx="6" ry="3" fill="none" stroke="#A8B5A0" strokeWidth="0.8" transform="rotate(-60,17,72)" opacity="0.7"/>
        <ellipse cx="14" cy="58" rx="6" ry="3" fill="none" stroke="#A8B5A0" strokeWidth="0.8" transform="rotate(-70,14,58)" opacity="0.6"/>
        <ellipse cx="16" cy="44" rx="5" ry="2.5" fill="none" stroke="#A8B5A0" strokeWidth="0.8" transform="rotate(-50,16,44)" opacity="0.6"/>
        <ellipse cx="21" cy="32" rx="5" ry="2.5" fill="none" stroke="#A8B5A0" strokeWidth="0.8" transform="rotate(-40,21,32)" opacity="0.5"/>

        {/* Right leaves */}
        <ellipse cx="103" cy="72" rx="6" ry="3" fill="none" stroke="#A8B5A0" strokeWidth="0.8" transform="rotate(60,103,72)" opacity="0.7"/>
        <ellipse cx="106" cy="58" rx="6" ry="3" fill="none" stroke="#A8B5A0" strokeWidth="0.8" transform="rotate(70,106,58)" opacity="0.6"/>
        <ellipse cx="104" cy="44" rx="5" ry="2.5" fill="none" stroke="#A8B5A0" strokeWidth="0.8" transform="rotate(50,104,44)" opacity="0.6"/>
        <ellipse cx="99" cy="32" rx="5" ry="2.5" fill="none" stroke="#A8B5A0" strokeWidth="0.8" transform="rotate(40,99,32)" opacity="0.5"/>

        {/* Small gold berries */}
        <circle cx="14" cy="80" r="2" fill="#C9A96E" opacity="0.5"/>
        <circle cx="12" cy="50" r="1.5" fill="#C9A96E" opacity="0.4"/>
        <circle cx="106" cy="80" r="2" fill="#C9A96E" opacity="0.5"/>
        <circle cx="108" cy="50" r="1.5" fill="#C9A96E" opacity="0.4"/>

        {/* Bottom ribbon bow */}
        <path d="M48,98 C44,102 36,104 38,100 C40,96 48,98 60,99 C72,98 80,96 82,100 C84,104 76,102 72,98"
          stroke="#C9A96E" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
        <path d="M60,99 L60,104" stroke="#C9A96E" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>

        {/* Top arc / crown */}
        <path d="M38,22 C48,14 72,14 82,22" stroke="#C9A96E" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6"/>
        <circle cx="60" cy="14" r="2" fill="#C9A96E" opacity="0.55"/>
      </svg>

      {/* Monogram centred inside wreath */}
      <span className="font-script text-5xl text-gold relative z-10" style={{ lineHeight: 1 }}>
        S &amp; A
      </span>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="py-16 px-6 text-center border-t border-gold/20">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="flex flex-col items-center gap-5"
      >
        <MonogramWreath />
        <div className="w-24 border-t border-gold/30" aria-hidden />
        <p className="font-display italic text-ink-soft text-lg">With love, 23 . 08 . 2026</p>
        <p className="font-body text-xs text-ink-soft/40 tracking-[0.2em] mt-1">
          Made with love for Sangeeth &amp; Arya
        </p>
      </motion.div>
    </footer>
  )
}
