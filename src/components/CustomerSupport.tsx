
import React, { useState } from 'react';
import { MessageCircle, X, Send, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CustomerSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'messages' | 'help' | 'faq'>('main');
  const [message, setMessage] = useState('');

  const toggleSupport = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCurrentView('main');
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Üzenet elküldve:', message);
      setMessage('');
    }
  };

  const renderMainView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-white">COME GET IT</h2>
          <div className="flex space-x-1">
            <div className="w-6 h-6 bg-electric-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-black">CG</span>
            </div>
            <div className="w-6 h-6 bg-ocean-400 rounded-full flex items-center justify-center">
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
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Szia! 👋</h3>
          <p className="text-white/80">Miben segíthetünk?</p>
        </div>

        {/* Main Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => setCurrentView('messages')}
            className="w-full h-14 bg-electric-300 hover:bg-electric-400 text-black font-semibold text-left flex items-center justify-between rounded-xl"
          >
            <span>Írj nekünk üzenetet</span>
            <Send className="w-5 h-5" />
          </Button>

          <Button
            onClick={() => setCurrentView('help')}
            className="w-full h-14 bg-white/10 hover:bg-white/20 text-white font-semibold text-left flex items-center justify-between rounded-xl border border-white/20"
          >
            <span>Keresés a súgóban</span>
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* FAQ Topics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/60 uppercase tracking-wide">Gyakori kérdések</h4>
          
          <div className="space-y-2">
            <button className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Ingyen italok</span>
                <span className="text-white/40">›</span>
              </div>
            </button>
            
            <button className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Jutalmak és kártya összekapcsolás</span>
                <span className="text-white/40">›</span>
              </div>
            </button>
            
            <button className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Regisztráció és fiókkezelés</span>
                <span className="text-white/40">›</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessagesView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-6 border-b border-white/10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentView('main')}
          className="text-white hover:bg-white/10 h-8 w-8 mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-semibold text-white flex-1">Üzenetek</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSupport}
          className="text-white hover:bg-white/10 h-8 w-8"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <MessageCircle className="w-16 h-16 text-white/30 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Nincs üzenet</h3>
        <p className="text-white/60 text-center">
          A csapat üzenetei itt fognak megjelenni
        </p>
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-white/10">
        <div className="flex space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Írj nekünk üzenetet"
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-electric-300 focus:ring-1 focus:ring-electric-300"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-electric-300 hover:bg-electric-400 text-black px-4 py-3 rounded-lg"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderHelpView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-6 border-b border-white/10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentView('main')}
          className="text-white hover:bg-white/10 h-8 w-8 mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-semibold text-white flex-1">Súgó</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSupport}
          className="text-white hover:bg-white/10 h-8 w-8"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Keresés a súgóban"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-electric-300 focus:ring-1 focus:ring-electric-300"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
        </div>

        {/* Collections */}
        <div className="space-y-4">
          <p className="text-sm text-white/50">2 gyűjtemény</p>
          
          <div className="space-y-3">
            <div className="bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/10 cursor-pointer transition-colors">
              <h3 className="font-semibold text-white mb-2">Come Get It App GYIK</h3>
              <p className="text-sm text-white/70 mb-3">
                További információk az app funkcióiról, beleértve a jutalmakat és kártya összekapcsolást.
              </p>
              <span className="text-xs text-white/50">6 cikk</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/10 cursor-pointer transition-colors">
              <h3 className="font-semibold text-white mb-2">Fiók és adatvédelem</h3>
              <p className="text-sm text-white/70 mb-3">
                Fiókkezelés, adatvédelem és biztonsági beállítások kezelése.
              </p>
              <span className="text-xs text-white/50">4 cikk</span>
            </div>
          </div>
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
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-electric-300 hover:bg-electric-400 rounded-full shadow-2xl neon-glow-electric flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6 text-black" />
        </button>
      )}

      {/* Support Panel Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={toggleSupport}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md h-[600px] bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl neon-glow-electric border border-white/10 overflow-hidden">
              {currentView === 'main' && renderMainView()}
              {currentView === 'messages' && renderMessagesView()}
              {currentView === 'help' && renderHelpView()}
            </div>
          </div>
        </>
      )}
    </>
  );
};
