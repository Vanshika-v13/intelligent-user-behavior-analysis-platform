import mongoose from 'mongoose'

const DEVICE_CATEGORIES = {
  desktop: ['desktop', 'Desktop'],
  mobile: ['mobile', 'Mobile', 'phone', 'Phone'],
  tablet: ['tablet', 'Tablet', 'ipad', 'iPad'],
}

const TIME_SERIES_INTERVALS = ['daily', 'weekly', 'monthly']

const DATE_FORMATS = {
  daily: '%Y-%m-%d',
  weekly: '%Y-W%V',
  monthly: '%Y-%m',
}

/**
 * Parses ISO date strings into a MongoDB date range on the given field.
 */
export const parseDateRange = (startDate, endDate) => {
  const range = {}

  if (startDate) {
    const start = new Date(startDate)
    if (Number.isNaN(start.getTime())) {
      throw new Error('Invalid startDate')
    }
    range.$gte = start
  }

  if (endDate) {
    const end = new Date(endDate)
    if (Number.isNaN(end.getTime())) {
      throw new Error('Invalid endDate')
    }
    end.setHours(23, 59, 59, 999)
    range.$lte = end
  }

  return Object.keys(range).length > 0 ? range : null
}

/**
 * Normalizes query parameters into a reusable analytics filter object.
 */
export const parseAnalyticsFilters = (query = {}) => {
  const interval = query.interval || query.groupBy || 'daily'

  if (!TIME_SERIES_INTERVALS.includes(interval)) {
    throw new Error(`Invalid interval. Must be one of: ${TIME_SERIES_INTERVALS.join(', ')}`)
  }

  const startDate = query.startDate || null
  const endDate = query.endDate || null

  if (startDate || endDate) {
    parseDateRange(startDate, endDate)
  }

  return {
    startDate,
    endDate,
    courseId: query.courseId || null,
    userId: query.userId || null,
    device: query.device || null,
    browser: query.browser || null,
    eventType: query.eventType || null,
    engagementLevel: query.engagementLevel || null,
    interval,
  }
}

/**
 * Returns true when any filter would alter the default platform-wide query.
 */
export const hasActiveFilters = (filters = {}) =>
  Boolean(
    filters.startDate ||
      filters.endDate ||
      filters.courseId ||
      filters.userId ||
      filters.device ||
      filters.browser ||
      filters.eventType ||
      filters.engagementLevel
  )

/**
 * Builds a MongoDB $match filter for Event collection queries.
 */
export const buildEventMatchFilter = (filters = {}) => {
  const match = {}

  const dateRange = parseDateRange(filters.startDate, filters.endDate)
  if (dateRange) {
    match.timestamp = dateRange
  }

  if (filters.userId) {
    match.userId = new mongoose.Types.ObjectId(filters.userId)
  }

  if (filters.eventType) {
    match.eventType = filters.eventType
  }

  if (filters.courseId) {
    match['metadata.courseId'] = filters.courseId
  }

  if (filters.browser) {
    match['metadata.browser'] = { $regex: filters.browser, $options: 'i' }
  }

  if (filters.device) {
    match['metadata.device'] = { $regex: filters.device, $options: 'i' }
  }

  return match
}

/**
 * Builds a MongoDB $match filter for Session collection queries.
 */
export const buildSessionMatchFilter = (filters = {}) => {
  const match = {}

  const dateRange = parseDateRange(filters.startDate, filters.endDate)
  if (dateRange) {
    match.startTime = dateRange
  }

  if (filters.userId) {
    match.userId = new mongoose.Types.ObjectId(filters.userId)
  }

  if (filters.device) {
    match.device = { $regex: filters.device, $options: 'i' }
  }

  if (filters.browser) {
    match.browser = { $regex: filters.browser, $options: 'i' }
  }

  return match
}

/**
 * Returns the $dateToString format for a time-series grouping interval.
 */
export const getDateGroupFormat = (interval = 'daily') => {
  return DATE_FORMATS[interval] || DATE_FORMATS.daily
}

/**
 * Classifies a raw device string into Desktop, Mobile, or Tablet.
 */
export const classifyDeviceCategory = (device = '') => {
  const normalized = device.toLowerCase()

  if (DEVICE_CATEGORIES.tablet.some((term) => normalized.includes(term.toLowerCase()))) {
    return 'Tablet'
  }

  if (DEVICE_CATEGORIES.mobile.some((term) => normalized.includes(term.toLowerCase()))) {
    return 'Mobile'
  }

  if (DEVICE_CATEGORIES.desktop.some((term) => normalized.includes(term.toLowerCase()))) {
    return 'Desktop'
  }

  return device ? 'Other' : 'Unknown'
}

/**
 * Filters user metric rows by engagement level when requested.
 */
export const filterByEngagementLevel = (rows, engagementLevel) => {
  if (!engagementLevel) {
    return rows
  }

  const normalized = engagementLevel.charAt(0).toUpperCase() + engagementLevel.slice(1).toLowerCase()

  return rows.filter((row) => row.level === normalized || row.engagementLevel === normalized)
}
