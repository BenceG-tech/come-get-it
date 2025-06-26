
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const quickQuestions = [
    'Hogyan kaphatok ingyen italt?',
    'Hogyan tudom összekötni a kártyám?',
    'Hogyan válthatok be pontokat?',
    'Hogyan tudok barátokat meghívni?'
  ];

  const faqContent = {
    'ingyen-italok': {
      title: 'Ingyen italok',
      articles: [
        { title: 'Regisztráció után azonnal', content: 'Regisztrálj az appban és azonnal kapsz egy ingyenes italt a partnereknél.' },
        { title: 'Partnerhelyek térképe', content: 'Minden partnerhelyen használható, amelyek az app térképén szerepelnek.' },
        { title: 'Érvényesség időtartama', content: 'A kupon 30 napig használható az aktiválástól számítva.' }
      ]
    },
    'jutalmak': {
      title: 'Jutalmak',
      articles: [
        { title: 'Kártya összekapcsolás', content: 'Profil > Kártyák menüben add hozzá a hűségkártyádat.' },
        { title: 'Pontgyűjtés rendszere', content: 'Minden vásárlás után pontokat kapsz, amelyeket jutalmakra válthatasz.' }
      ]
    },
    'regisztracio': {
      title: 'Fiók kezelés',
      articles: [
        { title: 'Új fiók létrehozása', content: 'Email cím és telefonszám szükséges a regisztrációhoz.' },
        { title: 'Adatok szerkesztése', content: 'Profil menüben szerkesztheted az adataidat és beállításaidat.' }
      ]
    },
    'ajanlas': {
      title: 'Ajánlások',
      articles: [
        { title: 'Barátok meghívása', content: 'Megosztás menüben találod a referral linkedet.' },
        { title: 'Meghívási jutalmak', content: 'Minden sikeres meghívásért pontokat kapsz.' }
      ]
    }
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-3 border-b border-white/10 bg-gray-900/98">
      <div className="flex items-center space-x-2">
        {detailView && (
          <Button
            variant="ghost"
            size="icon"
            onClick={closeDetailView}
            className="text-white hover:bg-white/10 w-7 h-7"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <h2 className="text-sm font-bold text-white">Come Get It</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSupport}
        className="text-white hover:bg-white/10 w-7 h-7"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderFooterNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/98 border-t border-white/10 z-50">
      <div className="flex">
        <button
          onClick={() => {
            setCurrentTab('home');
            setDetailView(null);
          }}
          className={`flex-1 flex flex-col items-center py-2 px-2 transition-all ${
            currentTab === 'home' && !detailView
              ? 'text-electric-300 bg-electric-300/10' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span className="text-xs">Kezdőlap</span>
        </button>
        
        <button
          onClick={() => {
            setCurrentTab('messages');
            setDetailView(null);
          }}
          className={`flex-1 flex flex-col items-center py-2 px-2 transition-all ${
            currentTab === 'messages' && !detailView
              ? 'text-electric-300 bg-electric-300/10' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          <MessageCircle className="w-4 h-4 mb-0.5" />
          <span className="text-xs">Üzenetek</span>
        </button>
        
        <button
          onClick={() => {
            setCurrentTab('help');
            setDetailView(null);
          }}
          className={`flex-1 flex flex-col items-center py-2 px-2 transition-all ${
            currentTab === 'help' && !detailView
              ? 'text-electric-300 bg-electric-300/10' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4 mb-0.5" />
          <span className="text-xs">Súgó</span>
        </button>
      </div>
    </div>
  );

  const renderFAQDetail = (type: DetailView) => {
    const content = faqContent[type!];

    return (
      <div className="flex flex-col h-full">
        {renderHeader()}
        
        <div className="flex-1 p-4 space-y-3 overflow-y-auto pb-16">
          <h3 className="text-lg font-bold text-white mb-3">{content.title}</h3>

          <div className="space-y-2">
            {content.articles.map((article, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-3">
                <h4 className="font-medium text-white text-sm mb-1">{article.title}</h4>
                <p className="text-white/70 text-xs leading-relaxed">{article.content}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setCurrentTab('messages')}
            className="w-full bg-electric-300 hover:bg-electric-400 text-black font-medium py-2 text-sm mt-4"
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
      
      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-16">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-white mb-1">Miben segíthetünk?</h3>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => setCurrentTab('messages')}
            className="w-full bg-electric-300 hover:bg-electric-400 text-black font-medium py-2.5 text-sm"
          >
            Írj nekünk üzenetet
          </Button>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Keresés a súgóban..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 pr-10 text-white placeholder-white/50 text-sm"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/80">Gyors kérdések</h4>
          
          <div className="space-y-2">
            {quickQuestions.map((question, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                <p className="text-white/80 text-xs">{question}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setCurrentTab('help')}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 text-sm py-2 mt-3"
          >
            További kérdésekért böngéssz a súgóban!
          </Button>
        </div>
      </div>
      
      {renderFooterNav()}
    </div>
  );

  const renderMessagesView = () => (
    <div className="flex flex-col h-full">
      {renderHeader()}

      <div className="flex-1 flex flex-col items-center justify-center p-4 pb-32">
        <div className="text-center">
          <MessageCircle className="w-10 h-10 text-electric-300 mx-auto mb-3" />
          <h3 className="text-base font-medium text-white mb-1">Nincs üzenet</h3>
          <p className="text-white/60 text-sm">
            Írj nekünk bármikor!
          </p>
        </div>
      </div>

      <div className="fixed bottom-14 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Írj nekünk üzenetet..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-electric-300 hover:bg-electric-400 text-black px-3 py-2"
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

      <div className="flex-1 p-4 space-y-3 overflow-y-auto pb-16">
        <div className="space-y-2">
          {Object.entries(faqContent).map(([key, content]) => (
            <button 
              key={key}
              onClick={() => openDetailView(key as DetailView)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all text-left"
            >
              <h3 className="font-medium text-white text-sm mb-1">{content.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">{content.articles.length} cikk</span>
                <span className="text-white/40">›</span>
              </div>
            </button>
          ))}
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
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-electric-300 hover:bg-electric-400 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105"
        >
          <MessageCircle className="w-5 h-5 text-black" />
        </button>
      )}

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-40"
            onClick={toggleSupport}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm h-[500px] bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl border border-white/20 overflow-hidden">
              {renderCurrentView()}
            </div>
          </div>
        </>
      )}
    </>
  );
};
