
import React, { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { VenueHeroSection } from '@/components/VenueHeroSection';
import { HowItWorksForVenues } from '@/components/HowItWorksForVenues';
import { VenueWhyWorth } from '@/components/VenueWhyWorth';
import { FoundingPartnerPerks } from '@/components/FoundingPartnerPerks';
import { VenueROI } from '@/components/VenueROI';
import { VenueStats } from '@/components/VenueStats';
import { VenueApplicationSection } from '@/components/VenueApplicationSection';
import { CustomerSupport } from '@/components/CustomerSupport';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { analytics } from '@/lib/analytics';

const Vendeglatohelyek = () => {
  // Analytics tracking
  useEffect(() => {
    analytics.venuePageView();
    analytics.pageView('vendeglatohelyek');
    
    const startTime = Date.now();
    let maxScrollDepth = 0;
    
    const handleScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        if (scrollPercent >= 25 && scrollPercent < 50) {
          analytics.scrollDepth(25, 'vendeglatohelyek');
        } else if (scrollPercent >= 50 && scrollPercent < 75) {
          analytics.scrollDepth(50, 'vendeglatohelyek');
        } else if (scrollPercent >= 75) {
          analytics.scrollDepth(75, 'vendeglatohelyek');
        }
      }
    };

    // Track section views
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || entry.target.className;
          analytics.sectionView(sectionId, 'vendeglatohelyek');
          analytics.venueFeatureView(sectionId);
        }
      });
    }, { threshold: 0.5 });

    // Observe all major sections
    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      
      const duration = Math.round((Date.now() - startTime) / 1000);
      analytics.timeOnPage(duration, 'vendeglatohelyek');
      
      // Lead engagement scoring for venues
      if (duration > 90 || maxScrollDepth > 60) {
        analytics.leadEngagement('high', 'vendeglatohelyek');
        analytics.leadQualification(90, 'venue_prospect');
      } else if (duration > 45 || maxScrollDepth > 35) {
        analytics.leadEngagement('medium', 'vendeglatohelyek');
        analytics.leadQualification(70, 'venue_prospect');
      } else {
        analytics.leadEngagement('low', 'vendeglatohelyek');
        analytics.leadQualification(40, 'venue_prospect');
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Vendéglátóhelyeknek — Founding Partner Program | Come Get It"
        description="Csatlakozz az első 15 budapesti partnerhelyhez. 6 hónap jutalékmentes, 100+ új vendég havonta a holtidőkben."
        canonical="/vendeglatohelyek"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Főoldal', item: 'https://come-get-it.app/' },
            { '@type': 'ListItem', position: 2, name: 'Vendéglátóhelyeknek', item: 'https://come-get-it.app/vendeglatohelyek' },
          ],
        }}
      />
      <MobileNavigation />
      <Navigation />
      <main>
        <VenueHeroSection />
        <VenueWhyWorth />
        <FoundingPartnerPerks />
        <VenueROI />
        <VenueStats />
        <HowItWorksForVenues />
        <VenueApplicationSection />
      </main>
      <CustomerSupport />
      <Footer />
    </div>
  );
};

export default Vendeglatohelyek;
