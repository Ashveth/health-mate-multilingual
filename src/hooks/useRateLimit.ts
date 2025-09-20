import { useState, useRef } from 'react';

interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

export function useRateLimit(options: RateLimitOptions) {
  const { maxAttempts, windowMs, blockDurationMs = windowMs } = options;
  const [isBlocked, setIsBlocked] = useState(false);
  const attemptsRef = useRef<number[]>([]);
  const blockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkRateLimit = (): boolean => {
    if (isBlocked) {
      return false;
    }

    const now = Date.now();
    
    // Remove attempts outside the current window
    attemptsRef.current = attemptsRef.current.filter(
      time => now - time < windowMs
    );

    // Check if we've exceeded the limit
    if (attemptsRef.current.length >= maxAttempts) {
      setIsBlocked(true);
      
      // Clear any existing timeout
      if (blockTimeoutRef.current) {
        clearTimeout(blockTimeoutRef.current);
      }
      
      // Set unblock timer
      blockTimeoutRef.current = setTimeout(() => {
        setIsBlocked(false);
        attemptsRef.current = [];
      }, blockDurationMs);
      
      return false;
    }

    // Add this attempt to the list
    attemptsRef.current.push(now);
    return true;
  };

  const getRemainingAttempts = (): number => {
    if (isBlocked) return 0;
    return Math.max(0, maxAttempts - attemptsRef.current.length);
  };

  return {
    checkRateLimit,
    isBlocked,
    remainingAttempts: getRemainingAttempts(),
  };
}