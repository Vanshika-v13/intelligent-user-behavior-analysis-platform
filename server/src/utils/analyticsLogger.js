const PREFIX = '[Analytics]'

export const analyticsLogger = {
  info: (message, meta = {}) => {
    console.info(PREFIX, message, meta)
  },
  warn: (message, meta = {}) => {
    console.warn(PREFIX, message, meta)
  },
  error: (message, error, meta = {}) => {
    console.error(PREFIX, message, {
      ...meta,
      error: error?.message,
    })
  },
}
