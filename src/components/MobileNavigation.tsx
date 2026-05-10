
import React, { useEffect, useState } from 'react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, X, MessageCircle, Home, Store, Handshake, Rocket, ChevronRight, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/hooks/useI18n';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Logo } from '@/components/ui/Logo';

export const MobileNavigation: React.FC = () => {
  const [showPulse, setShowPulse] = useState(false);
  const { t, lang, setLang } = useI18n();

  useEffect(() => {
    const seen = localStorage.getItem('menu_pulse_seen');
    if (!seen) {
      setShowPulse(true);
      const t = setTimeout(() => {
        setShowPulse(false);
        localStorage.setItem('menu_pulse_seen', '1');
      }, 3000);
      return () => clearTimeout(t);
    }
  }, []);
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button
            aria-label={t('nav.menu')}
            className={`fixed top-4 right-4 z-50 px-3 py-2 bg-nf-surface/90 backdrop-blur-md rounded-full border border-nf-border text-white hover:text-nf-primary hover:border-nf-primary transition-all duration-300 flex items-center gap-2 ${showPulse ? 'pulse' : ''}`}
          >
            <Menu className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-wide">{t('nav.menu')}</span>
          </button>
        </SheetTrigger>
        
        <SheetContent 
          side="top" 
          className="w-full h-full bg-nf-surface backdrop-blur-xl border-0 p-0 flex items-center justify-center"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigációs Menü</SheetTitle>
          </SheetHeader>
          
          <div className="w-full max-w-md mx-auto px-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <Logo className="h-8" />
              <SheetClose asChild>
                <button className="p-2 bg-nf-surface-alt rounded-lg text-white hover:text-nf-primary hover:bg-nf-border transition-all duration-200">
                  <X className="h-5 w-5" />
                </button>
              </SheetClose>
            </div>
            
            {/* Nyelvváltó */}
            <div className="mb-4 p-2 rounded-xl border border-nf-border bg-nf-surface-alt">
              <div className="flex items-center gap-2 mb-1.5 text-white">
                <Languages className="h-4 w-4 text-nf-primary" />
                <span className="text-xs font-medium">Nyelv / Language</span>
              </div>
              <ToggleGroup
                type="single"
                size="sm"
                value={lang}
                onValueChange={(v) => v && setLang(v as 'hu' | 'en')}
                aria-label={t('nav.language')}
                className="w-full"
              >
                <ToggleGroupItem
                  value="hu"
                  className={`flex-1 ${lang === 'hu' ? 'bg-nf-primary/20 text-nf-primary border-nf-primary' : 'text-nf-text-muted'}`}
                >
                  HU
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="en"
                  className={`flex-1 ${lang === 'en' ? 'bg-nf-primary/20 text-nf-primary border-nf-primary' : 'text-nf-text-muted'}`}
                >
                  EN
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Menü elemek */}
            <nav className="pt-2">
              <ul className="divide-y divide-nf-border">
                <li>
                  <SheetClose asChild>
                    <Link to="/" className="w-full flex items-center justify-between px-2 py-4 active:scale-[0.98] transition">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Home className="h-5 w-5 text-nf-primary shrink-0" />
                        <div className="min-w-0">
                          <span className="block text-white font-semibold truncate">{t('mobile_menu.home')}</span>
                          <span className="block text-xs text-nf-text-muted truncate">{t('mobile_menu.home_desc')}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-nf-text-muted shrink-0" />
                    </Link>
                  </SheetClose>
                </li>

                <li>
                  <SheetClose asChild>
                    <Link to="/vendeglatohelyek" className="w-full flex items-center justify-between px-2 py-4 active:scale-[0.98] transition">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Store className="h-5 w-5 text-nf-primary shrink-0" />
                        <div className="min-w-0">
                          <span className="block text-white font-semibold truncate">{t('mobile_menu.venues')}</span>
                          <span className="block text-xs text-nf-text-muted truncate">{t('mobile_menu.venues_desc')}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-nf-text-muted shrink-0" />
                    </Link>
                  </SheetClose>
                </li>

                <li>
                  <SheetClose asChild>
                    <Link to="/partnerek" className="w-full flex items-center justify-between px-2 py-4 active:scale-[0.98] transition">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Handshake className="h-5 w-5 text-nf-primary shrink-0" />
                        <div className="min-w-0">
                          <span className="block text-white font-semibold truncate">{t('mobile_menu.partners')}</span>
                          <span className="block text-xs text-nf-text-muted truncate">{t('mobile_menu.partners_desc')}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-nf-text-muted shrink-0" />
                    </Link>
                  </SheetClose>
                </li>

                <li>
                  <SheetClose asChild>
                    <Link to="/come-get-it-accelerator" className="w-full flex items-center justify-between px-2 py-4 active:scale-[0.98] transition">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Rocket className="h-5 w-5 text-nf-primary shrink-0" />
                        <div className="min-w-0">
                          <span className="block text-white font-semibold truncate">{t('mobile_menu.accelerator')}</span>
                          <span className="block text-xs text-nf-text-muted truncate">{t('mobile_menu.accelerator_desc')}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-nf-text-muted shrink-0" />
                    </Link>
                  </SheetClose>
                </li>

                <li>
                  <SheetClose asChild>
                    <button
                      onClick={() => {
                        window.dispatchEvent(new Event('open-support'))
                      }}
                      className="w-full appearance-none bg-transparent text-left flex items-center justify-between px-2 py-4 active:scale-[0.98] transition"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <MessageCircle className="h-5 w-5 text-nf-primary shrink-0" />
                        <div className="min-w-0">
                          <span className="block text-white font-semibold truncate">{t('mobile_menu.support')}</span>
                          <span className="block text-xs text-nf-text-muted truncate">{t('mobile_menu.support_desc')}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-nf-text-muted shrink-0" />
                    </button>
                  </SheetClose>
                </li>
              </ul>
            </nav>


            {/* Bottom accent */}
            <div className="mt-8 flex justify-center">
              <div className="w-12 h-0.5 bg-gradient-to-r from-nf-primary/60 via-nf-primary to-nf-primary/60 rounded-full"></div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
