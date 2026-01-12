import React, { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import { useI18n } from '@/hooks/useI18n';

export const SocialProof: React.FC = () => {
  const [count, setCount] = useState(0);
  const targetCount = 847; // Will be dynamic later
  const { t } = useI18n();

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
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nf-primary/30 to-nf-secondary/30 border-2 border-nf-primary/50"></div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nf-secondary/30 to-nf-primary/30 border-2 border-nf-secondary/50"></div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nf-primary/30 to-nf-secondary/30 border-2 border-nf-primary/50"></div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nf-secondary/30 to-nf-primary/30 border-2 border-nf-secondary/50 flex items-center justify-center">
            <span className="text-xs text-white font-semibold">+</span>
          </div>
        </div>
        
        <span className="text-lg md:text-xl font-bold text-nf-primary tabular-nums">
          {count.toLocaleString('hu-HU')}+
        </span>
      </div>
      
      <p className="text-sm text-nf-text-muted">
        {t('social.early_users_waiting')}
      </p>
    </div>
  );
};
