import mongoose from 'mongoose'
import Session from '../models/Session.js'
import Event from '../models/Event.js'
import User from '../models/User.js'
import {
  PAGE_VIEW,
  CLICK,
  SEARCH,
} from '../constants/eventTypes.js'

const EVENTS_COLLECTION = Event.collection.name

/**
 * Builds an optional $match stage from a filter object.
 */
export const buildMatchStage = (filter = {}) => {
  if (!filter || Object.keys(filter).length === 0) {
    return []
  }

  return [{ $match: filter }]
}

/**
 * Runs a custom aggregation pipeline on the Session collection.
 */
export const aggregateSessions = async (pipeline = []) => {
  return Session.aggregate(pipeline)
}

/**
 * Runs a custom aggregation pipeline on the Event collection.
 */
export const aggregateEvents = async (pipeline = []) => {
  return Event.aggregate(pipeline)
}

/**
 * Aggregates PAGE_VIEW events grouped by page, sorted by count descending.
 */
export const aggregatePageViews = async (matchFilter = {}) => {
  const pipeline = [
    ...buildMatchStage({
      eventType: PAGE_VIEW,
      page: { $exists: true, $nin: [null, ''] },
      ...matchFilter,
    }),
    {
      $group: {
        _id: '$page',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        page: '$_id',
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]

  return aggregateEvents(pipeline)
}

/**
 * Aggregates events grouped by event type.
 */
export const aggregateEventsByType = async (matchFilter = {}) => {
  const pipeline = [
    ...buildMatchStage(matchFilter),
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        eventType: '$_id',
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]

  return aggregateEvents(pipeline)
}

/**
 * Aggregates CLICK events grouped by metadata.buttonId.
 */
export const aggregateButtonClicks = async (matchFilter = {}) => {
  const pipeline = [
    ...buildMatchStage({
      eventType: CLICK,
      'metadata.buttonId': { $exists: true, $nin: [null, ''] },
      ...matchFilter,
    }),
    {
      $group: {
        _id: '$metadata.buttonId',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        buttonId: '$_id',
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]

  return aggregateEvents(pipeline)
}

/**
 * Aggregates SEARCH events grouped by metadata.searchQuery.
 */
export const aggregateSearchQueries = async (matchFilter = {}) => {
  const pipeline = [
    ...buildMatchStage({
      eventType: SEARCH,
      'metadata.searchQuery': { $exists: true, $nin: [null, ''] },
      ...matchFilter,
    }),
    {
      $group: {
        _id: '$metadata.searchQuery',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        searchQuery: '$_id',
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]

  return aggregateEvents(pipeline)
}

/**
 * Computes average session duration in seconds.
 */
export const aggregateAverageSessionDuration = async (matchFilter = {}) => {
  const pipeline = [
    ...buildMatchStage(matchFilter),
    {
      $group: {
        _id: null,
        averageDuration: { $avg: '$duration' },
      },
    },
    {
      $project: {
        _id: 0,
        averageDuration: { $round: ['$averageDuration', 0] },
      },
    },
  ]

  const [result] = await aggregateSessions(pipeline)
  return result?.averageDuration ?? 0
}

/**
 * Counts distinct users with at least one active session.
 */
export const aggregateActiveUsers = async (matchFilter = {}) => {
  const pipeline = [
    ...buildMatchStage({ isActive: true, ...matchFilter }),
    {
      $group: {
        _id: '$userId',
      },
    },
    {
      $count: 'activeUsers',
    },
  ]

  const [result] = await aggregateSessions(pipeline)
  return result?.activeUsers ?? 0
}

/**
 * Calculates bounce rate as a percentage of sessions with one event or duration under 30s.
 */
export const aggregateBounceRate = async (matchFilter = {}) => {
  const pipeline = [
    ...buildMatchStage(matchFilter),
    {
      $lookup: {
        from: EVENTS_COLLECTION,
        localField: '_id',
        foreignField: 'sessionId',
        as: 'events',
      },
    },
    {
      $project: {
        duration: 1,
        eventCount: { $size: '$events' },
        isBounced: {
          $or: [
            { $eq: [{ $size: '$events' }, 1] },
            { $lt: ['$duration', 30] },
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        bouncedSessions: {
          $sum: { $cond: ['$isBounced', 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        bounceRate: {
          $cond: [
            { $eq: ['$totalSessions', 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ['$bouncedSessions', '$totalSessions'] },
                    100,
                  ],
                },
                1,
              ],
            },
          ],
        },
      },
    },
  ]

  const [result] = await aggregateSessions(pipeline)
  return result?.bounceRate ?? 0
}

/**
 * Groups sessions into duration buckets for distribution analysis.
 */
export const aggregateSessionDistribution = async (matchFilter = {}) => {
  const pipeline = [
    ...buildMatchStage(matchFilter),
    {
      $facet: {
        '0-1 min': [
          { $match: { duration: { $gte: 0, $lt: 60 } } },
          { $count: 'count' },
        ],
        '1-5 min': [
          { $match: { duration: { $gte: 60, $lt: 300 } } },
          { $count: 'count' },
        ],
        '5-15 min': [
          { $match: { duration: { $gte: 300, $lt: 900 } } },
          { $count: 'count' },
        ],
        '15+ min': [
          { $match: { duration: { $gte: 900 } } },
          { $count: 'count' },
        ],
      },
    },
  ]

  const [result] = await aggregateSessions(pipeline)

  return {
    '0-1 min': result?.['0-1 min']?.[0]?.count ?? 0,
    '1-5 min': result?.['1-5 min']?.[0]?.count ?? 0,
    '5-15 min': result?.['5-15 min']?.[0]?.count ?? 0,
    '15+ min': result?.['15+ min']?.[0]?.count ?? 0,
  }
}

/**
 * Returns ordered page views for a single session journey.
 */
export const aggregateUserJourneys = async (sessionObjectId) => {
  const pipeline = [
    {
      $match: {
        sessionId: new mongoose.Types.ObjectId(sessionObjectId),
        eventType: PAGE_VIEW,
        page: { $exists: true, $nin: [null, ''] },
      },
    },
    { $sort: { timestamp: 1 } },
    {
      $project: {
        _id: 0,
        page: 1,
      },
    },
  ]

  return aggregateEvents(pipeline)
}

/**
 * Identifies pages where sessions end (last page view per session).
 */
export const aggregateDropOffs = async (matchFilter = {}) => {
  const pipeline = [
    ...buildMatchStage({
      eventType: PAGE_VIEW,
      page: { $exists: true, $nin: [null, ''] },
      ...matchFilter,
    }),
    { $sort: { sessionId: 1, timestamp: 1 } },
    {
      $group: {
        _id: '$sessionId',
        lastPage: { $last: '$page' },
      },
    },
    {
      $group: {
        _id: '$lastPage',
        dropOffs: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        page: '$_id',
        dropOffs: 1,
      },
    },
    { $sort: { dropOffs: -1 } },
  ]

  return aggregateEvents(pipeline)
}

/**
 * Computes consecutive page transitions across all sessions.
 */
export const aggregatePageTransitions = async (matchFilter = {}) => {
  const pipeline = [
    ...buildMatchStage({
      eventType: PAGE_VIEW,
      page: { $exists: true, $nin: [null, ''] },
      ...matchFilter,
    }),
    { $sort: { sessionId: 1, timestamp: 1 } },
    {
      $group: {
        _id: '$sessionId',
        pages: { $push: '$page' },
      },
    },
    {
      $project: {
        transitions: {
          $map: {
            input: { $range: [0, { $subtract: [{ $size: '$pages' }, 1] }] },
            as: 'index',
            in: {
              from: { $arrayElemAt: ['$pages', '$$index'] },
              to: { $arrayElemAt: ['$pages', { $add: ['$$index', 1] }] },
            },
          },
        },
      },
    },
    { $unwind: '$transitions' },
    {
      $group: {
        _id: {
          from: '$transitions.from',
          to: '$transitions.to',
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        from: '$_id.from',
        to: '$_id.to',
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]

  return aggregateEvents(pipeline)
}

/**
 * Aggregates per-user engagement metrics and platform maximums for score normalization.
 */
export const aggregateUserEngagementMetrics = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId)

  const [sessionResult] = await Session.aggregate([
    {
      $facet: {
        userSessions: [
          { $match: { userId: userObjectId } },
          {
            $group: {
              _id: null,
              totalDuration: { $sum: '$duration' },
            },
          },
        ],
        platformMaxDuration: [
          {
            $group: {
              _id: '$userId',
              totalDuration: { $sum: '$duration' },
            },
          },
          {
            $group: {
              _id: null,
              maxDuration: { $max: '$totalDuration' },
            },
          },
        ],
      },
    },
  ])

  const [eventResult] = await Event.aggregate([
    {
      $facet: {
        userEvents: [
          { $match: { userId: userObjectId } },
          {
            $group: {
              _id: null,
              totalEvents: { $sum: 1 },
              uniquePages: {
                $addToSet: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ['$eventType', PAGE_VIEW] },
                        { $ne: ['$page', null] },
                        { $ne: ['$page', ''] },
                      ],
                    },
                    '$page',
                    '$$REMOVE',
                  ],
                },
              },
              searchCount: {
                $sum: {
                  $cond: [{ $eq: ['$eventType', SEARCH] }, 1, 0],
                },
              },
            },
          },
          {
            $project: {
              totalEvents: 1,
              uniquePageCount: { $size: '$uniquePages' },
              searchCount: 1,
            },
          },
        ],
        platformMax: [
          {
            $group: {
              _id: '$userId',
              totalEvents: { $sum: 1 },
              uniquePages: {
                $addToSet: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ['$eventType', PAGE_VIEW] },
                        { $ne: ['$page', null] },
                        { $ne: ['$page', ''] },
                      ],
                    },
                    '$page',
                    '$$REMOVE',
                  ],
                },
              },
              searchCount: {
                $sum: {
                  $cond: [{ $eq: ['$eventType', SEARCH] }, 1, 0],
                },
              },
            },
          },
          {
            $project: {
              totalEvents: 1,
              uniquePageCount: { $size: '$uniquePages' },
              searchCount: 1,
            },
          },
          {
            $group: {
              _id: null,
              maxEvents: { $max: '$totalEvents' },
              maxPages: { $max: '$uniquePageCount' },
              maxSearches: { $max: '$searchCount' },
            },
          },
        ],
      },
    },
  ])

  const userDuration = sessionResult?.userSessions?.[0]?.totalDuration ?? 0
  const userEvents = eventResult?.userEvents?.[0]?.totalEvents ?? 0
  const userPages = eventResult?.userEvents?.[0]?.uniquePageCount ?? 0
  const userSearches = eventResult?.userEvents?.[0]?.searchCount ?? 0

  const maxDuration = sessionResult?.platformMaxDuration?.[0]?.maxDuration ?? 0
  const maxEvents = eventResult?.platformMax?.[0]?.maxEvents ?? 0
  const maxPages = eventResult?.platformMax?.[0]?.maxPages ?? 0
  const maxSearches = eventResult?.platformMax?.[0]?.maxSearches ?? 0

  return {
    userDuration,
    userEvents,
    userPages,
    userSearches,
    maxDuration,
    maxEvents,
    maxPages,
    maxSearches,
  }
}

/**
 * Counts total documents across core analytics collections.
 */
export const aggregateDashboardCounts = async () => {
  const [userCount, sessionCount, eventCount] = await Promise.all([
    User.countDocuments(),
    Session.countDocuments(),
    Event.countDocuments(),
  ])

  return {
    totalUsers: userCount,
    totalSessions: sessionCount,
    totalEvents: eventCount,
  }
}
