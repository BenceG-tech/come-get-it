
import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import FOMOSection from '@/components/FOMOSection';
import SignupSection from '@/components/SignupSection';
import StickyCTA from '@/components/StickyCTA';

const Index = () => {
  const handleSignupClick = () => {
    document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection onSignupClick={handleSignupClick} />
      <FeaturesSection />
      <FOMOSection onSignupClick={handleSignupClick} />
      <SignupSection />
      <StickyCTA onSignupClick={handleSignupClick} />
    </div>
  );
};

export default Index;
