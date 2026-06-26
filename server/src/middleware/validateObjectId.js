import mongoose from 'mongoose'

/**
 * Validates that a route param is a valid MongoDB ObjectId.
 */
export const validateObjectId = (paramName) => (req, res, next) => {
  const id = req.params[paramName]

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid id',
    })
  }

  next()
}
