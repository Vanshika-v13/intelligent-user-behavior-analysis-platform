import {
  getOverviewAnalytics,
  getSessionAnalytics,
  getEventAnalytics,
  getJourneyAnalytics,
  getEngagementAnalytics as fetchEngagementAnalytics,
} from '../services/analyticsService.js'

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
