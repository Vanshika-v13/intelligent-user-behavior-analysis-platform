import mongoose from 'mongoose'

const userEngagementSnapshotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: true,
      index: true,
    },
    periodStart: {
      type: Date,
      required: true,
      index: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    engagementScore: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      default: 'Low',
    },
    eventCount: {
      type: Number,
      default: 0,
    },
    sessionCount: {
      type: Number,
      default: 0,
    },
    capturedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

userEngagementSnapshotSchema.index({ userId: 1, period: 1, periodStart: 1 }, { unique: true })

const UserEngagementSnapshot = mongoose.model(
  'UserEngagementSnapshot',
  userEngagementSnapshotSchema
)

export default UserEngagementSnapshot
