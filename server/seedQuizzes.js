import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Course from './src/models/Course.js'
import Quiz from './src/models/Quiz.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const getQuizzesData = (courseMap) => [
  {
    courseId: courseMap['HTML & CSS Basics'],
    title: 'HTML & CSS Final Quiz',
    description: 'Test your knowledge on HTML & CSS fundamentals.',
    passingScore: 70,
    questions: [
      { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'Hyperlinks and Text Markup Language', 'Home Tool Markup Language', 'Hyper Tool Markup Language'], correctAnswer: 'Hyper Text Markup Language', explanation: 'HTML stands for Hyper Text Markup Language.' },
      { question: 'Choose the correct HTML element for the largest heading:', options: ['<heading>', '<h1>', '<h6>', '<head>'], correctAnswer: '<h1>', explanation: '<h1> is the largest heading tag.' },
      { question: 'What is the correct HTML for adding a background color?', options: ['<body bg="yellow">', '<background>yellow</background>', '<body style="background-color:yellow;">', '<body color="yellow">'], correctAnswer: '<body style="background-color:yellow;">', explanation: 'Inline styles use the style attribute.' },
      { question: 'What does CSS stand for?', options: ['Colorful Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets'], correctAnswer: 'Cascading Style Sheets', explanation: 'CSS stands for Cascading Style Sheets.' },
      { question: 'Where in an HTML document is the correct place to refer to an external style sheet?', options: ['In the <head> section', 'In the <body> section', 'At the end of the document', 'In the <title> section'], correctAnswer: 'In the <head> section', explanation: 'External stylesheets are linked in the head section.' },
      { question: 'Which HTML tag is used to define an internal style sheet?', options: ['<css>', '<script>', '<style>', '<link>'], correctAnswer: '<style>', explanation: 'The <style> tag is used for internal CSS.' },
      { question: 'Which HTML attribute is used to define inline styles?', options: ['class', 'styles', 'font', 'style'], correctAnswer: 'style', explanation: 'The style attribute is used for inline CSS.' },
      { question: 'Which is the correct CSS syntax?', options: ['body {color: black;}', '{body;color:black;}', 'body:color=black;', '{body:color=black;}'], correctAnswer: 'body {color: black;}', explanation: 'CSS syntax consists of a selector and a declaration block.' },
      { question: 'How do you insert a comment in a CSS file?', options: ['// this is a comment', '/* this is a comment */', '// this is a comment //', "' this is a comment"], correctAnswer: '/* this is a comment */', explanation: 'CSS comments are enclosed in /* and */.' },
      { question: 'Which property is used to change the background color?', options: ['color', 'bgcolor', 'background-color', 'bg-color'], correctAnswer: 'background-color', explanation: 'background-color is the correct CSS property.' }
    ]
  },
  {
    courseId: courseMap['JavaScript Fundamentals'],
    title: 'JavaScript Fundamentals Final Quiz',
    description: 'Test your knowledge on JavaScript fundamentals.',
    passingScore: 70,
    questions: [
      { question: 'Inside which HTML element do we put the JavaScript?', options: ['<javascript>', '<scripting>', '<js>', '<script>'], correctAnswer: '<script>', explanation: 'The <script> tag is used to embed JavaScript.' },
      { question: 'Where is the correct place to insert a JavaScript?', options: ['The <body> section', 'The <head> section', 'Both the <head> section and the <body> section are correct', 'At the end of the document'], correctAnswer: 'Both the <head> section and the <body> section are correct', explanation: 'JS can be placed in both head and body sections.' },
      { question: 'How do you write "Hello World" in an alert box?', options: ['msgBox("Hello World");', 'alert("Hello World");', 'msg("Hello World");', 'alertBox("Hello World");'], correctAnswer: 'alert("Hello World");', explanation: 'alert() is the correct function.' },
      { question: 'How do you create a function in JavaScript?', options: ['function = myFunction()', 'function myFunction()', 'function:myFunction()', 'create myFunction()'], correctAnswer: 'function myFunction()', explanation: 'Use the function keyword followed by the name.' },
      { question: 'How do you call a function named "myFunction"?', options: ['call myFunction()', 'myFunction()', 'call function myFunction()', 'execute myFunction()'], correctAnswer: 'myFunction()', explanation: 'Just use the function name followed by parentheses.' },
      { question: 'How to write an IF statement in JavaScript?', options: ['if i = 5 then', 'if i == 5 then', 'if (i == 5)', 'if i = 5'], correctAnswer: 'if (i == 5)', explanation: 'Conditions are wrapped in parentheses.' },
      { question: 'How does a WHILE loop start?', options: ['while (i <= 10; i++)', 'while (i <= 10)', 'while i = 1 to 10', 'while (i <= 10; i++)'], correctAnswer: 'while (i <= 10)', explanation: 'while loops take a single condition in parentheses.' },
      { question: 'How does a FOR loop start?', options: ['for (i = 0; i <= 5)', 'for (i <= 5; i++)', 'for i = 1 to 5', 'for (i = 0; i <= 5; i++)'], correctAnswer: 'for (i = 0; i <= 5; i++)', explanation: 'For loops take three statements separated by semicolons.' },
      { question: 'How can you add a comment in a JavaScript?', options: ['<!--This is a comment-->', '//This is a comment', "'This is a comment", '*This is a comment*'], correctAnswer: '//This is a comment', explanation: '// is used for single line comments.' },
      { question: 'How do you round the number 7.25, to the nearest integer?', options: ['rnd(7.25)', 'Math.round(7.25)', 'Math.rnd(7.25)', 'round(7.25)'], correctAnswer: 'Math.round(7.25)', explanation: 'Math.round() rounds to the nearest integer.' }
    ]
  },
  {
    courseId: courseMap['Node.js and Express.js Development'],
    title: 'Node.js & Express.js Final Quiz',
    description: 'Test your knowledge on Node.js and Express.',
    passingScore: 70,
    questions: [
      { question: 'What is Node.js?', options: ['A frontend framework', 'A JavaScript runtime environment', 'A database', 'A CSS preprocessor'], correctAnswer: 'A JavaScript runtime environment', explanation: 'Node.js is a JS runtime built on Chrome V8 engine.' },
      { question: 'Which command is used to initialize a new Node.js project?', options: ['node init', 'npm start', 'npm init', 'node new'], correctAnswer: 'npm init', explanation: 'npm init creates a package.json file.' },
      { question: 'How do you include an external module in Node.js?', options: ['import module', 'require("module")', 'include "module"', 'load("module")'], correctAnswer: 'require("module")', explanation: 'CommonJS uses require().' },
      { question: 'What is Express.js?', options: ['A database', 'A web framework for Node.js', 'A testing library', 'A template engine'], correctAnswer: 'A web framework for Node.js', explanation: 'Express is a fast, unopinionated web framework for Node.js.' },
      { question: 'How do you define a route in Express?', options: ['app.get("/path", callback)', 'app.route("/path")', 'server.get("/path")', 'express.route("/path")'], correctAnswer: 'app.get("/path", callback)', explanation: 'app.METHOD(PATH, HANDLER) is the standard.' },
      { question: 'Which middleware is built-in in Express for parsing JSON?', options: ['express.json()', 'body-parser', 'json-parser', 'express.parse()'], correctAnswer: 'express.json()', explanation: 'express.json() parses incoming JSON requests.' },
      { question: 'What is the role of package.json?', options: ['To store CSS', 'To list dependencies and project metadata', 'To configure the database', 'To define routes'], correctAnswer: 'To list dependencies and project metadata', explanation: 'It holds metadata relevant to the project.' },
      { question: 'Which object holds the request parameters in Express?', options: ['req.body', 'req.params', 'req.query', 'req.headers'], correctAnswer: 'req.params', explanation: 'req.params contains route parameters.' },
      { question: 'What does res.send() do?', options: ['Sends a file', 'Sends an HTTP response', 'Sends an email', 'Sends a database query'], correctAnswer: 'Sends an HTTP response', explanation: 'It sends the HTTP response to the client.' },
      { question: 'How do you handle errors in Express?', options: ['Using try/catch only', 'With error-handling middleware', 'Using console.error', 'Errors are handled automatically'], correctAnswer: 'With error-handling middleware', explanation: 'Express has special error-handling middleware functions with 4 arguments.' }
    ]
  },
  {
    courseId: courseMap['MongoDB for Beginners and Backend Development'],
    title: 'MongoDB Final Quiz',
    description: 'Test your knowledge on MongoDB.',
    passingScore: 70,
    questions: [
      { question: 'What type of database is MongoDB?', options: ['Relational', 'NoSQL Document Store', 'Key-Value Store', 'Graph Database'], correctAnswer: 'NoSQL Document Store', explanation: 'MongoDB is a document-oriented NoSQL database.' },
      { question: 'What format does MongoDB use to store data?', options: ['XML', 'CSV', 'BSON', 'YAML'], correctAnswer: 'BSON', explanation: 'MongoDB stores data in BSON (Binary JSON).' },
      { question: 'Which command inserts a document into a collection?', options: ['db.collection.add()', 'db.collection.insert()', 'db.collection.create()', 'db.collection.push()'], correctAnswer: 'db.collection.insert()', explanation: 'insertOne() or insertMany() or insert() are used.' },
      { question: 'Which command finds all documents in a collection?', options: ['db.collection.findAll()', 'db.collection.get()', 'db.collection.find()', 'db.collection.fetch()'], correctAnswer: 'db.collection.find()', explanation: 'find() with no arguments returns all documents.' },
      { question: 'How do you specify a filter in MongoDB find()?', options: ['db.collection.find("name=John")', 'db.collection.find({name: "John"})', 'db.collection.find([name: "John"])', 'db.collection.find(name="John")'], correctAnswer: 'db.collection.find({name: "John"})', explanation: 'Filters are passed as objects.' },
      { question: 'What is a replica set in MongoDB?', options: ['A backup file', 'A group of mongod processes that maintain the same data set', 'A collection of identical documents', 'A duplicate database for testing'], correctAnswer: 'A group of mongod processes that maintain the same data set', explanation: 'Replica sets provide redundancy and high availability.' },
      { question: 'What does an index do in MongoDB?', options: ['Encrypts data', 'Compresses data', 'Improves query performance', 'Creates a backup'], correctAnswer: 'Improves query performance', explanation: 'Indexes support the efficient execution of queries.' },
      { question: 'What is Mongoose?', options: ['A MongoDB GUI', 'An ODM (Object Data Modeling) library for MongoDB and Node.js', 'A MongoDB cloud service', 'A caching layer for MongoDB'], correctAnswer: 'An ODM (Object Data Modeling) library for MongoDB and Node.js', explanation: 'Mongoose provides a straight-forward, schema-based solution.' },
      { question: 'In Mongoose, what is a Schema?', options: ['A database connection', 'A definition of the document structure', 'A query language', 'A validation rule'], correctAnswer: 'A definition of the document structure', explanation: 'Schemas map to a MongoDB collection and define the shape of the documents.' },
      { question: 'Which command is used to delete a document?', options: ['db.collection.remove()', 'db.collection.delete()', 'db.collection.deleteOne()', 'Both a and c'], correctAnswer: 'Both a and c', explanation: 'remove() and deleteOne()/deleteMany() are used.' }
    ]
  },
  {
    courseId: courseMap['Git & GitHub Essentials'],
    title: 'Git & GitHub Final Quiz',
    description: 'Test your knowledge on Git and GitHub.',
    passingScore: 70,
    questions: [
      { question: 'What is Git?', options: ['A programming language', 'A version control system', 'A text editor', 'A cloud hosting service'], correctAnswer: 'A version control system', explanation: 'Git is a distributed version control system.' },
      { question: 'What is the command to initialize a new Git repository?', options: ['git start', 'git create', 'git init', 'git new'], correctAnswer: 'git init', explanation: 'git init creates a new Git repository.' },
      { question: 'How do you check the state of your working directory and staging area?', options: ['git status', 'git state', 'git log', 'git show'], correctAnswer: 'git status', explanation: 'git status shows the current state.' },
      { question: 'Which command adds files to the staging area?', options: ['git stage', 'git commit', 'git add', 'git push'], correctAnswer: 'git add', explanation: 'git add moves changes to the staging area.' },
      { question: 'How do you save changes to the local repository?', options: ['git save', 'git push', 'git update', 'git commit'], correctAnswer: 'git commit', explanation: 'git commit records changes to the repository.' },
      { question: 'What is GitHub?', options: ['A command-line tool', 'A hosting platform for version control using Git', 'A new version of Git', 'An IDE'], correctAnswer: 'A hosting platform for version control using Git', explanation: 'GitHub provides hosting for software development.' },
      { question: 'Which command is used to upload local repository content to a remote repository?', options: ['git pull', 'git fetch', 'git push', 'git upload'], correctAnswer: 'git push', explanation: 'git push updates remote refs.' },
      { question: 'Which command is used to download from a remote repository and integrate with another repository?', options: ['git pull', 'git download', 'git clone', 'git fetch'], correctAnswer: 'git pull', explanation: 'git pull fetches and merges.' },
      { question: 'What is a branch in Git?', options: ['A separate project', 'A copy of the repository', 'An independent line of development', 'A backup of the code'], correctAnswer: 'An independent line of development', explanation: 'Branches allow you to work isolated from others.' },
      { question: 'How do you switch to another branch?', options: ['git switch or git checkout', 'git change', 'git move', 'git branch'], correctAnswer: 'git switch or git checkout', explanation: 'Both git checkout and git switch can be used.' }
    ]
  }
];

const seedQuizzes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected for seeding Quizzes')

    await Quiz.deleteMany()
    console.log('Cleared existing quizzes')

    const courses = await Course.find()
    
    if (courses.length === 0) {
      console.log('No courses found. Please seed courses first.')
      process.exit(1)
    }

    const courseMap = {}
    courses.forEach(course => {
      courseMap[course.title] = course._id
    })

    const quizzesData = getQuizzesData(courseMap)

    const validQuizzesData = quizzesData.filter(q => q.courseId !== undefined);

    await Quiz.insertMany(validQuizzesData)
    console.log('Quizzes seeded successfully')
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding quizzes:', error)
    process.exit(1)
  }
}

seedQuizzes()
