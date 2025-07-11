// Google Analytics 4 Event Tracking
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'engagement',
      ...parameters,
    });
  }
};

// Specific event trackers for our site
export const analytics = {
  // User registration events
  signupFormView: () => trackEvent('signup_form_view'),
  signupSubmit: (email: string) => trackEvent('signup_submit', {
    user_email_domain: email.split('@')[1],
    event_category: 'conversion'
  }),
  signupSuccess: () => trackEvent('signup_success', {
    event_category: 'conversion'
  }),
  
  // Partner interest events
  partnerFormView: () => trackEvent('partner_form_view'),
  partnerSubmit: (type: string) => trackEvent('partner_submit', {
    partner_type: type,
    event_category: 'partner_conversion'
  }),
  
  // Navigation events
  pageView: (pageName: string) => trackEvent('page_view', {
    page_name: pageName,
    event_category: 'navigation'
  }),
  
  // CTA interactions
  ctaClick: (ctaLocation: string, ctaText: string) => trackEvent('cta_click', {
    cta_location: ctaLocation,
    cta_text: ctaText,
    event_category: 'engagement'
  }),
  
  // Exit intent
  exitIntentShow: () => trackEvent('exit_intent_show'),
  exitIntentConvert: () => trackEvent('exit_intent_convert', {
    event_category: 'conversion'
  }),
  
  // Social proof
  socialProofView: (count: number) => trackEvent('social_proof_view', {
    current_count: count
  })
};

export default analytics;