class MemoryStore {
  constructor() {
    this.values = new Map()
    this.expiry = new Map()
  }

  async get(key) {
    this.cleanup(key)
    return this.values.get(key) ?? null
  }

  async set(key, value, mode, ttlSeconds) {
    this.values.set(key, value)

    if (mode === 'EX' && ttlSeconds) {
      this.expiry.set(key, Date.now() + ttlSeconds * 1000)
    }

    return 'OK'
  }

  async del(...keys) {
    let removed = 0

    for (const key of keys) {
      if (this.values.delete(key)) {
        removed += 1
      }
      this.expiry.delete(key)
    }

    return removed
  }

  async keys(pattern) {
    this.cleanupAll()
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`)

    return [...this.values.keys()].filter((key) => regex.test(key))
  }

  cleanup(key) {
    const expiresAt = this.expiry.get(key)

    if (expiresAt && expiresAt <= Date.now()) {
      this.values.delete(key)
      this.expiry.delete(key)
    }
  }

  cleanupAll() {
    for (const key of [...this.expiry.keys()]) {
      this.cleanup(key)
    }
  }

  async ping() {
    return 'PONG'
  }

  async quit() {
    this.values.clear()
    this.expiry.clear()
  }
}

let client = null
let usingMemory = false

const createRedisClient = async () => {
  const { phase3Config } = await import('../config/phase3Config.js')

  if (!phase3Config.redis.enabled || !phase3Config.redis.url) {
    usingMemory = true
    client = new MemoryStore()
    return client
  }

  try {
    const { default: Redis } = await import('ioredis')
    const redisClient = new Redis(phase3Config.redis.url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    })

    await redisClient.ping()
    client = redisClient
    usingMemory = false
    return client
  } catch (error) {
    console.warn(`Redis unavailable, using in-memory cache: ${error.message}`)
    usingMemory = true
    client = new MemoryStore()
    return client
  }
}

export const getRedisClient = async () => {
  if (!client) {
    await createRedisClient()
  }

  return client
}

export const isUsingMemoryStore = () => usingMemory

export const closeRedisClient = async () => {
  if (!client) {
    return
  }

  if (typeof client.quit === 'function') {
    await client.quit()
  }

  client = null
}

export default getRedisClient
