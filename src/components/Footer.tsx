import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Music2, Mail } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import footerSkyline from '@/assets/footer-skyline.png';

export const Footer: React.FC = () => {
  const headingCls = 'text-white/90 font-anton uppercase tracking-wider text-xs mb-3';
  const linkCls = 'text-white/65 hover:text-nf-primary transition-colors';

  return (
    <footer className="relative mt-16 border-t border-nf-primary/20 bg-nf-background text-white/80">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-4 md:pb-12 grid gap-10 md:grid-cols-4">
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
      <div aria-hidden="true" className="max-w-7xl mx-auto px-0 md:px-4">
        <img
          src={footerSkyline}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="w-full h-auto select-none pointer-events-none"
        />
      </div>

      <div className="border-t border-nf-primary/15 py-4 md:py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Come Get It. Minden jog fenntartva.
      </div>
    </footer>
  );
};

export default Footer;
