
import React from 'react';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';

export const FOMOSection: React.FC = () => (
  <section className="py-24 px-4 bg-black">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
        Legyél alapító tag
      </h2>
      <p className="text-xl text-white mb-8">
        Az első 1000 bennfentes külön badge‑et, extra jutalmakat és életre szóló bragging right‑ot kap.
      </p>
      <p className="text-lg text-white mb-12">
        Budapest éjszakája most íródik — velünk.
      </p>
      
      <div className="flex justify-center">
        <Button 
          size="lg" 
          className="brand-gradient-cta hover:shadow-2xl text-white font-semibold py-4 px-12 text-lg rounded-full transition-all duration-300 neon-glow-brand border-0"
          onClick={() => {
            analytics.ctaClick('fomo_section', 'Jövök a körre');
            document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Jövök a körre
        </Button>
      </div>
    </div>
  </section>
);
