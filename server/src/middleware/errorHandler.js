/**
 * Centralized error handler for the application.
 */
export const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message)

    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
    })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ObjectId',
    })
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate value',
    })
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  })
}
