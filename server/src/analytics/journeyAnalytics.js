import mongoose from 'mongoose'
import Session from '../models/Session.js'
import {
  aggregateUserJourneys,
  aggregateDropOffs,
  aggregatePageTransitions,
} from '../services/analyticsAggregationService.js'

const createError = (message) => {
  const error = new Error(message)
  error.statusCode = 404
  return error
}

const resolveSessionObjectId = async (sessionId) => {
  if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
    throw createError('Session not found')
  }

  const session = await Session.findById(sessionId).select('_id')

  if (!session) {
    throw createError('Session not found')
  }

  return session._id
}

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
