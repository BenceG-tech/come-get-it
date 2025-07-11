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
  // Generic track method
  track: (eventName: string, properties: Record<string, any>) => trackEvent(eventName, properties),
  
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
  }),

  // Accelerator program events
  acceleratorPageView: () => trackEvent('accelerator_page_view', {
    event_category: 'engagement'
  }),
  acceleratorPackageView: (packageType: string) => trackEvent('accelerator_package_view', {
    package_type: packageType,
    event_category: 'engagement'
  }),
  acceleratorApplicationStart: () => trackEvent('accelerator_application_start', {
    event_category: 'conversion'
  }),
  acceleratorApplicationSubmit: (packageType: string) => trackEvent('accelerator_application_submit', {
    package_type: packageType,
    event_category: 'conversion'
  }),

  // Venue events
  venuePageView: () => trackEvent('venue_page_view', {
    event_category: 'engagement'
  }),
  venueFeatureView: (featureName: string) => trackEvent('venue_feature_view', {
    feature_name: featureName,
    event_category: 'engagement'
  }),
  venueApplicationStart: () => trackEvent('venue_application_start', {
    event_category: 'conversion'
  }),
  venueApplicationSubmit: (venueType: string) => trackEvent('venue_application_submit', {
    venue_type: venueType,
    event_category: 'conversion'
  }),

  // Rewards partner events
  rewardsPageView: () => trackEvent('rewards_page_view', {
    event_category: 'engagement'
  }),
  rewardsFeatureView: (featureName: string) => trackEvent('rewards_feature_view', {
    feature_name: featureName,
    event_category: 'engagement'
  }),
  rewardsPartnerApplicationStart: () => trackEvent('rewards_partner_application_start', {
    event_category: 'conversion'
  }),
  rewardsPartnerApplicationSubmit: (businessType: string) => trackEvent('rewards_partner_application_submit', {
    business_type: businessType,
    event_category: 'conversion'
  }),

  // Enhanced engagement tracking
  sectionView: (sectionName: string, pageName: string) => trackEvent('section_view', {
    section_name: sectionName,
    page_name: pageName,
    event_category: 'engagement'
  }),
  timeOnPage: (duration: number, pageName: string) => trackEvent('time_on_page', {
    duration_seconds: duration,
    page_name: pageName,
    event_category: 'engagement'
  }),
  scrollDepth: (percentage: number, pageName: string) => trackEvent('scroll_depth', {
    scroll_percentage: percentage,
    page_name: pageName,
    event_category: 'engagement'
  }),

  // Lead scoring events
  leadEngagement: (engagementLevel: 'low' | 'medium' | 'high', pageName: string) => trackEvent('lead_engagement', {
    engagement_level: engagementLevel,
    page_name: pageName,
    event_category: 'lead_scoring'
  }),
  leadQualification: (qualificationScore: number, leadType: string) => trackEvent('lead_qualification', {
    qualification_score: qualificationScore,
    lead_type: leadType,
    event_category: 'lead_scoring'
  })
};

export default analytics;