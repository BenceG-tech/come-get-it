
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/UserMenu';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { useI18n } from '@/hooks/useI18n';
import { useSecretAdminEntry } from '@/hooks/useSecretAdminEntry';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, lang, setLang } = useI18n();
  const secretAdminClick = useSecretAdminEntry();

  const handleNavClick = (section: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignupClick = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="nf-navbar hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" aria-label={t('nav.brand')} onClick={secretAdminClick} className="flex items-center transition-opacity duration-300 hover:opacity-80">
          <Logo />
        </Link>
        <div className="flex space-x-8 items-center">
          <button onClick={() => handleNavClick('drink')} className="text-white hover:text-nf-primary transition-colors duration-300">{t('nav.drink')}</button>
          <button onClick={() => handleNavClick('link')} className="text-white hover:text-nf-primary transition-colors duration-300">{t('nav.link')}</button>
          <button onClick={() => handleNavClick('earn')} className="text-white hover:text-nf-primary transition-colors duration-300">{t('nav.earn')}</button>
          <button onClick={() => handleNavClick('give')} className="text-white hover:text-nf-primary transition-colors duration-300">{t('nav.give')}</button>

          <Link to="/vendeglatohelyek" className="text-white hover:text-nf-primary transition-colors duration-300">{t('nav.venues')}</Link>
          <Link to="/partnerek" className="text-white hover:text-nf-primary transition-colors duration-300">{t('nav.partners_link')}</Link>
          <Link to="/come-get-it-accelerator" className="text-white hover:text-nf-primary transition-colors duration-300">{t('nav.accelerator')}</Link>
        
          {/* Language switcher */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setLang('hu')} 
              className={`transition-colors duration-300 ${lang === 'hu' ? 'text-nf-primary' : 'text-white hover:text-nf-primary'}`}
              aria-label={t('nav.hu')}
            >
              {t('nav.hu')}
            </button>
            <span className="text-nf-border">|</span>
            <button 
              onClick={() => setLang('en')} 
              className={`transition-colors duration-300 ${lang === 'en' ? 'text-nf-primary' : 'text-white hover:text-nf-primary'}`}
              aria-label={t('nav.en')}
            >
              {t('nav.en')}
            </button>
          </div>
          {user ? (
            <UserMenu />
          ) : (
            <div className="flex items-center space-x-4">
              <button onClick={handleSignupClick} className="text-white hover:text-nf-primary transition-colors duration-300">{t('nav.signup')}</button>
              <Button 
                variant="neon" 
                size="sm"
                onClick={() => navigate('/auth')}
              >
                {t('nav.login')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
