
import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorks } from '@/components/HowItWorks';
import { DrinkSection } from '@/components/DrinkSection';
import { LinkSection } from '@/components/LinkSection';
import { EarnSection } from '@/components/EarnSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { VenueApplicationSection } from '@/components/VenueApplicationSection';
import { FOMOSection } from '@/components/FOMOSection';
import { SignupForm } from '@/components/SignupForm';
import { StickyCallToAction } from '@/components/StickyCallToAction';
import { CustomerSupport } from '@/components/CustomerSupport';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { AccessibilityEnhancement } from '@/components/AccessibilityEnhancement';
import { useExitIntent } from '@/hooks/useExitIntent';
import { analytics } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';

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

  const drinkImages = [
    "/lovable-uploads/cb1f8184-6bb7-49c6-a584-71e3e7223c07.png",
    "/lovable-uploads/7f0ed43a-5016-4db8-89ae-f51f0c7e6126.png"
  ];

  const linkImage = "/lovable-uploads/d9b38dee-209b-4035-9d5a-5026e973ed21.png";

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
    try {
      analytics.signupSubmit(email);
      analytics.signupSuccess();
      
      toast({
        title: "🎉 Sikeres regisztráció!",
        description: "Köszönjük! Hamarosan jelentkezünk az indulással kapcsolatos részletekkel.",
      });
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "Kérjük, próbálja újra később.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AccessibilityEnhancement />
      
      <div className="min-h-screen bg-black text-white">
        <header>
          <Navigation />
        </header>
        
        <main id="main-content" role="main">
          <HeroSection currentImageIndex={currentImageIndex} appImages={appImages} />
          <HowItWorks />
          <DrinkSection currentImageIndex={drinkImageIndex} drinkImages={drinkImages} />
          <LinkSection linkImage={linkImage} />
          <EarnSection earnImageIndex={earnImageIndex} earnImages={earnImages} />
          <BenefitsSection />
          <VenueApplicationSection />
          <FOMOSection />
          <SignupForm />
        </main>
        
        <footer>
          <CustomerSupport />
        </footer>
        
        <StickyCallToAction />
        
        {/* Exit Intent Popup */}
        {showExitIntent && (
          <ExitIntentPopup 
            onClose={hideExitIntent}
            onSignup={handleExitIntentSignup}
          />
        )}
      </div>
    </>
  );
};

export default Index;
