import crypto from 'crypto'

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

export const buildEventFingerprint = ({
  sessionId,
  userId,
  eventType,
  page,
  metadata,
  timestamp,
  idempotencyKey,
}) => {
  if (idempotencyKey) {
    return crypto.createHash('sha256').update(`idempotency:${idempotencyKey}`).digest('hex')
  }

  const payload = stableStringify({
    sessionId: sessionId ? String(sessionId) : null,
    userId: String(userId),
    eventType,
    page: page || '',
    metadata: metadata || {},
    timestamp: timestamp ? new Date(timestamp).toISOString() : null,
  })

  return crypto.createHash('sha256').update(payload).digest('hex')
}

export default buildEventFingerprint
