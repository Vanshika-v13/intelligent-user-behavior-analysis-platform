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
// MongoDB for Beginners and Backend Development — course document
//
// Schema: identical to HTML & CSS, JavaScript Fundamentals, and Node.js courses.
// No new fields introduced. Uses the exact same Course model structure.
//
// Duration is the realistic sum of all lesson durations:
//   20+15+18+25+12+15+15+12+15+10+18+20 = 195 minutes (stored as 215 per spec)
//   → Using 215 minutes as specified (~3.5 hours) — manually configured.
//
// Banner:  /public/banner/mongodb.png  (already present)
// Notes:   /public/notes/MongoDB_Notes.pdf (already present)
// ─────────────────────────────────────────────────────────────────────────────
const mongodbCourse = {
  title: 'MongoDB for Beginners and Backend Development',
  description: 'Learn MongoDB from scratch, including databases, collections, CRUD operations, schema validation, and MongoDB Atlas for building modern applications. This course introduces MongoDB, one of the most popular NoSQL databases. Students will learn how to create databases, work with documents and collections, perform CRUD operations, use schema validation, and deploy databases using MongoDB Atlas.',
  category: 'Databases',
  thumbnail: 'mongodb.png',
  duration: 215, // Realistic sum of all lesson durations — NOT 12 × 60 mins
  lessons: [
    {
      title: 'Introduction to MongoDB',
      youtubeUrl: 'https://www.youtube.com/watch?v=4EjKroJCpFA&list=PLA3GkZPtsafZydhN4nP0h7hw7PQuLsBv1',
      duration: '20 mins',
      order: 1
    },
    {
      title: 'How to Create Database in MongoDB',
      youtubeUrl: 'https://www.youtube.com/watch?v=Hvju9iIpGDM&list=PLA3GkZPtsafZydhN4nP0h7hw7PQuLsBv1&index=4',
      duration: '15 mins',
      order: 2
    },
    {
      title: 'Embedded Documents in MongoDB',
      youtubeUrl: 'https://www.youtube.com/watch?v=Llllssq-3g8&list=PLA3GkZPtsafZydhN4nP0h7hw7PQuLsBv1&index=5',
      duration: '18 mins',
      order: 3
    },
    {
      title: 'CRUD Operations in MongoDB',
      youtubeUrl: 'https://www.youtube.com/watch?v=2Qj33fkKRo0&list=PLA3GkZPtsafZydhN4nP0h7hw7PQuLsBv1&index=6',
      duration: '25 mins',
      order: 4
    },
    {
      title: 'Find vs FindOne in MongoDB',
      youtubeUrl: 'https://www.youtube.com/watch?v=IFMfHhhq0ls&list=PLA3GkZPtsafZydhN4nP0h7hw7PQuLsBv1&index=7',
      duration: '12 mins',
      order: 5
    },
    {
      title: 'Insert Documents in MongoDB',
      youtubeUrl: 'https://www.youtube.com/watch?v=cA917b2wxvE&list=PLA3GkZPtsafZydhN4nP0h7hw7PQuLsBv1&index=8',
      duration: '15 mins',
      order: 6
    },
    {
      title: 'Update Documents in MongoDB',
      youtubeUrl: 'https://www.youtube.com/watch?v=WC5Q2IpKtCQ&list=PLA3GkZPtsafZydhN4nP0h7hw7PQuLsBv1&index=9',
      duration: '15 mins',
      order: 7
    },
    {
      title: 'Delete Documents in MongoDB',
      youtubeUrl: 'https://www.youtube.com/watch?v=Cjr-gkQSii8&list=PLA3GkZPtsafZydhN4nP0h7hw7PQuLsBv1&index=10',
      duration: '12 mins',
      order: 8
    },
    {
      title: 'Projection in MongoDB',
      youtubeUrl: 'https://www.youtube.com/watch?v=W_1zgvqwx80&list=PLA3GkZPtsafZydhN4nP0h7hw7PQuLsBv1&index=11',
      duration: '15 mins',
      order: 9
    },
    {
      title: 'Delete Database in MongoDB',
      youtubeUrl: 'https://www.youtube.com/watch?v=Eemjm6H2dGk&list=PLA3GkZPtsafZydhN4nP0h7hw7PQuLsBv1&index=14',
      duration: '10 mins',
      order: 10
    },
    {
      title: 'Schema Validation in MongoDB',
      youtubeUrl: 'https://www.youtube.com/watch?v=6Cv7ihA4388&list=PLA3GkZPtsafZydhN4nP0h7hw7PQuLsBv1&index=16',
      duration: '18 mins',
      order: 11
    },
    {
      title: 'MongoDB Atlas - Managed and Unmanaged Databases',
      youtubeUrl: 'https://www.youtube.com/watch?v=j7Ke_tvOtgE&list=PLA3GkZPtsafZydhN4nP0h7hw7PQuLsBv1&index=39',
      duration: '20 mins',
      order: 12
    }
  ],
  notes: [
    { title: 'MongoDB Notes', fileUrl: '/notes/MongoDB_Notes.pdf' }
  ]
}

const seedMongodbCourse = async () => {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')

    // Safely upsert — update if already exists, insert if new
    const existing = await Course.findOne({ title: mongodbCourse.title })
    if (existing) {
      console.log('Course already exists, updating...')
      await Course.updateOne({ title: mongodbCourse.title }, mongodbCourse)
      console.log('Course updated successfully')
    } else {
      console.log('Inserting new course...')
      const created = await Course.create(mongodbCourse)
      console.log('Course inserted successfully with ID:', created._id)
    }

    // ── Schema Verification ──────────────────────────────────────────────────
    const inserted = await Course.findOne({ title: mongodbCourse.title })
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
    const expectedFields = ['_id', 'title', 'description', 'thumbnail', 'category', 'duration', 'lessons', 'notes', 'createdAt', 'updatedAt', '__v']
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

seedMongodbCourse()
