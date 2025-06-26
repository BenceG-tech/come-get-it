
import React, { useState } from 'react';
import { MessageCircle, X, Send, Search, Home, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CustomerSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'messages' | 'help'>('main');
  const [message, setMessage] = useState('');

  const toggleSupport = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCurrentView('main');
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Itt később implementálható az üzenet küldés logika
      console.log('Üzenet elküldve:', message);
      setMessage('');
    }
  };

  const renderMainView = () => (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold">COME GET IT</h2>
          <div className="flex space-x-1">
            <div className="w-8 h-8 bg-electric-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-black">CG</span>
            </div>
            <div className="w-8 h-8 bg-ocean-400 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-white">IT</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSupport}
          className="text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Szia! 👋</h3>
        <p className="text-lg">Miben segíthetünk?</p>

        <div className="space-y-3">
          <Button
            onClick={() => setCurrentView('messages')}
            className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 text-white border-none p-4 h-auto"
          >
            <span>Írj nekünk üzenetet</span>
            <Send className="w-5 h-5" />
          </Button>

          <Button
            onClick={() => setCurrentView('help')}
            className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 text-white border-none p-4 h-auto"
          >
            <span>Keresés a súgóban</span>
            <Search className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-2 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-gray-300 hover:text-white cursor-pointer p-2">
            <span>Ingyen italok</span>
            <span>›</span>
          </div>
          <div className="flex items-center justify-between text-gray-300 hover:text-white cursor-pointer p-2">
            <span>Jutalmak és kártya összekapcsolás</span>
            <span>›</span>
          </div>
        </div>
      </div>

      <div className="flex justify-around mt-8 pt-4 border-t border-white/20">
        <div className="flex flex-col items-center space-y-1 text-electric-300">
          <Home className="w-6 h-6" />
          <span className="text-xs">Főoldal</span>
        </div>
        <div className="flex flex-col items-center space-y-1 text-white">
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs">Üzenetek</span>
        </div>
        <div className="flex flex-col items-center space-y-1 text-gray-400">
          <HelpCircle className="w-6 h-6" />
          <span className="text-xs">Súgó</span>
        </div>
      </div>
    </div>
  );

  const renderMessagesView = () => (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Üzenetek</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSupport}
          className="text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nincs üzenet</h3>
        <p className="text-gray-400 text-center mb-8">
          A csapat üzenetei itt fognak megjelenni
        </p>
      </div>

      <div className="mt-auto">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Írj nekünk üzenetet"
            className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-electric-300"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-electric-300 hover:bg-electric-400 text-black px-4"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex justify-around mt-6 pt-4 border-t border-white/20">
        <div 
          className="flex flex-col items-center space-y-1 text-gray-400 cursor-pointer"
          onClick={() => setCurrentView('main')}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Főoldal</span>
        </div>
        <div className="flex flex-col items-center space-y-1 text-electric-300">
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs">Üzenetek</span>
        </div>
        <div 
          className="flex flex-col items-center space-y-1 text-gray-400 cursor-pointer"
          onClick={() => setCurrentView('help')}
        >
          <HelpCircle className="w-6 h-6" />
          <span className="text-xs">Súgó</span>
        </div>
      </div>
    </div>
  );

  const renderHelpView = () => (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Súgó</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSupport}
          className="text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Keresés a súgóban"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-electric-300"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-400">2 gyűjtemény</p>
        
        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 cursor-pointer">
            <h3 className="font-semibold mb-2">Come Get It App GYIK</h3>
            <p className="text-sm text-gray-400 mb-2">
              További információk az app funkcióiról, beleértve a jutalmakat és kártya összekapcsolást.
            </p>
            <span className="text-xs text-gray-500">6 cikk</span>
          </div>

          <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 cursor-pointer">
            <h3 className="font-semibold mb-2">Fiók törlése</h3>
            <p className="text-sm text-gray-400 mb-2">
              Hogyan törölheted a fiókodat és személyes adataidat.
            </p>
            <span className="text-xs text-gray-500">2 cikk</span>
          </div>
        </div>
      </div>

      <div className="flex justify-around mt-8 pt-4 border-t border-white/20">
        <div 
          className="flex flex-col items-center space-y-1 text-gray-400 cursor-pointer"
          onClick={() => setCurrentView('main')}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Főoldal</span>
        </div>
        <div 
          className="flex flex-col items-center space-y-1 text-gray-400 cursor-pointer"
          onClick={() => setCurrentView('messages')}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs">Üzenetek</span>
        </div>
        <div className="flex flex-col items-center space-y-1 text-electric-300">
          <HelpCircle className="w-6 h-6" />
          <span className="text-xs">Súgó</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sticky Support Button */}
      {!isOpen && (
        <button
          onClick={toggleSupport}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-electric-300 hover:bg-electric-400 rounded-full shadow-lg neon-glow-electric flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6 text-black" />
        </button>
      )}

      {/* Support Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl neon-glow-electric overflow-hidden">
          <div className="h-full flex flex-col">
            {currentView === 'main' && renderMainView()}
            {currentView === 'messages' && renderMessagesView()}
            {currentView === 'help' && renderHelpView()}
          </div>
        </div>
      )}
    </>
  );
};
