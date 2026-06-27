import mongoose from 'mongoose'

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
})

beforeEach(async () => {
  const { collections } = mongoose.connection

  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.connection.close()
})
