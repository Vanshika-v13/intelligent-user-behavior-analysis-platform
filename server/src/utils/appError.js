/**
 * Creates an operational error with an HTTP status code for the centralized error handler.
 */
export const createError = (message, statusCode = 500) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}
