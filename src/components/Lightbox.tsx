import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface LightboxProps {
  images: string[]
  current: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ images, current, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(110,31,43,0.85) 0%, rgba(20,8,10,0.96) 100%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Close */}
        <button
          className="absolute top-6 right-6 text-ivory/80 hover:text-ivory transition-colors z-10"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <X size={28} />
        </button>

        {/* Prev */}
        {images.length > 1 && (
          <button
            className="absolute left-4 sm:left-8 text-ivory/70 hover:text-ivory transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            aria-label="Previous image"
          >
            <ChevronLeft size={36} />
          </button>
        )}

        {/* Image */}
        <motion.img
          key={current}
          src={images[current]}
          alt={`Gallery photo ${current + 1}`}
          className="max-w-[90vw] max-h-[85vh] object-contain"
          style={{
            border: '6px solid #FBF7F2',
            boxShadow: '0 0 0 1px rgba(201,162,75,0.6), 0 30px 60px -10px rgba(0,0,0,0.6)',
          }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Next */}
        {images.length > 1 && (
          <button
            className="absolute right-4 sm:right-8 text-ivory/70 hover:text-ivory transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); onNext() }}
            aria-label="Next image"
          >
            <ChevronRight size={36} />
          </button>
        )}

        {/* Counter */}
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-xs text-ivory/50 tracking-[0.2em]">
          {current + 1} / {images.length}
        </p>
      </motion.div>
    </AnimatePresence>
  )
}
