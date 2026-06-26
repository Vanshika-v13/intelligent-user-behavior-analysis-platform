import mongoose from 'mongoose'

/**
 * Session schema — a single user visit spanning device, browser, and timing metadata.
 * Linked to a User and referenced by Event documents.
 */
const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: [true, 'Session ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
      index: true,
    },
    endTime: {
      type: Date,
      validate: {
        validator(value) {
          if (!value) return true
          return value >= this.startTime
        },
        message: 'End time must be on or after start time',
      },
    },
    duration: {
      type: Number,
      default: 0,
      min: [0, 'Duration cannot be negative'],
    },
    device: {
      type: String,
      trim: true,
    },
    browser: {
      type: String,
      trim: true,
    },
    os: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const Session = mongoose.model('Session', sessionSchema)

export default Session
