
import React, { useState } from 'react';
import { MessageCircle, X, Send, Search, Home, HelpCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type MainTab = 'home' | 'messages' | 'help';
type CategoryView = 'ingyen-italok' | 'jutalmak' | 'fiok-kezeles' | 'ajanlasok' | null;
type QuestionView = string | null;

export const CustomerSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<MainTab>('home');
  const [categoryView, setCategoryView] = useState<CategoryView>(null);
  const [questionView, setQuestionView] = useState<QuestionView>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSupport = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCurrentTab('home');
      setCategoryView(null);
      setQuestionView(null);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Üzenet elküldve:', message);
      setMessage('');
    }
  };

  const openCategory = (category: CategoryView) => {
    setCategoryView(category);
    setQuestionView(null);
  };

  const openQuestion = (question: string) => {
    setQuestionView(question);
  };

  const closeCategory = () => {
    setCategoryView(null);
    setQuestionView(null);
  };

  const closeQuestion = () => {
    setQuestionView(null);
  };

  const categories = {
    'ingyen-italok': {
      title: 'Ingyen italok',
      questions: [
        {
          title: 'Hogyan kaphatok ingyen italt?',
          answer: 'Regisztrálj az appban és azonnal kapsz egy ingyenes italt a partnereknél. A kupon aktiválás után 30 napig érvényes.'
        },
        {
          title: 'Hol használhatom fel az italt?',
          answer: 'Minden partnerhelyen használható, amelyek az app térképén szerepelnek. Mutasd fel a kupont a pultnál.'
        },
        {
          title: 'Mennyi ideig érvényes a kupon?',
          answer: 'A kupon 30 napig használható az aktiválástól számítva. Az lejárat után új kupont kérhetsz.'
        }
      ]
    },
    'jutalmak': {
      title: 'Jutalmak',
      questions: [
        {
          title: 'Hogyan működik a pontgyűjtés?',
          answer: 'Minden vásárlás után pontokat kapsz. Add hozzá a hűségkártyádat a Profil > Kártyák menüben.'
        },
        {
          title: 'Hogyan válthatom be a pontokat?',
          answer: 'A Jutalmak szekció alatt válaszd ki a kívánt jutalmat és váltsd be a pontjaidat.'
        },
        {
          title: 'Mire válthatom be a pontokat?',
          answer: 'Ingyenes italokra, kedvezményekre és exkluzív ajánlatokra válthatod be a pontjaidat.'
        }
      ]
    },
    'fiok-kezeles': {
      title: 'Fiók kezelés',
      questions: [
        {
          title: 'Hogyan tudok regisztrálni?',
          answer: 'Email cím és telefonszám szükséges a regisztrációhoz. Töltsd ki az adatokat és erősítsd meg az emailt.'
        },
        {
          title: 'Elfelejtettem a jelszavam, mit tegyek?',
          answer: 'A bejelentkezési képernyőn kattints az "Elfelejtett jelszó" gombra és kövesd az utasításokat.'
        }
      ]
    },
    'ajanlasok': {
      title: 'Ajánlások',
      questions: [
        {
          title: 'Hogyan tudok barátokat meghívni?',
          answer: 'A Megosztás menüben találod a referral linkedet. Oszd meg barátaiddal és mindketten jutalmat kaptok.'
        },
        {
          title: 'Kapok-e jutalmat, ha meghívok valakit?',
          answer: 'Igen! Minden sikeres meghívásért pontokat kapsz, amit jutalmakra válthatasz be.'
        }
      ]
    }
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-2.5 border-b border-white/10 bg-gray-900/98">
      <div className="flex items-center space-x-2">
        {(categoryView || questionView) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={questionView ? closeQuestion : closeCategory}
            className="text-white hover:bg-white/10 w-6 h-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Button>
        )}
        <h2 className="text-xs font-bold text-white">Come Get It</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSupport}
        className="text-white hover:bg-white/10 w-6 h-6"
      >
        <X className="w-3.5 h-3.5" />
      </Button>
    </div>
  );

  const renderFooterNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/98 border-t border-white/10 z-50">
      <div className="flex h-10">
        <button
          onClick={() => {
            setCurrentTab('home');
            setCategoryView(null);
            setQuestionView(null);
          }}
          className={`flex-1 flex flex-col items-center justify-center transition-all ${
            currentTab === 'home' && !categoryView && !questionView
              ? 'text-electric-300 bg-electric-300/10' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          <Home className="w-3 h-3 mb-0.5" />
          <span className="text-xs leading-none">Kezdőlap</span>
        </button>
        
        <button
          onClick={() => {
            setCurrentTab('messages');
            setCategoryView(null);
            setQuestionView(null);
          }}
          className={`flex-1 flex flex-col items-center justify-center transition-all ${
            currentTab === 'messages' && !categoryView && !questionView
              ? 'text-electric-300 bg-electric-300/10' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          <MessageCircle className="w-3 h-3 mb-0.5" />
          <span className="text-xs leading-none">Üzenetek</span>
        </button>
        
        <button
          onClick={() => {
            setCurrentTab('help');
            setCategoryView(null);
            setQuestionView(null);
          }}
          className={`flex-1 flex flex-col items-center justify-center transition-all ${
            currentTab === 'help' && !categoryView && !questionView
              ? 'text-electric-300 bg-electric-300/10' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          <HelpCircle className="w-3 h-3 mb-0.5" />
          <span className="text-xs leading-none">Súgó</span>
        </button>
      </div>
    </div>
  );

  const renderQuestionDetail = (question: string) => {
    const category = Object.values(categories).find(cat => 
      cat.questions.some(q => q.title === question)
    );
    const questionData = category?.questions.find(q => q.title === question);

    if (!questionData) return null;

    return (
      <div className="flex flex-col h-full">
        {renderHeader()}
        
        <div className="flex-1 p-3 space-y-3 overflow-y-auto pb-12">
          <h3 className="text-sm font-medium text-white mb-2">{questionData.title}</h3>
          <p className="text-xs text-white/80 leading-relaxed">{questionData.answer}</p>
          
          <div className="pt-3 border-t border-white/10 mt-4">
            <button
              onClick={() => setCurrentTab('messages')}
              className="text-xs text-electric-300 hover:text-electric-400 transition-colors"
            >
              További kérdésed van? Írj nekünk!
            </button>
          </div>
        </div>
        
        {renderFooterNav()}
      </div>
    );
  };

  const renderCategoryQuestions = (categoryKey: CategoryView) => {
    const category = categories[categoryKey!];

    return (
      <div className="flex flex-col h-full">
        {renderHeader()}
        
        <div className="flex-1 p-3 space-y-2 overflow-y-auto pb-12">
          <h3 className="text-sm font-medium text-white mb-3">{category.title}</h3>

          <div className="space-y-1.5">
            {category.questions.map((question, index) => (
              <button 
                key={index}
                onClick={() => openQuestion(question.title)}
                className="w-full bg-gray-700/60 hover:bg-gray-700/80 border border-gray-600/40 rounded-lg p-2.5 text-left transition-all"
              >
                <p className="text-xs text-white/90">{question.title}</p>
              </button>
            ))}
          </div>
        </div>
        
        {renderFooterNav()}
      </div>
    );
  };

  const renderHomeView = () => (
    <div className="flex flex-col h-full">
      {renderHeader()}
      
      <div className="flex-1 p-3 space-y-3 overflow-y-auto pb-12">
        <div className="text-center mb-3">
          <h3 className="text-sm font-medium text-white">Miben segíthetünk?</h3>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => setCurrentTab('messages')}
            className="w-full bg-electric-300 hover:bg-electric-400 text-black font-medium py-2 text-xs h-8"
          >
            Írj nekünk üzenetet
          </Button>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Keresés a súgóban..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 pr-8 text-white placeholder-white/50 text-xs h-8"
            />
            <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-white/40" />
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={() => setCurrentTab('help')}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 text-xs py-1.5 h-8"
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

      <div className="flex-1 flex flex-col items-center justify-center p-3 pb-20">
        <div className="text-center">
          <MessageCircle className="w-8 h-8 text-electric-300 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-white mb-1">Nincs üzenet</h3>
          <p className="text-white/60 text-xs">Írj nekünk bármikor!</p>
        </div>
      </div>

      <div className="fixed bottom-10 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/95 to-transparent">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Írj nekünk üzenetet..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 text-white placeholder-white/50 text-xs h-8"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-electric-300 hover:bg-electric-400 text-black px-2.5 py-1.5 h-8"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {renderFooterNav()}
    </div>
  );

  const renderHelpView = () => (
    <div className="flex flex-col h-full">
      {renderHeader()}

      <div className="flex-1 p-3 space-y-2 overflow-y-auto pb-12">
        {Object.entries(categories).map(([key, category]) => (
          <button 
            key={key}
            onClick={() => openCategory(key as CategoryView)}
            className="w-full bg-gray-700/60 hover:bg-gray-700/80 border border-gray-600/40 rounded-lg p-2.5 text-left transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white text-xs mb-0.5">{category.title}</h3>
                <span className="text-xs text-white/50">{category.questions.length} kérdés</span>
              </div>
              <span className="text-white/40 group-hover:text-white/60 transition-colors">›</span>
            </div>
          </button>
        ))}
      </div>
      
      {renderFooterNav()}
    </div>
  );

  const renderCurrentView = () => {
    if (questionView) {
      return renderQuestionDetail(questionView);
    }

    if (categoryView) {
      return renderCategoryQuestions(categoryView);
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
          className="fixed bottom-4 right-4 z-50 w-10 h-10 bg-electric-300 hover:bg-electric-400 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105"
        >
          <MessageCircle className="w-4 h-4 text-black" />
        </button>
      )}

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-40"
            onClick={toggleSupport}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
            <div className="w-full max-w-sm h-80 bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl border border-white/20 overflow-hidden">
              {renderCurrentView()}
            </div>
          </div>
        </>
      )}
    </>
  );
};
