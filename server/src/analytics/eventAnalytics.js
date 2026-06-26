import {
  aggregatePageViews,
  aggregateButtonClicks,
  aggregateSearchQueries,
  aggregateEventsByType,
} from '../services/analyticsAggregationService.js'

/**
 * Returns pages ranked by PAGE_VIEW count.
 */
export const calculateMostVisitedPages = async () => {
  return aggregatePageViews()
}

/**
 * Returns buttons ranked by CLICK count using metadata.buttonId.
 */
export const calculateMostClickedButtons = async () => {
  const results = await aggregateButtonClicks()

  return results.map(({ buttonId, count }) => ({
    buttonId,
    count,
  }))
}

/**
 * Returns search queries ranked by SEARCH event count using metadata.searchQuery.
 */
export const calculateMostSearchedCourses = async () => {
  const results = await aggregateSearchQueries()

  return results.map(({ searchQuery, count }) => ({
    searchQuery,
    count,
  }))
}

/**
 * Returns event counts keyed by event type.
 */
export const calculateEventDistribution = async () => {
  const results = await aggregateEventsByType()

  return results.reduce((distribution, { eventType, count }) => {
    distribution[eventType] = count
    return distribution
  }, {})
}
