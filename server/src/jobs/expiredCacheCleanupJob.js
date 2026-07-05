import { processCacheCleanup } from '../processors/cleanupProcessor.js'

export const runExpiredCacheCleanupJob = async () => processCacheCleanup()

export default runExpiredCacheCleanupJob
