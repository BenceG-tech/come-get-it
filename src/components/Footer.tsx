import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 text-white/80 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="text-white font-anton text-xl mb-3">Come Get It</h3>
          <p className="text-sm text-white/60">
            Gyűjts pontokat, szerezz jutalmakat, támogass jótékonysági célokat – minden korttyal.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Oldalak</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-nf-primary transition-colors">Főoldal</Link></li>
            <li><Link to="/vendeglatohelyek" className="hover:text-nf-primary transition-colors">Vendéglátóhelyeknek</Link></li>
            <li><Link to="/italmarkak" className="hover:text-nf-primary transition-colors">Italmárkáknak</Link></li>
            <li><Link to="/rewards-partners" className="hover:text-nf-primary transition-colors">Rewards Partnerek</Link></li>
            <li><Link to="/come-get-it-accelerator" className="hover:text-nf-primary transition-colors">Founding Partner Program</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Jogi</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/adatvedelmi-szabalyzat" className="hover:text-nf-primary transition-colors">Adatvédelmi szabályzat</Link></li>
            <li><a href="/llm.html" className="hover:text-nf-primary transition-colors">AI/LLM összefoglaló</a></li>
            <li><a href="/sitemap.xml" className="hover:text-nf-primary transition-colors">Sitemap</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Kapcsolat</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="mailto:hello@come-get-it.app" className="hover:text-nf-primary transition-colors">hello@come-get-it.app</a></li>
            <li><a href="https://instagram.com/comegetit_app" target="_blank" rel="noopener noreferrer" className="hover:text-nf-primary transition-colors">Instagram</a></li>
            <li><a href="https://tiktok.com/@comegetit_app" target="_blank" rel="noopener noreferrer" className="hover:text-nf-primary transition-colors">TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Come Get It. Minden jog fenntartva.
      </div>
    </footer>
  );
};

export default Footer;
