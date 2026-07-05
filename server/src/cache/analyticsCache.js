import { cacheService } from './cacheService.js'
import { buildAnalyticsCacheKey } from './cacheKeys.js'
import { phase3Config } from '../config/phase3Config.js'
import { metricsCollector } from '../metrics/metricsCollector.js'

export const withAnalyticsCache = (namespace, fetchFn, extraResolver = () => ({})) => {
  return async (...args) => {
    if (!phase3Config.cache.enabled) {
      return fetchFn(...args)
    }

    const filters = args[0] || {}
    const extra = extraResolver(...args)
    const cacheKey = buildAnalyticsCacheKey(namespace, filters, extra)
    const cached = await cacheService.get(cacheKey)

    if (cached !== null) {
      metricsCollector.recordCacheHit()
      return cached
    }

    metricsCollector.recordCacheMiss()
    const data = await fetchFn(...args)
    await cacheService.set(cacheKey, data)

    return data
  }
}

export default withAnalyticsCache
