
import React, { useEffect, useState } from 'react';
import { MessageCircle, X, Send, Search, Home, HelpCircle, ArrowLeft, ThumbsUp, ThumbsDown, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';

type MainTab = 'home' | 'messages' | 'help';
type DetailView = 'ingyen-italok' | 'jutalmak' | 'regisztracio' | 'ajanlas' | null;

export const CustomerSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<MainTab>('home');
  const [detailView, setDetailView] = useState<DetailView>(null);
  const [message, setMessage] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useI18n();

  // Listen for global open-support events (from MobileNavigation, etc.)
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener('open-support', open);
    window.addEventListener('open_support', open);
    window.addEventListener('openSupport', open);
    return () => {
      window.removeEventListener('open-support', open);
      window.removeEventListener('open_support', open);
      window.removeEventListener('openSupport', open);
    };
  }, []);

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
          <span className="text-xs">{t('support.tabs.home')}</span>
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
          <span className="text-xs">{t('support.tabs.messages')}</span>
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
          <span className="text-xs">{t('support.tabs.help')}</span>
        </button>
      </div>
    </div>
  );

  const renderFeedbackSection = () => (
    <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <p className="text-white text-center mb-4">{t('support.feedback.question')}</p>
      <div className="flex justify-center space-x-4">
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg border border-green-600/30 transition-colors">
          <ThumbsUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm">{t('support.feedback.yes')}</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg border border-red-600/30 transition-colors">
          <ThumbsDown className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm">{t('support.feedback.no')}</span>
        </button>
      </div>
    </div>
  );

  const renderFAQDetail = (type: DetailView) => {
    const content = {
      'ingyen-italok': {
        title: 'Ingyen italok? Igen, jól hallottad!',
        sections: [
          {
            id: 'miert-adunk',
            title: 'Miért adunk ingyen italokat?',
            content: 'Egyszerűen azért, mert hisszük, hogy mindenkinek jár egy kis öröm, és közben a legmenőbb italmárkákkal dolgozunk együtt, hogy elsőként próbálhasd ki a legújabb italokat. Ezek a márkák szeretnének bemutatkozni neked, a bárok pedig örömmel látják, ha új arcok érkeznek hozzájuk.\n\nA te jelenléted, visszajelzésed és véleményed aranyat ér – segítesz abban, hogy a kedvenc italaid még jobbak legyenek, új ízeket fedezz fel, és közben olyan helyeket is kipróbálj, ahová magadtól talán sosem mennél el.'
          },
          {
            id: 'hogyan-juthatsz',
            title: 'Hogyan juthatsz hozzá egy ingyen italhoz?',
            content: 'Folyamatosan indítunk új ingyen italos akciókat, szóval érdemes résen lenni!\nNézd meg az applikációban a bárlistát, vagy keresd a térképen az „ingyen ital" jelzést – ezek mutatják, hol vár rád a következő pohár öröm.\n\nAmikor a helyszínre érsz, csak nyomd meg az „Ingyen ital" gombot, és mutasd meg a pultosnak a visszaigazoló képernyőt. Ennyi az egész!\n\nNe felejtsd el értékelni a helyet, a kiszolgálást és magát az italt! Az őszinte véleményed sokat számít – mind a bár, mind a márka számára hasznos visszajelzés lesz (és természetesen teljesen anonim módon).'
          },
          {
            id: 'miert-nem-latok',
            title: 'Miért nem látok most ital ajánlatokat?',
            content: 'Előfordulhat, hogy éppen nincs aktív kampány a városodban. Ne aggódj, hamarosan visszatérünk újabb meglepetésekkel! Addig is, ha a partner bárjainkban a regisztrált kártyáddal fizetsz, exkluzív ajánlatokat és hűségjutalmakat gyűjthetsz.'
          },
          {
            id: 'miert-zarolva',
            title: 'Miért van zárolva nálam az ingyen ital lehetőség?',
            content: 'Az ingyen italok csak akkor érhetők el, ha összekapcsolod a bankkártyádat a Come Get It Rewards rendszerével. Ezzel nemcsak az italokhoz jutsz hozzá, hanem minden fogyasztásod után pontokat is gyűjtesz, amit további jutalmakra válthatsz be. Szóval tényleg megéri! A részleteket megtalálod az alkalmazásban.'
          },
          {
            id: 'van-limit',
            title: 'Van valamilyen limit?',
            content: 'Igen, egy este mindenki csak egy ingyen italt válthat be – de ne aggódj, a helyszínen további kedvezmények és exkluzív ajánlatok is várnak!'
          },
          {
            id: 'adhatok-visszajelzest',
            title: 'Adhatok még több visszajelzést?',
            content: 'Igen! Egy-egy ital után lehet, hogy küldünk egy rövid kérdőívet. Őszinte tapasztalataidra nagyon kíváncsiak vagyunk, mert ezek alapján fejlesztjük tovább az élményt.'
          },
          {
            id: 'maradt-kerdes',
            title: 'Maradt még kérdésed?',
            content: 'Írj nekünk bátran a live chat-en! Szívesen segítünk bármiben. 👊'
          }
        ]
      },
      'jutalmak': {
        title: 'Pontok és Jutalmak',
        sections: [
          {
            id: 'mi-az-a-rewards',
            title: 'Mi az a Come Get It Rewards?',
            content: 'A Come Get It Rewards jutalmaz azért, mert kimész és élvezed a város legjobb helyeit. Gyűjts pontokat minden egyes fogyasztásod után a legjobb budapesti (vagy a jövőben más városi) partnerhelyeken – ezeket a pontokat exkluzív jutalmakra, menő márkák kedvezményeire válthatod be. Nincs szükség hűségkártyára, pecsétekre – sőt, még az appot sem kell megnyitnod minden alkalommal (de érdemes, mert mindig vár valami újdonság).'
          },
          {
            id: 'hogyan-szerezhetek-pontokat',
            title: 'Hogyan szerezhetek pontokat?',
            content: 'Pontokat kapsz minden alkalommal, amikor partnerhelyen fogyasztasz. Csak kapcsolod össze a bankkártyád az alkalmazással, és minden, a résztvevő helyeken történő tranzakció után automatikusan járnak a pontok. Bónuszpontokat is szerezhetsz, ha meghívod az ismerőseidet, és ők is csatlakoznak. A tranzakciókat és a meghívások adatait a Profil menüpontban követheted nyomon.'
          },
          {
            id: 'mire-kolthetem',
            title: 'Mire költhetem a pontjaimat?',
            content: 'A jutalmakat gondosan válogattuk össze – a lifestyle termékektől a divaton át a legmenőbb márkák ajánlataiig. Az aktuális kínálatot a Jutalmak fül alatt találod az appban. Folyamatosan bővítjük a kínálatot, ezért érdemes rendszeresen visszanézni, és szívesen várjuk az ötleteidet, hogy milyen márkákat látnál még szívesen!'
          },
          {
            id: 'hogyan-osszekotom',
            title: 'Hogyan tudom összekötni a kártyámat?',
            content: 'Nyisd meg az alkalmazásban a Jutalmak menüpontot, és válaszd a kártya összekötése opciót. Megadhatod manuálisan a kártyaadatokat, vagy egyszerűen be is szkennelheted a kameráddal.'
          },
          {
            id: 'biztonság',
            title: 'Biztonságosak az adataim?',
            content: 'Az adataid 100%-ban biztonságban vannak, és a kártyádat soha nem terheljük meg! A kártya összekötéséhez a Fidel.uk (Fidel API) biztonságos és PCI tanúsított SDK-ját használjuk. A kártyaadataidat nem tároljuk, hanem tokenizáljuk (titkosított azonosítóvá alakítjuk), amit a Fidel használ, hogy felismerje a Visa, Mastercard és American Express tranzakciókat, és rögzítse a jogosult vásárlásokat.'
          },
          {
            id: 'kartya-frissitese',
            title: 'Hogyan frissíthetem a kártyaadataimat?',
            content: 'Ha lejár a kártyád, de az új kártya száma nem változik, akkor nincs teendőd – automatikusan működni fog tovább. Ha le akarod cserélni, vagy teljesen új kártyát adnál hozzá, nyisd meg az appban a Profil menüpontot, ott válaszd a „Kapcsolt kártyák megtekintése" opciót, és ott tudod kezelni a kártyáidat.'
          },
          {
            id: 'minden-tranzakcio',
            title: 'Minden tranzakciómat látjátok?',
            content: 'Csak azokhoz a tranzakciókhoz férünk hozzá, amelyeket a partnerhelyeken, a regisztrált kártyáddal fizetsz a kártyaterminálokon keresztül.'
          },
          {
            id: 'lejarnak-pontok',
            title: 'Lejárnak a pontjaim?',
            content: 'A pontjaid soha nem járnak le, bármennyit gyűjthetsz, hogy beválthasd a nagyobb jutalmakat is.'
          },
          {
            id: 'online-fizetes',
            title: 'Támogatjátok az online fizetéseket (asztalnál rendelést)?',
            content: 'Sajnos nem támogatjuk az online, asztalnál történő rendeléseket vagy fizetéseket. Csak a kártyaterminálokon, partnerhelyeken végrehajtott tranzakciókat tudjuk figyelembe venni.'
          },
          {
            id: 'miert-nem-kaptam-pontot',
            title: 'Miért nem kaptam pontot egy tranzakció után?',
            content: 'Ha most kapcsolsz össze először Mastercardot, akár egy hétbe is telhet, mire megérkeznek az első tranzakciós adatok. Ez idő alatt is gyűlnek a pontok, de csak később jelennek meg az appban. Ha ezután sem kapod meg a pontokat, vedd fel velünk a kapcsolatot élő chaten, csatolj vásárlási bizonylatot, és segítünk! A Come Get It csak az elmúlt 7 nap tranzakcióit tudja utólag jóváírni.'
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

    // Handle sections-based content (ingyen-italok and jutalmak)
    if ('sections' in faqData) {
      const scrollToSection = (sectionId: string) => {
        setSelectedSection(sectionId);
        setIsDropdownOpen(false);
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };

      return (
        <div className="flex flex-col h-full bg-gray-900">
          {renderHeader()}
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">{faqData.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{t('support.faq_label')}</p>
              
              {/* Table of Contents Dropdown */}
              <div className="relative mb-6">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-left text-white flex items-center justify-between hover:bg-gray-700 transition-colors"
                >
                  <span className="text-sm font-medium">
                    {selectedSection ? faqData.sections.find(s => s.id === selectedSection)?.title : t('support.toc')}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                    {faqData.sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors border-b border-gray-700 last:border-b-0"
                      >
                        {section.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 pb-20">
              {faqData.sections.map((section) => (
                <div 
                  key={section.id} 
                  id={section.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
                >
                  <h4 className="font-semibold text-white mb-3 text-base leading-relaxed">{section.title}</h4>
                  <div className="text-gray-300 leading-relaxed text-sm">
                    {section.content.split('\n').map((paragraph, index) => (
                      <p key={index} className={paragraph.trim() ? 'mb-3' : 'mb-2'}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {renderFeedbackSection()}

            <div className="mt-6 pb-20">
              <Button
                onClick={() => setCurrentTab('messages')}
                className="w-full bg-electric-300 hover:bg-electric-400 text-black font-semibold py-3 rounded-xl"
              >
                {t('support.contact_button')}
              </Button>
            </div>
          </div>
          
          <div className="fixed bottom-0 left-0 right-0">
            {renderFooterNav()}
          </div>
        </div>
      );
    }

    // Handle content-based sections (regisztracio and ajanlas)
    return (
      <div className="flex flex-col h-full bg-gray-900">
        {renderHeader()}
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2">{faqData.title}</h3>
            <p className="text-gray-400 text-sm">Gyakori kérdések és válaszok</p>
          </div>

          <div className="space-y-4 pb-20">
            {Array.isArray(faqData.content) && faqData.content.map((item, index) => (
              <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-white mb-3 text-base leading-relaxed">{item.question}</h4>
                <p className="text-gray-300 leading-relaxed text-sm">{item.answer}</p>
              </div>
            ))}
          </div>

          {renderFeedbackSection()}

          <div className="mt-6 pb-20">
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
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <h2 className="text-base font-semibold text-white">Come Get It</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-6 h-6 bg-electric-300 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-black">CG</span>
            </div>
            <div className="w-6 h-6 bg-ocean-400 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">IT</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSupport}
            className="text-white hover:bg-white/10 h-6 w-6"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-1">Szia! 👋</h3>
          <p className="text-sm text-gray-400">Miben segíthetünk?</p>
        </div>

        <div className="space-y-2 mb-4">
          <Button
            onClick={() => setCurrentTab('messages')}
            className="w-full h-11 bg-electric-300 hover:bg-electric-400 text-black font-medium text-left flex items-center justify-between rounded-xl"
          >
            <span>Írj nekünk üzenetet</span>
            <Send className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => setCurrentTab('help')}
            className="w-full h-11 bg-ocean-600 hover:bg-ocean-700 text-white font-medium text-left flex items-center justify-between rounded-xl"
          >
            <span>Keresés a súgóban</span>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <button 
            onClick={() => openDetailView('ingyen-italok')}
            className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium text-sm">Ingyen italok</span>
              <span className="text-electric-300">›</span>
            </div>
          </button>
          
          <button 
            onClick={() => openDetailView('jutalmak')}
            className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium text-sm">Pontok és Jutalmak</span>
              <span className="text-electric-300">›</span>
            </div>
          </button>
          
          <button 
            onClick={() => openDetailView('regisztracio')}
            className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium text-sm">Fiók és regisztráció</span>
              <span className="text-electric-300">›</span>
            </div>
          </button>

          <button 
            onClick={() => openDetailView('ajanlas')}
            className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium text-sm">Ajánlások és megosztás</span>
              <span className="text-electric-300">›</span>
            </div>
          </button>
        </div>
      </div>
      
      <div className="bg-gray-900 border-t border-gray-700">
        <div className="flex">
          <button
            onClick={() => {
              setCurrentTab('home');
              setDetailView(null);
            }}
            className="flex-1 flex flex-col items-center py-2 px-2 transition-all duration-200 text-electric-300 bg-electric-300/10"
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Kezdőoldal</span>
          </button>
          
          <button
            onClick={() => {
              setCurrentTab('messages');
              setDetailView(null);
            }}
            className="flex-1 flex flex-col items-center py-2 px-2 transition-all duration-200 text-gray-400 hover:text-white"
          >
            <MessageCircle className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Üzenetek</span>
          </button>
          
          <button
            onClick={() => {
              setCurrentTab('help');
              setDetailView(null);
            }}
            className="flex-1 flex flex-col items-center py-2 px-2 transition-all duration-200 text-gray-400 hover:text-white"
          >
            <HelpCircle className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Súgó</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderMessagesView = () => (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <h2 className="text-base font-semibold text-white">Üzenetek</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-6 h-6 bg-electric-300 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-black">CG</span>
            </div>
            <div className="w-6 h-6 bg-ocean-400 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">IT</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSupport}
            className="text-white hover:bg-white/10 h-6 w-6"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 rounded-full p-4 mb-3">
          <MessageCircle className="w-8 h-8 text-electric-300" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Nincs üzenet</h3>
        <p className="text-gray-400 text-center text-sm max-w-sm">
          A csapat üzenetei itt fognak megjelenni. Írj nekünk, ha segítségre van szükséged!
        </p>
      </div>

      <div className="p-3 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Írj nekünk üzenetet..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electric-300 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-electric-300 hover:bg-electric-400 text-black px-3 py-2 rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-900 border-t border-gray-700">
        <div className="flex">
          <button
            onClick={() => {
              setCurrentTab('home');
              setDetailView(null);
            }}
            className="flex-1 flex flex-col items-center py-2 px-2 transition-all duration-200 text-gray-400 hover:text-white"
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Kezdőoldal</span>
          </button>
          
          <button
            onClick={() => {
              setCurrentTab('messages');
              setDetailView(null);
            }}
            className="flex-1 flex flex-col items-center py-2 px-2 transition-all duration-200 text-electric-300 bg-electric-300/10"
          >
            <MessageCircle className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Üzenetek</span>
          </button>
          
          <button
            onClick={() => {
              setCurrentTab('help');
              setDetailView(null);
            }}
            className="flex-1 flex flex-col items-center py-2 px-2 transition-all duration-200 text-gray-400 hover:text-white"
          >
            <HelpCircle className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Súgó</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderHelpView = () => (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <h2 className="text-base font-semibold text-white">Súgó</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSupport}
          className="text-white hover:bg-white/10 h-6 w-6"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Keresés a súgóban..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electric-300 text-sm"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        <div className="space-y-3">
          <p className="text-xs text-gray-400 font-medium">4 gyűjtemény</p>
          
          <div className="space-y-2">
            <button 
              onClick={() => openDetailView('ingyen-italok')}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 hover:bg-gray-800 transition-all duration-200 group text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm mb-1">Ingyen Italok</h3>
                  <p className="text-xs text-gray-400 mb-1">Tudj meg mindent az ingyen italokról és hogyan juthatók hozzá.</p>
                  <span className="text-[10px] text-electric-300">1 cikk</span>
                </div>
                <span className="text-electric-300 text-lg ml-2">›</span>
              </div>
            </button>

            <button 
              onClick={() => openDetailView('jutalmak')}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 hover:bg-gray-800 transition-all duration-200 group text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm mb-1">Pontok és Jutalmak</h3>
                  <p className="text-xs text-gray-400 mb-1">Minden a Come Get It Rewards rendszerről és pontgyűjtésről.</p>
                  <span className="text-[10px] text-electric-300">10 cikk</span>
                </div>
                <span className="text-electric-300 text-lg ml-2">›</span>
              </div>
            </button>

            <button 
              onClick={() => openDetailView('regisztracio')}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 hover:bg-gray-800 transition-all duration-200 group text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm mb-1">Fiók és regisztráció</h3>
                  <p className="text-xs text-gray-400 mb-1">Regisztráció, fiókkezelés és beállítások.</p>
                  <span className="text-[10px] text-electric-300">2 cikk</span>
                </div>
                <span className="text-electric-300 text-lg ml-2">›</span>
              </div>
            </button>

            <button 
              onClick={() => openDetailView('ajanlas')}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 hover:bg-gray-800 transition-all duration-200 group text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm mb-1">Ajánlások és megosztás</h3>
                  <p className="text-xs text-gray-400 mb-1">Barátok meghívása és ajánlási rendszer.</p>
                  <span className="text-[10px] text-electric-300">2 cikk</span>
                </div>
                <span className="text-electric-300 text-lg ml-2">›</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900 border-t border-gray-700">
        <div className="flex">
          <button
            onClick={() => {
              setCurrentTab('home');
              setDetailView(null);
            }}
            className="flex-1 flex flex-col items-center py-2 px-2 transition-all duration-200 text-gray-400 hover:text-white"
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Kezdőoldal</span>
          </button>
          
          <button
            onClick={() => {
              setCurrentTab('messages');
              setDetailView(null);
            }}
            className="flex-1 flex flex-col items-center py-2 px-2 transition-all duration-200 text-gray-400 hover:text-white"
          >
            <MessageCircle className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Üzenetek</span>
          </button>
          
          <button
            onClick={() => {
              setCurrentTab('help');
              setDetailView(null);
            }}
            className="flex-1 flex flex-col items-center py-2 px-2 transition-all duration-200 text-electric-300 bg-electric-300/10"
          >
            <HelpCircle className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Súgó</span>
          </button>
        </div>
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
          
          <div className="fixed inset-0 z-50 md:flex md:items-center md:justify-end md:p-4">
            <div className="w-full h-full md:w-[500px] lg:w-[600px] xl:w-[700px] md:h-[80vh] lg:h-[85vh] bg-gray-900 md:rounded-2xl shadow-2xl border border-gray-700 overflow-hidden relative">
              {renderCurrentView()}
            </div>
          </div>
        </>
      )}
    </>
  );
};
