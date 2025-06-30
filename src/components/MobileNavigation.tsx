
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
            
            {/* Super compact menu - fits in upper third */}
            <div className="px-4 py-4 overflow-hidden">
              <div className="grid grid-cols-1 gap-2 max-w-xs mx-auto">
                <SheetClose asChild>
                  <Link 
                    to="/" 
                    className="group flex items-center justify-between p-2.5 bg-white/5 hover:bg-electric-300/10 rounded-lg border border-white/10 hover:border-electric-300/30 transition-all duration-300"
                  >
                    <span className="text-white group-hover:text-electric-300 font-medium text-sm">ÚTMUTATÓK</span>
                    <div className="w-1.5 h-1.5 bg-electric-300/50 rounded-full group-hover:bg-electric-300 transition-colors duration-300"></div>
                  </Link>
                </SheetClose>
                
                {/* Special Csatlakozz section */}
                <div className="bg-white/5 rounded-lg border border-white/10 p-2.5">
                  <div className="text-electric-300 font-bold text-sm mb-2 tracking-wide">
                    CSATLAKOZZ
                  </div>
                  <div className="space-y-1">
                    <SheetClose asChild>
                      <Link 
                        to="/vendeglatohelyek" 
                        className="block text-white/80 hover:text-electric-300 text-xs py-1 px-2 hover:bg-white/5 rounded transition-all duration-200"
                      >
                        • Vendéglátóhelyek
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        to="/italmarkak" 
                        className="block text-white/80 hover:text-electric-300 text-xs py-1 px-2 hover:bg-white/5 rounded transition-all duration-200"
                      >
                        • Italmárkák
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link 
                        to="/rewards-partners" 
                        className="block text-white/80 hover:text-electric-300 text-xs py-1 px-2 hover:bg-white/5 rounded transition-all duration-200"
                      >
                        • Jutalom partnerek
                      </Link>
                    </SheetClose>
                  </div>
                </div>
                
                <SheetClose asChild>
                  <Link 
                    to="/come-get-it-accelerator" 
                    className="group flex items-center justify-between p-2.5 bg-white/5 hover:bg-electric-300/10 rounded-lg border border-white/10 hover:border-electric-300/30 transition-all duration-300"
                  >
                    <span className="text-white group-hover:text-electric-300 font-medium text-sm">GYORSÍTÓPOGRAM</span>
                    <div className="w-1.5 h-1.5 bg-electric-300/50 rounded-full group-hover:bg-electric-300 transition-colors duration-300"></div>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <a 
                    href="#support" 
                    className="group flex items-center justify-between p-2.5 bg-white/5 hover:bg-electric-300/10 rounded-lg border border-white/10 hover:border-electric-300/30 transition-all duration-300"
                  >
                    <span className="text-white group-hover:text-electric-300 font-medium text-sm">TÁMOGATÁS</span>
                    <div className="w-1.5 h-1.5 bg-electric-300/50 rounded-full group-hover:bg-electric-300 transition-colors duration-300"></div>
                  </a>
                </SheetClose>
              </div>
              
              {/* Minimal bottom accent */}
              <div className="mt-4 flex justify-center">
                <div className="w-8 h-0.5 bg-gradient-to-r from-electric-300 to-ocean-600 rounded-full opacity-40"></div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
