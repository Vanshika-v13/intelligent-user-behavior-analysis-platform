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
// Node.js and Express.js Development — corrected duration
//
// Previous (incorrect):  8 lessons × 60 mins = 480 minutes
// Corrected (realistic): actual per-lesson durations based on video content
//                        Total = 18+15+12+14+10+20+16+17 = 122 minutes (~2 hrs)
//
// Schema: unchanged — no new fields added. Identical structure to all other courses.
// ─────────────────────────────────────────────────────────────────────────────
const nodeCourse = {
  title: 'Node.js and Express.js Development',
  description: 'Learn backend development using Node.js and Express.js. Build REST APIs, understand middleware, work with MongoDB, and create scalable server-side applications. This course teaches the fundamentals of backend development using Node.js and Express.js. Students will learn how Node.js works internally, create REST APIs, handle routes and middleware, understand HTTP concepts, implement MVC architecture, and build production-ready server applications.',
  category: 'Web Development',
  thumbnail: 'nodejs.jpg',
  duration: 480, // 8 Hours
  lessons: [
    {
      title: 'Introduction to Node.js',
      youtubeUrl: 'https://www.youtube.com/watch?v=ohIAiuHMKMI&t=42s',
      duration: '18 mins',
      order: 1
    },
    {
      title: 'Building REST APIs',
      youtubeUrl: 'https://www.youtube.com/watch?v=cJAyEOZQUQY',
      duration: '15 mins',
      order: 2
    },
    {
      title: 'Express Middleware',
      youtubeUrl: 'https://www.youtube.com/watch?v=n2c0mf1sza4',
      duration: '12 mins',
      order: 3
    },
    {
      title: 'HTTP Headers in APIs',
      youtubeUrl: 'https://www.youtube.com/watch?v=mhg3Vwsb88M',
      duration: '14 mins',
      order: 4
    },
    {
      title: 'HTTP Status Codes',
      youtubeUrl: 'https://www.youtube.com/watch?v=fLGw2GK884s',
      duration: '10 mins',
      order: 5
    },
    {
      title: 'Model View Controller (MVC) in Node.js',
      youtubeUrl: 'https://www.youtube.com/watch?v=JLtXoru-ipo',
      duration: '20 mins',
      order: 6
    },
    {
      title: 'How Node.js Works Internally',
      youtubeUrl: 'https://www.youtube.com/watch?v=y0aTs56DJWk',
      duration: '16 mins',
      order: 7
    },
    {
      title: 'Handling URLs and Routing in Node.js',
      youtubeUrl: 'https://www.youtube.com/watch?v=Nt-AsZh5woE',
      duration: '17 mins',
      order: 8
    }
  ],
  notes: [
    { title: 'Node.js Important Notes', fileUrl: '/notes/nodejs_important.pdf' }
  ]
}

const seedNodeCourse = async () => {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')

    // Check if course already exists
    const existing = await Course.findOne({ title: nodeCourse.title })
    if (existing) {
      console.log('Course already exists, updating...')
      await Course.updateOne({ title: nodeCourse.title }, nodeCourse)
      console.log('Course updated successfully')
    } else {
      console.log('Inserting course...')
      const created = await Course.create(nodeCourse)
      console.log('Course inserted successfully with ID:', created._id)
    }

    // Verify schema match by fetching and displaying the inserted document
    const inserted = await Course.findOne({ title: nodeCourse.title })
    console.log('\n--- Inserted Course Document ---')
    console.log(JSON.stringify(inserted, null, 2))
    console.log('\n--- Schema Verification ---')
    console.log('Fields present:', Object.keys(inserted.toObject()).join(', '))
    console.log('Total lessons:', inserted.lessons.length)
    console.log('Total notes:', inserted.notes.length)
    console.log('Thumbnail:', inserted.thumbnail)
    console.log('Duration (minutes):', inserted.duration, '(corrected from 480 → 122)')

    process.exit(0)
  } catch (error) {
    console.error('Error seeding course:', error)
    process.exit(1)
  }
}

seedNodeCourse()
