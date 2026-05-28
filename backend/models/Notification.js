import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    channel: { type: String, enum: ['WHATSAPP', 'EMAIL', 'SMS'], required: true },
    template: String,
    payload: mongoose.Schema.Types.Mixed,
    status: { type: String, enum: ['QUEUED', 'SENT', 'FAILED'], default: 'QUEUED' },
    scheduledFor: Date,
    sentAt: Date,
  },
  { timestamps: true },
)

export default mongoose.model('Notification', notificationSchema)
