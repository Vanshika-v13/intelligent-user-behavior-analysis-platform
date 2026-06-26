import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/User.js'
import Session from '../models/Session.js'
import Event from '../models/Event.js'
import {
  PAGE_VIEW,
  CLICK,
  SEARCH,
  SESSION_START,
  SESSION_END,
} from '../constants/eventTypes.js'
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
  calculateEngagementScore,
  calculateUserEngagementLevel,
} from '../analytics/engagementAnalytics.js'
import { getDashboardOverview } from '../analytics/dashboardAnalytics.js'
import {
  aggregatePageViews,
  aggregateEventsByType,
  aggregateSessions,
  aggregateUserJourneys,
  aggregateDropOffs,
} from '../services/analyticsAggregationService.js'

dotenv.config()

const logSection = (title, data) => {
  console.log(`\n=== ${title} ===`)
  console.log(JSON.stringify(data, null, 2))
}

const seedAnalyticsData = async () => {
  await Promise.all([
    Event.deleteMany({}),
    Session.deleteMany({}),
  ])

  const users = await User.find().limit(3)

  if (users.length === 0) {
    throw new Error('No users found. Run npm run seed first.')
  }

  const [userA, userB, userC] = users

  const sessionA = await Session.create({
    sessionId: uuidv4(),
    userId: userA._id,
    startTime: new Date(Date.now() - 10 * 60 * 1000),
    endTime: new Date(Date.now() - 5 * 60 * 1000),
    duration: 300,
    device: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
    isActive: false,
  })

  const sessionB = await Session.create({
    sessionId: uuidv4(),
    userId: userB._id,
    startTime: new Date(Date.now() - 2 * 60 * 1000),
    endTime: new Date(Date.now() - 90 * 1000),
    duration: 30,
    device: 'mobile',
    browser: 'Safari',
    os: 'iOS',
    isActive: false,
  })

  const sessionC = await Session.create({
    sessionId: uuidv4(),
    userId: userC._id,
    startTime: new Date(),
    duration: 15,
    device: 'tablet',
    browser: 'Firefox',
    os: 'Android',
    isActive: true,
  })

  const sessionD = await Session.create({
    sessionId: uuidv4(),
    userId: userA._id,
    startTime: new Date(Date.now() - 20 * 60 * 1000),
    endTime: new Date(Date.now() - 18 * 60 * 1000),
    duration: 120,
    device: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
    isActive: false,
  })

  const createEvents = async (session, userId, events) => {
    const docs = events.map((event, index) => ({
      sessionId: session._id,
      userId,
      timestamp: new Date(Date.now() - (events.length - index) * 1000),
      ...event,
    }))

    await Event.insertMany(docs)
  }

  await createEvents(sessionA, userA._id, [
    { eventType: SESSION_START, page: '/home' },
    { eventType: PAGE_VIEW, page: '/home' },
    { eventType: PAGE_VIEW, page: '/courses' },
    { eventType: CLICK, page: '/courses', metadata: { buttonId: 'btn-1' } },
    { eventType: SEARCH, page: '/courses', metadata: { searchQuery: 'React' } },
    { eventType: PAGE_VIEW, page: '/checkout' },
    { eventType: SESSION_END, page: '/checkout' },
  ])

  await createEvents(sessionB, userB._id, [
    { eventType: SESSION_START, page: '/home' },
    { eventType: PAGE_VIEW, page: '/home' },
    { eventType: SESSION_END, page: '/home' },
  ])

  await createEvents(sessionC, userC._id, [
    { eventType: SESSION_START, page: '/home' },
    { eventType: PAGE_VIEW, page: '/home' },
  ])

  await createEvents(sessionD, userA._id, [
    { eventType: SESSION_START, page: '/home' },
    { eventType: PAGE_VIEW, page: '/home' },
    { eventType: PAGE_VIEW, page: '/courses' },
    { eventType: CLICK, page: '/courses', metadata: { buttonId: 'btn-2' } },
    { eventType: SEARCH, page: '/courses', metadata: { searchQuery: 'Node' } },
    { eventType: SESSION_END, page: '/courses' },
  ])

  return { sessionA, userA }
}

const runAnalyticsTests = async () => {
  console.log('Connecting to database...')
  await mongoose.connect(process.env.MONGODB_URI)

  const { sessionA, userA } = await seedAnalyticsData()
  console.log('Analytics test data seeded.')

  logSection('Average Session Duration', await calculateAverageSessionDuration())
  logSection('Active Users', await calculateActiveUsers())
  logSection('Bounce Rate', await calculateBounceRate())
  logSection('Session Distribution', await calculateSessionDistribution())
  logSection('Most Visited Pages', await calculateMostVisitedPages())
  logSection('Most Clicked Buttons', await calculateMostClickedButtons())
  logSection('Most Searched Courses', await calculateMostSearchedCourses())
  logSection('Event Distribution', await calculateEventDistribution())
  logSection(
    'User Journey',
    await calculateUserJourney(sessionA._id.toString())
  )
  logSection('Drop-off Pages', await calculateDropOffPages())
  logSection('Page Transitions', await calculatePageTransitions())
  logSection('Engagement Score', await calculateEngagementScore(userA._id.toString()))
  logSection(
    'Engagement Level',
    await calculateUserEngagementLevel(userA._id.toString())
  )
  logSection('Dashboard Overview', await getDashboardOverview())

  logSection('Aggregation: Page Views', await aggregatePageViews())
  logSection('Aggregation: Events By Type', await aggregateEventsByType())
  logSection(
    'Aggregation: Sessions Count',
    await aggregateSessions([{ $count: 'totalSessions' }])
  )
  logSection(
    'Aggregation: User Journey',
    await aggregateUserJourneys(sessionA._id)
  )
  logSection('Aggregation: Drop-offs', await aggregateDropOffs())

  console.log('\nAll Phase 7 analytics checks completed successfully.')
}

runAnalyticsTests()
  .catch((error) => {
    console.error(`Analytics test failed: ${error.message}`)
    process.exit(1)
  })
  .finally(async () => {
    await mongoose.connection.close()
    process.exit(0)
  })
