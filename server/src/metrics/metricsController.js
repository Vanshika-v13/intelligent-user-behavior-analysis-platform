import { getSystemMetrics } from '../metrics/metricsService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getMetricsHandler = asyncHandler(async (_req, res) => {
  const metrics = await getSystemMetrics()

  res.status(200).json({
    success: true,
    data: metrics,
  })
})

export default getMetricsHandler
