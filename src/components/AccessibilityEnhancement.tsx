
import React from 'react';

export const AccessibilityEnhancement: React.FC = () => {
  return (
    <>
      {/* Skip Links for keyboard navigation */}
      <div className="sr-only focus-within:not-sr-only">
        <a 
          href="#main-content" 
          className="skip-link focus-ring"
        >
          Ugrás a fő tartalomhoz
        </a>
        <a 
          href="#navigation" 
          className="skip-link focus-ring"
        >
          Ugrás a navigációhoz
        </a>
        <a 
          href="#signup" 
          className="skip-link focus-ring"
        >
          Ugrás a regisztrációhoz
        </a>
      </div>

      {/* Screen reader announcements */}
      <div 
        id="sr-live-region" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      />
      
      <div 
        id="sr-status-region" 
        aria-live="assertive" 
        aria-atomic="true" 
        className="sr-only"
      />
    </>
  );
};
