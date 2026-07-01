import mongoose from 'mongoose'
import Progress from '../models/Progress.js'
import {
  PAGE_VIEW,
  COURSE_OPEN,
  QUIZ_START,
  QUIZ_SUBMIT,
  CERTIFICATE_GENERATED,
  LESSON_STARTED,
  COURSE_COMPLETION_PERCENTAGE,
  TIME_SPENT_LEARNING,
} from '../constants/eventTypes.js'
import {
  aggregateEvents,
  buildMatchStage,
} from '../services/analyticsAggregationService.js'
import { buildEventMatchFilter } from './analyticsFilters.js'

const groupEventsByCourse = async (eventType, filters = {}, extraMatch = {}) => {
  const matchFilter = {
    eventType,
    'metadata.courseId': { $exists: true, $nin: [null, ''] },
    ...extraMatch,
    ...buildEventMatchFilter(filters),
  }

  const pipeline = [
    ...buildMatchStage(matchFilter),
    {
      $group: {
        _id: '$metadata.courseId',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        courseId: '$_id',
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]

  return aggregateEvents(pipeline)
}

const aggregateCourseMetricAverage = async (eventType, metadataField, filters = {}) => {
  const matchFilter = {
    eventType,
    [`metadata.${metadataField}`]: { $exists: true, $type: 'number' },
    'metadata.courseId': { $exists: true, $nin: [null, ''] },
    ...buildEventMatchFilter(filters),
  }

  const pipeline = [
    ...buildMatchStage(matchFilter),
    {
      $group: {
        _id: '$metadata.courseId',
        average: { $avg: `$metadata.${metadataField}` },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        courseId: '$_id',
        average: { $round: ['$average', 1] },
        count: 1,
      },
    },
    { $sort: { average: -1 } },
  ]

  return aggregateEvents(pipeline)
}

const getEnrollmentsByCourse = async (filters = {}) => {
  const matchFilter = {
    eventType: LESSON_STARTED,
    'metadata.courseId': { $exists: true, $nin: [null, ''] },
    ...buildEventMatchFilter(filters),
  }

  const pipeline = [
    ...buildMatchStage(matchFilter),
    {
      $group: {
        _id: {
          courseId: '$metadata.courseId',
          userId: '$userId',
        },
      },
    },
    {
      $group: {
        _id: '$_id.courseId',
        enrollments: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        courseId: '$_id',
        enrollments: 1,
      },
    },
    { $sort: { enrollments: -1 } },
  ]

  return aggregateEvents(pipeline)
}

const getCompletionRatesByCourse = async (filters = {}) => {
  const progressMatch = {}

  if (filters.courseId) {
    if (!mongoose.Types.ObjectId.isValid(filters.courseId)) {
      return []
    }
    progressMatch.course = new mongoose.Types.ObjectId(filters.courseId)
  }

  const progressData = await Progress.aggregate([
    ...buildMatchStage(progressMatch),
    {
      $group: {
        _id: '$course',
        totalUsers: { $sum: 1 },
        completedUsers: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $gte: ['$progressPercentage', 100] },
                  { $eq: ['$quizPassed', true] },
                  { $eq: ['$isLegacyCompleted', true] },
                ],
              },
              1,
              0,
            ],
          },
        },
        averageProgress: { $avg: '$progressPercentage' },
      },
    },
    {
      $project: {
        _id: 0,
        courseId: { $toString: '$_id' },
        totalUsers: 1,
        completedUsers: 1,
        completionRate: {
          $cond: [
            { $eq: ['$totalUsers', 0] },
            0,
            {
              $round: [
                { $multiply: [{ $divide: ['$completedUsers', '$totalUsers'] }, 100] },
                1,
              ],
            },
          ],
        },
        averageProgress: { $round: ['$averageProgress', 1] },
      },
    },
    { $sort: { completionRate: -1 } },
  ])

  return progressData
}

const getTrendingCourses = async (filters = {}) => {
  const recentFilters = { ...filters }
  if (!recentFilters.startDate) {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    recentFilters.startDate = thirtyDaysAgo.toISOString()
  }

  const [opens, views] = await Promise.all([
    groupEventsByCourse(COURSE_OPEN, recentFilters),
    groupEventsByCourse(PAGE_VIEW, recentFilters, {
      page: { $regex: '/courses', $options: 'i' },
    }),
  ])

  const scoreMap = new Map()

  for (const { courseId, count } of opens) {
    scoreMap.set(courseId, (scoreMap.get(courseId) || 0) + count * 2)
  }

  for (const { courseId, count } of views) {
    scoreMap.set(courseId, (scoreMap.get(courseId) || 0) + count)
  }

  return [...scoreMap.entries()]
    .map(([courseId, trendScore]) => ({ courseId, trendScore }))
    .sort((a, b) => b.trendScore - a.trendScore)
}

/**
 * Returns per-course and platform-wide course analytics.
 */
export const getCourseMetrics = async (filters = {}) => {
  const [
    views,
    opens,
    enrollments,
    quizAttempts,
    completionRates,
    progressAverages,
    certificatesGenerated,
    averageTimeSpent,
    averageQuizScores,
    trendingCourses,
  ] = await Promise.all([
    groupEventsByCourse(PAGE_VIEW, filters, {
      page: { $regex: '/courses', $options: 'i' },
    }),
    groupEventsByCourse(COURSE_OPEN, filters),
    getEnrollmentsByCourse(filters),
    groupEventsByCourse(QUIZ_START, filters),
    getCompletionRatesByCourse(filters),
    aggregateCourseMetricAverage(COURSE_COMPLETION_PERCENTAGE, 'percentage', filters),
    groupEventsByCourse(CERTIFICATE_GENERATED, filters),
    aggregateCourseMetricAverage(TIME_SPENT_LEARNING, 'duration', filters),
    aggregateCourseMetricAverage(QUIZ_SUBMIT, 'score', filters),
    getTrendingCourses(filters),
  ])

  const topPerformingCourses = [...completionRates]
    .sort((a, b) => b.completionRate - a.completionRate || b.averageProgress - a.averageProgress)
    .slice(0, 10)

  return {
    views,
    opens,
    enrollments,
    quizAttempts,
    completionRates,
    averageProgress: progressAverages,
    certificatesGenerated,
    averageTimeSpent,
    averageQuizScores,
    topPerformingCourses,
    trendingCourses,
  }
}
