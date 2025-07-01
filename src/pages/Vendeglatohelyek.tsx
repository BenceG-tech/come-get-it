
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { WorkWithUsSection } from '@/components/WorkWithUsSection';
import { HowItWorksForVenues } from '@/components/HowItWorksForVenues';
import { VenueApplicationSection } from '@/components/VenueApplicationSection';
import { CustomerSupport } from '@/components/CustomerSupport';

const Vendeglatohelyek = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <MobileNavigation />
      <Navigation />
      
      {/* Hero Section with unified styling */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Unified background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-ocean-800"></div>
        
        {/* Unified glow layers */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unified-glow-primary opacity-40 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-unified-glow-secondary opacity-25 blur-[80px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Main Title - Anton font with unified sizing */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-anton leading-[0.9] tracking-tight">
              <span className="block text-white mb-2">LOJALITÁS,</span>
              <span className="block text-electric-300">AHOGY KELLENE</span>
            </h1>
            
            {/* Subtitle */}
            <div className="max-w-2xl mx-auto">
              <p className="text-base md:text-lg text-electric-100 font-medium leading-tight">
                Növeld vendégforgalmad, szerezz új törzsvendégeket, és élvezd a digitális lojalitás előnyeit – mindent egy helyen, egyszerűen, papír és plasztikkártyák nélkül.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <WorkWithUsSection />
      <HowItWorksForVenues />
      <VenueApplicationSection />
      <CustomerSupport />
    </div>
  );
};

export default Vendeglatohelyek;
