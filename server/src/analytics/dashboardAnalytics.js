import {
  aggregateDashboardCounts,
  aggregateAverageSessionDuration,
  aggregateBounceRate,
  aggregateActiveUsers,
} from '../services/analyticsAggregationService.js'

/**
 * Returns high-level metrics for the analytics dashboard overview.
 */
export const getDashboardOverview = async () => {
  const [
    counts,
    averageSessionDuration,
    bounceRate,
    activeUsers,
  ] = await Promise.all([
    aggregateDashboardCounts(),
    aggregateAverageSessionDuration(),
    aggregateBounceRate(),
    aggregateActiveUsers(),
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
