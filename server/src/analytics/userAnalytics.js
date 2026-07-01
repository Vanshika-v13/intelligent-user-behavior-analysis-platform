import User from '../models/User.js'
import {
  aggregateEvents,
  aggregateSessions,
  buildMatchStage,
} from '../services/analyticsAggregationService.js'
import {
  buildEventMatchFilter,
  buildSessionMatchFilter,
  filterByEngagementLevel,
} from './analyticsFilters.js'
import { calculateEngagementFromMetrics } from './engagementAnalytics.js'

const getMostActiveUsers = async (filters = {}, limit = 10) => {
  const pipeline = [
    ...buildMatchStage(buildEventMatchFilter(filters)),
    {
      $group: {
        _id: '$userId',
        eventCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        userId: { $toString: '$_id' },
        eventCount: 1,
      },
    },
    { $sort: { eventCount: -1 } },
    { $limit: limit },
  ]

  return aggregateEvents(pipeline)
}

const getInactiveUsers = async (filters = {}) => {
  const eventMatch = buildEventMatchFilter(filters)

  const activeUserIds = await aggregateEvents([
    ...buildMatchStage(eventMatch),
    { $group: { _id: '$userId' } },
  ])

  const activeIds = activeUserIds.map(({ _id }) => _id)

  const inactiveQuery = activeIds.length > 0 ? { _id: { $nin: activeIds } } : {}

  const inactiveUsers = await User.find(inactiveQuery).select('_id name email').lean()

  return inactiveUsers.map(({ _id, name, email }) => ({
    userId: _id.toString(),
    name,
    email,
  }))
}

const getAverageSessionCount = async (filters = {}) => {
  const pipeline = [
    ...buildMatchStage(buildSessionMatchFilter(filters)),
    {
      $group: {
        _id: '$userId',
        sessionCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        averageSessionCount: { $avg: '$sessionCount' },
      },
    },
    {
      $project: {
        _id: 0,
        averageSessionCount: { $round: ['$averageSessionCount', 1] },
      },
    },
  ]

  const [result] = await aggregateSessions(pipeline)
  return result?.averageSessionCount ?? 0
}

const getAverageEventsPerUser = async (filters = {}) => {
  const pipeline = [
    ...buildMatchStage(buildEventMatchFilter(filters)),
    {
      $group: {
        _id: '$userId',
        eventCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        averageEvents: { $avg: '$eventCount' },
      },
    },
    {
      $project: {
        _id: 0,
        averageEvents: { $round: ['$averageEvents', 1] },
      },
    },
  ]

  const [result] = await aggregateEvents(pipeline)
  return result?.averageEvents ?? 0
}

const getReturningAndFirstTimeUsers = async (filters = {}) => {
  const sessionMatch = buildSessionMatchFilter(filters)

  const pipeline = [
    ...buildMatchStage(sessionMatch),
    {
      $group: {
        _id: '$userId',
        sessionCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        returningUsers: {
          $sum: { $cond: [{ $gt: ['$sessionCount', 1] }, 1, 0] },
        },
        firstTimeUsers: {
          $sum: { $cond: [{ $eq: ['$sessionCount', 1] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        returningUsers: 1,
        firstTimeUsers: 1,
      },
    },
  ]

  const [result] = await aggregateSessions(pipeline)

  return {
    returningUsers: result?.returningUsers ?? 0,
    firstTimeUsers: result?.firstTimeUsers ?? 0,
  }
}

const getAverageEngagement = async (filters = {}) => {
  let users = await User.find().select('_id').lean()

  if (filters.userId) {
    users = users.filter(({ _id }) => _id.toString() === filters.userId)
  }

  if (users.length === 0) {
    return 0
  }

  const scores = await Promise.all(
    users.map(async ({ _id }) => {
      const { engagementScore, level } = await calculateEngagementFromMetrics(_id.toString())
      return { engagementScore, level }
    })
  )

  const filtered = filterByEngagementLevel(scores, filters.engagementLevel)

  if (filtered.length === 0) {
    return 0
  }

  const total = filtered.reduce((sum, { engagementScore }) => sum + engagementScore, 0)
  return Math.round(total / filtered.length)
}

/**
 * Returns user behavior and engagement analytics.
 */
export const getUserMetrics = async (filters = {}) => {
  const [
    mostActiveUsers,
    inactiveUsers,
    averageSessionCount,
    averageEvents,
    averageEngagement,
    userTypes,
  ] = await Promise.all([
    getMostActiveUsers(filters),
    getInactiveUsers(filters),
    getAverageSessionCount(filters),
    getAverageEventsPerUser(filters),
    getAverageEngagement(filters),
    getReturningAndFirstTimeUsers(filters),
  ])

  return {
    mostActiveUsers,
    inactiveUsers,
    averageSessionCount,
    averageEvents,
    averageEngagement,
    returningUsers: userTypes.returningUsers,
    firstTimeUsers: userTypes.firstTimeUsers,
  }
}
