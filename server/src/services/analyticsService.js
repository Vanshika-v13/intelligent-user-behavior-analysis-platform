import User from '../models/User.js'
import { getDashboardOverview } from '../analytics/dashboardAnalytics.js'
import {
  calculateAverageSessionDuration,
  calculateActiveUsers,
  calculateBounceRate,
  calculateSessionDistribution,
} from '../analytics/sessionAnalytics.js'
import {
  calculateMostVisitedPages,
  calculateMostClickedButtons,
  calculateMostSearchedCourses,
  calculateEventDistribution,
} from '../analytics/eventAnalytics.js'
import {
  calculateUserJourney,
  calculateDropOffPages,
  calculatePageTransitions,
} from '../analytics/journeyAnalytics.js'
import {
  calculateEngagementFromMetrics,
} from '../analytics/engagementAnalytics.js'

const toDistributionArray = (distribution) =>
  Object.entries(distribution).map(([bucket, count]) => ({
    bucket,
    count,
  }))

const toEventDistributionArray = (distribution) =>
  Object.entries(distribution).map(([eventType, count]) => ({
    eventType,
    count,
  }))

/**
 * Returns high-level dashboard overview metrics.
 */
export const getOverviewAnalytics = async (filters = {}) => {
  return getDashboardOverview(filters)
}

/**
 * Returns combined session analytics for the dashboard.
 */
export const getSessionAnalytics = async (filters = {}) => {
  const [
    { averageDuration },
    { bounceRate },
    { activeUsers },
    sessionDistribution,
  ] = await Promise.all([
    calculateAverageSessionDuration(filters),
    calculateBounceRate(filters),
    calculateActiveUsers(filters),
    calculateSessionDistribution(filters),
  ])

  return {
    averageSessionDuration: averageDuration,
    bounceRate,
    activeUsers,
    sessionDistribution: toDistributionArray(sessionDistribution),
  }
}

/**
 * Returns combined event analytics for the dashboard.
 */
export const getEventAnalytics = async (filters = {}) => {
  const [
    eventDistribution,
    mostVisitedPages,
    mostClickedButtons,
    mostSearchedCourses,
  ] = await Promise.all([
    calculateEventDistribution(filters),
    calculateMostVisitedPages(filters),
    calculateMostClickedButtons(filters),
    calculateMostSearchedCourses(filters),
  ])

  return {
    eventDistribution: toEventDistributionArray(eventDistribution),
    mostVisitedPages,
    mostClickedButtons,
    mostSearchedCourses,
  }
}

/**
 * Returns journey analytics for a session or platform-wide aggregates.
 */
export const getJourneyAnalytics = async (sessionId, filters = {}) => {
  const [dropOffPages, pageTransitions] = await Promise.all([
    calculateDropOffPages(filters),
    calculatePageTransitions(filters),
  ])

  if (sessionId) {
    const journey = await calculateUserJourney(sessionId)

    return {
      userJourneys: [
        {
          sessionId,
          journey,
        },
      ],
      dropOffPages,
      pageTransitions,
    }
  }

  return {
    userJourneys: [],
    dropOffPages,
    pageTransitions,
  }
}

/**
 * Returns engagement scores and levels for one user or all users.
 */
export const getEngagementAnalytics = async (userId) => {
  if (userId) {
    const { engagementScore, level } = await calculateEngagementFromMetrics(userId)

    return {
      engagementScores: [{ userId, engagementScore }],
      engagementLevels: [{ userId, level }],
    }
  }

  const users = await User.find().select('_id').lean()

  const engagementData = await Promise.all(
    users.map(async ({ _id }) => {
      const id = _id.toString()
      const { engagementScore, level } = await calculateEngagementFromMetrics(id)

      return { userId: id, engagementScore, level }
    })
  )

  return {
    engagementScores: engagementData.map(({ userId: id, engagementScore }) => ({
      userId: id,
      engagementScore,
    })),
    engagementLevels: engagementData.map(({ userId: id, level }) => ({
      userId: id,
      level,
    })),
  }
}
