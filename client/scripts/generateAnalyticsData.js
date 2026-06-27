import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateUsers, generateSessions, getCommonMetadata } from './utils/fakeDataGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGETS = {
  page_view: 2000,
  click: 1000,
  search: 500,
  course_open: 300,
  quiz_submit: 200,
  video_play: 100,
  video_complete: 50
};

const EVENTS = [];
const USERS = generateUsers(50);
const SESSIONS = generateSessions(200, USERS);
const EVENT_VERSION = 1;

let counts = {
  page_view: 0,
  click: 0,
  search: 0,
  course_open: 0,
  quiz_submit: 0,
  video_play: 0,
  video_complete: 0
};

const createEvent = (type, session, timestamp, page, metadata = {}, seq) => {
  counts[type] = (counts[type] || 0) + 1;
  return {
    version: EVENT_VERSION,
    sessionId: session.sessionId,
    sessionSequenceNumber: seq,
    userId: session.userId,
    eventType: type,
    page: page,
    timestamp: new Date(timestamp).toISOString(),
    metadata: {
      ...getCommonMetadata(),
      ...metadata
    }
  };
};

// Simulate journeys
SESSIONS.forEach((session) => {
  let currentTime = session.startTime;
  let seq = 1;
  const type = Math.random();
  
  if (type > 0.7) {
    // Highly Engaged: Home -> Courses -> Course Details -> Dashboard -> Reports
    EVENTS.push(createEvent('page_view', session, currentTime, '/', { duration: 10000 }, seq++));
    currentTime += 10000;
    EVENTS.push(createEvent('click', session, currentTime, '/', { elementId: 'nav-courses' }, seq++));
    
    currentTime += 2000;
    EVENTS.push(createEvent('page_view', session, currentTime, '/courses', { duration: 15000, previousPage: '/' }, seq++));
    
    // Some interactions
    for(let i=0; i<3; i++) {
      currentTime += 5000;
      EVENTS.push(createEvent('search', session, currentTime, '/courses', { queryLength: 5, resultsCount: 10 }, seq++));
    }
    
    currentTime += 5000;
    EVENTS.push(createEvent('course_open', session, currentTime, '/courses/1', { courseId: '1' }, seq++));
    
    currentTime += 2000;
    EVENTS.push(createEvent('page_view', session, currentTime, '/courses/1', { duration: 60000, previousPage: '/courses' }, seq++));
    
    currentTime += 10000;
    EVENTS.push(createEvent('video_play', session, currentTime, '/courses/1', { videoId: 'v1' }, seq++));
    
    currentTime += 50000;
    EVENTS.push(createEvent('video_complete', session, currentTime, '/courses/1', { videoId: 'v1' }, seq++));
    
    currentTime += 10000;
    EVENTS.push(createEvent('quiz_submit', session, currentTime, '/courses/1', { quizId: 'q1', score: 90 }, seq++));
    
    currentTime += 5000;
    EVENTS.push(createEvent('page_view', session, currentTime, '/dashboard', { duration: 20000, previousPage: '/courses/1' }, seq++));
    
    currentTime += 20000;
    EVENTS.push(createEvent('page_view', session, currentTime, '/reports', { duration: 30000, previousPage: '/dashboard' }, seq++));
    
  } else if (type > 0.3) {
    // Medium: Home -> Courses -> Course Details -> Leave
    EVENTS.push(createEvent('page_view', session, currentTime, '/', { duration: 8000 }, seq++));
    currentTime += 8000;
    EVENTS.push(createEvent('page_view', session, currentTime, '/courses', { duration: 12000, previousPage: '/' }, seq++));
    currentTime += 12000;
    EVENTS.push(createEvent('course_open', session, currentTime, '/courses/2', { courseId: '2' }, seq++));
    EVENTS.push(createEvent('page_view', session, currentTime, '/courses/2', { duration: 20000, previousPage: '/courses' }, seq++));
    currentTime += 20000;
    EVENTS.push(createEvent('click', session, currentTime, '/courses/2', { elementId: 'buy-button' }, seq++));
  } else {
    // Churn: Home -> Leave
    EVENTS.push(createEvent('page_view', session, currentTime, '/', { duration: 3000 }, seq++));
  }
});

// Fill the rest to meet targets
let fillerSeq = 100;
const fillEvents = (targetType, count) => {
  for (let i = 0; i < count; i++) {
    const session = SESSIONS[Math.floor(Math.random() * SESSIONS.length)];
    EVENTS.push(createEvent(targetType, session, session.startTime + Math.random() * 100000, '/unknown', {}, fillerSeq++));
  }
};

for (const [key, target] of Object.entries(TARGETS)) {
  if (counts[key] < target) {
    fillEvents(key, target - counts[key]);
  }
}

// Write to file
const outPath = path.join(__dirname, 'mock_analytics_data.json');
fs.writeFileSync(outPath, JSON.stringify(EVENTS, null, 2));

console.log(`Generated ${EVENTS.length} events across ${SESSIONS.length} sessions for ${USERS.length} users.`);
console.log('Saved to', outPath);
