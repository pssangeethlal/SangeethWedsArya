import { useState } from 'react'
import { motion } from 'framer-motion'
import { allImages } from '../lib/images'
import Lightbox from './Lightbox'
import BotanicalDivider from './BotanicalDivider'

// Cycled rotations — scrapbook / polaroid feel
const ROTATIONS = [-2, 3, -1, 4, -3, 2, -4, 1, 3, -2]

export default function Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const images = allImages

  const prev = () => setLightboxIdx((i) => (i === null ? null : (i - 1 + images.length) % images.length))
  const next = () => setLightboxIdx((i) => (i === null ? null : (i + 1) % images.length))

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      >
        <p className="section-sub mb-3">Moments captured</p>
        <h2 className="section-heading">Our Gallery</h2>
      </motion.div>

      {images.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="aspect-[3/4]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              style={{ transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)` }}
            >
              {/* Polaroid frame */}
              <div className="h-full bg-white shadow-[0_8px_24px_-8px_rgba(58,47,42,0.25)] flex flex-col"
                style={{ padding: '10px 10px 32px' }}>
                <div className="flex-1 bg-blush/20 border border-gold/15 flex items-center justify-center">
                  <p className="font-body text-xs text-ink-soft text-center px-4">Photo coming soon</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="columns-2 md:columns-3 gap-6 space-y-8">
          {images.map((src, i) => {
            const rot = ROTATIONS[i % ROTATIONS.length]
            return (
              <motion.button
                key={src}
                className="break-inside-avoid w-full block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold group"
                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setLightboxIdx(i)}
                aria-label={`Open photo ${i + 1} in lightbox`}
                style={{
                  transform: `rotate(${rot}deg)`,
                  transition: 'transform 400ms cubic-bezier(0.22,1,0.36,1)',
                }}
                whileHover={{
                  rotate: 0,
                  scale: 1.03,
                  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                {/* Polaroid frame */}
                <div
                  className="bg-white transition-shadow duration-400 group-hover:shadow-[0_16px_40px_-10px_rgba(58,47,42,0.35)]"
                  style={{
                    padding: '10px 10px 36px',
                    boxShadow: '0 8px 24px -8px rgba(58,47,42,0.22), 0 2px 6px rgba(58,47,42,0.08)',
                  }}
                >
                  <div className="overflow-hidden">
                    <img
                      src={src}
                      alt={`Wedding photo ${i + 1}`}
                      loading="lazy"
                      className="w-full object-cover block transition-all duration-500 group-hover:scale-[1.04]"
                      style={{
                        filter: 'sepia(0.15) saturate(0.9)',
                        transition: 'filter 400ms ease, transform 500ms cubic-bezier(0.22,1,0.36,1)',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.filter = 'sepia(0) saturate(1)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.filter = 'sepia(0.15) saturate(0.9)' }}
                    />
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      )}

      <BotanicalDivider className="mt-16" />

      {lightboxIdx !== null && (
        <Lightbox
          images={images}
          current={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  )
}
