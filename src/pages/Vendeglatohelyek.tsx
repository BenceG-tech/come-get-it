
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { VenueHeroSection } from '@/components/VenueHeroSection';
import { HowItWorksForVenues } from '@/components/HowItWorksForVenues';
import { VenueKeyFeatures } from '@/components/VenueKeyFeatures';
import { VenueStats } from '@/components/VenueStats';
import { VenueApplicationSection } from '@/components/VenueApplicationSection';
import { CustomerSupport } from '@/components/CustomerSupport';

const Vendeglatohelyek = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <MobileNavigation />
      <Navigation />
      <VenueHeroSection />
      <HowItWorksForVenues />
      <VenueKeyFeatures />
      <VenueStats />
      <VenueApplicationSection />
      <CustomerSupport />
    </div>
  );
};

export default Vendeglatohelyek;
