
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDragGesture } from '@/hooks/useDragGesture';

interface TouchCarouselProps {
  images: string[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  slideTransition?: 'fade' | 'slide';
  onImageChange?: (index: number) => void;
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
}

const TouchCarousel = ({ 
  images, 
  autoPlay = true, 
  autoPlayInterval = 4000,
  showIndicators = true,
  slideTransition = 'slide', // Changed default to 'slide'
  onImageChange,
  currentIndex: externalCurrentIndex,
  onIndexChange
}: TouchCarouselProps) => {
  const [internalCurrentIndex, setInternalCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  // Use external index if provided, otherwise use internal
  const currentIndex = externalCurrentIndex !== undefined ? externalCurrentIndex : internalCurrentIndex;
  const setCurrentIndex = externalCurrentIndex !== undefined ? onIndexChange || (() => {}) : setInternalCurrentIndex;

  const containerWidth = containerRef.current?.offsetWidth || 0;

  const goToSlide = useCallback((index: number, smooth = true) => {
    if (isTransitioning || index === currentIndex) return;
    
    if (smooth) {
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 300);
    }
    
    setCurrentIndex(index);
  }, [currentIndex, isTransitioning, setCurrentIndex]);

  const goToNext = useCallback(() => {
    goToSlide((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, goToSlide]);

  const goToPrev = useCallback(() => {
    goToSlide((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, goToSlide]);

  // Clear auto play during drag
  const clearAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = undefined;
    }
  }, []);

  // Restart auto play after drag
  const restartAutoPlay = useCallback(() => {
    if (!autoPlay) return;
    clearAutoPlay();
    autoPlayRef.current = setInterval(goToNext, autoPlayInterval);
  }, [autoPlay, autoPlayInterval, goToNext, clearAutoPlay]);

  // Drag gesture handlers
  const { touchHandlers, mouseHandlers } = useDragGesture({
    onDragStart: () => {
      setIsDragging(true);
      clearAutoPlay();
    },
    onDragMove: (deltaX, velocity) => {
      if (slideTransition === 'slide') {
        setDragOffset(deltaX);
      }
    },
    onDragEnd: (deltaX, velocity) => {
      setIsDragging(false);
      setDragOffset(0);
      
      const threshold = containerWidth * 0.25; // 25% of container width
      const velocityThreshold = 0.5;
      
      if (Math.abs(deltaX) > threshold || Math.abs(velocity) > velocityThreshold) {
        if (deltaX > 0 || velocity > velocityThreshold) {
          goToPrev();
        } else if (deltaX < 0 || velocity < -velocityThreshold) {
          goToNext();
        }
      }
      
      // Restart autoplay after a delay
      setTimeout(restartAutoPlay, 1000);
    },
    threshold: 5
  });

  // Auto play effect
  useEffect(() => {
    if (!autoPlay || isDragging) return;
    restartAutoPlay();
    return clearAutoPlay;
  }, [autoPlay, isDragging, restartAutoPlay, clearAutoPlay]);

  // Notify parent of image changes
  useEffect(() => {
    onImageChange?.(currentIndex);
  }, [currentIndex, onImageChange]);

  // Calculate transform for real-time drag
  const getTransform = () => {
    if (slideTransition !== 'slide') return {};
    
    const baseTransform = -currentIndex * 100;
    const dragTransform = isDragging ? (dragOffset / containerWidth) * 100 : 0;
    
    return {
      transform: `translateX(${baseTransform + dragTransform}%)`,
      transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    };
  };

  return (
    <div className="relative w-full h-full select-none">
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        {...touchHandlers}
        {...mouseHandlers}
        style={{ touchAction: 'pan-y pinch-zoom' }}
      >
        {slideTransition === 'slide' ? (
          <div 
            className="flex w-full h-full will-change-transform"
            style={getTransform()}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                <img 
                  src={image}
                  alt={`Slide ${index + 1}`} 
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        ) : (
          images.map((image, index) => (
            <img 
              key={index}
              src={image}
              alt={`Slide ${index + 1}`} 
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
              draggable={false}
            />
          ))
        )}
      </div>

      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50 scale-125' 
                  : 'bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TouchCarousel;
