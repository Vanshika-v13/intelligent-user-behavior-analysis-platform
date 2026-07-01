import {
  aggregatePageViews,
  aggregateButtonClicks,
  aggregateSearchQueries,
  aggregateEventsByType,
} from '../services/analyticsAggregationService.js'
import { buildEventMatchFilter, hasActiveFilters } from './analyticsFilters.js'

const resolveEventMatch = (filters = {}) =>
  hasActiveFilters(filters) ? buildEventMatchFilter(filters) : {}

/**
 * Returns pages ranked by PAGE_VIEW count.
 */
export const calculateMostVisitedPages = async (filters = {}) => {
  return aggregatePageViews(resolveEventMatch(filters))
}

/**
 * Returns buttons ranked by CLICK count using metadata.buttonId.
 */
export const calculateMostClickedButtons = async (filters = {}) => {
  const results = await aggregateButtonClicks(resolveEventMatch(filters))

  return results.map(({ buttonId, count }) => ({
    buttonId,
    count,
  }))
}

/**
 * Returns search queries ranked by SEARCH event count using metadata.searchQuery.
 */
export const calculateMostSearchedCourses = async (filters = {}) => {
  const results = await aggregateSearchQueries(resolveEventMatch(filters))

  return results.map(({ searchQuery, count }) => ({
    searchQuery,
    count,
  }))
}

/**
 * Returns event counts keyed by event type.
 */
export const calculateEventDistribution = async (filters = {}) => {
  const results = await aggregateEventsByType(resolveEventMatch(filters))

  return results.reduce((distribution, { eventType, count }) => {
    distribution[eventType] = count
    return distribution
  }, {})
}
