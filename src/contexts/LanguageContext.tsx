import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'hu' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'hu';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): any => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  hu: {
    nav: {
      drink: 'DRINK',
      link: 'LINK',
      earn: 'EARN',
      venues: 'Vendéglátóhelyek',
      brands: 'Italmarkok',
      rewardsPartners: 'Rewards partnerek',
      accelerator: 'Come Get It Accelerator',
      signup: 'Regisztrálj most'
    },
    hero: {
      mainTitle: 'Budapest új ital-térképe',
      mainSubtitle: 'Igyál ingyen, gyűjts pontokat, segíts',
      mainDescription: 'Csatlakozz Budapest első ingyen ital alkalmazásához! Fedezd fel a város legjobb helyeit, gyűjts pontokat minden kortyért, és támogass jótékony célokat minden egyes italoddal.',
      venuesTitle: 'Csatlakozz a forradalomhoz!',
      venuesSubtitle: 'Légy részese Budapest új ital-térképének',
      venuesDescription: 'Növeld vendégköreid számát, építs márkaolást és csatlakozz egy olyan közösséghez, amely megváltoztatja a város éjszakai életét.',
      brandsTitle: 'Italmarkok',
      brandsSubtitle: 'Építsd a márkád Budapest új ital-térképén',
      brandsDescription: 'Csatlakozz az alkalmazáshoz, amely összeköti a márkádat a város legjobb vendéglátóhelyeivel és egy aktív, fiatal közösséggel.',
      rewardsTitle: 'Rewards Partnerek',
      rewardsSubtitle: 'Csatlakozz a jutalmazási rendszerünkhöz',
      rewardsDescription: 'Légy részese egy innovatív platform, ahol a vendégek pontokat gyűjtenek, és te nyújthatod a legexkluzívabb jutalmakat.',
      acceleratorTitle: 'Come Get It Accelerator',
      acceleratorSubtitle: 'Gyorsítsd fel az üzleted növekedését',
      acceleratorDescription: 'Csatlakozz az akcelerátorprogramunkhoz, amely segít maximalizálni a bevételeidet és építeni a márkádat Budapest szórakoztatóiparában.'
    },
    drink: {
      title: 'DRINK.',
      subtitle: 'Igyál ingyen minden nap',
      description: 'Válassz egy bárt, mutasd fel az appod, és élvezd az aznapi ingyen italod! Minden nap új élmény, új hely, új társaság.',
      cta: 'Kezdj el inni!'
    },
    link: {
      title: 'LINK.',
      subtitle: 'Köss össze embereket és helyeket',
      description: 'Hozz össze barátokat, fedezz fel új helyeket és építs kapcsolatokat. Az app segít megtalálni a tökéletes helyet minden alkalomra.'
    },
    earn: {
      title: 'EARN.',
      subtitle: 'Gyűjts pontokat és segíts',
      description: 'Gyűjts pontokat minden kortyért, felfedezésért és aktivitásért! Váltsd be őket exkluzív jutalmakra, miközben minden italoddal jótékony célt is támogatsz.'
    },
    fomo: {
      title: 'Legyél alapító tag',
      subtitle: 'Az első 1000 regisztrálónak exkluzív bónusz',
      description: 'Írjuk együtt Budapest új italtérképét',
      cta: 'Regisztrálj most'
    },
    features: {
      title: 'Miért válaszd a Come Get It-et?',
      items: {
        discover: {
          title: 'FEDEZD FEL.',
          description: 'Találd meg Budapest legmenőbb helyeit GPS alapon.',
          benefit: 'Új helyek, új arcok, új élmények – minden nap!'
        },
        earn: {
          title: 'IGYÁL ÉS GYŰJTS.',
          description: 'Minden nap jár egy ingyen ital, minden fogyasztás után pont jár.',
          benefit: 'Pontjaidat értékes jutalmakra válthatod!'
        },
        connect: {
          title: 'KÖSS ÖSSZE.',
          description: 'Hozz össze barátokat, fedezz fel új helyeket.',
          benefit: 'Építs kapcsolatokat minden nap!'
        },
        impact: {
          title: 'SEGÍTS!',
          description: 'Minden ital után automatikusan támogatod a jótékonyságot.',
          benefit: 'Iszol, szórakozol, közben jót teszel – win-win.'
        }
      }
    },
    benefits: {
      title: 'Előnyök mindenkinek',
      users: {
        title: 'Felhasználóknak',
        description: 'Ingyen italok és exkluzív élmények',
        items: [
          'Napi ingyen italok',
          'Pontgyűjtés és jutalmak',
          'Új helyek felfedezése',
          'Jótékony célok támogatása'
        ]
      },
      venues: {
        title: 'Vendéglátóhelyeknek',
        description: 'Több vendég és nagyobb forgalom',
        items: [
          'Új vendégek bevonzása',
          'Márkaépítés',
          'Közösségi marketing',
          'Adatelemzés'
        ]
      },
      sponsors: {
        title: 'Szponzoroknak',
        description: 'Célzott márkaépítés és elérés',
        items: [
          'Fiatal célcsoport elérése',
          'Mérhető eredmények',
          'Márkaasszociáció',
          'Közösségi impact'
        ]
      },
      community: {
        title: 'Közösségnek',
        description: 'Jobb éjszakai élet és társadalmi hatás',
        items: [
          'Élénkebb éjszakai élet',
          'Helyi vállalkozások támogatása',
          'Jótékony célok',
          'Közösségépítés'
        ]
      }
    },
    signup: {
      title: 'Kezdj el ingyen inni már ma!',
      subtitle: 'Csatlakozz Budapest új ital-térképéhez',
      namePlaceholder: 'Teljes név',
      emailPlaceholder: 'Email cím',
      phonePlaceholder: 'Telefonszám',
      submit: 'Regisztrálok',
      success: 'Sikeres regisztráció! Hamarosan jelentkezünk.',
      error: 'Hiba történt a regisztráció során. Próbáld újra!'
    }
  },
  en: {
    nav: {
      drink: 'DRINK',
      link: 'LINK',
      earn: 'EARN',
      venues: 'Venues',
      brands: 'Alcohol Brands',
      rewardsPartners: 'Rewards Partners',
      accelerator: 'Come Get It Accelerator',
      signup: 'Sign Up Now'
    },
    hero: {
      mainTitle: 'Budapest\'s New Drink Map',
      mainSubtitle: 'Drink for free, collect points, make an impact',
      mainDescription: 'Join Budapest\'s first free drink app! Discover the city\'s best spots, collect points with every sip, and support charitable causes with every drink.',
      venuesTitle: 'Join the Revolution!',
      venuesSubtitle: 'Be part of Budapest\'s new drink map',
      venuesDescription: 'Increase your customer base, build your brand, and join a community that\'s changing the city\'s nightlife.',
      brandsTitle: 'Alcohol Brands',
      brandsSubtitle: 'Build your brand on Budapest\'s new drink map',
      brandsDescription: 'Join the app that connects your brand with the city\'s best venues and an active, young community.',
      rewardsTitle: 'Rewards Partners',
      rewardsSubtitle: 'Join our rewards ecosystem',
      rewardsDescription: 'Be part of an innovative platform where customers collect points and you provide the most exclusive rewards.',
      acceleratorTitle: 'Come Get It Accelerator',
      acceleratorSubtitle: 'Accelerate your business growth',
      acceleratorDescription: 'Join our accelerator program that helps maximize your revenue and build your brand in Budapest\'s entertainment industry.'
    },
    drink: {
      title: 'DRINK.',
      subtitle: 'Drink for free every day',
      description: 'Choose a bar, show your app, and enjoy your daily free drink! Every day brings new experiences, new places, new people.',
      cta: 'Start drinking!'
    },
    link: {
      title: 'LINK.',
      subtitle: 'Connect people and places',
      description: 'Bring friends together, discover new places and build connections. The app helps you find the perfect spot for every occasion.'
    },
    earn: {
      title: 'EARN.',
      subtitle: 'Collect points and make an impact',
      description: 'Collect points for every sip, discovery, and activity! Redeem them for exclusive rewards while supporting charitable causes with every drink.'
    },
    fomo: {
      title: 'Become a founding member',
      subtitle: 'Exclusive bonus for the first 1000 registrants',
      description: 'Let\'s write Budapest\'s new drink map together',
      cta: 'Sign up now'
    },
    features: {
      title: 'Why Choose Come Get It?',
      items: {
        discover: {
          title: 'DISCOVER.',
          description: 'Find Budapest\'s coolest spots with GPS.',
          benefit: 'New places, new faces, new experiences – every day!'
        },
        earn: {
          title: 'DRINK & COLLECT.',
          description: 'Daily free drink, points with every sip.',
          benefit: 'Redeem your points for valuable rewards!'
        },
        connect: {
          title: 'CONNECT.',
          description: 'Bring friends together, discover new places.',
          benefit: 'Build connections every day!'
        },
        impact: {
          title: 'MAKE AN IMPACT!',
          description: 'Automatically support charity with every drink.',
          benefit: 'Drink, have fun, do good – win-win.'
        }
      }
    },
    benefits: {
      title: 'Benefits for everyone',
      users: {
        title: 'For Users',
        description: 'Free drinks and exclusive experiences',
        items: [
          'Daily free drinks',
          'Point collection and rewards',
          'Discover new places',
          'Support charitable causes'
        ]
      },
      venues: {
        title: 'For Venues',
        description: 'More customers and increased traffic',
        items: [
          'Attract new customers',
          'Brand building',
          'Social marketing',
          'Data analytics'
        ]
      },
      sponsors: {
        title: 'For Sponsors',
        description: 'Targeted branding and reach',
        items: [
          'Reach young audiences',
          'Measurable results',
          'Brand association',
          'Community impact'
        ]
      },
      community: {
        title: 'For Community',
        description: 'Better nightlife and social impact',
        items: [
          'Vibrant nightlife',
          'Support local businesses',
          'Charitable causes',
          'Community building'
        ]
      }
    },
    signup: {
      title: 'Start drinking for free today!',
      subtitle: 'Join Budapest\'s new drink map',
      namePlaceholder: 'Full name',
      emailPlaceholder: 'Email address',
      phonePlaceholder: 'Phone number',
      submit: 'Sign up',
      success: 'Registration successful! We\'ll be in touch soon.',
      error: 'Registration failed. Please try again!'
    }
  }
};