import { initializeEventQueue, shutdownEventQueue } from '../queue/eventQueue.js'
import { initializeJobs, shutdownJobs } from '../jobs/index.js'
import { closeRedisClient } from '../cache/redisClient.js'
import { phase3Config } from '../config/phase3Config.js'

let _bootstrapped = false

export const bootstrapPhase3 = async () => {
  if (_bootstrapped) {
    return { queue: 'already-initialized', jobs: 'already-initialized' }
  }

  await initializeEventQueue()
  const jobs = await initializeJobs()

  _bootstrapped = true

  return {
    queue: 'initialized',
    jobs: jobs.mode,
  }
}

export const shutdownPhase3 = async () => {
  const shutdownSteps = []

  try {
    await shutdownJobs()
    shutdownSteps.push('jobs')
  } catch (error) {
    console.warn(`Phase 3 jobs shutdown warning: ${error.message}`)
  }

  try {
    await shutdownEventQueue({ timeoutMs: phase3Config.queue.shutdownTimeoutMs })
    shutdownSteps.push('queue')
  } catch (error) {
    console.warn(`Phase 3 queue shutdown warning: ${error.message}`)
  }

  try {
    await closeRedisClient()
    shutdownSteps.push('redis')
  } catch (error) {
    console.warn(`Phase 3 redis shutdown warning: ${error.message}`)
  }

  _bootstrapped = false

  return { shutdown: shutdownSteps }
}

export default bootstrapPhase3
