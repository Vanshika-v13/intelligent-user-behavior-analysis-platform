import mongoose from 'mongoose'

const analyticsDailyRollupSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    dateKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    dailySessions: {
      type: Number,
      default: 0,
    },
    dailyUsers: {
      type: Number,
      default: 0,
    },
    dailyEvents: {
      type: Number,
      default: 0,
    },
    dailyPageViews: {
      type: Number,
      default: 0,
    },
    dailyQuizAttempts: {
      type: Number,
      default: 0,
    },
    dailyVideoPlays: {
      type: Number,
      default: 0,
    },
    dailyCourseOpens: {
      type: Number,
      default: 0,
    },
    dailyCertificates: {
      type: Number,
      default: 0,
    },
    dailySearches: {
      type: Number,
      default: 0,
    },
    dailyEngagement: {
      type: Number,
      default: 0,
    },
    computedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const AnalyticsDailyRollup = mongoose.model('AnalyticsDailyRollup', analyticsDailyRollupSchema)

export default AnalyticsDailyRollup
