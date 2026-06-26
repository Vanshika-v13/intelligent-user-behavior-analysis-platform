/**
 * Logs request metadata after the response is sent.
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now()
  const ip = req.ip || req.socket?.remoteAddress || 'unknown'

  res.on('finish', () => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19)
    const duration = Date.now() - start

    console.log(
      `${timestamp}\n${req.method} ${req.originalUrl}\n${res.statusCode}\n${duration}ms\n${ip}`
    )
  })

  next()
}
