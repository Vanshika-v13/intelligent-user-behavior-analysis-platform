import UserQuizAttempt from '../models/UserQuizAttempt.js'
import {
  QUIZ_START,
  QUIZ_SUBMIT,
} from '../constants/eventTypes.js'
import {
  aggregateEvents,
  buildMatchStage,
} from '../services/analyticsAggregationService.js'
import { buildEventMatchFilter } from './analyticsFilters.js'

const countEvents = async (eventType, filters = {}) => {
  const matchFilter = {
    eventType,
    ...buildEventMatchFilter(filters),
  }

  const pipeline = [
    ...buildMatchStage(matchFilter),
    { $count: 'total' },
  ]

  const [result] = await aggregateEvents(pipeline)
  return result?.total ?? 0
}

const getQuizScoreStats = async (filters = {}) => {
  const attemptMatch = {}

  if (filters.courseId) {
    attemptMatch.courseId = filters.courseId
  }

  if (filters.userId) {
    attemptMatch.userId = filters.userId
  }

  const [stats] = await UserQuizAttempt.aggregate([
    ...buildMatchStage(attemptMatch),
    {
      $group: {
        _id: null,
        averageScore: { $avg: '$score' },
        passCount: { $sum: { $cond: ['$isPassed', 1, 0] } },
        failCount: { $sum: { $cond: ['$isPassed', 0, 1] } },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        averageScore: { $round: ['$averageScore', 1] },
        passCount: 1,
        failCount: 1,
        total: 1,
        passRate: {
          $cond: [
            { $eq: ['$total', 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ['$passCount', '$total'] }, 100] }, 1] },
          ],
        },
        failRate: {
          $cond: [
            { $eq: ['$total', 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ['$failCount', '$total'] }, 100] }, 1] },
          ],
        },
      },
    },
  ])

  return (
    stats ?? {
      averageScore: 0,
      passCount: 0,
      failCount: 0,
      total: 0,
      passRate: 0,
      failRate: 0,
    }
  )
}

const getQuestionAccuracy = async (filters = {}) => {
  const attemptMatch = {}

  if (filters.courseId) {
    attemptMatch.courseId = filters.courseId
  }

  if (filters.userId) {
    attemptMatch.userId = filters.userId
  }

  return UserQuizAttempt.aggregate([
    ...buildMatchStage(attemptMatch),
    { $unwind: '$answers' },
    {
      $group: {
        _id: '$answers.questionId',
        questionText: { $first: '$answers.questionText' },
        totalAttempts: { $sum: 1 },
        correctAttempts: {
          $sum: { $cond: ['$answers.isCorrect', 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        questionId: { $toString: '$_id' },
        questionText: 1,
        totalAttempts: 1,
        accuracy: {
          $cond: [
            { $eq: ['$totalAttempts', 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ['$correctAttempts', '$totalAttempts'] },
                    100,
                  ],
                },
                1,
              ],
            },
          ],
        },
        incorrectRate: {
          $cond: [
            { $eq: ['$totalAttempts', 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        { $subtract: ['$totalAttempts', '$correctAttempts'] },
                        '$totalAttempts',
                      ],
                    },
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
    { $sort: { incorrectRate: -1 } },
  ])
}

const getQuizDifficultyRanking = async (filters = {}) => {
  const attemptMatch = {}

  if (filters.courseId) {
    attemptMatch.courseId = filters.courseId
  }

  return UserQuizAttempt.aggregate([
    ...buildMatchStage(attemptMatch),
    {
      $group: {
        _id: '$quizId',
        averageScore: { $avg: '$score' },
        attempts: { $sum: 1 },
        passRate: {
          $avg: { $cond: ['$isPassed', 100, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        quizId: { $toString: '$_id' },
        averageScore: { $round: ['$averageScore', 1] },
        attempts: 1,
        passRate: { $round: ['$passRate', 1] },
      },
    },
  ])
}

/**
 * Returns quiz performance analytics.
 */
export const getQuizMetrics = async (filters = {}) => {
  const [quizStarts, quizSubmissions, scoreStats, questionAccuracy, quizRankings] =
    await Promise.all([
      countEvents(QUIZ_START, filters),
      countEvents(QUIZ_SUBMIT, filters),
      getQuizScoreStats(filters),
      getQuestionAccuracy(filters),
      getQuizDifficultyRanking(filters),
    ])

  const sortedByScore = [...quizRankings].sort((a, b) => a.averageScore - b.averageScore)
  const hardestQuiz = sortedByScore[0] ?? null
  const easiestQuiz = sortedByScore[sortedByScore.length - 1] ?? null

  const mostIncorrectQuestions = [...questionAccuracy]
    .sort((a, b) => b.incorrectRate - a.incorrectRate)
    .slice(0, 10)

  return {
    quizStarts,
    quizSubmissions,
    passRate: scoreStats.passRate,
    failRate: scoreStats.failRate,
    averageScore: scoreStats.averageScore,
    questionAccuracy,
    mostIncorrectQuestions,
    hardestQuiz,
    easiestQuiz,
    byQuiz: quizRankings,
  }
}
