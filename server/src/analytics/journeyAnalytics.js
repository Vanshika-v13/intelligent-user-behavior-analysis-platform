import { resolveSessionObjectId } from '../utils/analyticsValidators.js'
import {
  aggregateUserJourneys,
  aggregateDropOffs,
  aggregatePageTransitions,
} from '../services/analyticsAggregationService.js'
import { buildEventMatchFilter, hasActiveFilters } from './analyticsFilters.js'

const resolveEventMatch = (filters = {}) =>
  hasActiveFilters(filters) ? buildEventMatchFilter(filters) : {}

/**
 * Returns ordered page views for a session journey.
 */
export const calculateUserJourney = async (sessionId) => {
  const sessionObjectId = await resolveSessionObjectId(sessionId)
  return aggregateUserJourneys(sessionObjectId)
}

/**
 * Returns pages where users most frequently end their sessions.
 */
export const calculateDropOffPages = async (filters = {}) => {
  return aggregateDropOffs(resolveEventMatch(filters))
}

/**
 * Returns consecutive page-to-page transitions across sessions.
 */
export const calculatePageTransitions = async (filters = {}) => {
  return aggregatePageTransitions(resolveEventMatch(filters))
}
