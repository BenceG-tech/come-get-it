
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
          className="w-full h-full bg-gradient-to-b from-black via-gray-900 to-black backdrop-blur-xl border-0 p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigációs Menü</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-electric-300/10">
              <div className="text-white text-lg font-black tracking-wide">
                COME GET IT
              </div>
              <SheetClose asChild>
                <button className="p-2 bg-white/10 rounded-lg text-white hover:text-electric-300 hover:bg-white/20 transition-all duration-200">
                  <X className="h-5 w-5" />
                </button>
              </SheetClose>
            </div>
            
            {/* Menu Items */}
            <div className="px-6 py-4 space-y-3">
              <SheetClose asChild>
                <Link 
                  to="/" 
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-white/10 to-electric-300/10 hover:from-electric-300/20 hover:to-electric-300/30 rounded-xl border border-white/20 hover:border-electric-300/40 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-electric-300/20"
                >
                  <span className="text-white group-hover:text-electric-300 font-bold text-base tracking-wide">ÚTMUTATÓK</span>
                  <div className="w-3 h-3 bg-electric-300/70 rounded-full group-hover:bg-electric-300 group-hover:scale-125 transition-all duration-300"></div>
                </Link>
              </SheetClose>
              
              {/* Csatlakozz section */}
              <div className="bg-gradient-to-r from-white/15 to-electric-300/15 rounded-xl border border-electric-300/30 p-4 backdrop-blur-sm shadow-lg">
                <div className="text-electric-300 font-black text-lg mb-3 tracking-wide flex items-center">
                  <span className="bg-gradient-to-r from-electric-300 via-white to-electric-300 bg-clip-text text-transparent drop-shadow-sm">CSATLAKOZZ</span>
                  <div className="w-2 h-2 bg-electric-300 rounded-full ml-3 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <SheetClose asChild>
                    <Link 
                      to="/vendeglatohelyek" 
                      className="block text-white hover:text-electric-300 text-base font-semibold py-3 px-4 hover:bg-white/20 rounded-lg transition-all duration-200 border border-transparent hover:border-electric-300/30 hover:shadow-md hover:shadow-electric-300/10"
                    >
                      Vendéglátóhelyek
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/italmarkak" 
                      className="block text-white hover:text-electric-300 text-base font-semibold py-3 px-4 hover:bg-white/20 rounded-lg transition-all duration-200 border border-transparent hover:border-electric-300/30 hover:shadow-md hover:shadow-electric-300/10"
                    >
                      Italmárkák
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/rewards-partners" 
                      className="block text-white hover:text-electric-300 text-base font-semibold py-3 px-4 hover:bg-white/20 rounded-lg transition-all duration-200 border border-transparent hover:border-electric-300/30 hover:shadow-md hover:shadow-electric-300/10"
                    >
                      Jutalom partnerek
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link 
                      to="/come-get-it-accelerator" 
                      className="block text-white hover:text-electric-300 text-base font-semibold py-3 px-4 hover:bg-white/20 rounded-lg transition-all duration-200 border border-transparent hover:border-electric-300/30 hover:shadow-md hover:shadow-electric-300/10"
                    >
                      Gyorsítóprogram
                    </Link>
                  </SheetClose>
                </div>
              </div>
              
              <SheetClose asChild>
                <a 
                  href="#support" 
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-white/10 to-electric-300/10 hover:from-electric-300/20 hover:to-electric-300/30 rounded-xl border border-white/20 hover:border-electric-300/40 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-electric-300/20"
                >
                  <span className="text-white group-hover:text-electric-300 font-bold text-base tracking-wide flex items-center">
                    <MessageCircle className="h-5 w-5 mr-3" />
                    TÁMOGATÁS
                  </span>
                  <div className="w-3 h-3 bg-electric-300/70 rounded-full group-hover:bg-electric-300 group-hover:scale-125 transition-all duration-300"></div>
                </a>
              </SheetClose>
            </div>
            
            {/* Bottom accent */}
            <div className="mt-auto mb-6 flex justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-electric-300/60 via-electric-300 to-electric-300/60 rounded-full"></div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
