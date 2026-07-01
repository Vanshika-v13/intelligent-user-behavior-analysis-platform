import {
  PAGE_VIEW,
  COURSE_OPEN,
  LESSON_STARTED,
  VIDEO_PLAY,
  QUIZ_START,
  CERTIFICATE_GENERATED,
} from '../constants/eventTypes.js'
import {
  aggregateEvents,
  buildMatchStage,
} from '../services/analyticsAggregationService.js'
import { buildEventMatchFilter } from './analyticsFilters.js'

export const DEFAULT_FUNNEL_STEPS = [
  {
    name: 'Landing',
    eventType: PAGE_VIEW,
    match: { page: { $regex: '^/(home)?$', $options: 'i' } },
  },
  {
    name: 'Course',
    eventType: COURSE_OPEN,
  },
  {
    name: 'Lesson',
    eventType: LESSON_STARTED,
  },
  {
    name: 'Video',
    eventType: VIDEO_PLAY,
  },
  {
    name: 'Quiz',
    eventType: QUIZ_START,
  },
  {
    name: 'Certificate',
    eventType: CERTIFICATE_GENERATED,
  },
]

const countDistinctUsersForStep = async (step, filters = {}) => {
  const matchFilter = {
    eventType: step.eventType,
    ...(step.match || {}),
    ...buildEventMatchFilter(filters),
  }

  const pipeline = [
    ...buildMatchStage(matchFilter),
    {
      $group: {
        _id: '$userId',
      },
    },
    { $count: 'users' },
  ]

  const [result] = await aggregateEvents(pipeline)
  return result?.users ?? 0
}

const buildFunnelResults = (steps, userCounts) => {
  const funnelSteps = steps.map((step, index) => {
    const users = userCounts[index]
    const previousUsers = index === 0 ? users : userCounts[index - 1]
    const topUsers = userCounts[0] || 0

    const conversionRate =
      topUsers === 0 ? 0 : Math.round((users / topUsers) * 1000) / 10

    const dropOffRate =
      index === 0 || previousUsers === 0
        ? 0
        : Math.round(((previousUsers - users) / previousUsers) * 1000) / 10

    return {
      step: step.name,
      eventType: step.eventType,
      users,
      conversionRate,
      dropOffRate,
    }
  })

  const exitPoints = funnelSteps
    .slice(0, -1)
    .map((step, index) => ({
      fromStep: step.step,
      toStep: funnelSteps[index + 1].step,
      dropOffRate: funnelSteps[index + 1].dropOffRate,
      usersLost: step.users - funnelSteps[index + 1].users,
    }))
    .filter(({ usersLost }) => usersLost > 0)
    .sort((a, b) => b.usersLost - a.usersLost)

  return {
    steps: funnelSteps,
    exitPoints,
    overallConversionRate:
      funnelSteps.length === 0 || funnelSteps[0].users === 0
        ? 0
        : Math.round(
            (funnelSteps[funnelSteps.length - 1].users / funnelSteps[0].users) * 1000
          ) / 10,
  }
}

/**
 * Calculates conversion funnel metrics for the default or custom funnel steps.
 */
export const getFunnelMetrics = async (filters = {}, customSteps = null) => {
  const steps = customSteps || DEFAULT_FUNNEL_STEPS

  const userCounts = await Promise.all(
    steps.map((step) => countDistinctUsersForStep(step, filters))
  )

  return buildFunnelResults(steps, userCounts)
}
