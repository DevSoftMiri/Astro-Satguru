import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['UPI', 'Cash', 'Card', 'Bank Transfer'], required: true },
    transactionId: { type: String, trim: true },
    status: { type: String, enum: ['PAID', 'PENDING', 'FAILED', 'REFUNDED'], default: 'PENDING', index: true },
    pendingDue: { type: Number, default: 0 },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

export default mongoose.model('Payment', paymentSchema)
