import {
  getOverviewAnalytics,
  getSessionAnalytics,
  getEventAnalytics,
  getJourneyAnalytics,
  getEngagementAnalytics as fetchEngagementAnalytics,
} from '../services/analyticsService.js'
import { persistAuthenticatedTrackEvent } from '../services/eventTrackingService.js'
import { buildTrackEventDocument } from '../utils/eventPayloadBuilder.js'
import { extractAnalyticsFilters } from '../utils/analyticsQueryParser.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { analyticsLogger } from '../utils/analyticsLogger.js'

export const getOverview = asyncHandler(async (req, res) => {
  const filters = extractAnalyticsFilters(req.query)
  const data = await getOverviewAnalytics(filters)

  res.status(200).json({
    success: true,
    data,
  })
})

export const getSessionsAnalytics = asyncHandler(async (req, res) => {
  const filters = extractAnalyticsFilters(req.query)
  const data = await getSessionAnalytics(filters)

  res.status(200).json({
    success: true,
    data,
  })
})

export const getEventsAnalytics = asyncHandler(async (req, res) => {
  const filters = extractAnalyticsFilters(req.query)
  const data = await getEventAnalytics(filters)

  res.status(200).json({
    success: true,
    data,
  })
})

export const getJourneysAnalytics = asyncHandler(async (req, res) => {
  const { sessionId } = req.query
  const filters = extractAnalyticsFilters(req.query)
  const data = await getJourneyAnalytics(sessionId, filters)

  res.status(200).json({
    success: true,
    data,
  })
})

export const getEngagementAnalytics = asyncHandler(async (req, res) => {
  const { userId } = req.query
  const data = await fetchEngagementAnalytics(userId)

  res.status(200).json({
    success: true,
    data,
  })
})

export const trackEvent = async (req, res, next) => {
  try {
    const eventDocument = buildTrackEventDocument(req.body, req.user._id)
    const event = await persistAuthenticatedTrackEvent(eventDocument)

    res.status(201).json({
      success: true,
      message: 'Event tracked successfully',
      event,
    })
  } catch (error) {
    if (error.statusCode) {
      return next(error)
    }

    if (error.name === 'ValidationError') {
      return next(error)
    }

    analyticsLogger.error('Track event storage failed', error, {
      eventType: req.body?.eventType,
      userId: req.user?._id?.toString(),
    })

    res.status(200).json({
      success: true,
      message: 'Event acknowledged (storage skipped)',
    })
  }
}
