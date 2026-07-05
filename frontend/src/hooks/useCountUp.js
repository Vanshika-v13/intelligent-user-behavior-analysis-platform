import { useState, useEffect } from 'react';

/**
 * A custom hook to animate a number counting up from 0 to a target value.
 * @param {string|number} endValue - The final value (can include non-numeric chars like 'K', '%', etc.)
 * @param {number} duration - Total duration of the animation in ms
 * @returns {string} The current animated value
 */
export const useCountUp = (endValue, duration = 800) => {
  const [count, setCount] = useState('0');

  useEffect(() => {
    // Return early if no value or if it's explicitly 0
    if (!endValue || endValue === '0' || endValue === 0) {
      setCount(String(endValue || '0'));
      return;
    }

    // Extract the numeric part and the suffix/prefix
    const stringValue = String(endValue);
    const match = stringValue.match(/^([^\d]*)([\d.,]+)(.*)$/);
    
    if (!match) {
      setCount(stringValue);
      return;
    }

    const prefix = match[1];
    const rawNumberStr = match[2].replace(/,/g, '');
    const suffix = match[3];
    const targetNumber = parseFloat(rawNumberStr);

    if (isNaN(targetNumber)) {
      setCount(stringValue);
      return;
    }

    // Determine decimal places
    const decimalPlaces = rawNumberStr.includes('.') 
      ? rawNumberStr.split('.')[1].length 
      : 0;

    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    // Easing function: easeOutQuart
    const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentNumber = targetNumber * easeOutQuart(progress);

      if (frame >= totalFrames) {
        clearInterval(counter);
        setCount(stringValue); // Ensure exact final string match
      } else {
        // Format with commas and exact decimals
        let formatted = currentNumber.toFixed(decimalPlaces);
        if (stringValue.includes(',')) {
          formatted = parseFloat(formatted).toLocaleString('en-US', {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces
          });
        }
        setCount(prefix + formatted + suffix);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [endValue, duration]);

  return count;
};
