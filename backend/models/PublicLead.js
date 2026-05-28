import mongoose from 'mongoose'

const publicLeadSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['CTA', 'JOIN_APPLICATION', 'NEWSLETTER'], required: true, index: true },
    name: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    intent: { type: String, trim: true },
    experience: Number,
    social: String,
    about: String,
    resumeName: String,
    metadata: mongoose.Schema.Types.Mixed,
    status: { type: String, enum: ['NEW', 'CONTACTED', 'CLOSED'], default: 'NEW', index: true },
  },
  { timestamps: true },
)

export default mongoose.model('PublicLead', publicLeadSchema)
