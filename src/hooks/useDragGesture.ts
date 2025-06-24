import { useRef, useCallback, useState } from 'react';

interface DragState {
  isDragging: boolean;
  startX: number;
  currentX: number;
  deltaX: number;
  velocity: number;
}

interface UseDragGestureOptions {
  onDragStart?: () => void;
  onDragMove?: (deltaX: number, velocity: number) => void;
  onDragEnd?: (deltaX: number, velocity: number) => void;
  threshold?: number;
}

export const useDragGesture = ({
  onDragStart,
  onDragMove,
  onDragEnd,
  threshold = 10
}: UseDragGestureOptions = {}) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    currentX: 0,
    deltaX: 0,
    velocity: 0
  });

  const lastMoveTime = useRef<number>(0);
  const velocityTracker = useRef<number[]>([]);

  const calculateVelocity = (deltaX: number, deltaTime: number): number => {
    const velocity = deltaTime > 0 ? deltaX / deltaTime : 0;
    velocityTracker.current.push(velocity);
    
    // Keep only last 3 velocity samples for smoothing
    if (velocityTracker.current.length > 3) {
      velocityTracker.current.shift();
    }
    
    // Return average velocity
    return velocityTracker.current.reduce((a, b) => a + b, 0) / velocityTracker.current.length;
  };

  const handleStart = useCallback((clientX: number) => {
    const now = Date.now();
    lastMoveTime.current = now;
    velocityTracker.current = [];
    
    setDragState({
      isDragging: true,
      startX: clientX,
      currentX: clientX,
      deltaX: 0,
      velocity: 0
    });
    
    onDragStart?.();
  }, [onDragStart]);

  const handleMove = useCallback((clientX: number) => {
    if (!dragState.isDragging) return;
    
    const now = Date.now();
    const deltaTime = now - lastMoveTime.current;
    const deltaX = clientX - dragState.startX;
    const velocity = calculateVelocity(deltaX - dragState.deltaX, deltaTime);
    
    lastMoveTime.current = now;
    
    setDragState(prev => ({
      ...prev,
      currentX: clientX,
      deltaX,
      velocity
    }));
    
    if (Math.abs(deltaX) > threshold) {
      onDragMove?.(deltaX, velocity);
    }
  }, [dragState.isDragging, dragState.startX, dragState.deltaX, onDragMove, threshold]);

  const handleEnd = useCallback(() => {
    if (!dragState.isDragging) return;
    
    onDragEnd?.(dragState.deltaX, dragState.velocity);
    
    setDragState(prev => ({
      ...prev,
      isDragging: false
    }));
  }, [dragState.isDragging, dragState.deltaX, dragState.velocity, onDragEnd]);

  // Touch handlers
  const touchHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      handleStart(e.touches[0].clientX);
    },
    onTouchMove: (e: React.TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault();
      handleEnd();
    }
  };

  // Mouse handlers
  const mouseHandlers = {
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientX);
    },
    onMouseMove: (e: React.MouseEvent) => {
      if (dragState.isDragging) {
        e.preventDefault();
        handleMove(e.clientX);
      }
    },
    onMouseUp: (e: React.MouseEvent) => {
      if (dragState.isDragging) {
        e.preventDefault();
        handleEnd();
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      if (dragState.isDragging) {
        e.preventDefault();
        handleEnd();
      }
    }
  };

  return {
    dragState,
    touchHandlers,
    mouseHandlers,
    isDragging: dragState.isDragging,
    dragOffset: dragState.deltaX
  };
};
