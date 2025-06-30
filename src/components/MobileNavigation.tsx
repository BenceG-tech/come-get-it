
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
          <button className="fixed top-6 right-4 z-50 p-2 text-white hover:text-electric-300 transition-colors">
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        
        <SheetContent 
          side="top" 
          className="w-full h-full bg-black border-0 p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigációs menü</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            {/* Header with logo and close button */}
            <div className="flex justify-between items-center p-6">
              <div className="text-white text-xl font-bold">
                COME GET IT
              </div>
              <SheetClose asChild>
                <button className="p-2 text-white hover:text-electric-300 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </SheetClose>
            </div>
            
            {/* Menu items */}
            <div className="flex-1 flex flex-col justify-center px-8 space-y-6">
              <SheetClose asChild>
                <Link 
                  to="/" 
                  className="text-2xl font-bold text-white hover:text-electric-300 transition-colors py-4 border-b border-gray-800"
                >
                  GUIDES
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <a 
                  href="#work-with-us" 
                  className="text-2xl font-bold text-white hover:text-electric-300 transition-colors py-4 border-b border-gray-800"
                >
                  WORK WITH US
                </a>
              </SheetClose>
              
              <SheetClose asChild>
                <Link 
                  to="/vendeglatohelyek" 
                  className="text-2xl font-bold text-white hover:text-electric-300 transition-colors py-4 border-b border-gray-800"
                >
                  VENDÉGLÁTÓHELYEK
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <Link 
                  to="/italmarkak" 
                  className="text-2xl font-bold text-white hover:text-electric-300 transition-colors py-4 border-b border-gray-800"
                >
                  ITALMÁRKÁK
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <Link 
                  to="/rewards-partners" 
                  className="text-2xl font-bold text-white hover:text-electric-300 transition-colors py-4 border-b border-gray-800"
                >
                  JUTALOM PARTNEREK
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <Link 
                  to="/come-get-it-accelerator" 
                  className="text-2xl font-bold text-white hover:text-electric-300 transition-colors py-4 border-b border-gray-800"
                >
                  COME GET IT ACCELERATOR
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <a 
                  href="#support" 
                  className="text-2xl font-bold text-white hover:text-electric-300 transition-colors py-4"
                >
                  SUPPORT
                </a>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
