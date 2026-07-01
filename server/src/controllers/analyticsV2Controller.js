import {
  getDeviceAnalytics,
  getCourseAnalytics,
  getVideoAnalytics,
  getQuizAnalytics,
  getUserAnalytics,
  getFunnelAnalytics,
  getTimeSeriesAnalytics,
} from '../services/analyticsV2Service.js'
import { extractAnalyticsFilters } from '../utils/analyticsQueryParser.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const createV2Handler = (serviceFn) =>
  asyncHandler(async (req, res) => {
    const filters = extractAnalyticsFilters(req.query)
    const data = await serviceFn(filters)

    res.status(200).json({
      success: true,
      data,
    })
  })

export const getDevices = createV2Handler(getDeviceAnalytics)
export const getCourses = createV2Handler(getCourseAnalytics)
export const getVideos = createV2Handler(getVideoAnalytics)
export const getQuizzes = createV2Handler(getQuizAnalytics)
export const getUsers = createV2Handler(getUserAnalytics)
export const getFunnels = createV2Handler(getFunnelAnalytics)
export const getTimeSeries = createV2Handler(getTimeSeriesAnalytics)
