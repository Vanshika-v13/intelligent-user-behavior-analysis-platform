import {
  getOverviewAnalytics,
  getSessionAnalytics,
  getEventAnalytics,
  getJourneyAnalytics,
  getEngagementAnalytics as fetchEngagementAnalytics,
} from '../services/analyticsService.js'
import Event from '../models/Event.js'

export const getOverview = async (req, res, next) => {
  try {
    const data = await getOverviewAnalytics()

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
}

export const getSessionsAnalytics = async (req, res, next) => {
  try {
    const data = await getSessionAnalytics()

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
}

export const getEventsAnalytics = async (req, res, next) => {
  try {
    const data = await getEventAnalytics()

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
}

export const getJourneysAnalytics = async (req, res, next) => {
  try {
    const { sessionId } = req.query
    const data = await getJourneyAnalytics(sessionId)

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
}

export const getEngagementAnalytics = async (req, res, next) => {
  try {
    const { userId } = req.query
    const data = await fetchEngagementAnalytics(userId)

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
}

export const trackEvent = async (req, res, next) => {
  try {
    const { eventType, page, metadata, timestamp } = req.body

    if (!eventType) {
      return res.status(400).json({
        success: false,
        message: 'eventType is required',
      })
    }

    const event = await Event.create({
      eventType,
      page: page || req.body.page || '',
      metadata: metadata || {},
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      userId: req.user._id,
      sessionId: req.body.sessionId || null,
    })

    res.status(201).json({
      success: true,
      message: 'Event tracked successfully',
      event,
    })
  } catch (error) {
    // Don't let analytics tracking errors crash the request
    console.error('Analytics track error:', error.message)
    res.status(200).json({
      success: true,
      message: 'Event acknowledged (storage skipped)',
    })
  }
}
