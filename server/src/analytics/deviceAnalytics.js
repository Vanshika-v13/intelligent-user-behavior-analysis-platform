import {
  aggregateEvents,
  aggregateSessions,
  buildMatchStage,
} from '../services/analyticsAggregationService.js'
import {
  buildEventMatchFilter,
  buildSessionMatchFilter,
  classifyDeviceCategory,
} from './analyticsFilters.js'

const groupSessionField = async (field, filters = {}) => {
  const matchFilter = buildSessionMatchFilter(filters)

  const pipeline = [
    ...buildMatchStage(matchFilter),
    {
      $group: {
        _id: { $ifNull: [`$${field}`, 'Unknown'] },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]

  return aggregateSessions(pipeline)
}

const groupEventMetadataField = async (metadataField, filters = {}) => {
  const matchFilter = {
    [`metadata.${metadataField}`]: { $exists: true, $nin: [null, ''] },
    ...buildEventMatchFilter(filters),
  }

  const pipeline = [
    ...buildMatchStage(matchFilter),
    {
      $group: {
        _id: `$metadata.${metadataField}`,
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]

  return aggregateEvents(pipeline)
}

/**
 * Aggregates sessions by device category (Desktop, Mobile, Tablet).
 */
export const getDeviceCategoryBreakdown = async (filters = {}) => {
  const sessions = await groupSessionField('device', filters)

  const categoryMap = sessions.reduce((acc, { name, count }) => {
    const category = classifyDeviceCategory(name)
    acc[category] = (acc[category] || 0) + count
    return acc
  }, {})

  return Object.entries(categoryMap).map(([category, count]) => ({
    category,
    count,
  }))
}

/**
 * Returns comprehensive device analytics metrics.
 */
export const getDeviceMetrics = async (filters = {}) => {
  const [
    byDeviceCategory,
    byOperatingSystem,
    byBrowser,
    byScreenResolution,
    byLanguage,
    byTimezone,
  ] = await Promise.all([
    getDeviceCategoryBreakdown(filters),
    groupSessionField('os', filters),
    groupSessionField('browser', filters),
    groupEventMetadataField('screenResolution', filters),
    groupEventMetadataField('language', filters),
    groupEventMetadataField('timezone', filters),
  ])

  return {
    byDeviceCategory,
    byOperatingSystem,
    byBrowser,
    byScreenResolution,
    byLanguage,
    byTimezone,
  }
}
