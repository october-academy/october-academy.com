"use client";

import { useEffect, useRef, useState } from "react";
import { useCountdown, useScrollAnimation } from "@/lib/hooks";

// =============================================================================
// SMALL REUSABLE UI COMPONENTS
// =============================================================================

/**
 * Countdown component - Full size countdown timer
 */
export function Countdown({ targetDate }: { targetDate: Date }) {
  const timeLeft = useCountdown(targetDate);

  return (
    <div className="flex gap-3 md:gap-4">
      {[
        { value: timeLeft.days, label: "일" },
        { value: timeLeft.hours, label: "시간" },
        { value: timeLeft.minutes, label: "분" },
        { value: timeLeft.seconds, label: "초" },
      ].map((item, i) => (
        <div
          key={i}
          className="countdown-box px-3 py-2 md:px-4 md:py-3 text-center min-w-[60px] md:min-w-[80px]"
        >
          <div className="font-mono text-2xl md:text-4xl font-bold text-accent countdown-number">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="text-xs md:text-sm text-gray-400">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * CountdownCompact - Compact countdown for sticky CTA
 * Shows urgency color (red) when less than 24 hours remain
 */
export function CountdownCompact({
  targetDate,
  expiredText = "마감됨",
}: {
  targetDate: Date;
  expiredText?: string;
}) {
  const timeLeft = useCountdown(targetDate);

  // 마감된 경우
  if (timeLeft.isExpired) {
    return (
      <span className="font-mono text-red-500 font-bold">{expiredText}</span>
    );
  }

  // 24시간 미만일 때 빨간색으로 변경
  const isUrgent = timeLeft.days === 0;
  const colorClass = isUrgent ? "text-red-500" : "text-accent";

  return (
    <div className={`flex items-center gap-1 font-mono font-bold ${colorClass}`}>
      <span>{String(timeLeft.days).padStart(2, "0")}일</span>
      <span>:</span>
      <span>{String(timeLeft.hours).padStart(2, "0")}시</span>
      <span>:</span>
      <span>{String(timeLeft.minutes).padStart(2, "0")}분</span>
      <span>:</span>
      <span>{String(timeLeft.seconds).padStart(2, "0")}초</span>
    </div>
  );
}

/**
 * Tooltip component - Click/hover tooltip with neo-brutalist design
 */
export function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="tooltip-trigger relative inline-flex items-center gap-1"
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      <svg
        onClick={handleClick}
        className="tooltip-icon"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      <div className={`brutal-tooltip ${isOpen ? "is-open" : ""}`}>
        {content}
      </div>
    </div>
  );
}

/**
 * AnimatedCounter - Number count-up animation
 */
export function AnimatedCounter({
  end,
  duration = 1500,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollAnimation();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    let rafId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(end * eased);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="counter-value">
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/**
 * AnimatedSection - Passthrough wrapper (animations removed)
 */
export function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return className ? <div className={className}>{children}</div> : <>{children}</>;
}

/**
 * ScrollProgress - Top progress bar showing scroll percentage
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="scroll-progress">
      <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}

/**
 * TextLogo - Simple text-based logo for company names
 */
export function TextLogo({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return <span className={`company-text-logo ${className}`}>{name}</span>;
}

/**
 * ImageDialog - Fullscreen image modal with neo-brutalist design
 */
export function ImageDialog({
  src,
  alt,
  isOpen,
  onClose,
}: {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    dialog.addEventListener("keydown", handleKeyDown);
    return () => dialog.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="image-dialog"
      onClick={onClose}
    >
      <div className="image-dialog-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="image-dialog-close"
          onClick={onClose}
          aria-label="닫기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
        {src && <img src={src} alt={alt} className="image-dialog-img" />}
        {alt && <p className="image-dialog-caption">{alt}</p>}
      </div>
    </dialog>
  );
}
