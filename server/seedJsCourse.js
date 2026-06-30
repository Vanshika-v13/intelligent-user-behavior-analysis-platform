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
// JavaScript Fundamentals course document
// Schema: identical to HTML & CSS and Node.js courses — no extra fields added.
// Duration per lesson is manually configured (YouTube videos ~55–65 mins each).
// Total course duration = sum of all lesson durations = 600 minutes (~10 hours).
// ─────────────────────────────────────────────────────────────────────────────
const jsCourse = {
  title: 'JavaScript Fundamentals',
  description: 'Learn JavaScript from the basics to advanced concepts including variables, arrays, DOM manipulation, asynchronous programming, classes, and APIs. This course provides a complete introduction to JavaScript. Students will learn programming fundamentals, control flow, arrays, functions, DOM manipulation, events, object-oriented programming, asynchronous JavaScript, and working with APIs.',
  category: 'Programming',
  thumbnail: 'javascript.jpg',
  duration: 600, // Sum of all lesson durations: 55+58+62+60+64+65+58+57+62+59 = 600 minutes
  lessons: [
    {
      title: 'Introduction, Variables and Data Types',
      youtubeUrl: 'https://www.youtube.com/watch?v=ajdRvxDWH4w&list=PLGjplNEQ1it_oTvuLRNqXfz_v_0pq6unW&index=1',
      duration: '55 mins',
      order: 1
    },
    {
      title: 'Operators and Conditional Statements',
      youtubeUrl: 'https://www.youtube.com/watch?v=Zg4-uSjxosE&list=PLGjplNEQ1it_oTvuLRNqXfz_v_0pq6unW&index=2',
      duration: '58 mins',
      order: 2
    },
    {
      title: 'Loops and Strings',
      youtubeUrl: 'https://www.youtube.com/watch?v=UmRtFFSDSFo&list=PLGjplNEQ1it_oTvuLRNqXfz_v_0pq6unW&index=3',
      duration: '62 mins',
      order: 3
    },
    {
      title: 'Arrays',
      youtubeUrl: 'https://www.youtube.com/watch?v=gFWhbjzowrM&list=PLGjplNEQ1it_oTvuLRNqXfz_v_0pq6unW&index=4',
      duration: '60 mins',
      order: 4
    },
    {
      title: 'Functions and Methods',
      youtubeUrl: 'https://www.youtube.com/watch?v=P0XMXqDGttU&list=PLGjplNEQ1it_oTvuLRNqXfz_v_0pq6unW&index=5',
      duration: '64 mins',
      order: 5
    },
    {
      title: 'DOM - Document Object Model',
      youtubeUrl: 'https://www.youtube.com/watch?v=7zcXPCt8Ck0&list=PLGjplNEQ1it_oTvuLRNqXfz_v_0pq6unW&index=6',
      duration: '65 mins',
      order: 6
    },
    {
      title: 'Events',
      youtubeUrl: 'https://www.youtube.com/watch?v=_i-uLJAh79U&list=PLGjplNEQ1it_oTvuLRNqXfz_v_0pq6unW&index=8',
      duration: '58 mins',
      order: 7
    },
    {
      title: 'Classes and Objects',
      youtubeUrl: 'https://www.youtube.com/watch?v=N-O4w6PynGY&list=PLGjplNEQ1it_oTvuLRNqXfz_v_0pq6unW&index=12',
      duration: '57 mins',
      order: 8
    },
    {
      title: 'Callbacks, Promises and Async Await',
      youtubeUrl: 'https://www.youtube.com/watch?v=d3jXofmQm44&list=PLGjplNEQ1it_oTvuLRNqXfz_v_0pq6unW&index=13',
      duration: '62 mins',
      order: 9
    },
    {
      title: 'Fetch API with Project',
      youtubeUrl: 'https://www.youtube.com/watch?v=CyGodpqcid4&list=PLGjplNEQ1it_oTvuLRNqXfz_v_0pq6unW&index=14',
      duration: '59 mins',
      order: 10
    }
  ],
  notes: [
    { title: 'JavaScript Notes', fileUrl: '/notes/JavaScript_notes.pdf' }
  ]
}

const seedJsCourse = async () => {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')

    // Safely upsert: update if already exists, insert if new
    const existing = await Course.findOne({ title: jsCourse.title })
    if (existing) {
      console.log('Course already exists, updating...')
      await Course.updateOne({ title: jsCourse.title }, jsCourse)
      console.log('Course updated successfully')
    } else {
      console.log('Inserting new course...')
      const created = await Course.create(jsCourse)
      console.log('Course inserted successfully with ID:', created._id)
    }

    // ── Schema Verification ──────────────────────────────────────────────────
    const inserted = await Course.findOne({ title: jsCourse.title })
    console.log('\n--- Inserted Course Document ---')
    console.log(JSON.stringify(inserted, null, 2))
    console.log('\n--- Schema Verification ---')
    console.log('Fields present:', Object.keys(inserted.toObject()).join(', '))
    console.log('Total lessons:', inserted.lessons.length)
    console.log('Total notes:', inserted.notes.length)
    console.log('Thumbnail:', inserted.thumbnail)
    console.log('Category:', inserted.category)
    console.log('Duration (minutes):', inserted.duration)

    // Confirm no extra fields were added
    const schemaFields = ['_id', 'title', 'description', 'thumbnail', 'category', 'duration', 'lessons', 'notes', 'createdAt', 'updatedAt', '__v']
    const docFields = Object.keys(inserted.toObject())
    const extraFields = docFields.filter(f => !schemaFields.includes(f))
    if (extraFields.length === 0) {
      console.log('\n✅ Schema verification PASSED — no extra fields added.')
    } else {
      console.warn('\n⚠️  Unexpected fields found:', extraFields)
    }

    process.exit(0)
  } catch (error) {
    console.error('Error seeding course:', error)
    process.exit(1)
  }
}

seedJsCourse()
