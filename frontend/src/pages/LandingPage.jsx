import { useEffect, useMemo, useRef, useState } from 'react'
import { publicService } from '../services/publicService'
import './LandingPage.css'

const tickerEn = [
  'When will I meet my soulmate or true love? 💕',
  'Will I have a love marriage or arranged marriage? 💍',
  'Will my ex come back into my life? 🔄',
  'When will I get a good job or career breakthrough? 💼',
  'Will my business succeed and grow? 📈',
]

const tickerHi = [
  'मेरी मुलाकात सच्चे प्यार से कब होगी? 💕',
  'मेरी प्रेम विवाह होगी या अरेंज्ड? 💍',
  'क्या मेरा पूर्व-प्रेमी वापस आएगा? 🔄',
  'मुझे अच्छी नौकरी कब मिलेगी? 💼',
  'क्या मेरा व्यापार सफल होगा? 📈',
]

const translations = {
  'AI-powered Vedic Astrology': 'एआई-संचालित वैदिक ज्योतिष',
  'Your trust is our identity': 'आपका विश्वास ही हमारी पहचान है',
  'Get personalized horoscopes, Kundli matching, and live astrology guidance-all in one place.':
    'व्यक्तिगत राशिफल, कुंडली मिलान, और लाइव ज्योतिष मार्गदर्शन-एक ही जगह पर।',
  'Get Your Horoscope': 'अपना राशिफल प्राप्त करें',
  'Generate Kundli': 'कुंडली जेनरेट करें',
  'Talk to an Astrologer': 'ज्योतिषी से बात करें',
  'Visit Shop': 'शॉप देखें',
  'Ask the AI Sage': 'एआई ऋषि से पूछें',
  '1 Question': '1 प्रश्न',
  '2 Questions': '2 प्रश्न',
  Unlimited: 'असीमित',
  Best: 'सर्वश्रेष्ठ',
  'Start Now': 'अभी शुरू करें',
  Home: 'होम',
  Services: 'सेवाएँ',
  Shop: 'शॉप',
  Astrologers: 'ज्योतिषी',
  'Talk to an astrologer': 'ज्योतिषी से बात करें',
  "What's troubling you?": 'आपको किस बात की चिंता है?',
  'The Stars have answers.': 'सितारों के पास जवाब हैं।',
  'Find guidance': 'मार्गदर्शन खोजें',
  'Our Services': 'हमारी सेवाएँ',
  'Six ways to read your stars.': 'अपने सितारों को पढ़ने के छह तरीके।',
  'Daily horoscope': 'दैनिक राशिफल',
  'What the stars say today?': 'आज सितारे क्या कहते हैं?',
  'Choose your zodiac sign and get personalized AI-powered Vedic insights.':
    'अपनी राशि चुनें और व्यक्तिगत एआई-संचालित वैदिक जानकारी प्राप्त करें।',
  'Janam Kundli': 'जन्म कुंडली',
  'Get your astrology reading in seconds': 'कुछ ही सेकंड में अपनी ज्योतिष रिपोर्ट पाएं',
  'Generate my Kundli': 'मेरी कुंडली जेनरेट करें',
  Compatibility: 'संगतता',
  'Two souls, one perfect match.': 'दो दिल, एक बेहतरीन जोड़ी।',
  'Check compatibility': 'संगतता जांचें',
  'Based on traditional Astrology, explained in your language.':
    'पारंपरिक ज्योतिष ज्ञान, आपकी अपनी भाषा में।',
  'Ask the AI sage': 'एआई ऋषि से पूछें',
  'Explore services': 'सेवाएँ देखें',
  'Sacred objects': 'पवित्र वस्तुएं',
  'Crafted with intention.': 'इरादे के साथ तैयार किया गया।',
  'View all': 'सभी देखें',
  'Words from seekers': 'साधकों के शब्द',
  'Loved across India.': 'पूरे भारत की पसंदीदा।',
  Questions: 'प्रश्न',
  'Frequently asked.': 'अक्सर पूछे जाते हैं।',
  Newsletter: 'समाचार पत्र',
  'Receive your weekly cosmic forecast.': 'अपना साप्ताहिक ब्रह्मांडीय पूर्वानुमान प्राप्त करें।',
  Join: 'शामिल हों',
  'Join Us': 'हमसे जुड़ें',
  'Join Our Team': 'हमारी टीम से जुड़ें',
  'Submit Application': 'आवेदन जमा करें',
}

