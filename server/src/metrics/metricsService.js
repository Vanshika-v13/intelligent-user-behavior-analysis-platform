import mongoose from 'mongoose'
import { metricsCollector } from './metricsCollector.js'
import { refreshAllQueueMetrics, getQueueManagerSnapshot } from '../queue/queueManager.js'
import { getLatestRollup } from '../rollups/rollupService.js'

const measureDatabaseLatency = async () => {
  const startedAt = Date.now()

  if (mongoose.connection.readyState !== 1) {
    return null
  }

  await mongoose.connection.db.admin().ping()
  const latencyMs = Date.now() - startedAt
  metricsCollector.recordDatabaseLatency(latencyMs)
  return latencyMs
}

export const getSystemMetrics = async () => {
  await refreshAllQueueMetrics()
  await measureDatabaseLatency()

  const latestRollup = await getLatestRollup()

  if (latestRollup?.computedAt) {
    metricsCollector.setRollupFreshness(latestRollup.computedAt)
  }

  const snapshot = metricsCollector.getSnapshot()

  return {
    ...snapshot,
    queueManager: getQueueManagerSnapshot(),
  }
}

export default getSystemMetrics
