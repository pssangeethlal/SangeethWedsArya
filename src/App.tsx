import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Envelope from './components/Envelope'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import CoupleSection from './components/CoupleSection'
import EventCard from './components/EventCard'
import Gallery from './components/Gallery'
import Footer from './components/Footer'
import BotanicalDivider from './components/BotanicalDivider'
import AmbientScene from './components/AmbientScene'
import CursorTrail from './components/CursorTrail'
import { ScrollProgressTrack, ScrollIndicator, MapFAB } from './components/ScrollProgress'
import { weddingEvent, receptionEvent } from './lib/calendar'

const VENUE_MAP_URL = 'https://maps.app.goo.gl/FqXUdBE8PCmXdsFX9'

export default function App() {
  const [opened, setOpened] = useState(false)
  const [flourish, setFlourish] = useState(false)

  const handleOpen = () => {
    setOpened(true)
    setFlourish(true)
    setTimeout(() => setFlourish(false), 1100)
  }

  return (
    <>
      {/* Ambient layer always behind everything */}
      <AmbientScene active={opened} />
      <CursorTrail />

      <AnimatePresence>
        {!opened && <Envelope onOpen={handleOpen} />}
      </AnimatePresence>

      {/* Gold flourish wash on reveal */}
      <AnimatePresence>
        {flourish && (
          <motion.div
            key="flourish"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], times: [0, 0.4, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 55,
              pointerEvents: 'none',
              background:
                'radial-gradient(circle at center, rgba(242,199,106,0.85) 0%, rgba(232,210,154,0.4) 30%, transparent 70%)',
            }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {opened && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', zIndex: 2 }}
          >
            <Hero />
            <Countdown />
            <BotanicalDivider />
            <CoupleSection />

            <section className="py-24 px-6">
              <motion.div
                className="text-center mb-4"
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
              >
                <p className="section-sub mb-4">Join us for</p>
              </motion.div>
              <EventCard
                title="The Wedding Ceremony"
                date="Sunday, 23 . 08 . 2026"
                time="eleven in the morning"
                venue="M K Convention Centre"
                address="Eramalloor"
                mapUrl="https://maps.app.goo.gl/FqXUdBE8PCmXdsFX9"
                calEvent={weddingEvent}
              />
            </section>

            <BotanicalDivider />

            <section className="py-24 px-6">
              <EventCard
                title="Wedding Reception"
                subtitle="Celebrate with us"
                date="Saturday, 29 . 08 . 2026"
                time="six in the evening"
                venue="Reception Venue"
                mapUrl="https://maps.app.goo.gl/CRo8WU7sw4dCcAjWA"
                calEvent={receptionEvent}
              />
            </section>

            <Gallery />
            <Footer />

            <ScrollProgressTrack />
            <ScrollIndicator />
            <MapFAB mapUrl={VENUE_MAP_URL} />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  )
}
