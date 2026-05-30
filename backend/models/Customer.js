import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, index: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, lowercase: true, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    dateOfBirth: Date,
    dob: Date,
    timeOfBirth: String,
    tob: String,
    placeOfBirth: String,
    lat: Number,
    lon: Number,
    tzone: Number,
    birthLatitude: Number,
    birthLongitude: Number,
    birthTimezoneOffset: String,
    address: String,
    notes: String,
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    horoscopeData: { type: mongoose.Schema.Types.Mixed, default: null },
    kundliData: { type: mongoose.Schema.Types.Mixed, default: null },
    matchHistory: [{ type: mongoose.Schema.Types.Mixed }],
    aiAstrologerChats: [{ type: mongoose.Schema.Types.Mixed }],
    generatedReports: [{ type: mongoose.Schema.Types.Mixed }],
    visitHistory: [{ type: mongoose.Schema.Types.Mixed }],
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

customerSchema.virtual('mobileNumber').get(function mobileNumber() {
  return this.phone
})

customerSchema.virtual('name').get(function name() {
  return this.fullName
})

customerSchema.virtual('birthDate').get(function birthDate() {
  return this.dateOfBirth
})

customerSchema.virtual('birthTime').get(function birthTime() {
  return this.timeOfBirth
})

customerSchema.virtual('birthPlace').get(function birthPlace() {
  return this.placeOfBirth
})

customerSchema.set('toJSON', { virtuals: true })
customerSchema.set('toObject', { virtuals: true })

export default mongoose.model('Customer', customerSchema)
