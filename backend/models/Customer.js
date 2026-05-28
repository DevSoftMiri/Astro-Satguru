import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, index: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, lowercase: true, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    dateOfBirth: Date,
    timeOfBirth: String,
    placeOfBirth: String,
    address: String,
    notes: String,
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    questionPlan: { type: String, enum: ['ONE_QUESTION', 'TWO_QUESTIONS', 'UNLIMITED_QUESTIONS'], required: true },
    questionsAllowed: { type: Number, required: true },
    questionsUsed: { type: Number, default: 0 },
    planExpiryDate: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

customerSchema.virtual('remainingQuestions').get(function remainingQuestions() {
  if (this.questionsAllowed === -1) return -1
  return Math.max(this.questionsAllowed - this.questionsUsed, 0)
})

customerSchema.set('toJSON', { virtuals: true })
customerSchema.set('toObject', { virtuals: true })

export default mongoose.model('Customer', customerSchema)
