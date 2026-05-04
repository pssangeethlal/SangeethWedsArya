import { motion } from 'framer-motion'

export default function BotanicalDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-10 ${className}`} aria-hidden>
      <motion.svg
        width="380"
        height="56"
        viewBox="0 0 380 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, scaleX: 0.4 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="goldStem" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A8842F" stopOpacity="0" />
            <stop offset="20%" stopColor="#C9A24B" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#E8D29A" />
            <stop offset="80%" stopColor="#C9A24B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#A8842F" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="paisleyFill" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#E8D29A" />
            <stop offset="60%" stopColor="#C9A24B" />
            <stop offset="100%" stopColor="#A8842F" />
          </radialGradient>
        </defs>

        {/* Stems */}
        <path d="M4 28 Q80 24 152 28" stroke="url(#goldStem)" strokeWidth="0.8" fill="none" />
        <path d="M228 28 Q300 32 376 28" stroke="url(#goldStem)" strokeWidth="0.8" fill="none" />

        {/* Left leaves */}
        <path d="M50 28 Q56 18 70 22 Q60 28 50 28 Z" fill="#A8B5A0" opacity="0.55" />
        <path d="M88 28 Q94 36 106 32 Q98 28 88 28 Z" fill="#A8B5A0" opacity="0.5" />
        <path d="M122 28 Q128 20 138 24 Q132 28 122 28 Z" fill="#A8B5A0" opacity="0.4" />

        {/* Right leaves */}
        <path d="M330 28 Q324 18 310 22 Q320 28 330 28 Z" fill="#A8B5A0" opacity="0.55" />
        <path d="M292 28 Q286 36 274 32 Q282 28 292 28 Z" fill="#A8B5A0" opacity="0.5" />
        <path d="M258 28 Q252 20 242 24 Q248 28 258 28 Z" fill="#A8B5A0" opacity="0.4" />

        {/* Tiny gold dots along stems */}
        <circle cx="36" cy="28" r="1.4" fill="#C9A24B" opacity="0.7" />
        <circle cx="344" cy="28" r="1.4" fill="#C9A24B" opacity="0.7" />

        {/* Center paisley — left mirror */}
        <g transform="translate(178 28)">
          <path
            d="M0 0 C-2 -10 -10 -16 -18 -10 C-22 -6 -22 0 -16 4 C-10 8 -2 6 0 0 Z"
            fill="url(#paisleyFill)"
            opacity="0.75"
          />
          <path
            d="M-4 -2 C-6 -7 -11 -10 -15 -7 C-17 -5 -16 -2 -13 -1"
            stroke="#6E1F2B"
            strokeWidth="0.5"
            fill="none"
            opacity="0.4"
          />
          <circle cx="-13" cy="-3" r="1" fill="#6E1F2B" opacity="0.5" />
        </g>

        {/* Center paisley — right mirror */}
        <g transform="translate(202 28) scale(-1 1)">
          <path
            d="M0 0 C-2 -10 -10 -16 -18 -10 C-22 -6 -22 0 -16 4 C-10 8 -2 6 0 0 Z"
            fill="url(#paisleyFill)"
            opacity="0.75"
          />
          <path
            d="M-4 -2 C-6 -7 -11 -10 -15 -7 C-17 -5 -16 -2 -13 -1"
            stroke="#6E1F2B"
            strokeWidth="0.5"
            fill="none"
            opacity="0.4"
          />
          <circle cx="-13" cy="-3" r="1" fill="#6E1F2B" opacity="0.5" />
        </g>

        {/* Center diamond/jewel */}
        <g transform="translate(190 28)">
          <circle r="3.5" fill="url(#paisleyFill)" />
          <circle r="5.5" stroke="#C9A24B" strokeWidth="0.5" fill="none" opacity="0.6" />
          <circle r="8" stroke="#6E1F2B" strokeWidth="0.4" fill="none" opacity="0.35" strokeDasharray="1 1.5" />
        </g>
      </motion.svg>
    </div>
  )
}
