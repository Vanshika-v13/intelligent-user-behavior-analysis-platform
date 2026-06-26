import mongoose from 'mongoose'
import Event from '../models/Event.js'
import Session from '../models/Session.js'
import User from '../models/User.js'
import { EVENT_TYPES } from '../constants/eventTypes.js'

const createError = (message, statusCode) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

const validateUserExists = async (userId) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw createError('User not found', 404)
  }

  const user = await User.findById(userId)
  if (!user) {
    throw createError('User not found', 404)
  }

  return user
}

const validateSessionExists = async (sessionId) => {
  if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
    throw createError('Session not found', 404)
  }

  const session = await Session.findById(sessionId)
  if (!session) {
    throw createError('Session not found', 404)
  }

  return session
}

const validateEventType = (eventType) => {
  if (!eventType || !EVENT_TYPES.includes(eventType)) {
    throw createError('Invalid event type', 400)
  }
}

const parsePagination = ({ page, limit }) => {
  const currentPage = Math.max(1, parseInt(page, 10) || 1)
  const pageLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
  const skip = (currentPage - 1) * pageLimit

  return { currentPage, pageLimit, skip }
}

/**
 * Records a new user interaction event within a session.
 */
export const createEvent = async ({
  sessionId,
  userId,
  eventType,
  page,
  metadata,
}) => {
  await validateUserExists(userId)
  await validateSessionExists(sessionId)

  const event = await Event.create({
    sessionId,
    userId,
    eventType,
    page,
    metadata: metadata || {},
    timestamp: new Date(),
  })

  return event
}

/**
 * Returns paginated events with optional filtering, newest first.
 */
export const getEvents = async ({
  page,
  limit,
  eventType,
  userId,
  sessionId,
}) => {
  const { currentPage, pageLimit, skip } = parsePagination({ page, limit })
  const filter = {}

  if (eventType) {
    validateEventType(eventType)
    filter.eventType = eventType
  }

  if (userId) {
    await validateUserExists(userId)
    filter.userId = userId
  }

  if (sessionId) {
    await validateSessionExists(sessionId)
    filter.sessionId = sessionId
  }

  const totalEvents = await Event.countDocuments(filter)
  const totalPages = Math.ceil(totalEvents / pageLimit) || 1

  const events = await Event.find(filter)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(pageLimit)

  return {
    events,
    totalEvents,
    currentPage,
    totalPages,
  }
}

/**
 * Fetches a single event by MongoDB _id with populated references.
 */
export const getEventById = async (id) => {
  const event = await Event.findById(id)
    .populate('userId', 'name email')
    .populate('sessionId')

  if (!event) {
    throw createError('Event not found', 404)
  }

  return event
}

/**
 * Returns all events for a session, sorted chronologically for journey analysis.
 */
export const getEventsBySession = async (sessionId) => {
  await validateSessionExists(sessionId)

  const events = await Event.find({ sessionId }).sort({ timestamp: 1 })

  return events
}

/**
 * Returns paginated events for a user, newest first.
 */
export const getEventsByUser = async (userId, { page, limit }) => {
  await validateUserExists(userId)

  const { currentPage, pageLimit, skip } = parsePagination({ page, limit })
  const filter = { userId }

  const totalEvents = await Event.countDocuments(filter)
  const totalPages = Math.ceil(totalEvents / pageLimit) || 1

  const events = await Event.find(filter)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(pageLimit)

  return {
    events,
    totalEvents,
    currentPage,
    totalPages,
  }
}
