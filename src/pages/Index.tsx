
import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { DrinkSection } from '@/components/DrinkSection';
import { LinkSection } from '@/components/LinkSection';
import { EarnSection } from '@/components/EarnSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { FOMOSection } from '@/components/FOMOSection';
import { SignupForm } from '@/components/SignupForm';
import { StickyCallToAction } from '@/components/StickyCallToAction';

const Index = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [earnImageIndex, setEarnImageIndex] = useState(0);

  const appImages = [
    "/lovable-uploads/49f35936-0231-47c1-9c05-932a0e8cbf6b.png",
    "/lovable-uploads/ea91230f-2ead-48f2-8c86-e8b0522217a7.png",
    "/lovable-uploads/8776d75d-72ee-4984-8b92-a0dcd00dec82.png",
    "/lovable-uploads/b836712d-530e-4a04-a518-1707ae12f75b.png",
    "/lovable-uploads/fe824679-3c0a-4703-a2c9-524d026bb134.png"
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
    const earnInterval = setInterval(() => {
      setEarnImageIndex((prevIndex) => 
        (prevIndex + 1) % earnImages.length
      );
    }, 4000);

    return () => clearInterval(earnInterval);
  }, [earnImages.length]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <HeroSection currentImageIndex={currentImageIndex} appImages={appImages} />
      <DrinkSection currentImageIndex={currentImageIndex} appImages={appImages} />
      <LinkSection linkImage={linkImage} />
      <EarnSection earnImageIndex={earnImageIndex} earnImages={earnImages} />
      <FeaturesSection />
      <FOMOSection />
      <SignupForm />
      <StickyCallToAction />
    </div>
  );
};

export default Index;
