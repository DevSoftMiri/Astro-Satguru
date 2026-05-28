import dotenv from 'dotenv'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

await connectDB()

const email = process.env.ADMIN_EMAIL || 'admin@astrosatguru.com'
const password = process.env.ADMIN_PASSWORD || 'Admin@1234'
const exists = await User.findOne({ email })

if (!exists) {
  await User.create({
    name: process.env.ADMIN_NAME || 'Astro Satguru Admin',
    email,
    password,
    role: 'ADMIN',
    status: 'ACTIVE',
  })
  console.log(`Admin created: ${email}`)
} else {
  exists.name = process.env.ADMIN_NAME || exists.name
  exists.password = password
  exists.role = 'ADMIN'
  exists.status = 'ACTIVE'
  exists.passwordResetRequired = false
  await exists.save()
  console.log(`Admin synced: ${email}`)
}

process.exit(0)
