const QUEUE_KEY = 'analytics_event_queue';
const MAX_RETRIES = 3;

// Deduplication map: Map<eventId, timestamp>
const processedEvents = new Map();
const DEDUPE_TTL = 5 * 60 * 1000; // 5 minutes

const cleanupDedupeMap = () => {
  const now = Date.now();
  for (const [eventId, timestamp] of processedEvents.entries()) {
    if (now - timestamp > DEDUPE_TTL) {
      processedEvents.delete(eventId);
    }
  }
};

export const eventQueue = {
  getQueue: () => {
    try {
      const q = localStorage.getItem(QUEUE_KEY);
      return q ? JSON.parse(q) : [];
    } catch (error) {
      console.error('Failed to parse event queue', error);
      return [];
    }
  },

  setQueue: (queue) => {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save event queue', error);
    }
  },

  enqueueEvent: (payload) => {
    cleanupDedupeMap();
    
    // Generate eventId for deduplication: `${sessionId}-${eventType}-${page}-${timestamp}`
    const eventId = `${payload.sessionId}-${payload.eventType}-${payload.page}-${payload.timestamp}`;
    
    if (processedEvents.has(eventId)) {
      // Duplicate detected, ignore
      return;
    }
    
    processedEvents.set(eventId, Date.now());

    const queue = eventQueue.getQueue();
    const event = {
      id: eventId,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      payload
    };
    queue.push(event);
    eventQueue.setQueue(queue);
  },

  incrementRetry: (eventId) => {
    let queue = eventQueue.getQueue();
    queue = queue.map(event => {
      if (event.id === eventId) {
        return { ...event, retryCount: event.retryCount + 1 };
      }
      return event;
    }).filter(event => event.retryCount < MAX_RETRIES); // Discard after 3 failures
    eventQueue.setQueue(queue);
  },

  removeEvents: (eventIds) => {
    let queue = eventQueue.getQueue();
    queue = queue.filter(event => !eventIds.includes(event.id));
    eventQueue.setQueue(queue);
  },

  clearQueue: () => {
    localStorage.removeItem(QUEUE_KEY);
  }
};
