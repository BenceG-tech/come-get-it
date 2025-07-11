import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  className = ""
}) => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diffX = currentX - startX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && onSwipeRight) {
        onSwipeRight();
        // Haptic feedback for action
        if (navigator.vibrate) {
          navigator.vibrate([10, 50, 10]);
        }
      } else if (diffX < 0 && onSwipeLeft) {
        onSwipeLeft();
        // Haptic feedback for action
        if (navigator.vibrate) {
          navigator.vibrate([10, 50, 10]);
        }
      }
    }

    setIsDragging(false);
    setCurrentX(0);
    setStartX(0);
  };

  const translateX = isDragging ? currentX - startX : 0;

  return (
    <div
      className={cn(
        "transition-transform duration-200 ease-out",
        className
      )}
      style={{
        transform: `translateX(${translateX}px)`,
        opacity: isDragging ? 0.8 : 1
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};

export const TouchFeedbackButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  vibration?: number | number[];
}> = ({ 
  children, 
  onClick, 
  className = "",
  vibration = 10
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    setIsPressed(true);
    if (navigator.vibrate) {
      navigator.vibrate(vibration);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (onClick) onClick();
  };

  return (
    <button
      className={cn(
        "transition-all duration-150 ease-out",
        "transform active:scale-95",
        isPressed && "scale-95 brightness-90",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
    </button>
  );
};

export const MobileOptimizedLoading: React.FC<{ className?: string }> = ({ 
  className = "" 
}) => (
  <div className={cn("flex flex-col items-center justify-center p-8", className)}>
    <div className="relative">
      <div className="h-12 w-12 border-4 border-electric-300/30 rounded-full animate-spin">
        <div className="absolute top-0 left-0 h-12 w-12 border-4 border-transparent border-t-electric-300 rounded-full animate-spin"></div>
      </div>
    </div>
    <p className="mt-4 text-muted-foreground text-center">
      Betöltés...
    </p>
  </div>
);

export const PullToRefresh: React.FC<{
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}> = ({ onRefresh, children, className = "" }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && startY > 0) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, (currentY - startY) * 0.5);
      setPullDistance(Math.min(distance, 100));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 50 && !isRefreshing) {
      setIsRefreshing(true);
      if (navigator.vibrate) {
        navigator.vibrate([10, 100, 10]);
      }
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    setStartY(0);
  };

  return (
    <div
      className={cn("relative", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(pullDistance > 0 || isRefreshing) && (
        <div 
          className="flex items-center justify-center py-4 bg-electric-300/10 border-b border-electric-300/20"
          style={{ height: `${pullDistance}px` }}
        >
          {isRefreshing ? (
            <div className="h-6 w-6 border-2 border-electric-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="text-electric-300 text-sm">
              {pullDistance > 50 ? 'Elengedés a frissítéshez' : 'Húzd le a frissítéshez'}
            </div>
          )}
        </div>
      )}
      <div style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  );
};