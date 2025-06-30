
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
          <button className="fixed top-4 right-4 z-50 p-3 bg-black/80 backdrop-blur-sm rounded-lg border border-electric-300/20 text-white hover:text-electric-300 hover:border-electric-300/40 transition-all duration-300">
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        
        <SheetContent 
          side="top" 
          className="w-full h-full bg-gradient-to-b from-black via-black/95 to-ocean-900/90 backdrop-blur-xl border-0 p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            {/* Compact header */}
            <div className="flex justify-between items-center p-4 border-b border-electric-300/10">
              <div className="text-white text-lg font-bold tracking-wide">
                COME GET IT
              </div>
              <SheetClose asChild>
                <button className="p-2 bg-white/5 rounded-lg text-white hover:text-electric-300 hover:bg-white/10 transition-all duration-200">
                  <X className="h-5 w-5" />
                </button>
              </SheetClose>
            </div>
            
            {/* Compact menu grid - fits in upper half */}
            <div className="px-6 py-8">
              <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
                <SheetClose asChild>
                  <Link 
                    to="/" 
                    className="group flex items-center justify-between p-4 bg-white/5 hover:bg-electric-300/10 rounded-xl border border-white/10 hover:border-electric-300/30 transition-all duration-300"
                  >
                    <span className="text-white group-hover:text-electric-300 font-medium text-base">GUIDES</span>
                    <div className="w-2 h-2 bg-electric-300/50 rounded-full group-hover:bg-electric-300 transition-colors duration-300"></div>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <a 
                    href="#work-with-us" 
                    className="group flex items-center justify-between p-4 bg-white/5 hover:bg-electric-300/10 rounded-xl border border-white/10 hover:border-electric-300/30 transition-all duration-300"
                  >
                    <span className="text-white group-hover:text-electric-300 font-medium text-base">WORK WITH US</span>
                    <div className="w-2 h-2 bg-electric-300/50 rounded-full group-hover:bg-electric-300 transition-colors duration-300"></div>
                  </a>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link 
                    to="/vendeglatohelyek" 
                    className="group flex items-center justify-between p-4 bg-white/5 hover:bg-electric-300/10 rounded-xl border border-white/10 hover:border-electric-300/30 transition-all duration-300"
                  >
                    <span className="text-white group-hover:text-electric-300 font-medium text-base">VENUES</span>
                    <div className="w-2 h-2 bg-electric-300/50 rounded-full group-hover:bg-electric-300 transition-colors duration-300"></div>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link 
                    to="/italmarkak" 
                    className="group flex items-center justify-between p-4 bg-white/5 hover:bg-electric-300/10 rounded-xl border border-white/10 hover:border-electric-300/30 transition-all duration-300"
                  >
                    <span className="text-white group-hover:text-electric-300 font-medium text-base">DRINKS BRANDS</span>
                    <div className="w-2 h-2 bg-electric-300/50 rounded-full group-hover:bg-electric-300 transition-colors duration-300"></div>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link 
                    to="/rewards-partners" 
                    className="group flex items-center justify-between p-4 bg-white/5 hover:bg-electric-300/10 rounded-xl border border-white/10 hover:border-electric-300/30 transition-all duration-300"
                  >
                    <span className="text-white group-hover:text-electric-300 font-medium text-base">REWARDS PARTNERS</span>
                    <div className="w-2 h-2 bg-electric-300/50 rounded-full group-hover:bg-electric-300 transition-colors duration-300"></div>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link 
                    to="/come-get-it-accelerator" 
                    className="group flex items-center justify-between p-4 bg-white/5 hover:bg-electric-300/10 rounded-xl border border-white/10 hover:border-electric-300/30 transition-all duration-300"
                  >
                    <span className="text-white group-hover:text-electric-300 font-medium text-base">ACCELERATOR</span>
                    <div className="w-2 h-2 bg-electric-300/50 rounded-full group-hover:bg-electric-300 transition-colors duration-300"></div>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <a 
                    href="#support" 
                    className="group flex items-center justify-between p-4 bg-white/5 hover:bg-electric-300/10 rounded-xl border border-white/10 hover:border-electric-300/30 transition-all duration-300"
                  >
                    <span className="text-white group-hover:text-electric-300 font-medium text-base">SUPPORT</span>
                    <div className="w-2 h-2 bg-electric-300/50 rounded-full group-hover:bg-electric-300 transition-colors duration-300"></div>
                  </a>
                </SheetClose>
              </div>
              
              {/* Subtle bottom accent */}
              <div className="mt-8 flex justify-center">
                <div className="w-12 h-1 bg-gradient-to-r from-electric-300 to-ocean-600 rounded-full opacity-50"></div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
