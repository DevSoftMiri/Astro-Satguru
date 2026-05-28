import mongoose from 'mongoose'

const attachmentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['KUNDLI_PDF', 'REPORT', 'IMAGE', 'VOICE_NOTE', 'OTHER'], default: 'OTHER' },
    url: String,
    publicId: String,
    originalName: String,
  },
  { _id: false },
)

const consultationSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    astrologer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    questionsAsked: [{ type: String, trim: true }],
    remedies: String,
    notes: String,
    internalNotes: String,
    status: { type: String, enum: ['NEW', 'IN_PROGRESS', 'COMPLETED', 'FOLLOW_UP', 'CLOSED'], default: 'NEW', index: true },
    followUpDate: Date,
    paymentStatus: { type: String, enum: ['PAID', 'PENDING', 'FAILED', 'REFUNDED'], default: 'PENDING', index: true },
    amount: { type: Number, default: 0 },
    attachments: [attachmentSchema],
    voiceNotes: [attachmentSchema],
  },
  { timestamps: true },
)

export default mongoose.model('Consultation', consultationSchema)
