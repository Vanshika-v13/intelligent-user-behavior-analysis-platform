import {
  aggregateAverageSessionDuration,
  aggregateActiveUsers,
  aggregateBounceRate,
  aggregateSessionDistribution,
} from '../services/analyticsAggregationService.js'

/**
 * Returns the average session duration across all sessions in seconds.
 */
export const calculateAverageSessionDuration = async () => {
  const averageDuration = await aggregateAverageSessionDuration()

  return { averageDuration }
}

/**
 * Returns the count of users with at least one active session.
 */
export const calculateActiveUsers = async () => {
  const activeUsers = await aggregateActiveUsers()

  return { activeUsers }
}

/**
 * Returns bounce rate as a percentage of sessions with one event or duration under 30 seconds.
 */
export const calculateBounceRate = async () => {
  const bounceRate = await aggregateBounceRate()

  return { bounceRate }
}

/**
 * Returns session counts grouped by duration buckets.
 */
export const calculateSessionDistribution = async () => {
  return aggregateSessionDistribution()
}
