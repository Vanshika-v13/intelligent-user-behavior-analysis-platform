import { getDeviceMetrics } from '../analytics/deviceAnalytics.js'
import { getCourseMetrics } from '../analytics/courseAnalytics.js'
import { getVideoMetrics } from '../analytics/videoAnalytics.js'
import { getQuizMetrics } from '../analytics/quizAnalytics.js'
import { getUserMetrics } from '../analytics/userAnalytics.js'
import { getFunnelMetrics } from '../analytics/funnelAnalytics.js'
import { getTimeSeriesMetrics } from '../analytics/timeSeriesAnalytics.js'

export const getDeviceAnalytics = async (filters = {}) => getDeviceMetrics(filters)

export const getCourseAnalytics = async (filters = {}) => getCourseMetrics(filters)

export const getVideoAnalytics = async (filters = {}) => getVideoMetrics(filters)

export const getQuizAnalytics = async (filters = {}) => getQuizMetrics(filters)

export const getUserAnalytics = async (filters = {}) => getUserMetrics(filters)

export const getFunnelAnalytics = async (filters = {}) => getFunnelMetrics(filters)

export const getTimeSeriesAnalytics = async (filters = {}) =>
  getTimeSeriesMetrics(filters)
