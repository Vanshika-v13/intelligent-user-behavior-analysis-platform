import { processOldEventCleanup } from '../processors/cleanupProcessor.js'

export const runOldEventCleanupJob = async () => processOldEventCleanup()

export default runOldEventCleanupJob
