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
import { weddingEvent, receptionEvent } from './lib/calendar'

export default function App() {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <AnimatePresence>
        {!opened && <Envelope onOpen={() => setOpened(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {opened && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Hero />
            <Countdown />
            <BotanicalDivider />
            <CoupleSection />

            {/* Wedding Ceremony */}
            <section className="py-24 px-6">
              <motion.div
                className="text-center mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <p className="section-sub mb-4">Join us for</p>
              </motion.div>
              <div className="relative">
                <EventCard
                  title="The Wedding Ceremony"
                  date="Sunday, 23 August 2026"
                  time="11:00 AM IST"
                  venue="M K Convention Centre"
                  address="Eramalloor"
                  mapUrl="https://maps.app.goo.gl/FqXUdBE8PCmXdsFX9"
                  calEvent={weddingEvent}
                />
              </div>
            </section>

            <BotanicalDivider />

            {/* Reception */}
            {/* TODO: Update time when confirmed. Currently 6:00 PM IST (default). */}
            <section className="py-24 px-6">
              <div className="relative">
                <EventCard
                  title="Wedding Reception"
                  subtitle="Celebrate with us"
                  date="Saturday, 29 August 2026"
                  time="6:00 PM IST"
                  venue="Reception Venue"
                  mapUrl="https://maps.app.goo.gl/CRo8WU7sw4dCcAjWA"
                  calEvent={receptionEvent}
                />
              </div>
            </section>

            <Gallery />
            <Footer />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  )
}
