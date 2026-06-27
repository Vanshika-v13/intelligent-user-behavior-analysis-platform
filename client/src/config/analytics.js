export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS !== 'false';
export const ENABLE_ANALYTICS_DEBUG = import.meta.env.VITE_ENABLE_ANALYTICS_DEBUG === 'true';
export const ANALYTICS_BATCH_SIZE = parseInt(import.meta.env.VITE_ANALYTICS_BATCH_SIZE || '5', 10);
export const ANALYTICS_BATCH_INTERVAL = parseInt(import.meta.env.VITE_ANALYTICS_BATCH_INTERVAL || '10000', 10);
