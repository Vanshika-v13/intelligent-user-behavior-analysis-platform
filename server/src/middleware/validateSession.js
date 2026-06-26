/**
 * Validates request body for POST /api/sessions/start.
 */
export const validateStartSession = (req, res, next) => {
  const { userId, device, browser, os } = req.body
  const missingFields = []

  if (!userId) missingFields.push('userId')
  if (!device) missingFields.push('device')
  if (!browser) missingFields.push('browser')
  if (!os) missingFields.push('os')

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.join(', ')}`,
    })
  }

  next()
}

/**
 * Validates request body for POST /api/sessions/end.
 */
export const validateEndSession = (req, res, next) => {
  const { sessionId } = req.body

  if (!sessionId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: sessionId',
    })
  }

  next()
}
