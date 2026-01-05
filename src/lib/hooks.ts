import { useEffect, useRef, useState } from "react";

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

/**
 * Custom hook for countdown timer logic
 * @param targetDate - The target date to count down to
 * @returns Object with days, hours, minutes, seconds remaining
 */
export function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Validate date
    if (!targetDate || isNaN(targetDate.getTime())) {
      console.warn("Invalid target date provided to useCountdown");
      return;
    }

    let timer: NodeJS.Timeout | null = null;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        // Stop timer when countdown reaches zero
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (timer) clearInterval(timer);
      }
    };

    // Initial update
    updateCountdown();

    timer = setInterval(updateCountdown, 1000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [targetDate]);

  return timeLeft;
}

/**
 * Custom hook for scroll-based animation visibility
 * Uses IntersectionObserver to detect when element enters viewport
 * @returns Object with ref to attach to element and isVisible boolean
 */
export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  return { ref, isVisible };
}
