import { randomUUID } from 'crypto';

export const generateUsers = (count) => {
  return Array.from({ length: count }, (_, i) => `user_${randomUUID()}`);
};

export const generateSessions = (count, users) => {
  const sessions = [];
  for (let i = 0; i < count; i++) {
    sessions.push({
      sessionId: `session_${randomUUID()}`,
      userId: users[Math.floor(Math.random() * users.length)],
      startTime: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000 // Random time in last 30 days
    });
  }
  return sessions;
};

export const generateTimestamps = (startTime, count, intervalMs = 5000) => {
  return Array.from({ length: count }, (_, i) => startTime + i * intervalMs);
};

export const getCommonMetadata = () => {
  return {
    browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
    os: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'][Math.floor(Math.random() * 5)],
    deviceType: Math.random() > 0.3 ? 'desktop' : 'mobile',
    viewportWidth: Math.floor(Math.random() * 1920) + 320,
    viewportHeight: Math.floor(Math.random() * 1080) + 480,
    language: 'en-US',
    timezone: 'America/New_York',
    networkType: ['4g', '3g', 'wifi'][Math.floor(Math.random() * 3)],
    platform: 'Win32',
    colorScheme: Math.random() > 0.5 ? 'dark' : 'light',
    touchDevice: Math.random() > 0.8
  };
};
