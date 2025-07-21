
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

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-[#3ba1cb]/20 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-anton text-white hover:text-[#27dddf] transition-colors">
          COME GET IT
        </Link>
        <div className="flex space-x-8">
          <button onClick={() => handleNavClick('drink')} className="text-white hover:text-[#27dddf] transition-colors">Drink</button>
          <button onClick={() => handleNavClick('link')} className="text-white hover:text-[#27dddf] transition-colors">Link</button>
          <button onClick={() => handleNavClick('earn')} className="text-white hover:text-[#27dddf] transition-colors">Earn</button>
        
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
        
          {user ? (
            <UserMenu />
          ) : (
            <div className="flex items-center space-x-4">
              <button onClick={handleSignupClick} className="text-white hover:text-[#27dddf] transition-colors">Regisztrálj</button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/auth')}
                className="border-[#27dddf] text-[#27dddf] hover:bg-[#27dddf] hover:text-black"
              >
                Bejelentkezés
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
