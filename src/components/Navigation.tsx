import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
        document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.querySelector('#signup')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-electric-300 to-ocean-400 bg-clip-text text-transparent">
          Come Get It
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <button 
            onClick={() => handleNavClick('drink')}
            className="text-white hover:text-electric-300 font-medium transition-colors"
          >
            {t('nav.drink')}
          </button>
          <button 
            onClick={() => handleNavClick('link')}
            className="text-white hover:text-electric-300 font-medium transition-colors"
          >
            {t('nav.link')}
          </button>
          <button 
            onClick={() => handleNavClick('earn')}
            className="text-white hover:text-electric-300 font-medium transition-colors"
          >
            {t('nav.earn')}
          </button>
          
          {/* Dropdown for Partners */}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-white hover:text-electric-300 font-medium transition-colors flex items-center gap-1">
              Partnerek
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-white/20 backdrop-blur-sm">
              <DropdownMenuItem asChild>
                <Link to="/vendeglatohelyek" className="text-white hover:text-electric-300 cursor-pointer">
                  {t('nav.venues')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/italmarkak" className="text-white hover:text-electric-300 cursor-pointer">
                  {t('nav.brands')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/rewards-partners" className="text-white hover:text-electric-300 cursor-pointer">
                  {t('nav.rewardsPartners')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/come-get-it-accelerator" className="text-white hover:text-electric-300 cursor-pointer">
                  {t('nav.accelerator')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Language Switcher */}
        <LanguageSwitcher />
        
        {/* Sign up button */}
        <button 
          onClick={handleSignupClick}
          className="brand-gradient-cta hover:shadow-2xl text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 neon-glow-brand border-0"
        >
          {t('nav.signup')}
        </button>
      </div>
    </header>
  );
};