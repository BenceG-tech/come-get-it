import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { MibenSegitSection } from '@/components/MibenSegitSection';
import { PricingSection } from '@/components/PricingSection';
import { VenuePartnerTeaser } from '@/components/VenuePartnerTeaser';
import { ScrollStory } from '@/components/ScrollStory';
import { DrinkSection } from '@/components/DrinkSection';
import { LinkSection } from '@/components/LinkSection';
import { EarnSection } from '@/components/EarnSection';
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
import consumerList from '@/assets/app-screens-v2/consumer/consumer-list.webp.asset.json';
import venueDetail from '@/assets/app-screens-v2/consumer/venue-detail.webp.asset.json';
import venueOffer from '@/assets/app-screens-v2/consumer/venue-offer.webp.asset.json';
import redeemArrival from '@/assets/app-screens-v2/consumer/redeem-arrival.webp.asset.json';
import redeemShow from '@/assets/app-screens-v2/consumer/redeem-show.webp.asset.json';
import redeemConfirm from '@/assets/app-screens-v2/consumer/redeem-confirm.webp.asset.json';
import rewardsList from '@/assets/app-screens-v2/rewards/rewards-list.webp.asset.json';
import rewardDetail from '@/assets/app-screens-v2/rewards/reward-detail.webp.asset.json';
import rewardsExperiences from '@/assets/app-screens-v2/rewards/rewards-experiences.webp.asset.json';
// QuickAccessChips removed from homepage — partner-link cards moved to /partnerek hub
 
const Index = () => {
  const [drinkImageIndex, setDrinkImageIndex] = useState(0);
  const [earnImageIndex, setEarnImageIndex] = useState(0);
  const { showExitIntent, hideExitIntent } = useExitIntent();
  const { toast } = useToast();

  // Track page view
  useEffect(() => {
    analytics.pageView('index');
  }, []);

  const drinkImages = [consumerList.url, venueDetail.url, venueOffer.url];
  const linkImages = [redeemArrival.url, redeemShow.url, redeemConfirm.url];
  const earnImages = [rewardsList.url, rewardDetail.url, rewardsExperiences.url];

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
      <SEO
        title="Come Get It — Találd meg, hova menj ma Budapesten"
        description="Ingyenes béta: találd meg a budapesti partnerhelyeket, válts be épp elérhető ingyen italokat, gyűjts pontokat és igényelj jutalmakat. Előfizetés nincs."
        canonical="/"
      />
      <Navigation />
      <main>
       <HeroSection />
       <ScrollStory />
      <MibenSegitSection />
      {/* QuickAccessChips eltávolítva — a 4 partner-link a /partnerek hub-on érhető el */}
      <DrinkSection currentImageIndex={drinkImageIndex} drinkImages={drinkImages} />
       <LinkSection linkImage={linkImages} />
      <EarnSection earnImageIndex={earnImageIndex} earnImages={earnImages} />
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
