import User from '../models/User.js'

const users = [
  { name: 'Aarav Sharma', email: 'aarav@example.com' },
  { name: 'Priya Verma', email: 'priya@example.com' },
  { name: 'Rohan Mehta', email: 'rohan@example.com' },
  { name: 'Ananya Patel', email: 'ananya@example.com' },
  { name: 'Vikram Singh', email: 'vikram@example.com' },
]

/**
 * Seeds users using upsert by email to prevent duplicate insertion.
 */
const seedUsers = async () => {
  const seededUsers = []

  for (const user of users) {
    const savedUser = await User.findOneAndUpdate(
      { email: user.email },
      user,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    )
    seededUsers.push(savedUser)
  }

  return seededUsers
}

export default seedUsers
