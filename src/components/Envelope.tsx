import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Particles from './Particles'

interface EnvelopeProps {
  onOpen: () => void
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [opening, setOpening] = useState(false)
  const [opened, setOpened] = useState(false)

  const handleOpen = () => {
    setOpening(true)
    setTimeout(() => {
      setOpened(true)
      setTimeout(onOpen, 800)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-ivory flex flex-col items-center justify-center z-50 overflow-hidden">
      <Particles />

      <AnimatePresence>
        {!opened && (
          <motion.div
            className="flex flex-col items-center gap-8 z-10"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Tagline */}
            <motion.p
              className="font-display italic text-ink-soft text-lg tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              You're invited to celebrate
            </motion.p>

            {/* Envelope SVG */}
            <motion.div
              className="relative w-72 sm:w-96 cursor-pointer select-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ perspective: 1000 }}
            >
              <svg
                viewBox="0 0 384 256"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full drop-shadow-[0_8px_32px_rgba(58,47,42,0.15)]"
              >
                {/* Envelope body */}
                <rect x="2" y="80" width="380" height="174" rx="4" fill="#FBF7F2" stroke="#C9A96E" strokeWidth="1.5" />

                {/* Envelope bottom-left triangle */}
                <path d="M2 84 L192 200 L382 84" stroke="#C9A96E" strokeWidth="1" fill="none" opacity="0.4" />

                {/* Left triangle fold */}
                <path d="M2 84 L2 254 L192 200 Z" fill="#F5EDE3" stroke="#C9A96E" strokeWidth="0.8" />
                {/* Right triangle fold */}
                <path d="M382 84 L382 254 L192 200 Z" fill="#F0E8DC" stroke="#C9A96E" strokeWidth="0.8" />
                {/* Bottom fold */}
                <path d="M2 254 L192 200 L382 254 Z" fill="#EDE4D8" stroke="#C9A96E" strokeWidth="0.8" />

                {/* Envelope flap — animates open */}
                <motion.g
                  style={{ transformOrigin: '192px 80px', transformBox: 'fill-box' }}
                  animate={opening ? { rotateX: -180 } : { rotateX: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <path d="M2 80 L192 190 L382 80 L192 2 Z" fill="#FBF7F2" stroke="#C9A96E" strokeWidth="1.5" />
                  {/* Flap inner shadow */}
                  <path d="M12 78 L192 184 L372 78" stroke="#C9A96E" strokeWidth="0.5" opacity="0.3" fill="none" />
                </motion.g>

                {/* Wax seal */}
                <motion.g
                  animate={opening ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformOrigin: '192px 168px', transformBox: 'fill-box' }}
                >
                  <circle cx="192" cy="168" r="28" fill="#B07A75" opacity="0.9" />
                  <circle cx="192" cy="168" r="24" fill="none" stroke="#E5D4A8" strokeWidth="1" opacity="0.6" />
                  <text
                    x="192"
                    y="175"
                    fontFamily="serif"
                    fontSize="16"
                    fontStyle="italic"
                    textAnchor="middle"
                    fill="#FBF7F2"
                    opacity="0.95"
                  >
                    S & A
                  </text>
                </motion.g>
              </svg>

              {/* Letter sliding out */}
              <AnimatePresence>
                {opening && (
                  <motion.div
                    className="absolute left-4 right-4 bottom-8 bg-ivory border border-gold/40 rounded-sm shadow-lg flex items-center justify-center"
                    style={{ height: 120 }}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -100, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="text-center">
                      <p className="font-display italic text-ink-soft text-sm">with love,</p>
                      <p className="font-display text-gold text-xl tracking-wide">Sangeeth & Arya</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Open button */}
            <motion.button
              className="btn-gold z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleOpen}
              disabled={opening}
              aria-label="Open the wedding invitation"
            >
              Open Invitation
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
