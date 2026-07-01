import {
  aggregateAverageSessionDuration,
  aggregateActiveUsers,
  aggregateBounceRate,
  aggregateSessionDistribution,
} from '../services/analyticsAggregationService.js'
import { buildSessionMatchFilter, hasActiveFilters } from './analyticsFilters.js'

const resolveSessionMatch = (filters = {}) =>
  hasActiveFilters(filters) ? buildSessionMatchFilter(filters) : {}

/**
 * Returns the average session duration across all sessions in seconds.
 */
export const calculateAverageSessionDuration = async (filters = {}) => {
  const averageDuration = await aggregateAverageSessionDuration(
    resolveSessionMatch(filters)
  )

  return { averageDuration }
}

/**
 * Returns the count of users with at least one active session.
 */
export const calculateActiveUsers = async (filters = {}) => {
  const activeUsers = await aggregateActiveUsers(resolveSessionMatch(filters))

  return { activeUsers }
}

/**
 * Returns bounce rate as a percentage of sessions with one event or duration under 30 seconds.
 */
export const calculateBounceRate = async (filters = {}) => {
  const bounceRate = await aggregateBounceRate(resolveSessionMatch(filters))

  return { bounceRate }
}

/**
 * Returns session counts grouped by duration buckets.
 */
export const calculateSessionDistribution = async (filters = {}) => {
  return aggregateSessionDistribution(resolveSessionMatch(filters))
}
