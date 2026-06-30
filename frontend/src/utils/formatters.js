/**
 * Formats a given duration in minutes or hours to a readable string.
 * @param {number|string} duration 
 * @returns {string} Formatted duration
 */
export const formatDuration = (duration) => {
  if (!duration) return '';
  return String(duration);
};

/**
 * Formats numbers into a more readable format, e.g., 1000 to 1k.
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};
