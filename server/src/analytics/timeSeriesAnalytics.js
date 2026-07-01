import {
  PAGE_VIEW,
  QUIZ_START,
  VIDEO_PLAY,
} from '../constants/eventTypes.js'
import {
  aggregateEvents,
  aggregateSessions,
  buildMatchStage,
} from '../services/analyticsAggregationService.js'
import {
  buildEventMatchFilter,
  buildSessionMatchFilter,
  getDateGroupFormat,
} from './analyticsFilters.js'

const buildTimeSeriesPipeline = (dateField, matchFilter, interval) => {
  const dateFormat = getDateGroupFormat(interval)

  return [
    ...buildMatchStage(matchFilter),
    {
      $group: {
        _id: {
          $dateToString: { format: dateFormat, date: `$${dateField}` },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        period: '$_id',
        count: 1,
      },
    },
    { $sort: { period: 1 } },
  ]
}

const buildDistinctUserTimeSeriesPipeline = (matchFilter, interval) => {
  const dateFormat = getDateGroupFormat(interval)

  return [
    ...buildMatchStage(matchFilter),
    {
      $group: {
        _id: {
          period: {
            $dateToString: { format: dateFormat, date: '$timestamp' },
          },
          userId: '$userId',
        },
      },
    },
    {
      $group: {
        _id: '$_id.period',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        period: '$_id',
        count: 1,
      },
    },
    { $sort: { period: 1 } },
  ]
}

/**
 * Returns event counts grouped by time period.
 */
export const getDailyEvents = async (filters = {}) => {
  const matchFilter = buildEventMatchFilter(filters)
  return aggregateEvents(buildTimeSeriesPipeline('timestamp', matchFilter, filters.interval))
}

/**
 * Returns session counts grouped by time period.
 */
export const getDailySessions = async (filters = {}) => {
  const matchFilter = buildSessionMatchFilter(filters)
  return aggregateSessions(buildTimeSeriesPipeline('startTime', matchFilter, filters.interval))
}

/**
 * Returns distinct active users grouped by time period.
 */
export const getDailyUsers = async (filters = {}) => {
  const matchFilter = buildEventMatchFilter(filters)
  return aggregateEvents(buildDistinctUserTimeSeriesPipeline(matchFilter, filters.interval))
}

/**
 * Returns PAGE_VIEW counts grouped by time period.
 */
export const getDailyPageViews = async (filters = {}) => {
  const matchFilter = {
    eventType: PAGE_VIEW,
    ...buildEventMatchFilter(filters),
  }
  return aggregateEvents(buildTimeSeriesPipeline('timestamp', matchFilter, filters.interval))
}

/**
 * Returns quiz attempt counts grouped by time period.
 */
export const getDailyQuizAttempts = async (filters = {}) => {
  const matchFilter = {
    eventType: QUIZ_START,
    ...buildEventMatchFilter(filters),
  }
  return aggregateEvents(buildTimeSeriesPipeline('timestamp', matchFilter, filters.interval))
}

/**
 * Returns video play counts grouped by time period.
 */
export const getDailyVideoPlays = async (filters = {}) => {
  const matchFilter = {
    eventType: VIDEO_PLAY,
    ...buildEventMatchFilter(filters),
  }
  return aggregateEvents(buildTimeSeriesPipeline('timestamp', matchFilter, filters.interval))
}

/**
 * Returns all time-series metrics for the requested interval.
 */
export const getTimeSeriesMetrics = async (filters = {}) => {
  const [
    dailyEvents,
    dailySessions,
    dailyUsers,
    dailyPageViews,
    dailyQuizAttempts,
    dailyVideoPlays,
  ] = await Promise.all([
    getDailyEvents(filters),
    getDailySessions(filters),
    getDailyUsers(filters),
    getDailyPageViews(filters),
    getDailyQuizAttempts(filters),
    getDailyVideoPlays(filters),
  ])

  return {
    interval: filters.interval || 'daily',
    dailyEvents,
    dailySessions,
    dailyUsers,
    dailyPageViews,
    dailyQuizAttempts,
    dailyVideoPlays,
  }
}
