
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
    <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gray-900/95 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        {detailView && (
          <Button
            variant="ghost"
            size="icon"
            onClick={closeDetailView}
            className="text-white hover:bg-white/10 h-8 w-8 mr-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
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
    <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-white/20 z-20">
      <div className="flex">
        <button
          onClick={() => {
            setCurrentTab('home');
            setDetailView(null);
          }}
          className={`flex-1 flex flex-col items-center py-4 px-3 transition-all duration-200 ${
            currentTab === 'home' && !detailView
              ? 'text-electric-300 bg-electric-300/20 border-t-2 border-electric-300' 
              : 'text-white/60 hover:text-white/80 hover:bg-white/10'
          }`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Kezdőoldal</span>
        </button>
        
        <button
          onClick={() => {
            setCurrentTab('messages');
            setDetailView(null);
          }}
          className={`flex-1 flex flex-col items-center py-4 px-3 transition-all duration-200 ${
            currentTab === 'messages' && !detailView
              ? 'text-electric-300 bg-electric-300/20 border-t-2 border-electric-300' 
              : 'text-white/60 hover:text-white/80 hover:bg-white/10'
          }`}
        >
          <MessageCircle className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Üzenetek</span>
        </button>
        
        <button
          onClick={() => {
            setCurrentTab('help');
            setDetailView(null);
          }}
          className={`flex-1 flex flex-col items-center py-4 px-3 transition-all duration-200 ${
            currentTab === 'help' && !detailView
              ? 'text-electric-300 bg-electric-300/20 border-t-2 border-electric-300' 
              : 'text-white/60 hover:text-white/80 hover:bg-white/10'
          }`}
        >
          <HelpCircle className="w-6 h-6 mb-1" />
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
            question: 'Hogyan szerezhetem meg az ingyen italt?',
            answer: 'Töltsd le az alkalmazást, regisztrálj és azonnal kapsz egy ingyen italt a résztvevő helyszíneken.'
          },
          {
            question: 'Hol használhatom fel az ingyen italt?',
            answer: 'Az összes partnercégünknél, amelyek szerepelnek az alkalmazásban. A térképen találod őket.'
          },
          {
            question: 'Van-e időkorlát az ingyen italra?',
            answer: 'Az ingyen ital kupon 30 napig érvényes az aktiválástól számítva.'
          }
        ]
      },
      'jutalmak': {
        title: 'Jutalmak és kártya összekapcsolás',
        content: [
          {
            question: 'Hogyan kapcsolhatom össze a kártyámat?',
            answer: 'A Profil > Kártyák menüpontban add hozzá a hűségkártyádat vagy bankkártyádat.'
          },
          {
            question: 'Milyen jutalmakat szerezhetek?',
            answer: 'Pontokat gyűjthetsz minden vásárlás után, amelyeket ingyen italokra vagy kedvezményekre válthatasz.'
          }
        ]
      },
      'regisztracio': {
        title: 'Regisztráció és fiókkezelés',
        content: [
          {
            question: 'Hogyan regisztrálhatok?',
            answer: 'Töltsd le az alkalmazást és kövesd a regisztrációs lépéseket. Szükséged lesz egy email címre és telefonszámra.'
          },
          {
            question: 'Hogyan változtathatom meg az adataim?',
            answer: 'A Profil menüben szerkesztheted a személyes adataidat, jelszavadat és értesítési beállításaidat.'
          }
        ]
      },
      'ajanlas': {
        title: 'Ajánlások és megosztás',
        content: [
          {
            question: 'Hogyan hívhatom meg a barátaimat?',
            answer: 'A Megosztás menüben találod a referral linkedet, amelyet elküldhetsz barátaidnak.'
          },
          {
            question: 'Mit kapok, ha meghívok valakit?',
            answer: 'Minden sikeres meghívásért pontokat kapsz, amelyeket jutalmakra válthatasz.'
          }
        ]
      }
    };

    const faqData = content[type!];

    return (
      <div className="flex flex-col h-full">
        {renderHeader()}
        
        <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">{faqData.title}</h3>
          </div>

          <div className="space-y-4">
            {faqData.content.map((item, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-200">
                <h4 className="font-semibold text-white mb-3 text-lg">{item.question}</h4>
                <p className="text-white/80 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Button
              onClick={() => setCurrentTab('messages')}
              className="w-full bg-electric-300 hover:bg-electric-400 text-black font-semibold py-3 rounded-xl"
            >
              További kérdés esetén írj nekünk
            </Button>
          </div>
        </div>
        
        {renderFooterNav()}
      </div>
    );
  };

  const renderHomeView = () => (
    <div className="flex flex-col h-full">
      {renderHeader()}
      
      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Szia! 👋</h3>
          <p className="text-white/80 text-lg">Miben segíthetünk?</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => setCurrentTab('messages')}
            className="w-full h-16 bg-electric-300 hover:bg-electric-400 text-black font-semibold text-left flex items-center justify-between rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span className="text-lg">Írj nekünk üzenetet</span>
            <Send className="w-6 h-6" />
          </Button>

          <Button
            onClick={() => setCurrentTab('help')}
            className="w-full h-16 bg-white/10 hover:bg-white/20 text-white font-semibold text-left flex items-center justify-between rounded-xl border-2 border-white/20 hover:border-white/30 transition-all duration-200"
          >
            <span className="text-lg">Keresés a súgóban</span>
            <Search className="w-6 h-6" />
          </Button>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/60 uppercase tracking-wide">Gyakori kérdések</h4>
          
          <div className="space-y-3">
            <button 
              onClick={() => openDetailView('ingyen-italok')}
              className="w-full text-left p-5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-200 hover:border-electric-300/50 hover:shadow-lg group"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold text-lg group-hover:text-electric-300 transition-colors">Ingyen italok</span>
                <span className="text-white/40 text-xl group-hover:text-electric-300 transition-colors">›</span>
              </div>
              <p className="text-white/60 text-sm mt-2">Hogyan szerezd meg és használd fel az ingyen italokat</p>
            </button>
            
            <button 
              onClick={() => openDetailView('jutalmak')}
              className="w-full text-left p-5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-200 hover:border-electric-300/50 hover:shadow-lg group"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold text-lg group-hover:text-electric-300 transition-colors">Jutalmak és kártya összekapcsolás</span>
                <span className="text-white/40 text-xl group-hover:text-electric-300 transition-colors">›</span>
              </div>
              <p className="text-white/60 text-sm mt-2">Kártyák hozzáadása és jutalmak kezelése</p>
            </button>
            
            <button 
              onClick={() => openDetailView('regisztracio')}
              className="w-full text-left p-5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-200 hover:border-electric-300/50 hover:shadow-lg group"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold text-lg group-hover:text-electric-300 transition-colors">Regisztráció és fiókkezelés</span>
                <span className="text-white/40 text-xl group-hover:text-electric-300 transition-colors">›</span>
              </div>
              <p className="text-white/60 text-sm mt-2">Fiók létrehozása és személyes adatok kezelése</p>
            </button>

            <button 
              onClick={() => openDetailView('ajanlas')}
              className="w-full text-left p-5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-200 hover:border-electric-300/50 hover:shadow-lg group"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold text-lg group-hover:text-electric-300 transition-colors">Ajánlások és megosztás</span>
                <span className="text-white/40 text-xl group-hover:text-electric-300 transition-colors">›</span>
              </div>
              <p className="text-white/60 text-sm mt-2">Barátok meghívása és jutalmak szerzése</p>
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

      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32">
        <div className="bg-white/5 rounded-full p-8 mb-6">
          <MessageCircle className="w-16 h-16 text-electric-300" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Nincs üzenet</h3>
        <p className="text-white/60 text-center text-lg max-w-sm">
          A csapat üzenetei itt fognak megjelenni. Írj nekünk, ha segítségre van szükséged!
        </p>
      </div>

      <div className="absolute bottom-20 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent">
        <div className="flex space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Írj nekünk üzenetet..."
            className="flex-1 bg-white/10 border-2 border-white/20 rounded-xl px-4 py-4 text-white placeholder-white/50 focus:outline-none focus:border-electric-300 focus:ring-2 focus:ring-electric-300/20 text-lg"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-electric-300 hover:bg-electric-400 text-black px-5 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Send className="w-6 h-6" />
          </Button>
        </div>
      </div>
      
      {renderFooterNav()}
    </div>
  );

  const renderHelpView = () => (
    <div className="flex flex-col h-full">
      {renderHeader()}

      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        <div className="relative">
          <input
            type="text"
            placeholder="Keresés a súgóban..."
            className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-4 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-electric-300 focus:ring-2 focus:ring-electric-300/20 text-lg"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/40" />
        </div>

        <div className="space-y-4">
          <p className="text-sm text-white/50">4 kategória</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => openDetailView('ingyen-italok')}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:border-electric-300/50 group text-left"
            >
              <h3 className="font-bold text-white mb-3 text-xl group-hover:text-electric-300 transition-colors">Ingyen italok</h3>
              <p className="text-white/70 mb-4 leading-relaxed">
                Minden amit tudnod kell az ingyen italokról, beleértve a megszerzést és felhasználást.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">3 cikk</span>
                <span className="text-sm text-white/40">Szerző: Come Get It Team</span>
              </div>
            </button>

            <button 
              onClick={() => openDetailView('jutalmak')}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:border-electric-300/50 group text-left"
            >
              <h3 className="font-bold text-white mb-3 text-xl group-hover:text-electric-300 transition-colors">Jutalmak és kártyák</h3>
              <p className="text-white/70 mb-4 leading-relaxed">
                Kártyák összekapcsolása, pontgyűjtés és jutalmak kezelése.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">2 cikk</span>
                <span className="text-sm text-white/40">Szerző: Come Get It Team</span>
              </div>
            </button>

            <button 
              onClick={() => openDetailView('regisztracio')}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:border-electric-300/50 group text-left"
            >
              <h3 className="font-bold text-white mb-3 text-xl group-hover:text-electric-300 transition-colors">Fiók és regisztráció</h3>
              <p className="text-white/70 mb-4 leading-relaxed">
                Regisztráció, bejelentkezés és fiókadatok kezelése.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">2 cikk</span>
                <span className="text-sm text-white/40">Szerző: Come Get It Team</span>
              </div>
            </button>

            <button 
              onClick={() => openDetailView('ajanlas')}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 cursor-pointer transition-all duration-200 hover:border-electric-300/50 group text-left"
            >
              <h3 className="font-bold text-white mb-3 text-xl group-hover:text-electric-300 transition-colors">Ajánlások és megosztás</h3>
              <p className="text-white/70 mb-4 leading-relaxed">
                Barátok meghívása és referral jutalmak megszerzése.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">2 cikk</span>
                <span className="text-sm text-white/40">Szerző: Come Get It Team</span>
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
              {renderCurrentView()}
            </div>
          </div>
        </>
      )}
    </>
  );
};
