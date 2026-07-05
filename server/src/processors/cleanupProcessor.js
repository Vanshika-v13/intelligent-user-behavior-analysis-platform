import { buildCachePattern } from '../cache/cacheKeys.js'
import { cacheService } from '../cache/cacheService.js'
import Event from '../models/Event.js'
import { phase3Config } from '../config/phase3Config.js'

export const processCacheCleanup = async () => {
  const removed = await cacheService.deleteByPattern(buildCachePattern('*'))
  return { removedKeys: removed }
}

export const processOldEventCleanup = async () => {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - phase3Config.rollups.retentionDays)

  const result = await Event.deleteMany({
    timestamp: { $lt: cutoff },
  })

  return {
    deletedCount: result.deletedCount,
    cutoffDate: cutoff.toISOString(),
  }
}

export const processCleanupJob = async (payload = {}) => {
  const jobType = payload.jobType || 'cache-cleanup'

  if (jobType === 'event-cleanup') {
    return processOldEventCleanup()
  }

  return processCacheCleanup()
}

export default processCleanupJob
