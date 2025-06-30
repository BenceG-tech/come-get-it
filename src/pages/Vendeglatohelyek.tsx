
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { WorkWithUsSection } from '@/components/WorkWithUsSection';
import { VenueApplicationSection } from '@/components/VenueApplicationSection';
import { CustomerSupport } from '@/components/CustomerSupport';

const Vendeglatohelyek = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <MobileNavigation />
      <Navigation />
      <WorkWithUsSection />
      <VenueApplicationSection />
      <CustomerSupport />
    </div>
  );
};

export default Vendeglatohelyek;
