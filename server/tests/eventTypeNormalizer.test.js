import {
  normalizeEventType,
  isValidEventType,
} from '../src/utils/eventTypeNormalizer.js'
import { extractTrackMetadata } from '../src/utils/eventPayloadBuilder.js'
import {
  LESSON_STARTED,
  COURSE_COMPLETION_PERCENTAGE,
} from '../src/constants/eventTypes.js'

describe('eventTypeNormalizer', () => {
  it('accepts canonical event types', () => {
    expect(normalizeEventType('PAGE_VIEW')).toBe('PAGE_VIEW')
    expect(isValidEventType('PAGE_VIEW')).toBe(true)
  })

  it('maps legacy frontend aliases to canonical types', () => {
    expect(normalizeEventType('lesson_started')).toBe(LESSON_STARTED)
    expect(normalizeEventType('course_completion_percentage')).toBe(
      COURSE_COMPLETION_PERCENTAGE
    )
  })

  it('returns null for unsupported types', () => {
    expect(normalizeEventType('unknown_event')).toBeNull()
    expect(isValidEventType('unknown_event')).toBe(false)
  })
})

describe('eventPayloadBuilder', () => {
  it('merges top-level custom fields into metadata', () => {
    const metadata = extractTrackMetadata({
      eventType: 'lesson_started',
      courseId: 'abc',
      lessonId: 'lesson-1',
      metadata: { source: 'video' },
    })

    expect(metadata).toEqual({
      courseId: 'abc',
      lessonId: 'lesson-1',
      source: 'video',
    })
  })
})
