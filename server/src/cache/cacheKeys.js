import crypto from 'crypto'
import { phase3Config } from '../config/phase3Config.js'

const stableStringify = (value) => {
  if (value === null || value === undefined) {
    return ''
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`
  }

  if (typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${key}:${stableStringify(value[key])}`)
      .join(',')}}`
  }

  return String(value)
}

export const buildAnalyticsCacheKey = (namespace, filters = {}, extra = {}) => {
  const payload = stableStringify({ filters, extra })
  const hash = crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16)

  return `${phase3Config.cache.prefix}:${namespace}:${hash}`
}

export const buildCachePattern = (namespace = '*') =>
  `${phase3Config.cache.prefix}:${namespace}:*`

export default buildAnalyticsCacheKey
