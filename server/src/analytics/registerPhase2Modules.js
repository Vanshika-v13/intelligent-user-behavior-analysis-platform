import { registerAnalyticsModule } from './moduleRegistry.js'
import { getDeviceMetrics } from './deviceAnalytics.js'
import { getCourseMetrics } from './courseAnalytics.js'
import { getVideoMetrics } from './videoAnalytics.js'
import { getQuizMetrics } from './quizAnalytics.js'
import { getUserMetrics } from './userAnalytics.js'
import { getFunnelMetrics } from './funnelAnalytics.js'
import { getTimeSeriesMetrics } from './timeSeriesAnalytics.js'

/**
 * Registers all Phase 2 analytics modules with the extension registry.
 * Future phases (caching, ML, reports) can consume modules via getRegisteredAnalyticsModules().
 */
export const registerPhase2AnalyticsModules = () => {
  registerAnalyticsModule({
    name: 'devices',
    getMetrics: getDeviceMetrics,
  })

  registerAnalyticsModule({
    name: 'courses',
    getMetrics: getCourseMetrics,
  })

  registerAnalyticsModule({
    name: 'videos',
    getMetrics: getVideoMetrics,
  })

  registerAnalyticsModule({
    name: 'quizzes',
    getMetrics: getQuizMetrics,
  })

  registerAnalyticsModule({
    name: 'users',
    getMetrics: getUserMetrics,
  })

  registerAnalyticsModule({
    name: 'funnels',
    getMetrics: getFunnelMetrics,
  })

  registerAnalyticsModule({
    name: 'timeseries',
    getMetrics: getTimeSeriesMetrics,
  })
}
