import dotenv from 'dotenv'

dotenv.config()

export default async () => {
  const baseUri =
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/intelligent-user-behavior-platform'

  process.env.MONGODB_URI = baseUri.replace(
    /\/[^/?]+(\?.*)?$/,
    '/iubp-test$1'
  )
  process.env.NODE_ENV = 'test'
}
