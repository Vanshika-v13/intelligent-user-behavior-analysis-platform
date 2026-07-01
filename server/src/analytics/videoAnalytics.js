import {
  VIDEO_PLAY,
  VIDEO_PAUSE,
  VIDEO_COMPLETE,
} from '../constants/eventTypes.js'
import {
  aggregateEvents,
  buildMatchStage,
} from '../services/analyticsAggregationService.js'
import { buildEventMatchFilter } from './analyticsFilters.js'

const videoMatchBase = (filters = {}) => ({
  'metadata.videoId': { $exists: true, $nin: [null, ''] },
  ...buildEventMatchFilter(filters),
})

const countByVideo = async (eventType, filters = {}) => {
  const pipeline = [
    ...buildMatchStage({
      eventType,
      ...videoMatchBase(filters),
    }),
    {
      $group: {
        _id: '$metadata.videoId',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        videoId: '$_id',
        count: 1,
      },
    },
    { $sort: { count: -1 } },
  ]

  return aggregateEvents(pipeline)
}

const getVideoWatchMetrics = async (filters = {}) => {
  const pipeline = [
    ...buildMatchStage({
      eventType: { $in: [VIDEO_PLAY, VIDEO_COMPLETE] },
      ...videoMatchBase(filters),
    }),
    {
      $group: {
        _id: '$metadata.videoId',
        starts: {
          $sum: { $cond: [{ $eq: ['$eventType', VIDEO_PLAY] }, 1, 0] },
        },
        completes: {
          $sum: { $cond: [{ $eq: ['$eventType', VIDEO_COMPLETE] }, 1, 0] },
        },
        totalWatchTime: {
          $sum: {
            $cond: [
              { $eq: ['$eventType', VIDEO_COMPLETE] },
              { $ifNull: ['$metadata.watchTime', 0] },
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        videoId: '$_id',
        starts: 1,
        completes: 1,
        completionRate: {
          $cond: [
            { $eq: ['$starts', 0] },
            0,
            {
              $round: [
                { $multiply: [{ $divide: ['$completes', '$starts'] }, 100] },
                1,
              ],
            },
          ],
        },
        averageWatchTime: {
          $cond: [
            { $eq: ['$completes', 0] },
            0,
            { $round: [{ $divide: ['$totalWatchTime', '$completes'] }, 0] },
          ],
        },
        dropOffRate: {
          $cond: [
            { $eq: ['$starts', 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        { $subtract: ['$starts', '$completes'] },
                        '$starts',
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
    { $sort: { starts: -1 } },
  ]

  return aggregateEvents(pipeline)
}

/**
 * Returns video engagement analytics.
 */
export const getVideoMetrics = async (filters = {}) => {
  const [videoStarts, videoCompletes, perVideoMetrics, replayCounts] =
    await Promise.all([
      countByVideo(VIDEO_PLAY, filters),
      countByVideo(VIDEO_COMPLETE, filters),
      getVideoWatchMetrics(filters),
      countByVideo(VIDEO_PLAY, filters),
    ])

  const totalStarts = videoStarts.reduce((sum, { count }) => sum + count, 0)
  const totalCompletes = videoCompletes.reduce((sum, { count }) => sum + count, 0)

  const platformCompletionRate =
    totalStarts === 0 ? 0 : Math.round((totalCompletes / totalStarts) * 1000) / 10

  const platformDropOffRate =
    totalStarts === 0
      ? 0
      : Math.round(((totalStarts - totalCompletes) / totalStarts) * 1000) / 10

  const averageWatchTime =
    perVideoMetrics.length === 0
      ? 0
      : Math.round(
          perVideoMetrics.reduce((sum, v) => sum + v.averageWatchTime, 0) /
            perVideoMetrics.length
        )

  const mostReplayedVideos = replayCounts.filter(({ count }) => count > 1).slice(0, 10)

  const mostSkippedVideos = [...perVideoMetrics]
    .filter(({ starts, completes }) => starts > 0 && completes === 0)
    .sort((a, b) => b.starts - a.starts)
    .slice(0, 10)
    .map(({ videoId, starts, dropOffRate }) => ({
      videoId,
      starts,
      dropOffRate,
    }))

  return {
    videoStarts: totalStarts,
    videoCompletes: totalCompletes,
    completionRate: platformCompletionRate,
    averageWatchTime,
    dropOffRate: platformDropOffRate,
    byVideo: perVideoMetrics,
    mostReplayedVideos,
    mostSkippedVideos,
    videoPauses: await countByVideo(VIDEO_PAUSE, filters),
  }
}
