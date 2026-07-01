import mongoose from 'mongoose'
import User from '../models/User.js'
import Session from '../models/Session.js'
import { createError } from './appError.js'

/**
 * Validates that a user exists and returns the document.
 */
export const validateUserExists = async (userId) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw createError('User not found', 404)
  }

  const user = await User.findById(userId)

  if (!user) {
    throw createError('User not found', 404)
  }

  return user
}

/**
 * Validates that a session exists by MongoDB _id and returns the document.
 */
export const validateSessionExists = async (sessionId) => {
  if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
    throw createError('Session not found', 404)
  }

  const session = await Session.findById(sessionId)

  if (!session) {
    throw createError('Session not found', 404)
  }

  return session
}

/**
 * Resolves a session MongoDB _id from a string id, throwing if not found.
 */
export const resolveSessionObjectId = async (sessionId) => {
  const session = await validateSessionExists(sessionId)
  return session._id
}
