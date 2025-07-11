import React, { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';

export const SocialProof: React.FC = () => {
  const [count, setCount] = useState(0);
  const targetCount = 847; // Will be dynamic later

  useEffect(() => {
    // Animated counter effect
    const duration = 2000;
    const steps = 60;
    const stepValue = targetCount / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setCount(Math.floor(stepValue * currentStep));
      
      if (currentStep >= steps) {
        setCount(targetCount);
        clearInterval(timer);
        // Track when animation completes
        analytics.socialProofView(targetCount);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetCount]);

  return (
    <div className="flex flex-col items-center justify-center text-center mb-8">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex -space-x-2">
          {/* User avatars placeholder */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-300/30 to-ocean-600/30 border-2 border-electric-300/50"></div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean-400/30 to-electric-500/30 border-2 border-ocean-400/50"></div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-500/30 to-ocean-300/30 border-2 border-electric-500/50"></div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean-600/30 to-electric-400/30 border-2 border-ocean-600/50 flex items-center justify-center">
            <span className="text-xs text-white font-semibold">+</span>
          </div>
        </div>
        
        <span className="text-lg md:text-xl font-bold text-electric-300 tabular-nums">
          {count.toLocaleString('hu-HU')}+
        </span>
      </div>
      
      <p className="text-sm text-electric-100">
        korai felhasználó várja az indulást
      </p>
    </div>
  );
};