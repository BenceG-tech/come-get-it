
import React, { useState } from 'react';
import { MessageCircle, X, Send, Search, Home, HelpCircle, ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react';
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
    <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center space-x-3">
        {detailView && (
          <Button
            variant="ghost"
            size="icon"
            onClick={closeDetailView}
            className="text-white hover:bg-white/10 h-8 w-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <h2 className="text-lg font-semibold text-white">Come Get It</h2>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-electric-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-black">CG</span>
          </div>
          <div className="w-8 h-8 bg-ocean-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">IT</span>
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
    </div>
  );

  const renderFooterNav = () => (
    <div className="bg-gray-900 border-t border-gray-700">
      <div className="flex">
        <button
          onClick={() => {
            setCurrentTab('home');
            setDetailView(null);
          }}
          className={`flex-1 flex flex-col items-center py-3 px-3 transition-all duration-200 ${
            currentTab === 'home' && !detailView
              ? 'text-electric-300 bg-electric-300/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-xs">Kezdőoldal</span>
        </button>
        
        <button
          onClick={() => {
            setCurrentTab('messages');
            setDetailView(null);
          }}
          className={`flex-1 flex flex-col items-center py-3 px-3 transition-all duration-200 ${
            currentTab === 'messages' && !detailView
              ? 'text-electric-300 bg-electric-300/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageCircle className="w-5 h-5 mb-1" />
          <span className="text-xs">Üzenetek</span>
        </button>
        
        <button
          onClick={() => {
            setCurrentTab('help');
            setDetailView(null);
          }}
          className={`flex-1 flex flex-col items-center py-3 px-3 transition-all duration-200 ${
            currentTab === 'help' && !detailView
              ? 'text-electric-300 bg-electric-300/10' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-5 h-5 mb-1" />
          <span className="text-xs">Súgó</span>
        </button>
      </div>
    </div>
  );

  const renderFeedbackSection = () => (
    <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <p className="text-white text-center mb-4">Did this answer your question?</p>
      <div className="flex justify-center space-x-4">
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg border border-green-600/30 transition-colors">
          <ThumbsUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm">Yes</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg border border-red-600/30 transition-colors">
          <ThumbsDown className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm">No</span>
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
      <div className="flex flex-col h-full bg-black">
        {renderHeader()}
        
        <div className="flex-1 overflow-y-auto p-6 pb-32">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">{faqData.title}</h3>
            <p className="text-gray-400 text-sm">Gyakori kérdések és válaszok</p>
          </div>

          <div className="space-y-6">
            {faqData.content.map((item, index) => (
              <div key={index} className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                <h4 className="font-semibold text-white mb-3 text-lg leading-relaxed">{item.question}</h4>
                <p className="text-gray-300 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>

          {renderFeedbackSection()}

          <div className="mt-6">
            <Button
              onClick={() => setCurrentTab('messages')}
              className="w-full bg-electric-300 hover:bg-electric-400 text-black font-semibold py-3 rounded-xl"
            >
              További kérdés esetén írj nekünk
            </Button>
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0">
          {renderFooterNav()}
        </div>
      </div>
    );
  };

  const renderHomeView = () => (
    <div className="flex flex-col h-full bg-black">
      {renderHeader()}
      
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Szia! 👋</h3>
          <p className="text-gray-400 text-lg">Miben segíthetünk?</p>
        </div>

        <div className="space-y-4 mb-8">
          <Button
            onClick={() => setCurrentTab('messages')}
            className="w-full h-14 bg-electric-300 hover:bg-electric-400 text-black font-semibold text-left flex items-center justify-between rounded-xl"
          >
            <span className="text-lg">Írj nekünk üzenetet</span>
            <Send className="w-5 h-5" />
          </Button>

          <Button
            onClick={() => setCurrentTab('help')}
            className="w-full h-14 bg-gray-800 hover:bg-gray-700 text-white font-semibold text-left flex items-center justify-between rounded-xl border border-gray-600"
          >
            <span className="text-lg">Keresés a súgóban</span>
            <Search className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Gyakori kérdések</h4>
          
          <div className="space-y-2">
            <button 
              onClick={() => openDetailView('ingyen-italok')}
              className="w-full text-left p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium text-base group-hover:text-electric-300 transition-colors">Ingyen italok</span>
                <span className="text-gray-400 text-lg group-hover:text-electric-300 transition-colors">›</span>
              </div>
            </button>
            
            <button 
              onClick={() => openDetailView('jutalmak')}
              className="w-full text-left p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium text-base group-hover:text-electric-300 transition-colors">Jutalmak és kártya összekapcsolás</span>
                <span className="text-gray-400 text-lg group-hover:text-electric-300 transition-colors">›</span>
              </div>
            </button>
            
            <button 
              onClick={() => openDetailView('regisztracio')}
              className="w-full text-left p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium text-base group-hover:text-electric-300 transition-colors">Regisztráció és fiókkezelés</span>
                <span className="text-gray-400 text-lg group-hover:text-electric-300 transition-colors">›</span>
              </div>
            </button>

            <button 
              onClick={() => openDetailView('ajanlas')}
              className="w-full text-left p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium text-base group-hover:text-electric-300 transition-colors">Ajánlások és megosztás</span>
                <span className="text-gray-400 text-lg group-hover:text-electric-300 transition-colors">›</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0">
        {renderFooterNav()}
      </div>
    </div>
  );

  const renderMessagesView = () => (
    <div className="flex flex-col h-full bg-black">
      {renderHeader()}

      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-40">
        <div className="bg-gray-800/50 rounded-full p-6 mb-4">
          <MessageCircle className="w-12 h-12 text-electric-300" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Nincs üzenet</h3>
        <p className="text-gray-400 text-center max-w-sm">
          A csapat üzenetei itt fognak megjelenni. Írj nekünk, ha segítségre van szükséged!
        </p>
      </div>

      <div className="fixed bottom-16 left-4 right-4 bg-black/95 backdrop-blur-sm">
        <div className="flex space-x-3 p-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Írj nekünk üzenetet..."
            className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-electric-300"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-electric-300 hover:bg-electric-400 text-black px-4 py-3 rounded-xl"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0">
        {renderFooterNav()}
      </div>
    </div>
  );

  const renderHelpView = () => (
    <div className="flex flex-col h-full bg-black">
      {renderHeader()}

      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Keresés a súgóban..."
            className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-electric-300"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-400">4 kategória</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => openDetailView('ingyen-italok')}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:bg-gray-800 transition-all duration-200 group text-left"
            >
              <h3 className="font-bold text-white mb-2 text-xl group-hover:text-electric-300 transition-colors">Ingyen italok</h3>
              <p className="text-gray-300 mb-3 leading-relaxed">
                Minden amit tudnod kell az ingyen italokról, beleértve a megszerzést és felhasználást.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">3 cikk</span>
                <span className="text-sm text-gray-500">Come Get It Team</span>
              </div>
            </button>

            <button 
              onClick={() => openDetailView('jutalmak')}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:bg-gray-800 transition-all duration-200 group text-left"
            >
              <h3 className="font-bold text-white mb-2 text-xl group-hover:text-electric-300 transition-colors">Jutalmak és kártyák</h3>
              <p className="text-gray-300 mb-3 leading-relaxed">
                Kártyák összekapcsolása, pontgyűjtés és jutalmak kezelése.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">2 cikk</span>
                <span className="text-sm text-gray-500">Come Get It Team</span>
              </div>
            </button>

            <button 
              onClick={() => openDetailView('regisztracio')}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:bg-gray-800 transition-all duration-200 group text-left"
            >
              <h3 className="font-bold text-white mb-2 text-xl group-hover:text-electric-300 transition-colors">Fiók és regisztráció</h3>
              <p className="text-gray-300 mb-3 leading-relaxed">
                Regisztráció, bejelentkezés és fiókadatok kezelése.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">2 cikk</span>
                <span className="text-sm text-gray-500">Come Get It Team</span>
              </div>
            </button>

            <button 
              onClick={() => openDetailView('ajanlas')}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:bg-gray-800 transition-all duration-200 group text-left"
            >
              <h3 className="font-bold text-white mb-2 text-xl group-hover:text-electric-300 transition-colors">Ajánlások és megosztás</h3>
              <p className="text-gray-300 mb-3 leading-relaxed">
                Barátok meghívása és referral jutalmak megszerzése.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">2 cikk</span>
                <span className="text-sm text-gray-500">Come Get It Team</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0">
        {renderFooterNav()}
      </div>
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
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-electric-300 hover:bg-electric-400 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
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
          
          <div className="fixed inset-0 z-50 md:flex md:items-center md:justify-center md:p-4">
            <div className="w-full h-full md:w-full md:max-w-md md:h-[700px] bg-black md:rounded-2xl shadow-2xl border border-gray-700 overflow-hidden relative">
              {renderCurrentView()}
            </div>
          </div>
        </>
      )}
    </>
  );
};
