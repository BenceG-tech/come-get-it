
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/UserMenu';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, lang, setLang } = useI18n();

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-blue/80 backdrop-blur-sm border-b border-[#3ba1cb]/20 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-anton text-white hover:text-[#27dddf] transition-colors">
          {t('nav.brand')}
        </Link>
        <div className="flex space-x-8">
          <button onClick={() => handleNavClick('drink')} className="text-white hover:text-[#27dddf] transition-colors">{t('nav.drink')}</button>
          <button onClick={() => handleNavClick('link')} className="text-white hover:text-[#27dddf] transition-colors">{t('nav.link')}</button>
          <button onClick={() => handleNavClick('earn')} className="text-white hover:text-[#27dddf] transition-colors">{t('nav.earn')}</button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center text-white hover:text-[#27dddf] transition-colors focus:outline-none">
            {t('nav.partners')}
            <ChevronDown className="ml-1 h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-dark-blue/90 backdrop-blur-sm border border-[#3ba1cb]/20 rounded-lg">
            <DropdownMenuItem asChild>
              <Link to="/vendeglatohelyek" className="text-white hover:text-[#27dddf] cursor-pointer w-full">
                {t('nav.venues')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/italmarkak" className="text-white hover:text-[#27dddf] cursor-pointer w-full">
                {t('nav.brands')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/rewards-partners" className="text-white hover:text-[#27dddf] cursor-pointer w-full">
                {t('nav.rewards')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/come-get-it-accelerator" className="text-white hover:text-[#27dddf] cursor-pointer w-full">
                {t('nav.accelerator')}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
          {/* Language switcher */}
          <div className="flex items-center space-x-2">
            <button onClick={() => setLang('hu')} className="text-white hover:text-[#27dddf] transition-colors" aria-label={t('nav.hu')}>{t('nav.hu')}</button>
            <span className="text-white/50">|</span>
            <button onClick={() => setLang('en')} className="text-white hover:text-[#27dddf] transition-colors" aria-label={t('nav.en')}>{t('nav.en')}</button>
          </div>
          {user ? (
            <UserMenu />
          ) : (
            <div className="flex items-center space-x-4">
              <button onClick={handleSignupClick} className="text-white hover:text-[#27dddf] transition-colors">{t('nav.signup')}</button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/auth')}
                className="border-[#27dddf] text-[#27dddf] hover:bg-[#27dddf] hover:text-black"
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
