import { useState } from 'react'
import { motion } from 'framer-motion'
import { allImages } from '../lib/images'
import Lightbox from './Lightbox'
import BotanicalDivider from './BotanicalDivider'

export default function Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const images = allImages

  const prev = () => setLightboxIdx((i) => (i === null ? null : (i - 1 + images.length) % images.length))
  const next = () => setLightboxIdx((i) => (i === null ? null : (i + 1) % images.length))

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="section-sub mb-3">Moments captured</p>
        <h2 className="section-heading">Our Gallery</h2>
      </motion.div>

      {images.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-blush/20 border border-gold/20 rounded-sm flex items-center justify-center"
            >
              <p className="font-body text-xs text-ink-soft text-center px-4">Photo coming soon</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((src, i) => (
            <motion.button
              key={src}
              className="break-inside-avoid w-full block overflow-hidden rounded-sm group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setLightboxIdx(i)}
              aria-label={`Open photo ${i + 1} in lightbox`}
            >
              <img
                src={src}
                alt={`Wedding photo ${i + 1}`}
                loading="lazy"
                className="w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:sepia-[0.3]"
              />
            </motion.button>
          ))}
        </div>
      )}

      <BotanicalDivider className="mt-12" />

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
