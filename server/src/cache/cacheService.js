import { getRedisClient } from './redisClient.js'
import { phase3Config } from '../config/phase3Config.js'
import { metricsCollector } from '../metrics/metricsCollector.js'

const serialize = (value) => JSON.stringify(value)

const deserialize = (value) => {
  if (value === null || value === undefined) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export const cacheService = {
  async get(key) {
    const startedAt = Date.now()

    try {
      const client = await getRedisClient()
      const value = await client.get(key)
      metricsCollector.recordCacheTiming(Date.now() - startedAt, 'get')

      return deserialize(value)
    } catch {
      metricsCollector.recordCacheTiming(Date.now() - startedAt, 'get-error')
      return null
    }
  },

  async set(key, value, ttlSeconds = phase3Config.cache.ttlSeconds) {
    const startedAt = Date.now()

    try {
      const client = await getRedisClient()
      await client.set(key, serialize(value), 'EX', ttlSeconds)
      metricsCollector.recordCacheTiming(Date.now() - startedAt, 'set')
      return true
    } catch {
      metricsCollector.recordCacheTiming(Date.now() - startedAt, 'set-error')
      return false
    }
  },

  async del(key) {
    const client = await getRedisClient()
    return client.del(key)
  },

  async deleteByPattern(pattern) {
    const client = await getRedisClient()
    const keys = await client.keys(pattern)

    if (!keys.length) {
      return 0
    }

    return client.del(...keys)
  },
}

export default cacheService
