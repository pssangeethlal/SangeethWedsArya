import { motion } from 'framer-motion'

function MonogramMandala() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      <svg
        viewBox="0 0 160 160"
        width="160"
        height="160"
        fill="none"
        className="absolute inset-0"
        aria-hidden
      >
        <defs>
          <radialGradient id="mandalaG" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#E8D29A" />
            <stop offset="100%" stopColor="#A8842F" />
          </radialGradient>
        </defs>
        {/* Concentric rings */}
        <circle cx="80" cy="80" r="74" stroke="url(#mandalaG)" strokeWidth="0.6" opacity="0.5" />
        <circle cx="80" cy="80" r="62" stroke="#A8842F" strokeWidth="0.7" opacity="0.6" strokeDasharray="2 3" />
        <circle cx="80" cy="80" r="50" stroke="#A8842F" strokeWidth="0.8" opacity="0.65" />
        {/* Petals */}
        <g opacity="0.7">
          {Array.from({ length: 16 }).map((_, i) => (
            <g key={i} transform={`rotate(${(i * 360) / 16} 80 80)`}>
              <path
                d="M80 16 Q86 36 80 56 Q74 36 80 16 Z"
                fill="url(#mandalaG)"
                opacity="0.55"
              />
            </g>
          ))}
        </g>
        {/* Inner ring with dots */}
        <circle cx="80" cy="80" r="38" stroke="#6E1F2B" strokeWidth="0.5" opacity="0.4" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 12
          return (
            <circle
              key={i}
              cx={80 + Math.cos(a) * 38}
              cy={80 + Math.sin(a) * 38}
              r="1.4"
              fill="#C9A24B"
            />
          )
        })}
        {/* Inner double circle */}
        <circle cx="80" cy="80" r="30" stroke="#A8842F" strokeWidth="0.7" />
        <circle cx="80" cy="80" r="27" stroke="#A8842F" strokeWidth="0.4" opacity="0.5" />
      </svg>

      <span
        className="font-script gold-foil relative z-10"
        style={{ fontSize: 56, lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(110,31,43,0.3))' }}
      >
        S &amp; A
      </span>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="py-20 px-6 text-center relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 1.1 }}
        className="flex flex-col items-center gap-6"
      >
        <MonogramMandala />
        <p className="font-script gold-foil text-3xl mt-2" style={{ lineHeight: 1.2 }}>
          with love
        </p>
        <p className="font-heading text-sm tracking-[0.42em] uppercase text-maroon">
          Sangeeth &amp; Arya
        </p>
        <p className="font-display italic text-ink-soft text-base">23 . 08 . 2026</p>
        <div className="w-24 border-t border-gold/30 mt-2" aria-hidden />
        <p className="font-body text-[10px] text-ink-soft/50 tracking-[0.28em] uppercase mt-1">
          See you there
        </p>
      </motion.div>
    </footer>
  )
}
