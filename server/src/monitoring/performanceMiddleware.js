import { phase3Config } from '../config/phase3Config.js'
import { metricsCollector } from '../metrics/metricsCollector.js'

export const performanceMiddleware = (req, res, next) => {
  const startedAt = Date.now()
  const originalEnd = res.end

  res.end = function performanceEnd(...args) {
    const durationMs = Date.now() - startedAt

    if (!res.headersSent) {
      res.setHeader('X-Response-Time', `${durationMs}ms`)
    }

    metricsCollector.recordApiLatency(durationMs, req.originalUrl, req.method)

    if (durationMs >= phase3Config.monitoring.slowApiThresholdMs) {
      metricsCollector.recordSlowQuery(durationMs, 'api-request', {
        path: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
      })
    }

    return originalEnd.apply(this, args)
  }

  next()
}

export default performanceMiddleware
