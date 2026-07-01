/**
 * Wraps async route handlers and forwards errors to Express error middleware.
 */
export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)
