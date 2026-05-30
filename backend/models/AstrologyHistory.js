import mongoose from 'mongoose'

const astrologyHistorySchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    featureType: {
      type: String,
      enum: ['kundali', 'matching', 'love_calculator', 'kaal_sarp_yog'],
      required: true,
      index: true,
    },
    inputData: { type: mongoose.Schema.Types.Mixed, required: true },
    apiResponse: { type: mongoose.Schema.Types.Mixed, required: true },
    notes: String,
    calculatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.model('AstrologyHistory', astrologyHistorySchema)
