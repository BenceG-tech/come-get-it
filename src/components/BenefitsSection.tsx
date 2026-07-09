import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { analytics } from '@/lib/analytics';

export const BenefitsSection: React.FC = () => {
  return (
    <section className="py-14 px-4 bg-nf-background nf-section-glow">
      <div className="max-w-4xl mx-auto text-center">
        <Link
          to="/partnerek"
          onClick={() => analytics.ctaClick('home_partners_link', 'Partnerek')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-nf-primary/40 bg-white/[0.03] backdrop-blur-md text-sm md:text-base text-white/85 hover:border-nf-primary/70 hover:text-white hover:shadow-[0_10px_40px_-10px_rgba(0,188,212,0.45)] transition-all duration-500"
        >
          <span>
            Partnerhely, italmárka vagy rewards-partner vagy? <span className="text-nf-primary font-semibold">Partnereknek</span>
          </span>
          <ArrowRight className="w-4 h-4 text-nf-primary" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
};
