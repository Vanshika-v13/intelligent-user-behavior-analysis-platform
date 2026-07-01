import { v4 as uuidv4 } from 'uuid'
import Session from '../models/Session.js'
import { validateUserExists } from '../utils/analyticsValidators.js'
import { createError } from '../utils/appError.js'

/**
 * Validates user existence and creates a new active session.
 */
export const createSession = async ({ userId, device, browser, os }) => {
  await validateUserExists(userId)

  const session = await Session.create({
    sessionId: uuidv4(),
    userId,
    startTime: new Date(),
    duration: 0,
    device,
    browser,
    os,
    isActive: true,
  })

  return session
}

/**
 * Ends an active session and stores duration in seconds.
 */
export const endSession = async (sessionId) => {
  if (!sessionId) {
    throw createError('Session not found', 404)
  }

  const session = await Session.findOne({ sessionId })

  if (!session) {
    throw createError('Session not found', 404)
  }

  if (!session.isActive) {
    throw createError('Session already ended', 400)
  }

  const endTime = new Date()
  const duration = Math.floor((endTime - session.startTime) / 1000)

  session.endTime = endTime
  session.isActive = false
  session.duration = duration

  await session.save()

  return session
}

/**
 * Fetches a session by MongoDB _id with populated user details.
 */
export const getSession = async (id) => {
  const session = await Session.findById(id).populate('userId', 'name email')

  if (!session) {
    throw createError('Session not found', 404)
  }

  return session
}
