import Event from '../models/Event.js'
import Session from '../models/Session.js'
import User from '../models/User.js'
import AnalyticsDailyRollup from './models/AnalyticsDailyRollup.js'
import UserEngagementSnapshot from '../models/UserEngagementSnapshot.js'
import {
  PAGE_VIEW,
  QUIZ_START,
  QUIZ_SUBMIT,
  VIDEO_PLAY,
  COURSE_OPEN,
  CERTIFICATE_GENERATED,
  SEARCH,
} from '../constants/eventTypes.js'
import { calculateEngagementFromMetrics } from '../analytics/engagementAnalytics.js'
import { metricsCollector } from '../metrics/metricsCollector.js'
import { trackAggregation } from '../monitoring/aggregationTracker.js'

const startOfDay = (date) => {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  return value
}

const endOfDay = (date) => {
  const value = new Date(date)
  value.setHours(23, 59, 59, 999)
  return value
}

const toDateKey = (date) => startOfDay(date).toISOString().slice(0, 10)

const periodBounds = (period, referenceDate = new Date()) => {
  const start = new Date(referenceDate)

  if (period === 'weekly') {
    const day = start.getDay()
    const diff = day === 0 ? -6 : 1 - day
    start.setDate(start.getDate() + diff)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    end.setHours(23, 59, 59, 999)

    return { periodStart: start, periodEnd: end }
  }

  if (period === 'monthly') {
    start.setDate(1)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999)
    return { periodStart: start, periodEnd: end }
  }

  return {
    periodStart: startOfDay(referenceDate),
    periodEnd: endOfDay(referenceDate),
  }
}

export const computeDailyRollup = async (targetDate = new Date()) => {
  return trackAggregation('daily-rollup', async () => {
    const dayStart = startOfDay(targetDate)
    const dayEnd = endOfDay(targetDate)
    const dateKey = toDateKey(targetDate)

    const matchStage = {
      timestamp: {
        $gte: dayStart,
        $lte: dayEnd,
      },
    }

    const [
      eventStats,
      sessionCount,
      engagedUsers,
    ] = await Promise.all([
      Event.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            dailyEvents: { $sum: 1 },
            dailyUsers: { $addToSet: '$userId' },
            dailyPageViews: {
              $sum: {
                $cond: [{ $eq: ['$eventType', PAGE_VIEW] }, 1, 0],
              },
            },
            dailyQuizAttempts: {
              $sum: {
                $cond: [
                  { $in: ['$eventType', [QUIZ_START, QUIZ_SUBMIT]] },
                  1,
                  0,
                ],
              },
            },
            dailyVideoPlays: {
              $sum: {
                $cond: [{ $eq: ['$eventType', VIDEO_PLAY] }, 1, 0],
              },
            },
            dailyCourseOpens: {
              $sum: {
                $cond: [{ $eq: ['$eventType', COURSE_OPEN] }, 1, 0],
              },
            },
            dailyCertificates: {
              $sum: {
                $cond: [{ $eq: ['$eventType', CERTIFICATE_GENERATED] }, 1, 0],
              },
            },
            dailySearches: {
              $sum: {
                $cond: [{ $eq: ['$eventType', SEARCH] }, 1, 0],
              },
            },
          },
        },
      ]),
      Session.countDocuments({
        startTime: {
          $gte: dayStart,
          $lte: dayEnd,
        },
      }),
      User.countDocuments(),
    ])

    const stats = eventStats[0] || {}
    const dailyUsers = stats.dailyUsers ? stats.dailyUsers.length : 0

    let dailyEngagement = 0

    if (dailyUsers > 0) {
      const sampleUsers = await User.find().select('_id').limit(25).lean()
      const scores = await Promise.all(
        sampleUsers.map(async ({ _id }) => {
          const { engagementScore } = await calculateEngagementFromMetrics(_id.toString())
          return engagementScore
        })
      )

      dailyEngagement =
        scores.length > 0
          ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
          : 0
    } else {
      dailyEngagement = engagedUsers > 0 ? 0 : 0
    }

    const rollup = await AnalyticsDailyRollup.findOneAndUpdate(
      { dateKey },
      {
        date: dayStart,
        dateKey,
        dailySessions: sessionCount,
        dailyUsers,
        dailyEvents: stats.dailyEvents || 0,
        dailyPageViews: stats.dailyPageViews || 0,
        dailyQuizAttempts: stats.dailyQuizAttempts || 0,
        dailyVideoPlays: stats.dailyVideoPlays || 0,
        dailyCourseOpens: stats.dailyCourseOpens || 0,
        dailyCertificates: stats.dailyCertificates || 0,
        dailySearches: stats.dailySearches || 0,
        dailyEngagement,
        computedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    )

    metricsCollector.setRollupFreshness(rollup.computedAt)
    return rollup
  })
}

export const computeEngagementSnapshots = async (
  period = 'daily',
  referenceDate = new Date()
) => {
  return trackAggregation(`engagement-snapshot-${period}`, async () => {
    const { periodStart, periodEnd } = periodBounds(period, referenceDate)
    const users = await User.find().select('_id').lean()
    const snapshots = []

    for (const { _id } of users) {
      const userId = _id
      const [engagement, eventCount, sessionCount] = await Promise.all([
        calculateEngagementFromMetrics(userId.toString()),
        Event.countDocuments({
          userId,
          timestamp: { $gte: periodStart, $lte: periodEnd },
        }),
        Session.countDocuments({
          userId,
          startTime: { $gte: periodStart, $lte: periodEnd },
        }),
      ])

      const snapshot = await UserEngagementSnapshot.findOneAndUpdate(
        {
          userId,
          period,
          periodStart,
        },
        {
          periodEnd,
          engagementScore: engagement.engagementScore,
          level: engagement.level,
          eventCount,
          sessionCount,
          capturedAt: new Date(),
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      )

      snapshots.push(snapshot)
    }

    return snapshots
  })
}

export const getLatestRollup = async () => AnalyticsDailyRollup.findOne().sort({ date: -1 }).lean()

export default {
  computeDailyRollup,
  computeEngagementSnapshots,
  getLatestRollup,
}
