import mongoose from 'mongoose'
import User from '../models/User.js'
import { aggregateUserEngagementMetrics } from '../services/analyticsAggregationService.js'

const ENGAGEMENT_WEIGHTS = {
  duration: 0.4,
  events: 0.3,
  pages: 0.2,
  searches: 0.1,
}

const ENGAGEMENT_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

const createError = (message) => {
  const error = new Error(message)
  error.statusCode = 404
  return error
}

const normalizeMetric = (value, max) => {
  if (!max || max <= 0) {
    return 0
  }

  return Math.min(100, (value / max) * 100)
}

const resolveEngagementLevel = (score) => {
  if (score <= 30) {
    return ENGAGEMENT_LEVELS.LOW
  }

  if (score <= 70) {
    return ENGAGEMENT_LEVELS.MEDIUM
  }

  return ENGAGEMENT_LEVELS.HIGH
}

const validateUserId = async (userId) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw createError('User not found')
  }

  const user = await User.findById(userId).select('_id')

  if (!user) {
    throw createError('User not found')
  }

  return user._id
}

/**
 * Calculates a weighted engagement score (0-100) for a user.
 */
export const calculateEngagementScore = async (userId) => {
  await validateUserId(userId)

  const {
    userDuration,
    userEvents,
    userPages,
    userSearches,
    maxDuration,
    maxEvents,
    maxPages,
    maxSearches,
  } = await aggregateUserEngagementMetrics(userId)

  const durationScore = normalizeMetric(userDuration, maxDuration)
  const eventsScore = normalizeMetric(userEvents, maxEvents)
  const pagesScore = normalizeMetric(userPages, maxPages)
  const searchesScore = normalizeMetric(userSearches, maxSearches)

  const engagementScore = Math.round(
    durationScore * ENGAGEMENT_WEIGHTS.duration +
      eventsScore * ENGAGEMENT_WEIGHTS.events +
      pagesScore * ENGAGEMENT_WEIGHTS.pages +
      searchesScore * ENGAGEMENT_WEIGHTS.searches
  )

  return { engagementScore }
}

/**
 * Maps a user's engagement score to Low, Medium, or High.
 */
export const calculateUserEngagementLevel = async (userId) => {
  const { engagementScore } = await calculateEngagementScore(userId)

  return {
    level: resolveEngagementLevel(engagementScore),
  }
}
