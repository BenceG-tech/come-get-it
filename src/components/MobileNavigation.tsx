
import React from 'react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, X } from 'lucide-react';
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
          className="w-full h-full bg-gradient-to-b from-black via-black/98 to-ocean-900/95 backdrop-blur-xl border-0 p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigációs Menü</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            {/* Ultra compact header */}
            <div className="flex justify-between items-center p-3 border-b border-electric-300/10">
              <div className="text-white text-base font-bold tracking-wide">
                COME GET IT
              </div>
              <SheetClose asChild>
                <button className="p-1.5 bg-white/5 rounded-md text-white hover:text-electric-300 hover:bg-white/10 transition-all duration-200">
                  <X className="h-4 w-4" />
                </button>
              </SheetClose>
            </div>
            
            {/* Modern compact menu */}
            <div className="px-4 py-3 overflow-hidden">
              <div className="grid grid-cols-1 gap-2 max-w-sm mx-auto">
                <SheetClose asChild>
                  <Link 
                    to="/" 
                    className="group flex items-center justify-between p-3 bg-gradient-to-r from-white/5 to-white/10 hover:from-electric-300/10 hover:to-electric-300/20 rounded-xl border border-white/10 hover:border-electric-300/30 transition-all duration-300 backdrop-blur-sm"
                  >
                    <span className="text-white group-hover:text-electric-300 font-semibold text-sm tracking-wide">ÚTMUTATÓK</span>
                    <div className="w-2 h-2 bg-electric-300/60 rounded-full group-hover:bg-electric-300 group-hover:scale-125 transition-all duration-300"></div>
                  </Link>
                </SheetClose>
                
                {/* Modern Csatlakozz section */}
                <div className="bg-gradient-to-r from-white/8 to-white/12 rounded-xl border border-white/15 p-3 backdrop-blur-sm">
                  <div className="text-electric-300 font-bold text-sm mb-2 tracking-wide flex items-center">
                    <span className="bg-gradient-to-r from-electric-300 to-ocean-400 bg-clip-text text-transparent">CSATLAKOZZ</span>
                    <div className="w-1 h-1 bg-electric-300 rounded-full ml-2"></div>
                  </div>
                  <div className="space-y-1.5">
                    <SheetClose asChild>
                      <Link 
                        to="/vendeglatohelyek" 
                        className="block text-white/90 hover:text-electric-300 text-sm font-medium py-2 px-3 hover:bg-white/10 rounded-lg transition-all duration-200 border border-transparent hover:border-electric-300/20"
                      >
                        Vendéglátóhelyek
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        to="/italmarkak" 
                        className="block text-white/90 hover:text-electric-300 text-sm font-medium py-2 px-3 hover:bg-white/10 rounded-lg transition-all duration-200 border border-transparent hover:border-electric-300/20"
                      >
                        Italmárkák
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        to="/rewards-partners" 
                        className="block text-white/90 hover:text-electric-300 text-sm font-medium py-2 px-3 hover:bg-white/10 rounded-lg transition-all duration-200 border border-transparent hover:border-electric-300/20"
                      >
                        Jutalom partnerek
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        to="/come-get-it-accelerator" 
                        className="block text-white/90 hover:text-electric-300 text-sm font-medium py-2 px-3 hover:bg-white/10 rounded-lg transition-all duration-200 border border-transparent hover:border-electric-300/20"
                      >
                        Gyorsítóprogram
                      </Link>
                    </SheetClose>
                  </div>
                </div>
                
                <SheetClose asChild>
                  <a 
                    href="#support" 
                    className="group flex items-center justify-between p-3 bg-gradient-to-r from-white/5 to-white/10 hover:from-electric-300/10 hover:to-electric-300/20 rounded-xl border border-white/10 hover:border-electric-300/30 transition-all duration-300 backdrop-blur-sm"
                  >
                    <span className="text-white group-hover:text-electric-300 font-semibold text-sm tracking-wide">TÁMOGATÁS</span>
                    <div className="w-2 h-2 bg-electric-300/60 rounded-full group-hover:bg-electric-300 group-hover:scale-125 transition-all duration-300"></div>
                  </a>
                </SheetClose>
              </div>
              
              {/* Modern minimal accent */}
              <div className="mt-3 flex justify-center">
                <div className="w-12 h-0.5 bg-gradient-to-r from-electric-300/40 via-electric-300 to-ocean-600/40 rounded-full"></div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
