import mongoose from 'mongoose'
import { EVENT_TYPES } from '../constants/eventTypes.js'

/**
 * Event schema — granular user interaction within a session.
 * metadata stores dynamic payload (e.g. buttonId, courseId, videoId).
 */
const eventSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      default: null,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: {
        values: EVENT_TYPES,
        message: `Event type must be one of: ${EVENT_TYPES.join(', ')}`,
      },
      index: true,
    },
    page: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

eventSchema.index({ sessionId: 1, timestamp: 1 })
eventSchema.index({ eventType: 1, timestamp: -1 })
eventSchema.index({ userId: 1, timestamp: -1 })
eventSchema.index({ eventType: 1, page: 1 })

const Event = mongoose.model('Event', eventSchema)

export default Event
