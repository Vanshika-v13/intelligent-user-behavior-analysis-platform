import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, 'mock_analytics_data.json');

if (!fs.existsSync(dataPath)) {
  console.error('Data file not found. Run generateAnalyticsData.js first.');
  process.exit(1);
}

const events = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let duplicateEvents = 0;
let missingMetadata = 0;
let orphanEvents = 0;

const eventCounts = {};
const sessionMap = new Map();
const userSet = new Set();
const eventIds = new Set();
const pageCounts = {};

events.forEach(event => {
  // Count types
  eventCounts[event.eventType] = (eventCounts[event.eventType] || 0) + 1;
  
  // Track users
  if (!event.userId || !event.userId.startsWith('user_')) {
    orphanEvents++;
  } else {
    userSet.add(event.userId);
  }

  // Track sessions
  if (!sessionMap.has(event.sessionId)) {
    sessionMap.set(event.sessionId, { start: event.timestamp, end: event.timestamp, events: 1 });
  } else {
    const s = sessionMap.get(event.sessionId);
    s.events++;
    if (new Date(event.timestamp) < new Date(s.start)) s.start = event.timestamp;
    if (new Date(event.timestamp) > new Date(s.end)) s.end = event.timestamp;
  }

  // Deduplication check
  const id = `${event.sessionId}-${event.eventType}-${event.page}-${event.timestamp}`;
  if (eventIds.has(id)) {
    duplicateEvents++;
  }
  eventIds.add(id);

  // Missing metadata check
  if (!event.metadata || !event.metadata.browser || !event.metadata.os || !event.metadata.networkType) {
    missingMetadata++;
  }

  // Page counts
  if (event.page) {
    pageCounts[event.page] = (pageCounts[event.page] || 0) + 1;
  }
});

console.log('--- Verification Results ---');
console.log(`✓ Total Events: ${events.length}`);
console.log(`✓ Total Sessions: ${sessionMap.size}`);
console.log(`✓ Total Users: ${userSet.size}`);
console.log(`✓ Duplicate Events: ${duplicateEvents}`);
console.log(`✓ Orphan Events (invalid users): ${orphanEvents}`);
console.log(`✓ Missing Metadata: ${missingMetadata}`);

console.log('\n--- Event Distribution ---');
for (const [type, count] of Object.entries(eventCounts)) {
  console.log(`- ${type}: ${count}`);
}

console.log('\n--- Top Pages ---');
const sortedPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
for (const [page, count] of sortedPages) {
  console.log(`- ${page}: ${count} views`);
}

console.log('\n--- Session Duration Distribution ---');
let durations = [];
for (const s of sessionMap.values()) {
  durations.push(new Date(s.end).getTime() - new Date(s.start).getTime());
}
durations.sort((a, b) => a - b);
const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
console.log(`Average Session Duration: ${(avg / 1000).toFixed(2)} seconds`);
console.log(`Max Session Duration: ${(durations[durations.length - 1] / 1000).toFixed(2)} seconds`);
