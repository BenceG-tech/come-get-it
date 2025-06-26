
import React, { useState } from 'react';
import { MessageCircle, X, Send, Search, Home, HelpCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type MainTab = 'home' | 'messages' | 'help';
type DetailView = 'ingyen-italok' | 'jutalmak' | 'regisztracio' | 'ajanlas' | null;

export const CustomerSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<MainTab>('home');
  const [detailView, setDetailView] = useState<DetailView>(null);
  const [message, setMessage] = useState('');

  const toggleSupport = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCurrentTab('home');
      setDetailView(null);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Üzenet elküldve:', message);
      setMessage('');
    }
  };

  const openDetailView = (view: DetailView) => {
    setDetailView(view);
  };

  const closeDetailView = () => {
    setDetailView(null);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-3 border-b border-white/10 bg-gray-900/98 backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        {detailView && (
          <Button
            variant="ghost"
            size="icon"
            onClick={closeDetailView}
            className="text-white hover:bg-white/10 h-7 w-7"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <h2 className="text-base font-bold text-white">Come Get It</h2>
        <div className="flex space-x-1">
          <div className="w-4 h-4 bg-electric-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-black">C</span>
          </div>
          <div className="w-4 h-4 bg-ocean-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">G</span>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSupport}
        className="text-white hover:bg-white/10 h-7 w-7"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderFooterNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/98 backdrop-blur-sm border-t border-white/10 z-30">
      <div className="flex">
        <button
          onClick={() => {
            setCurrentTab('home');
            setDetailView(null);
          }}
          className={`flex-1 flex flex-col items-center py-2.5 px-2 transition-all duration-200 ${
            currentTab === 'home' && !detailView
              ? 'text-electric-300 bg-electric-300/15 border-t-2 border-electric-300' 
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-xs font-medium">Kezdőlap</span>
        </button>
        
        <button
          onClick={() => {
            setCurrentTab('messages');
            setDetailView(null);
          }}
          className={`flex-1 flex flex-col items-center py-2.5 px-2 transition-all duration-200 ${
            currentTab === 'messages' && !detailView
              ? 'text-electric-300 bg-electric-300/15 border-t-2 border-electric-300' 
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageCircle className="w-5 h-5 mb-0.5" />
          <span className="text-xs font-medium">Üzenetek</span>
        </button>
        
        <button
          onClick={() => {
            setCurrentTab('help');
            setDetailView(null);
          }}
          className={`flex-1 flex flex-col items-center py-2.5 px-2 transition-all duration-200 ${
            currentTab === 'help' && !detailView
              ? 'text-electric-300 bg-electric-300/15 border-t-2 border-electric-300' 
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-5 h-5 mb-0.5" />
          <span className="text-xs font-medium">Súgó</span>
        </button>
      </div>
    </div>
  );

  const renderFAQDetail = (type: DetailView) => {
    const content = {
      'ingyen-italok': {
        title: 'Ingyen italok',
        content: [
          {
            question: 'Hogyan szerezhetem meg?',
            answer: 'Regisztrálj az appban és azonnal kapsz egy ingyenes italt a partnereknél.'
          },
          {
            question: 'Hol használhatom?',
            answer: 'Minden partnerhelyen, amelyek az app térképén szerepelnek.'
          },
          {
            question: 'Meddig érvényes?',
            answer: 'A kupon 30 napig használható az aktiválástól számítva.'
          }
        ]
      },
      'jutalmak': {
        title: 'Jutalmak',
        content: [
          {
            question: 'Kártya összekapcsolás',
            answer: 'Profil > Kártyák menüben add hozzá a hűségkártyádat.'
          },
          {
            question: 'Pontgyűjtés',
            answer: 'Minden vásárlás után pontokat kapsz, amelyeket jutalmakra válthatasz.'
          }
        ]
      },
      'regisztracio': {
        title: 'Fiók',
        content: [
          {
            question: 'Regisztráció',
            answer: 'Email cím és telefonszám szükséges a regisztrációhoz.'
          },
          {
            question: 'Adatok módosítása',
            answer: 'Profil menüben szerkesztheted az adataidat és beállításaidat.'
          }
        ]
      },
      'ajanlas': {
        title: 'Ajánlások',
        content: [
          {
            question: 'Barátok meghívása',
            answer: 'Megosztás menüben találod a referral linkedet.'
          },
          {
            question: 'Jutalmak',
            answer: 'Minden sikeres meghívásért pontokat kapsz.'
          }
        ]
      }
    };

    const faqData = content[type!];

    return (
      <div className="flex flex-col h-full">
        {renderHeader()}
        
        <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-20">
          <h3 className="text-xl font-bold text-white">{faqData.title}</h3>

          <div className="space-y-3">
            {faqData.content.map((item, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/8 transition-all duration-200">
                <h4 className="font-semibold text-white mb-2">{item.question}</h4>
                <p className="text-white/80 text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setCurrentTab('messages')}
            className="w-full bg-electric-300 hover:bg-electric-400 text-black font-semibold py-2.5 rounded-lg"
          >
            További kérdés esetén írj nekünk
          </Button>
        </div>
        
        {renderFooterNav()}
      </div>
    );
  };

  const renderHomeView = () => (
    <div className="flex flex-col h-full">
      {renderHeader()}
      
      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-20">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Szia! 👋</h3>
          <p className="text-white/80">Miben segíthetünk?</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => setCurrentTab('messages')}
            className="w-full h-12 bg-electric-300 hover:bg-electric-400 text-black font-semibold text-left flex items-center justify-between rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span>Írj nekünk üzenetet</span>
            <Send className="w-5 h-5" />
          </Button>

          <Button
            onClick={() => setCurrentTab('help')}
            className="w-full h-12 bg-white/10 hover:bg-white/20 text-white font-semibold text-left flex items-center justify-between rounded-lg border border-white/20 hover:border-white/30 transition-all duration-200"
          >
            <span>Keresés a súgóban</span>
            <Search className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-medium text-white/60 uppercase tracking-wide">Gyors válaszok</h4>
          
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => openDetailView('ingyen-italok')}
              className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-200 hover:border-electric-300/50 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium group-hover:text-electric-300 transition-colors">Ingyen italok</span>
                <span className="text-white/40 group-hover:text-electric-300 transition-colors">›</span>
              </div>
              <p className="text-white/60 text-xs mt-1">Megszerzés és felhasználás</p>
            </button>
            
            <button 
              onClick={() => openDetailView('jutalmak')}
              className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-200 hover:border-electric-300/50 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium group-hover:text-electric-300 transition-colors">Jutalmak</span>
                <span className="text-white/40 group-hover:text-electric-300 transition-colors">›</span>
              </div>
              <p className="text-white/60 text-xs mt-1">Kártyák és pontgyűjtés</p>
            </button>
            
            <button 
              onClick={() => openDetailView('regisztracio')}
              className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-200 hover:border-electric-300/50 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium group-hover:text-electric-300 transition-colors">Fiók kezelés</span>
                <span className="text-white/40 group-hover:text-electric-300 transition-colors">›</span>
              </div>
              <p className="text-white/60 text-xs mt-1">Regisztráció és beállítások</p>
            </button>

            <button 
              onClick={() => openDetailView('ajanlas')}
              className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-200 hover:border-electric-300/50 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium group-hover:text-electric-300 transition-colors">Ajánlások</span>
                <span className="text-white/40 group-hover:text-electric-300 transition-colors">›</span>
              </div>
              <p className="text-white/60 text-xs mt-1">Barátok meghívása</p>
            </button>
          </div>
        </div>
      </div>
      
      {renderFooterNav()}
    </div>
  );

  const renderMessagesView = () => (
    <div className="flex flex-col h-full">
      {renderHeader()}

      <div className="flex-1 flex flex-col items-center justify-center p-4 pb-32">
        <div className="bg-white/5 rounded-full p-6 mb-4">
          <MessageCircle className="w-12 h-12 text-electric-300" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Nincs üzenet</h3>
        <p className="text-white/60 text-center text-sm max-w-xs">
          Itt jelennek meg a csapat üzenetei. Írj nekünk bármikor!
        </p>
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Írj nekünk üzenetet..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-electric-300 focus:ring-1 focus:ring-electric-300/20 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-electric-300 hover:bg-electric-400 text-black px-3 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {renderFooterNav()}
    </div>
  );

  const renderHelpView = () => (
    <div className="flex flex-col h-full">
      {renderHeader()}

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-20">
        <div className="relative">
          <input
            type="text"
            placeholder="Keresés..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 pr-10 text-white placeholder-white/50 focus:outline-none focus:border-electric-300 focus:ring-1 focus:ring-electric-300/20 text-sm"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
        </div>

        <div className="space-y-3">
          <p className="text-xs text-white/60">Kategóriák</p>
          
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => openDetailView('ingyen-italok')}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:border-electric-300/50 group text-left"
            >
              <h3 className="font-semibold text-white mb-1 group-hover:text-electric-300 transition-colors">Ingyen italok</h3>
              <p className="text-white/70 text-xs mb-2">Ingyen italok megszerzése és felhasználása</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">3 cikk</span>
                <span className="text-xs text-white/40">›</span>
              </div>
            </button>

            <button 
              onClick={() => openDetailView('jutalmak')}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:border-electric-300/50 group text-left"
            >
              <h3 className="font-semibold text-white mb-1 group-hover:text-electric-300 transition-colors">Jutalmak</h3>
              <p className="text-white/70 text-xs mb-2">Kártya összekapcsolás és pontgyűjtés</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">2 cikk</span>
                <span className="text-xs text-white/40">›</span>
              </div>
            </button>

            <button 
              onClick={() => openDetailView('regisztracio')}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:border-electric-300/50 group text-left"
            >
              <h3 className="font-semibold text-white mb-1 group-hover:text-electric-300 transition-colors">Fiók kezelés</h3>
              <p className="text-white/70 text-xs mb-2">Regisztráció és beállítások</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">2 cikk</span>
                <span className="text-xs text-white/40">›</span>
              </div>
            </button>

            <button 
              onClick={() => openDetailView('ajanlas')}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:border-electric-300/50 group text-left"
            >
              <h3 className="font-semibold text-white mb-1 group-hover:text-electric-300 transition-colors">Ajánlások</h3>
              <p className="text-white/70 text-xs mb-2">Barátok meghívása és jutalmak</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">2 cikk</span>
                <span className="text-xs text-white/40">›</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {renderFooterNav()}
    </div>
  );

  const renderCurrentView = () => {
    if (detailView) {
      return renderFAQDetail(detailView);
    }

    switch (currentTab) {
      case 'home':
        return renderHomeView();
      case 'messages':
        return renderMessagesView();
      case 'help':
        return renderHelpView();
      default:
        return renderHomeView();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleSupport}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-electric-300 hover:bg-electric-400 rounded-full shadow-2xl neon-glow-electric flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6 text-black" />
        </button>
      )}

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={toggleSupport}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm h-[600px] bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl neon-glow-electric border border-white/20 overflow-hidden relative">
              {renderCurrentView()}
            </div>
          </div>
        </>
      )}
    </>
  );
};
