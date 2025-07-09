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
      brand: 'Come Get It',
      vendeglatohelyek: 'Vendéglátóhelyek',
      italmarkak: 'Italmárkák',
      rewardsPartners: 'Jutalom partnerek',
      accelerator: 'Gyorsító',
      signup: 'Regisztráció',
      partners: 'Partnerek'
    },
    venues: {
      hero: {
        title1: 'LOJALITÁS AHOGY',
        title2: 'KELLENE, VÉGRE',
        subtitle: 'A DUSK felhasználók jutalmat kapnak a te helyed látogatásáért.',
        subtitle2: 'Nincs kártya, nincs bélyegző, nincs macera. Csak zökkenőmentes lojalitás, végre.',
        cta: 'Partnernek jelentkezem'
      },
      howItWorks: {
        title: 'HOGYAN MŰKÖDIK?',
        steps: {
          register: { title: 'REGISZTRÁLJ', description: 'Csatlakozz pár kattintással.' },
          setup: { title: 'ÁLLÍTSD BE', description: 'Add meg ajánlatod és időpontjaid.' },
          welcome: { title: 'FOGADJ VENDÉGEKET', description: 'Növeld a forgalmat, érkeznek az új vendégek.' },
          track: { title: 'KÖVESD AZ EREDMÉNYEKET', description: 'Riportok és statisztikák élőben.' }
        }
      },
      keyFeatures: {
        title: 'KULCS FUNKCIÓK',
        features: {
          traffic: { title: 'NÖVELD A FORGALMAT', description: 'Az alkalmazás növeli a fogyasztást és visszahozza a vendégeket több pontért és jutalmakért.' },
          rewards: { title: 'DUSK JUTALMAK', description: 'Te döntöd el, milyen jutalmakat adsz – és így növeled az újralátogatások számát.' },
          simple: { title: 'EGYSZERŰ BEVEZETÉS', description: 'Semmi extra oktatás vagy berendezés. Minden egyszerűen működik.' },
          footprint: { title: 'KÖVETHETŐ LÁBNYOM', description: 'Küldünk néhány kódot és reklámanyagot a helyed számára - ez minden, amire szükség van.' },
          gps: { title: 'GPS', description: 'Segítünk a vendégeknek megtalálni a helyed és egyszerűen eljutni hozzád.' }
        }
      },
      stats: {
        age: { value: '24', label: 'ÁTLAG ÉLETKOR', description: 'Fiatal, aktív korosztály' },
        millennials: { value: '91%', label: 'MILLENNIÁL & GEN Z ADATBÁZIS', description: 'Célzott demográfia' },
        women: { value: '56%', label: 'NŐI KÖZÖNSÉG', description: 'Kiegyensúlyozott arány' },
        active: { value: '85%', label: 'ESTE/HÉTVÉGÉN AKTÍV', description: 'Rendszeres látogatók' }
      }
    },
    brands: {
      hero: {
        title1: 'ITALMÁRKA',
        title2: 'ÉLMÉNY',
        subtitle: 'Indítsd be a márkád –<br />Budapest legizgalmasabb közösségében!',
        cta: 'Jelentkezz most!'
      },
      howItWorks: {
        title: 'HOGYAN MŰKÖDIK?',
        steps: {
          show: { title: 'MUTASD BE', description: 'Töltsd fel italodat a Come Get It platformra, és mutasd meg a budapesti közönségnek!' },
          test: { title: 'TESZTELD', description: 'A közösség kipróbálja, értékeli, és azonnal visszajelzést ad.' },
          feedback: { title: 'GYŰJTS VISSZAJELZÉST', description: 'Valódi, őszinte vélemények és adatok alapján optimalizálhatsz.' },
          scale: { title: 'SKÁLÁZD FEL', description: 'Jusson el italod több helyre, növeld a márkaismertséget és az eladásokat!' }
        }
      },
      features: {
        title: 'MIT KÍNÁLUNK?',
        reach: { title: 'FOGYASZTÓI ELÉRÉS', description: 'Több ezer új fogyasztó havonta' },
        flexibility: { title: 'RUGALMASSÁG', description: 'Egy helytől országos skálázásig' },
        marketing: { title: 'MARKETING TÁMOGATÁS', description: 'Social media, influencer program' },
        data: { title: 'VALÓS IDEJŰ ADATOK', description: 'Pontos fogyasztási statisztikák' }
      },
      targetAudience: {
        title: 'KINEK AJÁNLJUK?',
        newBrands: { title: 'ÚJ MÁRKÁK', description: 'Boutique, craft brandek' },
        bigBrands: { title: 'NAGY BRANDEK', description: 'Új célcsoportot keresők' },
        alcoholFree: { title: 'ALKOHOLMENTES', description: 'Innovatív healthy opciók' }
      },
      statistics: {
        users: '246+',
        women: '91%',
        partners: '250+',
        rating: '4.8'
      },
      finalCTA: {
        title1: 'INDÍTSD EL AZ',
        title2: 'ÉLMÉNYKAMPÁNYT!',
        subtitle: 'Írj nekünk, csatlakozz az elsők között!',
        cta: 'KAPCSOLATFELVÉTEL'
      }
    },
    rewards: {
      hero: {
        title1: 'JUTALOM &',
        title2: 'KEDVEZMÉNY',
        subtitle: 'Érj el több ezer aktív felhasználót –<br />exkluzív ajánlatokkal és kedvezményekkel!',
        cta: 'Jutalom partner leszek'
      },
      howItWorks: {
        title: 'HOGYAN MŰKÖDIK?',
        steps: {
          register: { title: 'REGISZTRÁLJ', description: 'Lépj be a programba!' },
          create: { title: 'HOZZ LÉTRE AJÁNLATOT', description: 'Adj exkluzív kedvezményt vagy jutalmat.' },
          activate: { title: 'AKTIVÁLD', description: 'Promód azonnal él!' },
          track: { title: 'KÖVESD EREDMÉNYEKET', description: 'Láss élő statisztikákat.' }
        }
      },
      features: {
        title: 'Jutalom rendszer előnyei',
        exclusive: { title: 'Exkluzív ajánlatok', description: 'Hozz létre egyedi kedvezményeket és ajánlatokat az applikáció felhasználóinak.' },
        targeted: { title: 'Célzott elérés', description: 'Juttatd el az ajánlataidat a megfelelő célcsoporthoz és növeld a konverziót.' },
        instant: { title: 'Azonnali aktiváció', description: 'A kupok és kedvezmények azonnal beválthatók, nincs hosszas várakozás.' },
        analytics: { title: 'Részletes statisztikák', description: 'Kövesd nyomon a kampányaid teljesítményét valós idejű adatokkal.' }
      },
      stats: {
        title: 'Jutalom partnereink eredményei',
        redemption: 'Kupon beváltási arány',
        growth: 'Új vásárlók növekedése',
        partners: 'Aktív jutalom partner',
        satisfaction: 'Partner elégedettség'
      }
    },
    accelerator: {
      hero: {
        title1: 'COME GET IT',
        title2: 'GYORSÍTÓ',
        subtitle: 'Indítsd be márkádat –<br />Budapest legdinamikusabb italos közösségében!',
        cta: 'Jelentkezz most!'
      },
      howItWorks: {
        title: 'HOGYAN MŰKÖDIK?',
        steps: {
          apply: { title: 'JELENTKEZZ', description: 'Töltsd ki a pilot jelentkezést' },
          test: { title: 'TESZTELD', description: 'Közösségünk kipróbálja az italodat' },
          feedback: { title: 'GYŰJTS VISSZAJELZÉST', description: 'Valódi, mérhető fogyasztói vélemények' },
          scale: { title: 'SKÁLÁZD FEL', description: 'Indítsd el több helyen – növeld az eladásokat!' }
        }
      },
      packages: {
        title: 'PROGRAMCSOMAGOK ITALMÁRKÁKNAK',
        fresh: {
          title: 'FRESH',
          features: [
            'Minimum 5 helyszín',
            'Közösségi tesztkampány',
            'Fogyasztói visszajelzések, piaci adatok',
            'Social media + PR aktivitás',
            'Influencer jelenlét',
            'Heti riport, ajánlások'
          ]
        },
        superFresh: {
          title: 'SUPER-FRESH',
          features: [
            'Már 1 helyszínnel elindítható',
            'Közvetlen tesztelés a célcsoporton',
            'Social poszt / TikTok reel',
            'Heti visszajelzés',
            'Adatalapú insightok',
            'Márkaismertség boost'
          ]
        }
      },
      benefits: {
        title: 'MIÉRT VÁLASSZ MINKET?',
        speed: { title: 'GYORS PIACRA LÉPÉS', description: 'Minimális időráfordítással' },
        audience: { title: 'CÉLZOTT KÖZÖNSÉG', description: '18-34 éves aktív fiatalok' },
        data: { title: 'VALÓDI FOGYASZTÓI ADATOK', description: 'Mérhető visszajelzések' },
        easy: { title: 'KÖNNYŰ BEVEZETÉS', description: 'Egyszerű indulási folyamat' }
      },
      demographics: {
        title: 'FELHASZNÁLÓI DEMÓ ADATOK'
      },
      finalCTA: {
        title: 'CSATLAKOZZ A PILOTHOZ!',
        subtitle: 'Lépj be az elsők közé, akik meghatározzák<br />Budapest italtrendjeit!',
        cta: 'JELENTKEZZ MOST'
      }
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
      brand: 'Come Get It',
      vendeglatohelyek: 'Venues',
      italmarkak: 'Alcohol Brands',
      rewardsPartners: 'Rewards Partners',
      accelerator: 'Accelerator',
      signup: 'Sign Up',
      partners: 'Partners'
    },
    venues: {
      hero: {
        title1: 'LOYALTY AS IT',
        title2: 'SHOULD BE, FINALLY',
        subtitle: 'DUSK users get rewarded for visiting your venue.',
        subtitle2: 'No cards, no stamps, no hassle. Just seamless loyalty, finally.',
        cta: 'Apply as Partner'
      },
      howItWorks: {
        title: 'HOW IT WORKS?',
        steps: {
          register: { title: 'REGISTER', description: 'Join with a few clicks.' },
          setup: { title: 'SET UP', description: 'Add your offers and schedule.' },
          welcome: { title: 'WELCOME GUESTS', description: 'Increase traffic, new guests are coming.' },
          track: { title: 'TRACK RESULTS', description: 'Live reports and statistics.' }
        }
      },
      keyFeatures: {
        title: 'KEY FEATURES',
        features: {
          traffic: { title: 'INCREASE TRAFFIC', description: 'The app increases consumption and brings customers back for more points and rewards.' },
          rewards: { title: 'DUSK REWARDS', description: 'You decide what rewards to give – and increase repeat visits.' },
          simple: { title: 'EASY IMPLEMENTATION', description: 'No extra training or equipment needed. Everything works simply.' },
          footprint: { title: 'TRACKABLE FOOTPRINT', description: 'We send some codes and promotional materials for your venue - that\'s all you need.' },
          gps: { title: 'GPS', description: 'We help guests find your venue and get there easily.' }
        }
      },
      stats: {
        age: { value: '24', label: 'AVERAGE AGE', description: 'Young, active age group' },
        millennials: { value: '91%', label: 'MILLENNIAL & GEN Z DATABASE', description: 'Targeted demographics' },
        women: { value: '56%', label: 'FEMALE AUDIENCE', description: 'Balanced ratio' },
        active: { value: '85%', label: 'ACTIVE EVENINGS/WEEKENDS', description: 'Regular visitors' }
      }
    },
    brands: {
      hero: {
        title1: 'BEVERAGE BRAND',
        title2: 'EXPERIENCE',
        subtitle: 'Launch your brand –<br />in Budapest\'s most exciting community!',
        cta: 'Apply now!'
      },
      howItWorks: {
        title: 'HOW IT WORKS?',
        steps: {
          show: { title: 'SHOWCASE', description: 'Upload your drink to the Come Get It platform and show it to the Budapest audience!' },
          test: { title: 'TEST', description: 'The community tries it, rates it, and gives immediate feedback.' },
          feedback: { title: 'COLLECT FEEDBACK', description: 'Optimize based on real, honest opinions and data.' },
          scale: { title: 'SCALE UP', description: 'Get your drink to more places, increase brand awareness and sales!' }
        }
      },
      features: {
        title: 'WHAT WE OFFER?',
        reach: { title: 'CONSUMER REACH', description: 'Thousands of new consumers monthly' },
        flexibility: { title: 'FLEXIBILITY', description: 'From one location to nationwide scaling' },
        marketing: { title: 'MARKETING SUPPORT', description: 'Social media, influencer program' },
        data: { title: 'REAL-TIME DATA', description: 'Accurate consumption statistics' }
      },
      targetAudience: {
        title: 'WHO DO WE RECOMMEND IT FOR?',
        newBrands: { title: 'NEW BRANDS', description: 'Boutique, craft brands' },
        bigBrands: { title: 'BIG BRANDS', description: 'Looking for new audiences' },
        alcoholFree: { title: 'ALCOHOL-FREE', description: 'Innovative healthy options' }
      },
      statistics: {
        users: '246+',
        women: '91%',
        partners: '250+',
        rating: '4.8'
      },
      finalCTA: {
        title1: 'LAUNCH YOUR',
        title2: 'EXPERIENCE CAMPAIGN!',
        subtitle: 'Contact us, join the first ones!',
        cta: 'CONTACT US'
      }
    },
    rewards: {
      hero: {
        title1: 'REWARDS &',
        title2: 'DISCOUNTS',
        subtitle: 'Reach thousands of active users –<br />with exclusive offers and discounts!',
        cta: 'Become a rewards partner'
      },
      howItWorks: {
        title: 'HOW IT WORKS?',
        steps: {
          register: { title: 'REGISTER', description: 'Join the program!' },
          create: { title: 'CREATE OFFER', description: 'Give exclusive discounts or rewards.' },
          activate: { title: 'ACTIVATE', description: 'Your promo goes live instantly!' },
          track: { title: 'TRACK RESULTS', description: 'See live statistics.' }
        }
      },
      features: {
        title: 'Rewards system benefits',
        exclusive: { title: 'Exclusive offers', description: 'Create unique discounts and offers for app users.' },
        targeted: { title: 'Targeted reach', description: 'Get your offers to the right target audience and increase conversion.' },
        instant: { title: 'Instant activation', description: 'Coupons and discounts can be redeemed immediately, no long waiting.' },
        analytics: { title: 'Detailed statistics', description: 'Track your campaign performance with real-time data.' }
      },
      stats: {
        title: 'Our rewards partners\' results',
        redemption: 'Coupon redemption rate',
        growth: 'New customer growth',
        partners: 'Active rewards partners',
        satisfaction: 'Partner satisfaction'
      }
    },
    accelerator: {
      hero: {
        title1: 'COME GET IT',
        title2: 'ACCELERATOR',
        subtitle: 'Launch your brand –<br />in Budapest\'s most dynamic beverage community!',
        cta: 'Apply now!'
      },
      howItWorks: {
        title: 'HOW IT WORKS?',
        steps: {
          apply: { title: 'APPLY', description: 'Fill out the pilot application' },
          test: { title: 'TEST', description: 'Our community tries your drink' },
          feedback: { title: 'COLLECT FEEDBACK', description: 'Real, measurable consumer opinions' },
          scale: { title: 'SCALE UP', description: 'Launch in multiple locations – increase sales!' }
        }
      },
      packages: {
        title: 'PROGRAM PACKAGES FOR BEVERAGE BRANDS',
        fresh: {
          title: 'FRESH',
          features: [
            'Minimum 5 locations',
            'Community test campaign',
            'Consumer feedback, market data',
            'Social media + PR activity',
            'Influencer presence',
            'Weekly reports, recommendations'
          ]
        },
        superFresh: {
          title: 'SUPER-FRESH',
          features: [
            'Can start with just 1 location',
            'Direct testing on target audience',
            'Social post / TikTok reel',
            'Weekly feedback',
            'Data-driven insights',
            'Brand awareness boost'
          ]
        }
      },
      benefits: {
        title: 'WHY CHOOSE US?',
        speed: { title: 'FAST MARKET ENTRY', description: 'With minimal time investment' },
        audience: { title: 'TARGETED AUDIENCE', description: '18-34 year old active young people' },
        data: { title: 'REAL CONSUMER DATA', description: 'Measurable feedback' },
        easy: { title: 'EASY IMPLEMENTATION', description: 'Simple launch process' }
      },
      demographics: {
        title: 'USER DEMOGRAPHIC DATA'
      },
      finalCTA: {
        title: 'JOIN THE PILOT!',
        subtitle: 'Be among the first to define<br />Budapest\'s drink trends!',
        cta: 'APPLY NOW'
      }
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