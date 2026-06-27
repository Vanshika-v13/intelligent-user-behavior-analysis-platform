# Analytics Data Model

This document outlines the data schemas, versioning strategy, and processing pipelines for the Intelligent User Behavior Analytics Platform. The analytics events tracked here act as the foundation for the Machine Learning and Recommendation engines.

## Event Schema

Every analytics event follows a unified schema:

```json
{
  "version": 1,
  "sessionId": "session_abc123",
  "sessionSequenceNumber": 4,
  "userId": "user_xyz789",
  "eventType": "page_view",
  "page": "/courses/1",
  "timestamp": "2023-10-12T10:00:00Z",
  "metadata": { ... }
}
```

### Event Types
- `page_view`
- `click`
- `search`
- `course_open`
- `video_play`
- `video_pause`
- `video_complete`
- `quiz_start`
- `quiz_submit`

## Session Schema

A session ties a sequence of events together. It is managed on the client side with the `AnalyticsContext` and `trackingService`.
- Starts when a user opens the app (or when they login).
- Events occurring within the same browser tab are linked via `sessionId`.
- `sessionSequenceNumber` tracks the order of events within the session.

## Metadata Schema

The `metadata` object is enriched automatically with device and environment parameters for every event:

```json
{
  "browser": "Chrome",
  "os": "macOS",
  "deviceType": "desktop",
  "viewportWidth": 1440,
  "viewportHeight": 900,
  "screenWidth": 1440,
  "screenHeight": 900,
  "language": "en-US",
  "timezone": "America/New_York",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://google.com",
  "networkType": "4g",
  "platform": "MacIntel",
  "colorScheme": "dark",
  "touchDevice": false,
  "category": "Navigation",
  "duration": 15000 
}
```

## Versioning Strategy

All events include a `version` field (currently `1`). As the payload structure evolves in the future, the version number will increment, allowing downstream data warehouses and machine learning pipelines to gracefully handle schema changes.

## Queue System

Events are temporarily stored in `localStorage` (`analytics_event_queue`) using the `eventQueue.js` utility. This ensures resilience against page reloads or unexpected closures before events are sent to the backend.

## Batch System

Events are processed in batches by `batchTracker.js` to minimize network overhead.
- Configurable via `VITE_ANALYTICS_BATCH_SIZE` and `VITE_ANALYTICS_BATCH_INTERVAL`.
- The `AnalyticsInitializer` handles flushing the batch queue.

## Retry System

Failed network requests are re-queued. Events contain a `retryCount`. If an event fails to send `MAX_RETRIES` (3) times, it is discarded to prevent blocking the queue.

## Deduplication Strategy

Events are deduplicated on the client-side to handle double-clicks, browser retries, or accidental rapid interactions. 
- **ID Generation:** `${sessionId}-${eventType}-${page}-${timestamp}`
- **Buffer:** An in-memory Map stores processed event IDs.
- **TTL:** Entries older than 5 minutes are automatically purged.

---

# Feature Engineering Candidates

The enriched data collected in this phase will directly support the following features for Machine Learning:

* **Average Session Duration**: Total time spent across all page views per session.
* **Pages Visited**: Count of unique pages viewed during a single session.
* **Clicks Per Session**: Interaction density indicating high or low engagement.
* **Course Completion Rate**: Ratio of `video_complete` or `quiz_submit` to `course_open` events.
* **Quiz Completion Rate**: Number of `quiz_submit` vs `quiz_start`.
* **Return Frequency**: Time elapsed between multiple sessions for the same user.
* **Engagement Score**: A weighted metric combining durations, click volume, and course completions.
