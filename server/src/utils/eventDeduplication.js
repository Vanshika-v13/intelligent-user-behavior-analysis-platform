import Event from '../models/Event.js'
import { buildEventFingerprint } from './eventFingerprint.js'

export const findExistingEvent = async ({ idempotencyKey, eventFingerprint }) => {
  if (idempotencyKey) {
    const byKey = await Event.findOne({ idempotencyKey }).lean()
    if (byKey) {
      return byKey
    }
  }

  if (eventFingerprint) {
    return Event.findOne({ eventFingerprint }).lean()
  }

  return null
}

export const buildDedupFields = (eventInput) => {
  const idempotencyKey = eventInput.idempotencyKey || null
  const eventFingerprint = buildEventFingerprint(eventInput)

  return {
    idempotencyKey,
    eventFingerprint,
  }
}

export default findExistingEvent
