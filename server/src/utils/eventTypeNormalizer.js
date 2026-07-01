import { EVENT_TYPES } from '../constants/eventTypes.js'

/**
 * Maps legacy / frontend event names to canonical SCREAMING_SNAKE_CASE types.
 * Preserves backward compatibility without changing frontend contracts.
 */
const EVENT_TYPE_ALIASES = {
  lesson_started: 'LESSON_STARTED',
  lesson_completed: 'LESSON_COMPLETED',
  lesson_marked_complete: 'LESSON_MARKED_COMPLETE',
  course_completion_percentage: 'COURSE_COMPLETION_PERCENTAGE',
  time_spent_learning: 'TIME_SPENT_LEARNING',
}

/**
 * Normalizes an incoming event type to a canonical backend value.
 * Returns null when the type cannot be resolved.
 */
export const normalizeEventType = (eventType) => {
  if (!eventType || typeof eventType !== 'string') {
    return null
  }

  const trimmed = eventType.trim()

  if (EVENT_TYPES.includes(trimmed)) {
    return trimmed
  }

  const aliasKey = trimmed.toLowerCase()
  const aliased = EVENT_TYPE_ALIASES[aliasKey]

  if (aliased && EVENT_TYPES.includes(aliased)) {
    return aliased
  }

  return null
}

/**
 * Returns true when the event type resolves to a supported canonical type.
 */
export const isValidEventType = (eventType) => normalizeEventType(eventType) !== null
