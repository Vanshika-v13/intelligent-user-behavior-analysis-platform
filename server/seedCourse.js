import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Course from './src/models/Course.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/user-analytics'

const sampleCourse = {
  title: 'HTML & CSS Basics',
  description: 'Learn the fundamentals of HTML and CSS and build responsive websites from scratch. This beginner-friendly course covers HTML structure, lists, tables, media elements, CSS styling, selectors, box model, forms, and responsive design principles.',
  category: 'Web Development',
  thumbnail: 'html_css.jpg',
  duration: 300, // Approximate 4-5 hours
  lessons: [
    {
      title: "Introduction to HTML",
      youtubeUrl: "https://www.youtube.com/watch?v=Rek0NWPCNOc&t=666s",
      duration: "35 mins",
      order: 1
    },
    {
      title: "Lists & Tables",
      youtubeUrl: "https://www.youtube.com/watch?v=2QR11oDukn4",
      duration: "25 mins",
      order: 2
    },
    {
      title: "Media Elements",
      youtubeUrl: "https://www.youtube.com/watch?v=2QR11oDukn4",
      duration: "20 mins",
      order: 3
    },
    {
      title: "Mini HTML Project",
      youtubeUrl: "https://www.youtube.com/watch?v=61ppyY5rUB0",
      duration: "40 mins",
      order: 4
    },
    {
      title: "CSS Selectors",
      youtubeUrl: "https://www.youtube.com/watch?v=sqJ6xZ9mUwE",
      duration: "25 mins",
      order: 5
    },
    {
      title: "Properties in CSS",
      youtubeUrl: "https://www.youtube.com/watch?v=4nC4VXHlys8",
      duration: "30 mins",
      order: 6
    },
    {
      title: "Understanding Box Model",
      youtubeUrl: "https://www.youtube.com/watch?v=C01LeeMhwHc",
      duration: "20 mins",
      order: 7
    },
    {
      title: "Understanding Cascading, Specificity & Inheritance",
      youtubeUrl: "https://www.youtube.com/watch?v=wKPlQkOdpFQ",
      duration: "30 mins",
      order: 8
    },
    {
      title: "Styling Forms in CSS",
      youtubeUrl: "https://www.youtube.com/watch?v=6Cpd63_WXdI",
      duration: "25 mins",
      order: 9
    },
    {
      title: "Responsive Design",
      youtubeUrl: "https://www.youtube.com/watch?v=p870o46o1bM",
      duration: "30 mins",
      order: 10
    }
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
      console.log('Course already exists, updating...')
      await Course.updateOne({ title: sampleCourse.title }, sampleCourse)
      console.log('Course updated successfully')
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
