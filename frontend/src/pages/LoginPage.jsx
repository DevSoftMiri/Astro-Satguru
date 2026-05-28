import { useState } from 'react'
import { Lock, Mail } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import heroImg from '../assets/vedic-chart.jpg'

function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: 'admin@astrosatguru.com', password: 'Admin@1234' })
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const user = await login(form)
      const fallback = user.role === 'ASTROLOGER' ? '/astrologer/dashboard' : '/admin/dashboard'
      navigate(location.state?.from?.pathname || fallback, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login. Check credentials and try again.')
    }
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .login-root {
          display: grid;
          min-height: 100vh;
          grid-template-columns: 1fr 520px;
        }

        /* ── Hero panel ── */
        .login-hero {
          position: relative;
          overflow: hidden;
          background-color: #1a1208;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem 3rem;
        }

        .login-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.55;
        }

        .login-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(20,13,4,0.75) 0%, rgba(20,13,4,0.45) 50%, rgba(15,10,3,0.75) 100%);
        }

        .login-hero-badge {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .login-hero-badge-dot {
          width: 18px;
          height: 18px;
          background-color: #c9972a;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .login-hero-badge span {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #c9972a;
          text-transform: uppercase;
          font-family: 'Georgia', serif;
        }

        .login-hero-bottom {
          position: relative;
          z-index: 1;
        }

        .login-hero-bottom h1 {
          font-size: 3.25rem;
          font-weight: 400;
          color: #d4a84b;
          font-family: 'Georgia', 'Times New Roman', serif;
          letter-spacing: 0.02em;
          line-height: 1.15;
          margin: 0 0 1rem 0;
        }

        .login-hero-bottom p {
          font-size: 1.05rem;
          color: #c8bfa0;
          font-family: 'Georgia', serif;
          line-height: 1.65;
          margin: 0;
          max-width: 480px;
        }

        /* ── Form panel ── */
        .login-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f0e6;
          padding: 2.5rem 2rem;
        }

        .login-form {
          width: 100%;
          max-width: 420px;
        }

        .login-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background-color: #1a1208;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.75rem;
        }

        .login-avatar span {
          font-size: 1rem;
          font-weight: 600;
          color: #f5f0e6;
          letter-spacing: 0.04em;
          font-family: 'Georgia', serif;
        }

        .login-form h2 {
          font-size: 2rem;
          font-weight: 400;
          color: #1a1208;
          font-family: 'Georgia', 'Times New Roman', serif;
          margin: 0 0 0.4rem 0;
          letter-spacing: -0.01em;
        }

        .login-form > p {
          font-size: 0.9rem;
          color: #7a6e5c;
          font-family: 'Georgia', serif;
          margin: 0 0 2rem 0;
        }

        .login-error {
          margin-bottom: 1rem;
          border-radius: 6px;
          background-color: #fee2e2;
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: #b91c1c;
        }

        .login-field {
          margin-bottom: 1.25rem;
        }

        .login-field label {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #5a4f3e;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          font-family: 'Georgia', serif;
        }

        .login-input-wrap {
          position: relative;
        }

        .login-input-wrap svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: #9a8c78;
          pointer-events: none;
        }

        .login-input-wrap input {
          height: 44px;
          width: 100%;
          padding-left: 40px;
          padding-right: 12px;
          background-color: transparent;
          border: none;
          border-bottom: 1.5px solid #b5a88e;
          outline: none;
          font-size: 0.95rem;
          color: #1a1208;
          font-family: 'Georgia', serif;
          transition: border-color 0.2s;
        }

        .login-input-wrap input:focus {
          border-bottom-color: #c9972a;
        }

        .login-field-last {
          margin-bottom: 2.25rem;
        }

        .login-submit {
          height: 48px;
          width: 100%;
          background-color: #1a1208;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          color: #c9972a;
          font-family: 'Georgia', 'Times New Roman', serif;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .login-submit:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        /* ── Tablet ── */
        @media (min-width: 768px) and (max-width: 1023px) {
          .login-root {
            grid-template-columns: 1fr 400px;
          }

          .login-hero {
            padding: 2rem;
          }

          .login-hero-bottom h1 {
            font-size: 2.5rem;
          }
        }

        /* ── Mobile: single column, no hero, form fills screen ── */
        @media (max-width: 767px) {
          .login-root {
            display: block;
            min-height: 100vh;
          }

          /* Hide the hero entirely on mobile */
          .login-hero {
            display: none;
          }

          /* Form panel fills the full viewport */
          .login-panel {
            min-height: 100vh;
            padding: 3rem 1.5rem 2rem;
            align-items: flex-start;
          }

          .login-form {
            max-width: 100%;
          }

          /* Shrink heading slightly */
          .login-form h2 {
            font-size: 1.65rem;
          }

          /* Make inputs a touch taller for easier tapping */
          .login-input-wrap input {
            height: 48px;
            font-size: 1rem;
          }

          /* Taller submit button */
          .login-submit {
            height: 52px;
            font-size: 1rem;
          }
        }
      `}</style>

      <main className="login-root">
        {/* ── Left hero panel ── */}
        <section className="login-hero">
          <img src={heroImg} alt="" className="login-hero-img" />
          <div className="login-hero-overlay" />

          <div className="login-hero-badge">
            <div className="login-hero-badge-dot" />
            <span>Premium Astrology Solutions</span>
          </div>

          <div className="login-hero-bottom">
            <h1>Astro Satguru</h1>
            <p>
              Manage consultations, customers, payments, remedies, timelines, and astrologer
              performance from one secure dashboard.
            </p>
          </div>
        </section>

        {/* ── Right login panel ── */}
        <section className="login-panel">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-avatar">
              <span>AS</span>
            </div>

            <h2>Sign in to Astro Satguru</h2>
            <p>Secure admin and astrologer workspace.</p>

            {error && <div className="login-error">{error}</div>}

            <div className="login-field">
              <label>Email</label>
              <div className="login-input-wrap">
                <Mail />
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  type="email"
                  required
                />
              </div>
            </div>

            <div className="login-field login-field-last">
              <label>Password</label>
              <div className="login-input-wrap">
                <Lock />
                <input
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  type="password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </section>
      </main>
    </>
  )
}

export default LoginPage