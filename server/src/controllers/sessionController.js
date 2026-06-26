import {
  createSession,
  endSession,
  getSession,
} from '../services/sessionService.js'

export const startSession = async (req, res, next) => {
  try {
    const { userId, device, browser, os } = req.body
    const session = await createSession({ userId, device, browser, os })

    res.status(201).json({
      success: true,
      message: 'Session started successfully',
      session,
    })
  } catch (error) {
    next(error)
  }
}

export const endSessionHandler = async (req, res, next) => {
  try {
    const { sessionId } = req.body
    const session = await endSession(sessionId)

    res.status(200).json({
      success: true,
      message: 'Session ended successfully',
      session,
    })
  } catch (error) {
    next(error)
  }
}

export const getSessionById = async (req, res, next) => {
  try {
    const session = await getSession(req.params.id)

    res.status(200).json({
      success: true,
      session,
    })
  } catch (error) {
    next(error)
  }
}
