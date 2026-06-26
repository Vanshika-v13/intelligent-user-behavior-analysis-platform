import {
  createEvent,
  getEvents,
  getEventById,
  getEventsBySession,
  getEventsByUser,
} from '../services/eventService.js'

export const createEventHandler = async (req, res, next) => {
  try {
    const { sessionId, userId, eventType, page, metadata } = req.body
    const event = await createEvent({
      sessionId,
      userId,
      eventType,
      page,
      metadata,
    })

    res.status(201).json({
      success: true,
      message: 'Event tracked successfully',
      event,
    })
  } catch (error) {
    next(error)
  }
}

export const getEventsHandler = async (req, res, next) => {
  try {
    const { page, limit, eventType, userId, sessionId } = req.query
    const result = await getEvents({ page, limit, eventType, userId, sessionId })

    res.status(200).json({
      success: true,
      totalEvents: result.totalEvents,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      events: result.events,
    })
  } catch (error) {
    next(error)
  }
}

export const getEventByIdHandler = async (req, res, next) => {
  try {
    const event = await getEventById(req.params.id)

    res.status(200).json({
      success: true,
      event,
    })
  } catch (error) {
    next(error)
  }
}

export const getEventsBySessionHandler = async (req, res, next) => {
  try {
    const events = await getEventsBySession(req.params.sessionId)

    res.status(200).json({
      success: true,
      events,
    })
  } catch (error) {
    next(error)
  }
}

export const getEventsByUserHandler = async (req, res, next) => {
  try {
    const { page, limit } = req.query
    const result = await getEventsByUser(req.params.userId, { page, limit })

    res.status(200).json({
      success: true,
      totalEvents: result.totalEvents,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      events: result.events,
    })
  } catch (error) {
    next(error)
  }
}
