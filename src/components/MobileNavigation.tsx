
import React from 'react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, X, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MobileNavigation: React.FC = () => {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button className="fixed top-4 right-4 z-50 p-2.5 bg-black/90 backdrop-blur-sm rounded-lg border border-electric-300/20 text-white hover:text-electric-300 hover:border-electric-300/40 transition-all duration-300">
            <Menu className="h-4 w-4" />
          </button>
        </SheetTrigger>
        
        <SheetContent 
          side="top" 
          className="w-full h-full bg-gradient-to-br from-black via-gray-900/95 to-black backdrop-blur-xl border-0 p-0 flex items-center justify-center"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigációs Menü</SheetTitle>
          </SheetHeader>
          
          <div className="w-full max-w-md mx-auto px-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="text-white text-xl font-black tracking-wide bg-gradient-to-r from-electric-300 to-white bg-clip-text text-transparent">
                COME GET IT
              </div>
              <SheetClose asChild>
                <button className="p-2 bg-white/10 rounded-lg text-white hover:text-electric-300 hover:bg-white/20 transition-all duration-200">
                  <X className="h-5 w-5" />
                </button>
              </SheetClose>
            </div>
            
            {/* Menu Items - Centered */}
            <div className="space-y-4">
              <SheetClose asChild>
                <Link 
                  to="/" 
                  className="group flex items-center justify-center p-4 bg-gradient-to-r from-white/10 to-electric-300/10 hover:from-electric-300/20 hover:to-electric-300/30 rounded-xl border border-white/20 hover:border-electric-300/40 transition-all duration-300 backdrop-blur-sm"
                >
                  <span className="text-white group-hover:text-electric-300 font-bold text-lg tracking-wide">ÚTMUTATÓK</span>
                </Link>
              </SheetClose>
              
              {/* Csatlakozz section - more compact */}
              <div className="bg-gradient-to-r from-white/15 to-electric-300/15 rounded-xl border border-electric-300/30 p-4 backdrop-blur-sm">
                <div className="text-center mb-4">
                  <h3 className="text-electric-300 font-black text-xl tracking-wide bg-gradient-to-r from-electric-300 via-white to-electric-300 bg-clip-text text-transparent">
                    CSATLAKOZZ
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <SheetClose asChild>
                    <Link 
                      to="/vendeglatohelyek" 
                      className="text-center text-white hover:text-electric-300 text-base font-semibold py-3 px-4 hover:bg-white/20 rounded-lg transition-all duration-200 border border-transparent hover:border-electric-300/30"
                    >
                      Vendéglátóhelyek
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/italmarkak" 
                      className="text-center text-white hover:text-electric-300 text-base font-semibold py-3 px-4 hover:bg-white/20 rounded-lg transition-all duration-200 border border-transparent hover:border-electric-300/30"
                    >
                      Italmárkák
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/rewards-partners" 
                      className="text-center text-white hover:text-electric-300 text-base font-semibold py-3 px-4 hover:bg-white/20 rounded-lg transition-all duration-200 border border-transparent hover:border-electric-300/30"
                    >
                      Jutalom partnerek
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/come-get-it-accelerator" 
                      className="text-center text-white hover:text-electric-300 text-base font-semibold py-3 px-4 hover:bg-white/20 rounded-lg transition-all duration-200 border border-transparent hover:border-electric-300/30"
                    >
                      Gyorsítóprogram
                    </Link>
                  </SheetClose>
                </div>
              </div>
              
              {/* Support button - more prominent */}
              <SheetClose asChild>
                <button 
                  onClick={() => {
                    const supportSection = document.getElementById('support');
                    if (supportSection) {
                      supportSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full group flex items-center justify-center p-4 bg-gradient-to-r from-electric-300/20 to-electric-300/30 hover:from-electric-300/30 hover:to-electric-300/40 rounded-xl border border-electric-300/40 hover:border-electric-300/60 transition-all duration-300 backdrop-blur-sm"
                >
                  <MessageCircle className="h-5 w-5 mr-3 text-electric-300" />
                  <span className="text-white group-hover:text-electric-300 font-bold text-lg tracking-wide">TÁMOGATÁS</span>
                </button>
              </SheetClose>
            </div>
            
            {/* Bottom accent - smaller */}
            <div className="mt-8 flex justify-center">
              <div className="w-12 h-0.5 bg-gradient-to-r from-electric-300/60 via-electric-300 to-electric-300/60 rounded-full"></div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
