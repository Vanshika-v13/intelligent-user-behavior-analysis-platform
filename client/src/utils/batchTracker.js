import { eventQueue } from './eventQueue';
import api from '../services/api';

const BATCH_SIZE = 5;
const FLUSH_INTERVAL = 10000; // 10 seconds
let intervalId = null;

let batch = [];

const sendBatch = async (eventsToSend) => {
  if (eventsToSend.length === 0) return;

  try {
    const payload = eventsToSend.map(e => e.payload);
    await api.post('/events', { events: payload });
    // Success, we don't need to do anything with the successful events
  } catch (error) {
    console.error('Failed to send batch of events', error);
    // On failure, enqueue them for retry
    eventsToSend.forEach(e => eventQueue.enqueueEvent(e.payload));
  }
};

export const batchTracker = {
  addEvent: (payload) => {
    const event = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      payload
    };
    batch.push(event);

    if (import.meta.env.VITE_ENABLE_ANALYTICS_DEBUG === 'true') {
      console.group('Analytics Event');
      console.log(payload);
      console.groupEnd();
    }

    if (batch.length >= BATCH_SIZE) {
      batchTracker.flushEvents();
    }
  },

  flushEvents: () => {
    if (batch.length === 0) return;
    
    const eventsToSend = [...batch];
    batch = [];
    sendBatch(eventsToSend);
  },
  
  retryFailedEvents: async () => {
    const queue = eventQueue.getQueue();
    if (queue.length === 0) return;
    
    const isOnline = window.navigator.onLine;
    if (!isOnline) return;

    const eventsToRetry = [...queue];
    eventQueue.clearQueue();

    try {
        const payload = eventsToRetry.map(e => e.payload);
        await api.post('/events', { events: payload });
    } catch (error) {
        console.error('Failed to retry events', error);
        eventsToRetry.forEach(e => eventQueue.incrementRetry(e.id));
    }
  },

  startInterval: () => {
    if (!intervalId) {
      intervalId = setInterval(() => {
        batchTracker.flushEvents();
        batchTracker.retryFailedEvents();
      }, FLUSH_INTERVAL);
    }
  },

  stopInterval: () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
};
