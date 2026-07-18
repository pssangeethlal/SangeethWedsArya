import { useState } from 'react'
import { motion } from 'framer-motion'

// No backend — RSVP opens the guest's mail client addressed to the couple.
// Change this to the couple's preferred inbox.
const RSVP_EMAIL = 'pssangeethlal@gmail.com'

const labelStyle: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 10,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'var(--ink-soft)',
  fontWeight: 600,
  marginBottom: 6,
  display: 'block',
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: '"Cormorant Garamond", serif',
  fontSize: 17,
  color: 'var(--ink)',
  background: 'rgba(255,255,255,0.7)',
  border: '1px solid rgba(201,162,75,0.4)',
  borderRadius: 6,
  padding: '10px 14px',
  outline: 'none',
}

export default function Rsvp() {
  const [name, setName] = useState('')
  const [guests, setGuests] = useState('1')
  const [attending, setAttending] = useState<'yes' | 'no'>('yes')
  const [message, setMessage] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = `RSVP — ${name || 'Guest'} (${attending === 'yes' ? 'Attending' : 'Regrets'})`
    const body = [
      `Name: ${name}`,
      `Attending: ${attending === 'yes' ? 'Yes' : 'No'}`,
      `Number of guests: ${guests}`,
      '',
      `Message: ${message}`,
    ].join('\n')
    window.location.href =
      `mailto:${RSVP_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <section id="rsvp" aria-label="RSVP" className="py-24 px-6">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      >
        <p className="section-sub mb-3">Kindly reply</p>
        <h2 className="section-heading-script gold-foil">RSVP</h2>
      </motion.div>

      <motion.form
        onSubmit={onSubmit}
        className="card-glass max-w-md mx-auto p-8 sm:p-10"
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          borderRadius: 6,
          border: '1px solid rgba(201,162,75,0.45)',
          boxShadow: '0 12px 36px -8px rgba(110,31,43,0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="rsvp-name" style={labelStyle}>Your name</label>
          <input
            id="rsvp-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={fieldStyle}
            placeholder="Full name"
          />
        </div>

        <fieldset style={{ border: 'none', padding: 0, margin: '0 0 18px' }}>
          <legend style={labelStyle}>Will you attend?</legend>
          <div style={{ display: 'flex', gap: 12 }}>
            {(['yes', 'no'] as const).map((v) => (
              <label
                key={v}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 16,
                  color: attending === v ? 'white' : 'var(--ink)',
                  background: attending === v ? 'var(--maroon)' : 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(201,162,75,0.4)',
                  transition: 'all 220ms ease',
                }}
              >
                <input
                  type="radio"
                  name="attending"
                  value={v}
                  checked={attending === v}
                  onChange={() => setAttending(v)}
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                />
                {v === 'yes' ? 'Joyfully accept' : 'Regretfully decline'}
              </label>
            ))}
          </div>
        </fieldset>

        <div style={{ marginBottom: 18 }}>
          <label htmlFor="rsvp-guests" style={labelStyle}>Number of guests</label>
          <select
            id="rsvp-guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            style={fieldStyle}
          >
            {['1', '2', '3', '4', '5+'].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label htmlFor="rsvp-message" style={labelStyle}>Message (optional)</label>
          <textarea
            id="rsvp-message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ ...fieldStyle, resize: 'vertical' }}
            placeholder="A note for the couple"
          />
        </div>

        <button type="submit" className="btn-gold w-full" style={{ borderRadius: 6 }}>
          Send RSVP
        </button>
        <p className="section-sub" style={{ textAlign: 'center', marginTop: 14, opacity: 0.7 }}>
          Opens your email to send
        </p>
      </motion.form>
    </section>
  )
}