const concerns = [
  { q: 'Love Life Problems?', hi: 'प्रेम जीवन में समस्या?', i: '💔', img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80' },
  { q: 'Looking for a life partner?', hi: 'जीवन साथी की तलाश है?', i: '👥', img: 'https://www.shutterstock.com/image-photo/romantic-engagement-moment-couple-exchanges-260nw-2737811993.jpg' },
  { q: 'Husband / Wife Problems?', hi: 'पति / पत्नी से समस्या?', i: '💔', img: 'https://thumbs.dreamstime.com/b/sad-couple-sitting-back-to-back-argument-sad-couple-sitting-back-to-back-ground-argument-breakup-concept-116795260.jpg' },
  { q: 'Marriage delay?', hi: 'विवाह में देरी?', i: '💎', img: 'https://plus.unsplash.com/premium_photo-1682092632793-c7d75b23718e?w=600&auto=format&fit=crop&q=60' },
  { q: 'Difficulty Getting a Job?', hi: 'नौकरी पाने में दिक्कत?', i: '💼', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80' },
  { q: 'Is Your Business Failing?', hi: 'व्यापार बढ़ नहीं रहा?', i: '📈', img: 'https://www.shutterstock.com/image-vector/businessman-using-trampoline-jump-over-260nw-2588828775.jpg' },
  { q: 'Health or Family problems?', hi: 'स्वास्थ्य या परिवार की समस्या?', i: '🌿', img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80' },
  { q: 'Financial Losses?', hi: 'आर्थिक नुकसान?', i: '💰', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80' },
]

const services = [
  { t: 'Daily Horoscope', hi: 'दैनिक राशिफल', s: 'Personalised daily guidance for your zodiac sign.', img: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1200&q=80', cta: "Read today's horoscope", i: '☀' },
  { t: 'Kundli / Birth Chart', hi: 'कुंडली / जन्म पत्रिका', s: 'Generate your complete Vedic birth chart in seconds.', img: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&w=1200&q=80', cta: 'Generate my Kundli', i: '★' },
  { t: 'Compatibility Match', hi: 'कुंडली मिलान', s: 'Discover the harmony between two souls.', img: 'https://astro-vedicrishi-in.b-cdn.net/web-vedicrishi/images/matching/matching1.png', cta: 'Check compatibility', i: '♥' },
  { t: 'Full Astrology Report', hi: 'पूर्ण ज्योतिष रिपोर्ट', s: 'Get your complete astrology report and discover insights into every aspect of your life.', img: 'https://t3.ftcdn.net/jpg/03/46/36/48/360_F_346364876_GatpVrAFsgI62FoUAGiDdbIm0xN4iAsp.jpg', cta: 'Get my full report', i: '📜' },
  { t: 'AI Interpretation', hi: 'एआई व्याख्या', s: 'Ask any astrology question, get instant clarity.', img: 'https://res.cloudinary.com/dzrg0utcm/image/upload/v1779692948/ChatGPT_Image_May_25_2026_12_20_50_PM_rvnud1.png', cta: 'Ask the AI sage', i: '✦' },
  { t: 'Talk to an Astrologer', hi: 'ज्योतिषी से बात करें', s: 'Live consultation with verified Vedic astrologers.', img: 'https://media.istockphoto.com/id/1347480695/photo/beard-priest-holy-astrologer-guru-or-jyotishi-placing-cowrie-shells-on-chart-and-counting-to.jpg?s=612x612&w=0&k=20&c=Fa0mG3pfB7X_odMXwU4rM0lyyVFIradeKZjgmo3sd0Y=', cta: 'Book a session', i: '💬' },
]

const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

const horoscopes = {
  Leo: {
    summary: "Jupiter's gentle gaze opens a door you've been quietly knocking on.",
    love: 'A warm conversation shifts a hesitant heart.',
    career: 'Recognition arrives from an unexpected quarter.',
    health: 'Walks at dusk restore your fire.',
    n: 7,
    c: 'Saffron',
  },
}

const products = [
  { n: 'Panchdhatu Saturn Ring', c: 'Rings', p: 2499, o: 3299, r: 4.8, img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80' },
  { n: 'Emerald Prosperity Ring', c: 'Rings', p: 5899, r: 4.9, img: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS61OjeHUM-dpbf68VWPzW4WIJVtfv5lQIA_tAWvOnvjxSqWaor95sKp8Fl_aIPMCl4Ldk0qgeHm9XnzY1mDKC1fKxF1Bh5PA' },
  { n: 'Tiger Eye Bracelet', c: 'Bracelets', p: 1299, o: 1699, r: 4.7, img: 'https://m.media-amazon.com/images/I/511PFs9OdjL.jpg' },
  { n: 'Sacred Sandalwood Mala 108', c: 'Malas', p: 1899, r: 4.9, img: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSQircb5WO-A0-yLa2xOI1McTme1zfP5OcUNYcU8tbjFJnRFa3aSYW0Sdlh2J41X6Agjc4sRo0QwIg49cOMO8B_YkjZGtLXg17LEHbfPYo' },
]

const testimonials = [
  { n: 'Aanya', c: 'Chandigarh', img: 'https://i.pinimg.com/736x/e6/b6/bd/e6b6bd5a1dba7ec034b92eb701c7f1ec.jpg', t: "The Kundli reading mirrored everything I'd silently been feeling. The remedies actually shifted my year." },
  { n: 'Ishaan', c: 'Delhi', img: 'https://i.pinimg.com/1200x/d0/18/d3/d018d3646a7d320d800a428b66d7c768.jpg', t: 'Beautiful interface, deeply thoughtful interpretations. Astro Satguru is what spiritual tech should look like.' },
  { n: 'Priyam', c: 'Ambala-City', img: 'https://i.pinimg.com/736x/df/1f/fc/df1ffc9cffe9af1988ee7087ee5f4beb.jpg', t: 'My consultation with Pandit Meera was extraordinary: calming, precise and full of warmth.' },
]

const astrologers = [
  { img: 'https://media.istockphoto.com/id/1347480695/photo/beard-priest-holy-astrologer-guru-or-jyotishi-placing-cowrie-shells-on-chart-and-counting-to.jpg?s=612x612&w=0&k=20&c=Fa0mG3pfB7X_odMXwU4rM0lyyVFIradeKZjgmo3sd0Y=', name: 'Speak to a Vedic sage - live, right now', sub: 'Available 24 x 7 · Hindi & English' },
  { img: 'https://media.istockphoto.com/id/1347480695/photo/beard-priest-holy-astrologer-guru-or-jyotishi-placing-cowrie-shells-on-chart-and-counting-to.jpg?s=612x612&w=0&k=20&c=Fa0mG3pfB7X_odMXwU4rM0lyyVFIradeKZjgmo3sd0Y=', name: 'Acharya Vikram Sharma', sub: '18 yrs · Vedic · Marriage · Career' },
  { img: 'https://media.istockphoto.com/id/1347480695/photo/beard-priest-holy-astrologer-guru-or-jyotishi-placing-cowrie-shells-on-chart-and-counting-to.jpg?s=612x612&w=0&k=20&c=Fa0mG3pfB7X_odMXwU4rM0lyyVFIradeKZjgmo3sd0Y=', name: 'Guru Rajan Iyer', sub: '22 yrs · Nadi · Spiritual · Remedies' },
  { img: 'https://media.istockphoto.com/id/1347480695/photo/beard-priest-holy-astrologer-guru-or-jyotishi-placing-cowrie-shells-on-chart-and-counting-to.jpg?s=612x612&w=0&k=20&c=Fa0mG3pfB7X_odMXwU4rM0lyyVFIradeKZjgmo3sd0Y=', name: 'Pandit Meera Joshi', sub: '12 yrs · KP System · Love · Numerology' },
]

const trustStats = [['1.2M+', 'Readings delivered'], ['150+', 'Verified astrologers'], ['4.9★', 'Average rating'], ['100%', 'Secure & private']]

const faqs = [
  ['Are the readings really personalised?', 'Yes. Every reading is generated from your exact birth details and refined through classical Jyotish logic.'],
  ['How accurate is the AI interpretation?', 'The AI interpretation is grounded in classical Vedic astrology principles and designed for clarity, not fear.'],
  ['Are the gemstones certified?', 'Every gemstone can be shipped with a lab certificate of authenticity.'],
]

const inr = (n) => `₹${n.toLocaleString('en-IN')}`

function LandingPage() {
  const [hindi, setHindi] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSign, setActiveSign] = useState('Leo')
  const [joinOpen, setJoinOpen] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [joinForm, setJoinForm] = useState({ name: '', phone: '', experience: '', social: '', about: '', resumeName: '' })
  const [status, setStatus] = useState('')
  const [joinStatus, setJoinStatus] = useState('')
  const pageRef = useRef(null)

  const t = (text) => (hindi ? translations[text] || text : text)
  const tickerItems = hindi ? tickerHi : tickerEn
  const doubledAstrologers = useMemo(() => [...astrologers, ...astrologers], [])
  const horoscope = horoscopes[activeSign] || {
    summary: `Today the cosmos favours ${activeSign}: lead with intention.`,
    love: 'A small gesture deepens trust.',
    career: 'Focus brings unexpected reward.',
    health: 'Hydrate and breathe deeply.',
    n: (activeSign.length % 9) + 1,
    c: 'Gold',
  }
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    document.title = 'Astro Satguru - Premium AI Vedic Astrology, Horoscopes & Sacred Shop'
  }, [])

  useEffect(() => {
    const root = pageRef.current
    if (!root) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    root.querySelectorAll('.anim-fade-up, .anim-fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const track = (intent, metadata = {}) => {
    publicService.trackCta(intent, metadata).catch(() => {})
  }

  const handleNewsletter = async (event) => {
    event.preventDefault()
    setStatus('Saving...')
    try {
      await publicService.newsletter(newsletterEmail)
      setNewsletterEmail('')
      setStatus('Subscribed successfully.')
    } catch {
      setStatus('Could not subscribe right now.')
    }
  }

  const handleJoinSubmit = async (event) => {
    event.preventDefault()
    setJoinStatus('Sending...')
    try {
      await publicService.join({
        ...joinForm,
        experience: joinForm.experience ? Number(joinForm.experience) : undefined,
      })
      setJoinStatus('Application submitted successfully.')
      setJoinForm({ name: '', phone: '', experience: '', social: '', about: '', resumeName: '' })
      setTimeout(() => setJoinOpen(false), 700)
    } catch {
      setJoinStatus('Could not submit the application right now.')
    }
  }

  return (
    <main className="landing-page" ref={pageRef} lang={hindi ? 'hi' : 'en'}>
      <header className="landing-header">
        <div className="landing-container landing-nav">
          <a href="#home" className="landing-logo"><span className="landing-logo-mark">✦</span>Astro Satguru<span className="gradient-gold-text">.</span></a>
          <nav className="landing-nav-links">
            <a href="#home">{t('Home')}</a>
            <a href="#services">{t('Services')}</a>
            <a href="#shop">{t('Shop')}</a>
            <a href="#astrologers">{t('Astrologers')}</a>
          </nav>
          <div className="landing-nav-right">
            <button className="translate-btn" type="button" onClick={() => setHindi((value) => !value)}>{hindi ? 'A' : 'अ'}</button>
            <a href="#astrologers" className="landing-btn landing-btn-outline hide-mobile">{t('Talk to an astrologer')}</a>
            <button className="landing-icon-btn" type="button" aria-label="Cart">🛍</button>
            <button className="landing-menu-btn" type="button" onClick={() => setMobileOpen(true)} aria-label="Menu">☰</button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`} onClick={(event) => event.target === event.currentTarget && setMobileOpen(false)}>
        <div className="mobile-nav-panel">
          <button className="mobile-nav-close" type="button" onClick={() => setMobileOpen(false)}>✕</button>
          {['Home', 'Services', 'Shop', 'Astrologers'].map((item) => (
            <a key={item} href={`#${item.toLowerCase() === 'home' ? 'home' : item.toLowerCase()}`} onClick={() => setMobileOpen(false)}>{t(item)}</a>
          ))}
        </div>
      </div>

      <section id="home" className="landing-hero">
        <div className="hero-bg"><img src="https://res.cloudinary.com/dzrg0utcm/image/upload/v1779692948/ChatGPT_Image_May_25_2026_12_20_50_PM_rvnud1.png" alt="Vedic astrology background" /></div>
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((item, index) => <span className="ticker-item" key={`${item}-${index}`}>{item}<span className="sep">✦</span></span>)}
          </div>
        </div>
        <div className="landing-container hero-inner">
          <div className="hero-copy">
            <span className="hero-badge">✦ {t('AI-powered Vedic Astrology')}</span>
            <h1>{t('Your trust is our identity')}</h1>
            <p>{t('Get personalized horoscopes, Kundli matching, and live astrology guidance-all in one place.')}</p>
            <div className="hero-ctas">
              <a href="#horoscope" className="landing-btn landing-btn-lg landing-btn-gold" onClick={() => track('Get horoscope')}>{t('Get Your Horoscope')}</a>
              <a href="#kundli" className="landing-btn landing-btn-lg landing-btn-ghost-light" onClick={() => track('Generate Kundli')}>{t('Generate Kundli')}</a>
              <a href="#astrologers" className="landing-btn landing-btn-lg landing-btn-ghost-light" onClick={() => track('Talk to Astrologer')}>{t('Talk to an Astrologer')}</a>
              <a href="#shop" className="landing-btn landing-btn-lg landing-btn-ghost-light">{t('Visit Shop')}</a>
            </div>
          </div>
          <div className="pricing-banner">
            <p className="landing-eyebrow">{t('Ask the AI Sage')}</p>
            {[['1 Question', '₹99'], ['2 Questions', '₹149'], ['Unlimited', '₹299']].map(([label, price], index) => (
              <div className={`price-row ${index === 2 ? 'best' : ''}`} key={label}>
                <span className="price-label">{t(label)}</span>
                <span className="price-amt">{price}</span>
                {index === 2 && <span className="best-tag">{t('Best')}</span>}
              </div>
            ))}
            <button className="landing-btn landing-btn-gold price-button" type="button" onClick={() => track('Start AI Sage')}>{t('Start Now')} →</button>
          </div>
        </div>
      </section>

      <div className="astro-strip" id="astrologers">
        <div className="astro-float">
          {doubledAstrologers.map((item, index) => (
            <div className="astro-strip-item" key={`${item.name}-${index}`}>
              <div className="astro-circle"><img src={item.img} alt={item.name} /></div>
              <div className="astro-strip-text"><p>{item.name}</p><span>{item.sub}</span></div>
              <b>✦</b>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-cream">
        <div className="landing-container">
          <SectionHead eyebrow={t("What's troubling you?")} title={t('The Stars have answers.')} />
          <div className="landing-grid landing-grid-4 stagger-children">
            {concerns.map((item) => (
              <a className="landing-card landing-card-hover concern anim-fade-up" href="#services" key={item.q} onClick={() => track('Concern card', { concern: item.q })}>
                <div className="concern-img-wrap"><img src={item.img} alt={item.q} loading="lazy" /><div className="concern-overlay" /></div>
                <div className="concern-body"><span>{item.i}</span><p>{hindi ? item.hi : item.q}</p><small>{t('Find guidance')} →</small></div>
                <div className="concern-hover-label"><p>{hindi ? item.hi : item.q}</p><span>{t('Find guidance')} →</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="services">
        <div className="landing-container">
          <SectionHead eyebrow={t('Our Services')} title={t('Six ways to read your stars.')} />
          <div className="landing-grid landing-grid-3 stagger-children">
            {services.map((service) => (
              <button className="landing-card landing-card-hover service anim-fade-up" type="button" key={service.t} onClick={() => track(service.t)}>
                <div className="service-img"><img src={service.img} alt={service.t} loading="lazy" /><span>{service.i}</span></div>
                <div className="service-body"><h3>{hindi ? service.hi : service.t}</h3><p>{service.s}</p><b>{service.cta} →</b></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="horoscope" className="bg-cream-soft">
        <div className="landing-container two-col">
          <div className="anim-fade-up">
            <p className="landing-eyebrow">{t('Daily horoscope')}</p>
            <h2 className="landing-section-title">{t('What the stars say today?')}</h2>
            <p className="muted">{t('Choose your zodiac sign and get personalized AI-powered Vedic insights.')}</p>
            <div className="zodiac">
              {zodiacSigns.map((sign) => <button className={`zb ${activeSign === sign ? 'active' : ''}`} type="button" key={sign} onClick={() => setActiveSign(sign)}>{sign}</button>)}
            </div>
          </div>
          <div className="horoscope-card anim-fade-up">
            <div className="horoscope-head"><h3>{activeSign}</h3><span>{today}</span></div>
            <p className="horoscope-summary">"{horoscope.summary}"</p>
            <div className="h-rows">
              {['love', 'career', 'health'].map((key) => <div className="h-row" key={key}><span>{key}</span><p>{horoscope[key]}</p></div>)}
            </div>
            <div className="h-foot"><span>Lucky number: <b>{horoscope.n}</b></span><span>Lucky color: <b>{horoscope.c}</b></span></div>
          </div>
        </div>
      </section>

      <FeatureSection id="kundli" eyebrow={t('Janam Kundli')} title={t('Get your astrology reading in seconds')} image="https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&w=1400&q=80" cta={t('Generate my Kundli')} />

      <section className="bg-cream">
        <div className="landing-container two-col">
          <div className="anim-fade-up">
            <p className="landing-eyebrow">{t('Compatibility')}</p>
            <h2 className="landing-section-title">{t('Two souls, one perfect match.')}</h2>
            <p className="muted">Ashtakoot Guna Milan combined with AI interpretation reveals emotional, mental and karmic harmony.</p>
            <div className="compat-card"><div className="score">28</div><div><small>Sample match score</small><p>Aanya & Ishaan - Strongly aligned</p><span>Emotional 82% · Mental 74% · Spiritual 88%</span></div></div>
            <button className="landing-btn landing-btn-lg landing-btn-gold" type="button" onClick={() => track('Check compatibility')}>{t('Check compatibility')}</button>
          </div>
          <div className="rounded-img tall anim-fade-up"><img src="https://res.cloudinary.com/dzrg0utcm/image/upload/v1779794291/collage_450x550_vrubaw.jpg" alt="Couple compatibility" /></div>
        </div>
      </section>

      <section>
        <div className="landing-container">
          <div className="ai-card anim-fade-up">
            <span className="pill">✦ AI Sage</span>
            <h2>{t('Based on traditional Astrology, explained in your language.')}</h2>
            <p className="muted">Our AI is grounded in Brihat Parashara Hora Shastra, Phaladeepika and centuries of Vedic tradition, then refined by master astrologers so every reading feels human, warm and precise.</p>
            <div className="ai-actions"><button className="landing-btn landing-btn-gold" type="button" onClick={() => track('Ask AI sage')}>{t('Ask the AI sage')}</button><a href="#services" className="landing-btn landing-btn-outline">{t('Explore services')}</a></div>
          </div>
        </div>
      </section>

      <section id="shop" className="bg-cream-soft">
        <div className="landing-container">
          <div className="flex-between anim-fade-up"><div><p className="landing-eyebrow">{t('Sacred objects')}</p><h2 className="landing-section-title">{t('Crafted with intention.')}</h2></div><a href="#shop" className="text-gold hide-mobile">{t('View all')} →</a></div>
          <div className="products stagger-children">
            {products.map((product) => (
              <article className="landing-card landing-card-hover product anim-fade-up" key={product.n}>
                <div className="product-img"><img src={product.img} alt={product.n} loading="lazy" />{product.o && <span>Sale</span>}</div>
                <div className="product-body"><small>{product.c}</small><h3>{product.n}</h3><p>★ {product.r}</p><div><b>{inr(product.p)}</b>{product.o && <del>{inr(product.o)}</del>}</div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="landing-container">
          <SectionHead eyebrow={t('Words from seekers')} title={t('Loved across India.')} />
          <div className="landing-grid landing-grid-3 stagger-children">
            {testimonials.map((item) => <article className="landing-card testimonial anim-fade-up" key={item.n}><span>"</span><p>{item.t}</p><div><img src={item.img} alt="" /><b>{item.n}</b><small>{item.c}</small></div></article>)}
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="landing-container landing-grid landing-grid-4">
          {trustStats.map(([number, label]) => <div className="landing-card trust-card anim-fade-up" key={label}><b>{number}</b><span>{label}</span></div>)}
        </div>
      </section>

      <section>
        <div className="landing-container faq-wrap">
          <SectionHead eyebrow={t('Questions')} title={t('Frequently asked.')} />
          <div className="faq-list anim-fade-up">{faqs.map(([question, answer]) => <details className="landing-card faq" key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <footer>
        <div className="landing-container foot">
          <div><div className="landing-logo"><span className="landing-logo-mark">✦</span>Astro Satguru</div><p>Experience modern Vedic astrology with AI-powered insights and spiritual guidance rooted in India's ancient wisdom.</p><button className="landing-btn landing-btn-gold" type="button" onClick={() => setJoinOpen(true)}>{t('Join Us')} →</button></div>
          <FooterColumn title={t('Services')} items={['Daily horoscope', 'Kundli', 'Compatibility', 'Full report']} />
          <FooterColumn title={t('Shop')} items={['Rings & gemstones', 'Malas & rudraksha', 'Yantras', 'Accessories']} />
          <div><h4>{t('Newsletter')}</h4><p>{t('Receive your weekly cosmic forecast.')}</p><form className="news" onSubmit={handleNewsletter}><input type="email" placeholder="your@email.com" value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} required /><button type="submit">{t('Join')}</button></form>{status && <small className="form-status">{status}</small>}</div>
        </div>
        <div className="copyright">© {new Date().getFullYear()} Astro Satguru. Crafted with devotion in Bharat.</div>
      </footer>

      {joinOpen && (
        <div className="modal-overlay active" onClick={(event) => event.target === event.currentTarget && setJoinOpen(false)}>
          <div className="modal-content">
            <button className="modal-close" type="button" onClick={() => setJoinOpen(false)}>✕</button>
            <h2>{t('Join Our Team')}</h2>
            <form onSubmit={handleJoinSubmit}>
              <FormField label="Full Name *" value={joinForm.name} onChange={(value) => setJoinForm((form) => ({ ...form, name: value }))} required />
              <FormField label="Phone Number *" value={joinForm.phone} onChange={(value) => setJoinForm((form) => ({ ...form, phone: value }))} type="tel" required />
              <FormField label="Years of Experience" value={joinForm.experience} onChange={(value) => setJoinForm((form) => ({ ...form, experience: value }))} type="number" />
              <FormField label="Social Media Profile Link" value={joinForm.social} onChange={(value) => setJoinForm((form) => ({ ...form, social: value }))} type="url" placeholder="https://..." />
              <label className="form-group">About You / Bio<textarea value={joinForm.about} onChange={(event) => setJoinForm((form) => ({ ...form, about: event.target.value }))} /></label>
              <label className="form-group">Resume (PDF)<input type="file" accept=".pdf" onChange={(event) => setJoinForm((form) => ({ ...form, resumeName: event.target.files?.[0]?.name || '' }))} /></label>
              <button className="form-submit" type="submit">{joinStatus === 'Sending...' ? joinStatus : t('Submit Application')}</button>
              {joinStatus && <p className="form-status">{joinStatus}</p>}
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

function SectionHead({ eyebrow, title }) {
  return <div className="section-head anim-fade-up"><p className="landing-eyebrow">{eyebrow}</p><h2>{title}</h2></div>
}

function FeatureSection({ id, eyebrow, title, image, cta }) {
  return (
    <section id={id}>
      <div className="landing-container two-col">
        <div className="rounded-img anim-fade-up"><img src={image} alt={title} /></div>
        <div className="anim-fade-up"><p className="landing-eyebrow">{eyebrow}</p><h2 className="landing-section-title">{title}</h2><p className="muted">A complete Vedic birth chart with planetary placements, dasha periods and ascendant analysis rendered in a beautifully readable format.</p><ul className="checklist"><li>Ascendant & Moon sign analysis</li><li>Vimshottari dasha timeline</li><li>House-by-house interpretation</li><li>Personalised remedies</li></ul><button className="landing-btn landing-btn-lg landing-btn-gold" type="button">{cta}</button></div>
      </div>
    </section>
  )
}

function FooterColumn({ title, items }) {
  return <div><h4>{title}</h4><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>
}

function FormField({ label, value, onChange, type = 'text', required = false, placeholder = '' }) {
  return <label className="form-group">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} placeholder={placeholder} /></label>
}

export default LandingPage
