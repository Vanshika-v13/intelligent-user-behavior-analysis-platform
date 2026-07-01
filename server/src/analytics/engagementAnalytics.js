import { validateUserExists } from '../utils/analyticsValidators.js'
import { aggregateUserEngagementMetrics } from '../services/analyticsAggregationService.js'

const ENGAGEMENT_WEIGHTS = {
  duration: 0.4,
  events: 0.3,
  pages: 0.2,
  searches: 0.1,
}

export const ENGAGEMENT_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

const normalizeMetric = (value, max) => {
  if (!max || max <= 0) {
    return 0
  }

  return Math.min(100, (value / max) * 100)
}

export const resolveEngagementLevel = (score) => {
  if (score <= 30) {
    return ENGAGEMENT_LEVELS.LOW
  }

  if (score <= 70) {
    return ENGAGEMENT_LEVELS.MEDIUM
  }

  return ENGAGEMENT_LEVELS.HIGH
}

const computeEngagementScore = ({
  userDuration,
  userEvents,
  userPages,
  userSearches,
  maxDuration,
  maxEvents,
  maxPages,
  maxSearches,
}) => {
  const durationScore = normalizeMetric(userDuration, maxDuration)
  const eventsScore = normalizeMetric(userEvents, maxEvents)
  const pagesScore = normalizeMetric(userPages, maxPages)
  const searchesScore = normalizeMetric(userSearches, maxSearches)

  return Math.round(
    durationScore * ENGAGEMENT_WEIGHTS.duration +
      eventsScore * ENGAGEMENT_WEIGHTS.events +
      pagesScore * ENGAGEMENT_WEIGHTS.pages +
      searchesScore * ENGAGEMENT_WEIGHTS.searches
  )
}

/**
 * Calculates a weighted engagement score (0-100) for a user.
 */
export const calculateEngagementScore = async (userId) => {
  await validateUserExists(userId)

  const metrics = await aggregateUserEngagementMetrics(userId)
  const engagementScore = computeEngagementScore(metrics)

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

/**
 * Derives engagement score and level from pre-fetched metrics.
 * Used to avoid duplicate aggregation when computing both values.
 */
export const calculateEngagementFromMetrics = async (userId) => {
  await validateUserExists(userId)

  const metrics = await aggregateUserEngagementMetrics(userId)
  const engagementScore = computeEngagementScore(metrics)

  return {
    engagementScore,
    level: resolveEngagementLevel(engagementScore),
  }
}
