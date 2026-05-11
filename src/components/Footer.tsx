import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Music2, Mail } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export const Footer: React.FC = () => {
  const headingCls = 'text-white/90 font-anton uppercase tracking-wider text-xs mb-3';
  const linkCls = 'text-white/65 hover:text-nf-primary transition-colors';

  return (
    <footer className="relative mt-16 border-t border-nf-primary/20 bg-gradient-to-b from-[#03070d] to-black text-white/80">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <Logo className="h-9 mb-4" />
          <p className="text-sm text-white/60 leading-relaxed">
            Gyűjts pontokat, szerezz jutalmakat, támogass jótékonysági célokat – minden korttyal.
          </p>
        </div>

        <div>
          <h4 className={headingCls}>Oldalak</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className={linkCls}>Főoldal</Link></li>
            <li><Link to="/vendeglatohelyek" className={linkCls}>Vendéglátóhelyeknek</Link></li>
            <li><Link to="/partnerek" className={linkCls}>Partnerek</Link></li>
            <li><Link to="/come-get-it-accelerator" className={linkCls}>Founding Partner Program</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={headingCls}>Jogi</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/adatvedelmi-szabalyzat" className={linkCls}>Adatvédelmi szabályzat</Link></li>
            <li><a href="/llm.html" className={linkCls}>AI/LLM összefoglaló</a></li>
            <li><a href="/sitemap.xml" className={linkCls}>Sitemap</a></li>
          </ul>
        </div>

        <div>
          <h4 className={headingCls}>Kapcsolat</h4>
          <div className="flex items-center gap-3 mb-4">
            <a
              href="https://instagram.com/comegetit_app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] flex items-center justify-center text-nf-primary hover:border-nf-primary hover:shadow-[0_0_20px_rgba(0,188,212,0.5)] transition-all"
            >
              <Instagram className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <a
              href="https://tiktok.com/@comegetit_app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-9 h-9 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] flex items-center justify-center text-nf-primary hover:border-nf-primary hover:shadow-[0_0_20px_rgba(0,188,212,0.5)] transition-all"
            >
              <Music2 className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <a
              href="mailto:hello@come-get-it.app"
              aria-label="Email"
              className="w-9 h-9 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06] flex items-center justify-center text-nf-primary hover:border-nf-primary hover:shadow-[0_0_20px_rgba(0,188,212,0.5)] transition-all"
            >
              <Mail className="w-4 h-4" strokeWidth={1.5} />
            </a>
          </div>
          <ul className="space-y-2 text-sm">
            <li><a href="mailto:hello@come-get-it.app" className={linkCls}>hello@come-get-it.app</a></li>
            <li><a href="https://instagram.com/comegetit_app" target="_blank" rel="noopener noreferrer" className={linkCls}>Instagram</a></li>
            <li><a href="https://tiktok.com/@comegetit_app" target="_blank" rel="noopener noreferrer" className={linkCls}>TikTok</a></li>
          </ul>
        </div>
      </div>

      {/* Decorative Budapest skyline — layered for depth */}
      <div aria-hidden="true" className="max-w-7xl mx-auto px-4 relative">
        {/* Back layer — soft, distant */}
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="absolute inset-x-4 bottom-0 w-[calc(100%-2rem)] h-14 text-nf-primary/20">
          <path
            fill="currentColor"
            d="M0,80 L0,55 L60,55 L60,42 L120,42 L120,52 L180,52 L180,38 L240,38 L240,48 L320,48 L320,32 L380,32 L380,46 L460,46 L460,40 L540,40 L540,28 L600,28 L600,42 L680,42 L680,36 L760,36 L760,48 L840,48 L840,30 L920,30 L920,44 L1000,44 L1000,38 L1080,38 L1080,50 L1200,50 L1200,80 Z"
          />
        </svg>
        {/* Front layer — sharper, with cyan glow */}
        <svg
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          className="relative w-full h-16 text-nf-primary/45"
          style={{ filter: 'drop-shadow(0 -2px 8px rgba(0,188,212,0.35))' }}
        >
          <path
            fill="currentColor"
            d="M0,80 L0,60 L40,60 L40,50 L60,50 L60,58 L90,58 L90,40 L100,40 L100,58 L130,58 L130,48 L160,48 L160,60 L200,60 L200,35 L210,35 L210,28 L220,28 L220,35 L230,35 L230,60 L270,60 L270,52 L300,52 L300,62 L340,62 L340,45 L360,45 L360,38 L380,38 L380,45 L400,45 L400,62 L440,62 L440,50 L470,50 L470,60 L510,60 L510,42 L530,42 L530,32 L550,32 L550,42 L570,42 L570,60 L610,60 L610,52 L640,52 L640,62 L680,62 L680,48 L700,48 L700,38 L720,38 L720,48 L740,48 L740,62 L780,62 L780,50 L820,50 L820,60 L860,60 L860,40 L880,40 L880,30 L900,30 L900,40 L920,40 L920,60 L960,60 L960,52 L1000,52 L1000,62 L1040,62 L1040,48 L1070,48 L1070,58 L1110,58 L1110,50 L1150,50 L1150,60 L1200,60 L1200,80 Z"
          />
        </svg>
      </div>

      <div className="border-t border-nf-primary/15 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Come Get It. Minden jog fenntartva.
      </div>
    </footer>
  );
};

export default Footer;
