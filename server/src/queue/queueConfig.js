import { phase3Config } from '../config/phase3Config.js'

const limiter =
  phase3Config.queue.rateLimitMax > 0
    ? {
        max: phase3Config.queue.rateLimitMax,
        duration: phase3Config.queue.rateLimitDurationMs,
      }
    : undefined

export const queueConfig = {
  connection: phase3Config.redis.url
    ? { url: phase3Config.redis.url }
    : null,
  defaultJobOptions: {
    attempts: phase3Config.queue.maxRetries,
    backoff: {
      type: phase3Config.queue.backoffType,
      delay: phase3Config.queue.backoffDelayMs,
    },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
  limiter,
  lockDuration: phase3Config.queue.jobTimeoutMs,
}

export default queueConfig
