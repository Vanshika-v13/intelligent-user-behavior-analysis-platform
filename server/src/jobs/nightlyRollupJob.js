import { processDailyRollup } from '../processors/rollupProcessor.js'

export const runNightlyRollupJob = async () => processDailyRollup()

export default runNightlyRollupJob
