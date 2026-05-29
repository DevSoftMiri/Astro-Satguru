import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import authRoutes from './routes/authRoutes.js'
import consultationRoutes from './routes/consultationRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import publicRoutes from './routes/publicRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '.env') })

const normalizeOrigin = (value) => {
  if (!value) return null
  try {
    return new URL(value).origin
  } catch {
    return value
  }
}

const app = express()
const allowedOrigins = [
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map((origin) => normalizeOrigin(origin.trim())) : []),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean)

app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error(`CORS blocked for origin: ${origin}`))
  },
  credentials: true,
}))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

app.get('/', (_req, res) => res.status(200).json({ success: true, message: 'Welcome to Astro Satguru API!' }))
app.get('/health', (_req, res) => res.json({ success: true, service: 'Astro Satguru API' }))
app.use('/api/public', publicRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/consultations', consultationRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/uploads', uploadRoutes)

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Astro Satguru API running on port ${port}`))
  })
  .catch((error) => {
    console.error('Failed to start server', error)
    process.exit(1)
  })
