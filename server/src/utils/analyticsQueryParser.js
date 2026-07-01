import { parseAnalyticsFilters } from '../analytics/analyticsFilters.js'
import { createError } from '../utils/appError.js'

/**
 * Parses analytics query parameters from an Express request.
 * Returns empty filters when no query params are provided (backward compatible).
 */
export const extractAnalyticsFilters = (query = {}) => {
  const hasFilterParams = Boolean(
    query.startDate ||
      query.endDate ||
      query.courseId ||
      query.userId ||
      query.device ||
      query.browser ||
      query.eventType ||
      query.engagementLevel ||
      query.interval ||
      query.groupBy
  )

  if (!hasFilterParams) {
    return {}
  }

  try {
    return parseAnalyticsFilters(query)
  } catch (error) {
    throw createError(error.message, 400)
  }
}
