import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, MessageCircle, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analytics } from '@/lib/analytics';

interface FloatingActionButtonProps {
  type?: 'scroll-to-top' | 'contact' | 'support';
  className?: string;
  showAfterScroll?: number;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  type = 'scroll-to-top',
  className = "",
  showAfterScroll = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfterScroll) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showAfterScroll]);

  const handleClick = () => {
    switch (type) {
      case 'scroll-to-top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        analytics.track('floatingActionClick', {
          action: 'scrollToTop',
          timestamp: Date.now()
        });
        break;
      case 'contact':
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        analytics.track('floatingActionClick', {
          action: 'contact',
          timestamp: Date.now()
        });
        break;
      case 'support':
        document.getElementById('support')?.scrollIntoView({ behavior: 'smooth' });
        analytics.track('floatingActionClick', {
          action: 'support',
          timestamp: Date.now()
        });
        break;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'scroll-to-top':
        return <ArrowUp className="h-5 w-5" />;
      case 'contact':
        return <Phone className="h-5 w-5" />;
      case 'support':
        return <MessageCircle className="h-5 w-5" />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'scroll-to-top':
        return 'Vissza a tetejére';
      case 'contact':
        return 'Kapcsolat';
      case 'support':
        return 'Támogatás';
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
        "bg-electric-300 hover:bg-electric-400 text-black",
        "transition-all duration-300 transform",
        "hover:scale-110 active:scale-95",
        "shadow-electric-300/25 hover:shadow-electric-300/40",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0",
        className
      )}
      aria-label={getLabel()}
      title={getLabel()}
    >
      {getIcon()}
    </Button>
  );
};

export const FloatingActionGroup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col space-y-3",
        "transition-all duration-300 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      )}
    >
      <FloatingActionButton type="support" className="h-12 w-12" showAfterScroll={0} />
      <FloatingActionButton type="scroll-to-top" className="h-12 w-12" showAfterScroll={0} />
    </div>
  );
};