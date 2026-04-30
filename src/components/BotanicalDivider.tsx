export default function BotanicalDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`} aria-hidden>
      <svg
        width="320"
        height="48"
        viewBox="0 0 320 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-60"
      >
        {/* Left stem */}
        <path d="M10 24 Q80 20 150 24" stroke="#C9A96E" strokeWidth="0.8" fill="none" />
        {/* Right stem */}
        <path d="M170 24 Q240 28 310 24" stroke="#C9A96E" strokeWidth="0.8" fill="none" />
        {/* Center diamond */}
        <rect x="155" y="19" width="10" height="10" rx="1" transform="rotate(45 160 24)" fill="none" stroke="#C9A96E" strokeWidth="0.8" />
        {/* Left leaves */}
        <path d="M60 24 Q65 14 75 18 Q70 24 60 24Z" fill="#A8B5A0" opacity="0.5" />
        <path d="M100 24 Q105 34 115 30 Q110 24 100 24Z" fill="#A8B5A0" opacity="0.5" />
        <path d="M130 24 Q135 16 143 20 Q138 24 130 24Z" fill="#A8B5A0" opacity="0.4" />
        {/* Right leaves */}
        <path d="M260 24 Q255 14 245 18 Q250 24 260 24Z" fill="#A8B5A0" opacity="0.5" />
        <path d="M220 24 Q215 34 205 30 Q210 24 220 24Z" fill="#A8B5A0" opacity="0.5" />
        <path d="M190 24 Q185 16 177 20 Q182 24 190 24Z" fill="#A8B5A0" opacity="0.4" />
        {/* Tiny dots */}
        <circle cx="40" cy="24" r="1.5" fill="#C9A96E" opacity="0.6" />
        <circle cx="280" cy="24" r="1.5" fill="#C9A96E" opacity="0.6" />
      </svg>
    </div>
  )
}
