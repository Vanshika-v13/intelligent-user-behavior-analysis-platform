import { resolveSessionObjectId } from '../utils/analyticsValidators.js'
import {
  aggregateUserJourneys,
  aggregateDropOffs,
  aggregatePageTransitions,
} from '../services/analyticsAggregationService.js'

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
export const calculateDropOffPages = async () => {
  return aggregateDropOffs()
}

/**
 * Returns consecutive page-to-page transitions across sessions.
 */
export const calculatePageTransitions = async () => {
  return aggregatePageTransitions()
}
