import mongoose from 'mongoose'

/**
 * Prediction schema — ML output for a user's engagement and retention signals.
 */
const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    engagementLevel: {
      type: Number,
      min: [0, 'Engagement level cannot be negative'],
      max: [100, 'Engagement level cannot exceed 100'],
    },
    churnProbability: {
      type: Number,
      min: [0, 'Churn probability must be between 0 and 1'],
      max: [1, 'Churn probability must be between 0 and 1'],
    },
    returnProbability: {
      type: Number,
      min: [0, 'Return probability must be between 0 and 1'],
      max: [1, 'Return probability must be between 0 and 1'],
    },
    predictedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Supports fetching the latest prediction per user
predictionSchema.index({ userId: 1, predictedAt: -1 })

const Prediction = mongoose.model('Prediction', predictionSchema)

export default Prediction
