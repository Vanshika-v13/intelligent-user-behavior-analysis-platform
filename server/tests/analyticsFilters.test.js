import {
  parseDateRange,
  parseAnalyticsFilters,
  hasActiveFilters,
  buildEventMatchFilter,
  buildSessionMatchFilter,
  classifyDeviceCategory,
  filterByEngagementLevel,
} from '../src/analytics/analyticsFilters.js'

describe('analyticsFilters', () => {
  describe('parseDateRange', () => {
    it('returns null when no dates provided', () => {
      expect(parseDateRange(null, null)).toBeNull()
    })

    it('builds a range with start and end dates', () => {
      const range = parseDateRange('2026-01-01', '2026-01-31')
      expect(range.$gte).toEqual(new Date('2026-01-01'))
      expect(range.$lte.getHours()).toBe(23)
    })

    it('throws on invalid startDate', () => {
      expect(() => parseDateRange('not-a-date', null)).toThrow('Invalid startDate')
    })
  })

  describe('parseAnalyticsFilters', () => {
    it('returns defaults when query is empty', () => {
      const filters = parseAnalyticsFilters({})
      expect(filters.interval).toBe('daily')
      expect(filters.startDate).toBeNull()
    })

    it('parses all supported filter fields', () => {
      const filters = parseAnalyticsFilters({
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        courseId: 'course-1',
        userId: '507f1f77bcf86cd799439011',
        device: 'mobile',
        browser: 'Chrome',
        eventType: 'PAGE_VIEW',
        engagementLevel: 'High',
        interval: 'weekly',
      })

      expect(filters.startDate).toBe('2026-01-01')
      expect(filters.courseId).toBe('course-1')
      expect(filters.interval).toBe('weekly')
    })

    it('rejects invalid interval', () => {
      expect(() => parseAnalyticsFilters({ interval: 'hourly' })).toThrow(
        'Invalid interval'
      )
    })
  })

  describe('hasActiveFilters', () => {
    it('returns false for empty filters', () => {
      expect(hasActiveFilters({})).toBe(false)
    })

    it('returns true when startDate is set', () => {
      expect(hasActiveFilters({ startDate: '2026-01-01' })).toBe(true)
    })
  })

  describe('buildEventMatchFilter', () => {
    it('builds match with userId and eventType', () => {
      const userId = '507f1f77bcf86cd799439011'
      const match = buildEventMatchFilter({ userId, eventType: 'PAGE_VIEW' })

      expect(match.eventType).toBe('PAGE_VIEW')
      expect(match.userId.toString()).toBe(userId)
    })
  })

  describe('buildSessionMatchFilter', () => {
    it('builds match with device and browser', () => {
      const match = buildSessionMatchFilter({ device: 'mobile', browser: 'Safari' })
      expect(match.device).toBeDefined()
      expect(match.browser).toBeDefined()
    })
  })

  describe('classifyDeviceCategory', () => {
    it('classifies mobile devices', () => {
      expect(classifyDeviceCategory('mobile')).toBe('Mobile')
      expect(classifyDeviceCategory('iPhone')).toBe('Mobile')
    })

    it('classifies desktop devices', () => {
      expect(classifyDeviceCategory('desktop')).toBe('Desktop')
    })

    it('classifies tablet devices', () => {
      expect(classifyDeviceCategory('iPad')).toBe('Tablet')
    })
  })

  describe('filterByEngagementLevel', () => {
    it('returns all rows when no level specified', () => {
      const rows = [{ level: 'Low' }, { level: 'High' }]
      expect(filterByEngagementLevel(rows)).toHaveLength(2)
    })

    it('filters by engagement level', () => {
      const rows = [{ level: 'Low' }, { level: 'High' }]
      expect(filterByEngagementLevel(rows, 'high')).toHaveLength(1)
    })
  })
})
