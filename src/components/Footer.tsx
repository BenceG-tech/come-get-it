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

      {/* Decorative skyline */}
      <div aria-hidden="true" className="max-w-7xl mx-auto px-4">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-10 text-nf-primary/15">
          <path
            fill="currentColor"
            d="M0,60 L0,40 L40,40 L40,30 L60,30 L60,38 L90,38 L90,20 L100,20 L100,38 L130,38 L130,28 L160,28 L160,40 L200,40 L200,15 L210,15 L210,8 L220,8 L220,15 L230,15 L230,40 L270,40 L270,32 L300,32 L300,42 L340,42 L340,25 L360,25 L360,18 L380,18 L380,25 L400,25 L400,42 L440,42 L440,30 L470,30 L470,40 L510,40 L510,22 L530,22 L530,12 L550,12 L550,22 L570,22 L570,40 L610,40 L610,32 L640,32 L640,42 L680,42 L680,28 L700,28 L700,18 L720,18 L720,28 L740,28 L740,42 L780,42 L780,30 L820,30 L820,40 L860,40 L860,20 L880,20 L880,10 L900,10 L900,20 L920,20 L920,40 L960,40 L960,32 L1000,32 L1000,42 L1040,42 L1040,28 L1070,28 L1070,38 L1110,38 L1110,30 L1150,30 L1150,40 L1200,40 L1200,60 Z"
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
