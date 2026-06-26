import dotenv from 'dotenv'
import mongoose from 'mongoose'
import seedUsers from './seedUsers.js'
import seedCourses from './seedCourses.js'

dotenv.config()

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...')
    await mongoose.connect(process.env.MONGODB_URI)

    await seedUsers()
    console.log('Users seeded successfully.')

    await seedCourses()
    console.log('Courses seeded successfully.')

    console.log('Database seeding completed.')
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    process.exit(0)
  }
}

seedDatabase()
