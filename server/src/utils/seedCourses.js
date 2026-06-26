import Course from '../models/Course.js'

const courses = [
  {
    title: 'Introduction to JavaScript',
    description:
      'Learn JavaScript fundamentals including variables, functions, arrays, objects, and DOM manipulation. Build a solid foundation for modern web development.',
    thumbnail: 'https://placehold.co/600x400/2563eb/ffffff?text=JavaScript',
    category: 'Web Development',
    duration: 480,
  },
  {
    title: 'React Fundamentals',
    description:
      'Master React components, props, state, hooks, and component lifecycle. Build interactive UIs with reusable component patterns.',
    thumbnail: 'https://placehold.co/600x400/0891b2/ffffff?text=React',
    category: 'Web Development',
    duration: 540,
  },
  {
    title: 'Node.js Backend Development',
    description:
      'Build scalable server-side applications with Node.js and Express. Learn routing, middleware, error handling, and REST API design.',
    thumbnail: 'https://placehold.co/600x400/16a34a/ffffff?text=Node.js',
    category: 'Backend',
    duration: 600,
  },
  {
    title: 'MongoDB Essentials',
    description:
      'Understand document-based data modeling, CRUD operations, indexing, aggregation pipelines, and schema design with Mongoose.',
    thumbnail: 'https://placehold.co/600x400/15803d/ffffff?text=MongoDB',
    category: 'Database',
    duration: 420,
  },
  {
    title: 'Machine Learning Basics',
    description:
      'Explore supervised and unsupervised learning, model training, evaluation metrics, and practical ML workflows for real-world datasets.',
    thumbnail: 'https://placehold.co/600x400/7c3aed/ffffff?text=Machine+Learning',
    category: 'Machine Learning',
    duration: 720,
  },
  {
    title: 'Data Structures and Algorithms',
    description:
      'Strengthen problem-solving skills with arrays, linked lists, trees, graphs, sorting, searching, and time-space complexity analysis.',
    thumbnail: 'https://placehold.co/600x400/d97706/ffffff?text=DSA',
    category: 'Programming',
    duration: 900,
  },
  {
    title: 'System Design Fundamentals',
    description:
      'Learn how to design scalable systems covering load balancing, caching, databases, microservices, and high-availability architecture.',
    thumbnail: 'https://placehold.co/600x400/475569/ffffff?text=System+Design',
    category: 'Backend',
    duration: 660,
  },
  {
    title: 'Redis for Developers',
    description:
      'Use Redis for caching, pub/sub messaging, session storage, and rate limiting. Understand data structures and performance tuning.',
    thumbnail: 'https://placehold.co/600x400/dc2626/ffffff?text=Redis',
    category: 'Database',
    duration: 300,
  },
  {
    title: 'TypeScript for Modern Apps',
    description:
      'Add static typing to JavaScript projects with TypeScript. Cover interfaces, generics, type inference, and integration with React and Node.',
    thumbnail: 'https://placehold.co/600x400/1d4ed8/ffffff?text=TypeScript',
    category: 'Programming',
    duration: 360,
  },
]

/**
 * Seeds courses using upsert by title to prevent duplicate insertion.
 */
const seedCourses = async () => {
  const seededCourses = []

  for (const course of courses) {
    const savedCourse = await Course.findOneAndUpdate(
      { title: course.title },
      course,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    )
    seededCourses.push(savedCourse)
  }

  return seededCourses
}

export default seedCourses
