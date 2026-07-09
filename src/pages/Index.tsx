import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { MibenSegitSection } from '@/components/MibenSegitSection';
import { PricingSection } from '@/components/PricingSection';
import { VenuePartnerTeaser } from '@/components/VenuePartnerTeaser';
import { HowItWorks } from '@/components/HowItWorks';
import { GiveSection } from '@/components/GiveSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { VenueApplicationSection } from '@/components/VenueApplicationSection';
// FOMOSection removed — duplicated SignupForm CTA
import { SignupForm } from '@/components/SignupForm';
import { StickyCallToAction } from '@/components/StickyCallToAction';
import { CustomerSupport } from '@/components/CustomerSupport';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useExitIntent } from '@/hooks/useExitIntent';
import { analytics } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';
import { getSupabaseClient } from '@/lib/supabase';
import heroListAsset from '@/assets/app-hero-list.png.asset.json';
import heroDetailAsset from '@/assets/app-hero-detail.png.asset.json';
// QuickAccessChips removed from homepage — partner-link cards moved to /partnerek hub
 
const Index = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { showExitIntent, hideExitIntent } = useExitIntent();
  const { toast } = useToast();

  // Track page view
  useEffect(() => {
    analytics.pageView('index');
  }, []);

  const appImages = [
    heroListAsset.url,
    heroDetailAsset.url
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % appImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [appImages.length]);


  const handleExitIntentSignup = async (email: string) => {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      toast({
        title: "Hiba történt",
        description: "Kérjük, próbáld újra később.",
        variant: "destructive",
      });
      return;
    }

    // Build source context
    const params = new URLSearchParams(window.location.search);
    const utmPairs = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content']
      .map((k) => (params.get(k) ? `${k}=${params.get(k)}` : ''))
      .filter(Boolean)
      .join('&');
    const ref = document.referrer ? `ref=${encodeURIComponent(document.referrer)}` : '';
    const path = `path=${encodeURIComponent(window.location.pathname)}`;
    const source = ['exit_intent_popup', utmPairs && `utm:${utmPairs}`, ref, path]
      .filter(Boolean)
      .join(' | ');

    try {
      const { error: submitError } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'user_signup',
          data: {
            email,
            source: source
          }
        }
      });

      if (submitError) {
        console.error('Error submitting exit intent signup:', submitError);
        toast({
          title: "Hiba történt",
          description: "Kérjük, próbáld újra később.",
          variant: "destructive",
        });
        return;
      }

      analytics.signupSubmit(email);
      analytics.signupSuccess();

      toast({
        title: "🎉 Sikeres regisztráció!",
        description: "Köszönjük! Hamarosan jelentkezünk az indulással kapcsolatos részletekkel.",
      });
    } catch (error) {
      console.error('Error in exit intent signup:', error);
      toast({
        title: "Hiba történt",
        description: "Kérjük, próbálja újra később.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Come Get It — Találd meg, hova menj ma Budapesten"
        description="Napi egy ingyen ital Budapest jó helyein. Válassz helyet, menj el, az első ital a miénk — és minden beváltás egy nap tiszta ivóvizet ad valakinek. Szeptemberben indulunk."
        canonical="/"
      />
      <Navigation />
      <main>
      <HeroSection currentImageIndex={currentImageIndex} appImages={appImages} />
      <MibenSegitSection />
      <HowItWorks />
      <GiveSection />
      <PricingSection />
      <VenuePartnerTeaser />
      <BenefitsSection />
      <VenueApplicationSection />
      {/* FOMOSection eltávolítva — a SignupForm már lefedi az alapító tag CTA-t */}
      <SignupForm />
      </main>
      <Footer />
      <StickyCallToAction />
      <CustomerSupport />
      
      {/* Exit Intent Popup */}
      {showExitIntent && (
        <ExitIntentPopup 
          onClose={hideExitIntent}
          onSignup={handleExitIntentSignup}
        />
      )}
    </div>
  );
};

export default Index;
