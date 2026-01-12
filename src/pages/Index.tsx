import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorks } from '@/components/HowItWorks';
import { DrinkSection } from '@/components/DrinkSection';
import { LinkSection } from '@/components/LinkSection';
import { EarnSection } from '@/components/EarnSection';
import { GiveSection } from '@/components/GiveSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { VenueApplicationSection } from '@/components/VenueApplicationSection';
import { FOMOSection } from '@/components/FOMOSection';
import { SignupForm } from '@/components/SignupForm';
import { StickyCallToAction } from '@/components/StickyCallToAction';
import { CustomerSupport } from '@/components/CustomerSupport';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { useExitIntent } from '@/hooks/useExitIntent';
import { analytics } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';
import { getSupabaseClient } from '@/lib/supabase';
import { QuickAccessChips } from '@/components/QuickAccessChips';
 
const Index = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [drinkImageIndex, setDrinkImageIndex] = useState(0);
  const [earnImageIndex, setEarnImageIndex] = useState(0);
  const { showExitIntent, hideExitIntent } = useExitIntent();
  const { toast } = useToast();

  // Track page view
  useEffect(() => {
    analytics.pageView('index');
  }, []);

  const appImages = [
    "/lovable-uploads/1d253158-a9a3-4377-bfe6-480c7551ca4b.png",
    "/lovable-uploads/15d3c320-446b-4d7c-87b4-8a214e9d2546.png"
  ];

  // Drink section uses these two images alternating
  const drinkImages = [
    "/lovable-uploads/cb1f8184-6bb7-49c6-a584-71e3e7223c07.png",
    "/lovable-uploads/7f0ed43a-5016-4db8-89ae-f51f0c7e6126.png"
  ];

  // Link section uses specific image
  const linkImage = "/lovable-uploads/d9b38dee-209b-4035-9d5a-5026e973ed21.png";

  // Earn section uses these two images alternating
  const earnImages = [
    "/lovable-uploads/979f31e4-e452-4696-b8ae-b6de91420066.png",
    "/lovable-uploads/574c49aa-62ba-49c3-9425-e564722b764e.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % appImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [appImages.length]);

  useEffect(() => {
    const drinkInterval = setInterval(() => {
      setDrinkImageIndex((prevIndex) => 
        (prevIndex + 1) % drinkImages.length
      );
    }, 4000);

    return () => clearInterval(drinkInterval);
  }, [drinkImages.length]);

  useEffect(() => {
    const earnInterval = setInterval(() => {
      setEarnImageIndex((prevIndex) => 
        (prevIndex + 1) % earnImages.length
      );
    }, 4000);

    return () => clearInterval(earnInterval);
  }, [earnImages.length]);

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
      <Navigation />
      <HeroSection currentImageIndex={currentImageIndex} appImages={appImages} />
      <QuickAccessChips />
      <HowItWorks />
      <DrinkSection currentImageIndex={drinkImageIndex} drinkImages={drinkImages} />
      <LinkSection linkImage={linkImage} />
      <EarnSection earnImageIndex={earnImageIndex} earnImages={earnImages} />
      <GiveSection />
      <BenefitsSection />
      <VenueApplicationSection />
      <FOMOSection />
      <SignupForm />
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
