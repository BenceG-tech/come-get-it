
import React, { useState } from 'react';
import { MessageCircle, X, Send, Search, Home, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CustomerSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'home' | 'messages' | 'help'>('home');
  const [message, setMessage] = useState('');

  const toggleSupport = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCurrentTab('home');
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Üzenet elküldve:', message);
      setMessage('');
    }
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gray-900/90 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <h2 className="text-lg font-bold text-white">Come Get It</h2>
        <div className="flex space-x-1">
          <div className="w-5 h-5 bg-electric-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-black">CG</span>
          </div>
          <div className="w-5 h-5 bg-ocean-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">IT</span>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSupport}
        className="text-white hover:bg-white/10 h-8 w-8"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderFooterNav = () => (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-white/20">
      <div className="flex">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex-1 flex flex-col items-center py-4 px-3 transition-all duration-200 ${
            currentTab === 'home' 
              ? 'text-electric-300 bg-electric-300/10 border-t-2 border-electric-300' 
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Kezdőoldal</span>
        </button>
        
        <button
          onClick={() => setCurrentTab('messages')}
          className={`flex-1 flex flex-col items-center py-4 px-3 transition-all duration-200 ${
            currentTab === 'messages' 
              ? 'text-electric-300 bg-electric-300/10 border-t-2 border-electric-300' 
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <MessageCircle className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Üzenetek</span>
        </button>
        
        <button
          onClick={() => setCurrentTab('help')}
          className={`flex-1 flex flex-col items-center py-4 px-3 transition-all duration-200 ${
            currentTab === 'help' 
              ? 'text-electric-300 bg-electric-300/10 border-t-2 border-electric-300' 
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Súgó</span>
        </button>
      </div>
    </div>
  );

  const renderHomeView = () => (
    <div className="flex flex-col h-full relative">
      {renderHeader()}
      
      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Szia! 👋</h3>
          <p className="text-white/80 text-base">Miben segíthetünk?</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => setCurrentTab('messages')}
            className="w-full h-16 bg-electric-300 hover:bg-electric-400 text-black font-semibold text-left flex items-center justify-between rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span className="text-base">Írj nekünk üzenetet</span>
            <Send className="w-5 h-5" />
          </Button>

          <Button
            onClick={() => setCurrentTab('help')}
            className="w-full h-16 bg-white/10 hover:bg-white/20 text-white font-semibold text-left flex items-center justify-between rounded-xl border-2 border-white/20 hover:border-white/30 transition-all duration-200 shadow-lg"
          >
            <span className="text-base">Keresés a súgóban</span>
            <Search className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/60 uppercase tracking-wide">Gyakori kérdések</h4>
          
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-200 hover:border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Ingyen italok</span>
                <span className="text-white/40 text-lg">›</span>
              </div>
            </button>
            
            <button className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-200 hover:border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Jutalmak és kártya összekapcsolás</span>
                <span className="text-white/40 text-lg">›</span>
              </div>
            </button>
            
            <button className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-200 hover:border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Regisztráció és fiókkezelés</span>
                <span className="text-white/40 text-lg">›</span>
              </div>
            </button>

            <button className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-200 hover:border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Ajánlások és megosztás</span>
                <span className="text-white/40 text-lg">›</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {renderFooterNav()}
    </div>
  );

  const renderMessagesView = () => (
    <div className="flex flex-col h-full relative">
      {renderHeader()}

      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32">
        <div className="bg-white/5 rounded-full p-6 mb-4">
          <MessageCircle className="w-12 h-12 text-electric-300" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Nincs üzenet</h3>
        <p className="text-white/60 text-center text-base">
          A csapat üzenetei itt fognak megjelenni
        </p>
      </div>

      <div className="absolute bottom-20 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="flex space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Írj nekünk üzenetet"
            className="flex-1 bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-electric-300 focus:ring-2 focus:ring-electric-300/20"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-electric-300 hover:bg-electric-400 text-black px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {renderFooterNav()}
    </div>
  );

  const renderHelpView = () => (
    <div className="flex flex-col h-full relative">
      {renderHeader()}

      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        <div className="relative">
          <input
            type="text"
            placeholder="Keresés a súgóban"
            className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-electric-300 focus:ring-2 focus:ring-electric-300/20"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
        </div>

        <div className="space-y-4">
          <p className="text-sm text-white/50">4 gyűjtemény</p>
          
          <div className="space-y-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:border-white/20">
              <h3 className="font-semibold text-white mb-2">Come Get It App GYIK</h3>
              <p className="text-sm text-white/70 mb-3">
                További információk az app funkcióiról, beleértve a jutalmakat és kártya összekapcsolást.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">6 cikk</span>
                <span className="text-xs text-white/40">Szerző: Max</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:border-white/20">
              <h3 className="font-semibold text-white mb-2">Fiók és adatvédelem</h3>
              <p className="text-sm text-white/70 mb-3">
                Fiókkezelés, adatvédelem és biztonsági beállítások kezelése.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">4 cikk</span>
                <span className="text-xs text-white/40">Szerző: Max</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:border-white/20">
              <h3 className="font-semibold text-white mb-2">Keresés és szűrők</h3>
              <p className="text-sm text-white/70 mb-3">
                Hogyan találd meg a legjobb ajánlatokat és használd a szűrőket.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">3 cikk</span>
                <span className="text-xs text-white/40">Szerző: Max</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:border-white/20">
              <h3 className="font-semibold text-white mb-2">Ajánlások és megosztás</h3>
              <p className="text-sm text-white/70 mb-3">
                Barátaid meghívása és jutalmak szerzése a referral program segítségével.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">5 cikk</span>
                <span className="text-xs text-white/40">Szerző: Max</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {renderFooterNav()}
    </div>
  );

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleSupport}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-electric-300 hover:bg-electric-400 rounded-full shadow-2xl neon-glow-electric flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-7 h-7 text-black" />
        </button>
      )}

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={toggleSupport}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md h-[700px] bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl neon-glow-electric border border-white/20 overflow-hidden relative">
              {currentTab === 'home' && renderHomeView()}
              {currentTab === 'messages' && renderMessagesView()}
              {currentTab === 'help' && renderHelpView()}
            </div>
          </div>
        </>
      )}
    </>
  );
};
