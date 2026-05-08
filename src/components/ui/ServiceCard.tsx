import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
  badge?: string;
  deliverables?: string[];
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
  index = 0,
  badge,
  deliverables,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      className={cn(
        'group relative rounded-2xl overflow-hidden border border-white/10 hover:border-nf-primary/60 shadow-elegant hover:shadow-azure transition-all duration-500 min-h-[280px] flex',
        className
      )}
    >
      {/* Background base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-nf-surface via-nf-surface-alt to-black" />

      {/* Slow zooming radial color layer (replaces image) */}
      <div
        className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 20%, hsl(187 100% 42% / 0.22), transparent 60%), radial-gradient(circle at 80% 90%, hsl(205 68% 29% / 0.25), transparent 55%)',
        }}
      />

      {/* Dark gradient overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10 group-hover:from-black/98 group-hover:via-black/85 group-hover:to-black/40 transition-all duration-500" />

      {/* Top-left badge */}
      {badge && (
        <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md border border-nf-primary/30 rounded-full px-3 py-1 text-xs font-bold text-nf-primary tracking-wider">
          {badge}
        </div>
      )}

      {/* Top-right floating icon */}
      <div className="absolute top-4 right-4 z-10 h-11 w-11 rounded-full bg-nf-primary/95 backdrop-blur-sm shadow-azure flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
        <Icon className="w-5 h-5 text-black" strokeWidth={2.5} />
      </div>

      {/* Bottom content */}
      <div className="relative z-10 mt-auto p-6 w-full">
        <h3 className="text-lg md:text-xl font-black text-white mb-2 group-hover:text-nf-primary transition-colors duration-300 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-nf-text-muted leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
          {description}
        </p>

        {/* Hover-revealed deliverables */}
        {deliverables && deliverables.length > 0 && (
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
            <div className="overflow-hidden">
              <ul className="mt-4 space-y-1.5 border-t border-nf-primary/20 pt-3">
                {deliverables.map((d, i) => (
                  <li key={i} className="text-xs text-nf-text-muted flex gap-2">
                    <span className="text-nf-primary">✓</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-nf-primary to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
    </motion.div>
  );
};

export default ServiceCard;
