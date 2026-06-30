import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from './src/models/Course.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/user-analytics'

const sampleCourse = {
  title: 'HTML & CSS Basics',
  description: 'Learn the fundamentals of HTML and CSS and build responsive websites from scratch. This beginner-friendly course covers HTML structure, forms, CSS styling, Flexbox, and responsive design principles.',
  category: 'Web Development',
  thumbnail: 'https://via.placeholder.com/600x400?text=HTML+%26+CSS+Basics',
  duration: 120, // Total duration in minutes (just a placeholder)
  lessons: [
    { title: 'Introduction to HTML', youtubeUrl: '', duration: '20 mins', order: 1 },
    { title: 'HTML Elements and Structure', youtubeUrl: '', duration: '25 mins', order: 2 },
    { title: 'Forms and Tables', youtubeUrl: '', duration: '30 mins', order: 3 },
    { title: 'CSS Fundamentals', youtubeUrl: '', duration: '20 mins', order: 4 },
    { title: 'Flexbox and Layout', youtubeUrl: '', duration: '25 mins', order: 5 },
    { title: 'Responsive Design Basics', youtubeUrl: '', duration: '30 mins', order: 6 }
  ],
  notes: [
    { title: 'HTML Cheat Sheet', fileUrl: '/notes/html-cheatsheet.pdf' },
    { title: 'CSS Cheat Sheet', fileUrl: '/notes/css-cheatsheet.pdf' }
  ]
}

const seedCourse = async () => {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')

    // Check if course already exists
    const existing = await Course.findOne({ title: sampleCourse.title })
    if (existing) {
      console.log('Course already exists, skipping...')
    } else {
      console.log('Inserting course...')
      await Course.create(sampleCourse)
      console.log('Course inserted successfully')
    }

    process.exit(0)
  } catch (error) {
    console.error('Error seeding course:', error)
    process.exit(1)
  }
}

seedCourse()
