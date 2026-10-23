import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  durationMs?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
  distancePx?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delayMs = 0,
  durationMs = 700,
  direction = 'up',
  threshold = 0.12,
  distancePx = 24,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect OS reduced motion preference (Modern Web Guidance rule)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const currentRef = domRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  const getInitialTransform = () => {
    if (direction === 'up') return `translate3d(0, ${distancePx}px, 0)`;
    if (direction === 'down') return `translate3d(0, -${distancePx}px, 0)`;
    if (direction === 'left') return `translate3d(${distancePx}px, 0, 0)`;
    if (direction === 'right') return `translate3d(-${distancePx}px, 0, 0)`;
    return 'none';
  };

  return (
    <div
      ref={domRef}
      className={`will-change-[transform,opacity] ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : getInitialTransform(),
        transition: `opacity ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
};
