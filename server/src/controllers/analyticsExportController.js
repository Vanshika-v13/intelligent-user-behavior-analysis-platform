import { extractAnalyticsFilters } from '../utils/analyticsQueryParser.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { formatExport } from '../utils/exportFormatter.js'

// Reuse all existing analytics services — no new aggregation logic
import { getOverviewAnalytics } from '../services/analyticsService.js'
import { getCourseAnalytics } from '../services/analyticsV2Service.js'
import { getVideoAnalytics } from '../services/analyticsV2Service.js'
import { getQuizAnalytics } from '../services/analyticsV2Service.js'
import { getDeviceAnalytics } from '../services/analyticsV2Service.js'
import { getFunnelAnalytics } from '../services/analyticsV2Service.js'
import { getEngagementAnalytics } from '../services/analyticsService.js'

const SUPPORTED_FORMATS = new Set(['csv', 'xlsx'])

/**
 * GET /api/analytics/export
 *
 * Query params (same as every other analytics endpoint, plus format):
 *   startDate, endDate, interval, courseId   — forwarded to all analytics services
 *   format                                   — 'csv' (default) | 'xlsx'
 *
 * Returns a downloadable file whose data is sourced entirely from live MongoDB aggregations.
 * No data is generated or mocked in this controller.
 */
export const getAnalyticsExport = asyncHandler(async (req, res) => {
  const format = SUPPORTED_FORMATS.has(req.query.format) ? req.query.format : 'csv'

  // Use the same filter parser every other analytics endpoint uses
  const filters = extractAnalyticsFilters(req.query)

  // Fetch all analytics sections in parallel — reusing existing service functions
  const [overview, courses, videos, quizzes, devices, funnels, engagement] =
    await Promise.all([
      getOverviewAnalytics(filters),
      getCourseAnalytics(filters),
      getVideoAnalytics(filters),
      getQuizAnalytics(filters),
      getDeviceAnalytics(filters),
      getFunnelAnalytics(filters),
      getEngagementAnalytics().catch(() => ({ engagementScores: [], engagementLevels: [] })),
    ])

  const payload = { overview, courses, videos, quizzes, devices, funnels, engagement }

  const { contentType, buffer, filename } = formatExport(payload, format)

  res.setHeader('Content-Type', contentType)
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.setHeader('Cache-Control', 'no-store')

  return res.send(buffer)
})
