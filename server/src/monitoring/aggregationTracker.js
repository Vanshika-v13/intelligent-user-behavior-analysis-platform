import { phase3Config } from '../config/phase3Config.js'
import { metricsCollector } from '../metrics/metricsCollector.js'

export const trackAggregation = async (label, fn) => {
  const startedAt = Date.now()
  const result = await fn()
  const durationMs = Date.now() - startedAt

  metricsCollector.recordAggregationTiming(durationMs, label)

  if (durationMs >= phase3Config.monitoring.slowQueryThresholdMs) {
    metricsCollector.recordSlowQuery(durationMs, label)
  }

  return result
}

export default trackAggregation
