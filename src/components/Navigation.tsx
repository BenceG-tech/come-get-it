
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navigation: React.FC = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-[#3ba1cb]/20 hidden lg:block">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end items-center">
      <div className="flex space-x-8">
        <a href="#drink" className="text-white hover:text-[#27dddf] transition-colors">Drink</a>
        <a href="#link" className="text-white hover:text-[#27dddf] transition-colors">Link</a>
        <a href="#earn" className="text-white hover:text-[#27dddf] transition-colors">Earn</a>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center text-white hover:text-[#27dddf] transition-colors focus:outline-none">
            Partnerek
            <ChevronDown className="ml-1 h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black/90 backdrop-blur-sm border border-[#3ba1cb]/20 rounded-lg">
            <DropdownMenuItem asChild>
              <Link to="/vendeglatohelyek" className="text-white hover:text-[#27dddf] cursor-pointer w-full">
                Vendéglátóhelyek
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/italmarkak" className="text-white hover:text-[#27dddf] cursor-pointer w-full">
                Italmárkák
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/rewards-partners" className="text-white hover:text-[#27dddf] cursor-pointer w-full">
                Jutalom Partnerek
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/come-get-it-accelerator" className="text-white hover:text-[#27dddf] cursor-pointer w-full">
                Come Get It Accelerator
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <a href="#signup" className="text-white hover:text-[#27dddf] transition-colors">Regisztrálj</a>
      </div>
    </div>
  </nav>
);
