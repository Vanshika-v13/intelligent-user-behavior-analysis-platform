import Event from '../models/Event.js'
import { persistEvent } from './eventTrackingService.js'
import { normalizeEventType } from '../utils/eventTypeNormalizer.js'
import { validateUserExists, validateSessionExists } from '../utils/analyticsValidators.js'
import { createError } from '../utils/appError.js'

const parsePagination = ({ page, limit }) => {
  const currentPage = Math.max(1, parseInt(page, 10) || 1)
  const pageLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
  const skip = (currentPage - 1) * pageLimit

  return { currentPage, pageLimit, skip }
}

const validateEventTypeFilter = (eventType) => {
  if (!normalizeEventType(eventType)) {
    throw createError('Invalid event type', 400)
  }
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
  return persistEvent({
    sessionId,
    userId,
    eventType,
    page,
    metadata,
  })
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
    validateEventTypeFilter(eventType)
    filter.eventType = normalizeEventType(eventType)
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
