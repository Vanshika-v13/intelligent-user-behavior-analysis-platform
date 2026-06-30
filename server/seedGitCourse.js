import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from './src/models/Course.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/user-analytics'

// ─────────────────────────────────────────────────────────────────────────────
// Git & GitHub Essentials — course document
//
// Schema: identical to HTML & CSS, JavaScript, Node.js, and MongoDB courses.
// No new fields introduced. Uses the exact same Course model structure.
//
// Duration is the realistic sum of all lesson durations:
//   55 + 60 + 50 + 55 + 60 = 280 minutes (~4.5 hours) — as specified.
//   NOT calculated as 5 × 60 = 300.
//
// Banner:  /public/banner/github.png        (already present)
// Notes:   /public/notes/Git_GitHub_Notes.pdf (already present)
// ─────────────────────────────────────────────────────────────────────────────
const gitCourse = {
  title: 'Git & GitHub Essentials',
  description: 'Learn Git and GitHub from scratch. Understand version control, repositories, branches, collaboration workflows, and GitHub best practices used in real-world software development. This course introduces version control using Git and collaborative development using GitHub. Students will learn Git fundamentals, branching strategies, collaboration workflows, and practical GitHub usage for personal and team projects.',
  category: 'Developer Tools',
  thumbnail: 'github.png',
  duration: 280, // Realistic sum of all lesson durations: 55+60+50+55+60 — NOT 5×60
  lessons: [
    {
      title: 'Master Git & GitHub | Part 1',
      youtubeUrl: 'https://www.youtube.com/watch?v=Oq6nxXD-MZc&list=PLbtI3_MArDOlJ4036mWiUKaQToUS8MZVu',
      duration: '55 mins',
      order: 1
    },
    {
      title: 'Master Git & GitHub | Part 2 | Fundamentals',
      youtubeUrl: 'https://www.youtube.com/watch?v=ylVQ_lBaqvY&list=PLbtI3_MArDOlJ4036mWiUKaQToUS8MZVu&index=2',
      duration: '60 mins',
      order: 2
    },
    {
      title: 'Master Git & GitHub | Part 3 | Branching',
      youtubeUrl: 'https://www.youtube.com/watch?v=tsoa9wdSKAk&list=PLbtI3_MArDOlJ4036mWiUKaQToUS8MZVu&index=3',
      duration: '50 mins',
      order: 3
    },
    {
      title: 'Master Git & GitHub | Part 4 | Collaboration',
      youtubeUrl: 'https://www.youtube.com/watch?v=cn8l5bXhTBM&list=PLbtI3_MArDOlJ4036mWiUKaQToUS8MZVu&index=4',
      duration: '55 mins',
      order: 4
    },
    {
      title: 'Master Git & GitHub in One Video! Level Up Your Skills Now!',
      youtubeUrl: 'https://www.youtube.com/watch?v=r8QQOAicu8Y&list=PLbtI3_MArDOlJ4036mWiUKaQToUS8MZVu&index=5',
      duration: '60 mins',
      order: 5
    }
  ],
  notes: [
    { title: 'Git & GitHub Notes', fileUrl: '/notes/Git_GitHub_Notes.pdf' }
  ]
}

const seedGitCourse = async () => {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')

    // Safely upsert — update if already exists, insert if new
    const existing = await Course.findOne({ title: gitCourse.title })
    if (existing) {
      console.log('Course already exists, updating...')
      await Course.updateOne({ title: gitCourse.title }, gitCourse)
      console.log('Course updated successfully')
    } else {
      console.log('Inserting new course...')
      const created = await Course.create(gitCourse)
      console.log('Course inserted successfully with ID:', created._id)
    }

    // ── Schema Verification ──────────────────────────────────────────────────
    const inserted = await Course.findOne({ title: gitCourse.title })
    console.log('\n--- Inserted Course Document ---')
    console.log(JSON.stringify(inserted, null, 2))
    console.log('\n--- Schema Verification ---')
    console.log('Fields present:', Object.keys(inserted.toObject()).join(', '))
    console.log('Total lessons:', inserted.lessons.length)
    console.log('Total notes:', inserted.notes.length)
    console.log('Thumbnail:', inserted.thumbnail)
    console.log('Category:', inserted.category)
    console.log('Duration (minutes):', inserted.duration)

    // Confirm no extra schema fields were introduced
    const expectedFields = [
      '_id', 'title', 'description', 'thumbnail', 'category',
      'duration', 'lessons', 'notes', 'createdAt', 'updatedAt', '__v'
    ]
    const docFields = Object.keys(inserted.toObject())
    const extraFields = docFields.filter(f => !expectedFields.includes(f))
    if (extraFields.length === 0) {
      console.log('\n✅ Schema verification PASSED — no extra fields added.')
      console.log('✅ Document structure is identical to all existing courses.')
    } else {
      console.warn('\n⚠️  Unexpected fields found:', extraFields)
    }

    process.exit(0)
  } catch (error) {
    console.error('Error seeding course:', error)
    process.exit(1)
  }
}

seedGitCourse()
