import {
  aggregateDashboardCounts,
  aggregateAverageSessionDuration,
  aggregateBounceRate,
  aggregateActiveUsers,
} from '../services/analyticsAggregationService.js'
import {
  buildEventMatchFilter,
  buildSessionMatchFilter,
  hasActiveFilters,
} from './analyticsFilters.js'

/**
 * Returns high-level metrics for the analytics dashboard overview.
 */
export const getDashboardOverview = async (filters = {}) => {
  const sessionMatch = hasActiveFilters(filters)
    ? buildSessionMatchFilter(filters)
    : {}
  const eventMatch = hasActiveFilters(filters)
    ? buildEventMatchFilter(filters)
    : {}

  const [
    counts,
    averageSessionDuration,
    bounceRate,
    activeUsers,
  ] = await Promise.all([
    aggregateDashboardCounts(eventMatch, sessionMatch),
    aggregateAverageSessionDuration(sessionMatch),
    aggregateBounceRate(sessionMatch),
    aggregateActiveUsers(sessionMatch),
  ])

  return {
    totalUsers: counts.totalUsers,
    totalSessions: counts.totalSessions,
    totalEvents: counts.totalEvents,
    averageSessionDuration,
    bounceRate,
    activeUsers,
  }
}
