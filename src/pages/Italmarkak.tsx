
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Compass, CreditCard, Wine, Gift, Rocket } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';

const Italmarkak = () => {
  const brandImage = "/lovable-uploads/cb1f8184-6bb7-49c6-a584-71e3e7223c07.png";

  const howItWorksSteps = [
    {
      number: "1",
      icon: Wine,
      title: "MUTASD BE",
      description: "Töltsd fel italodat a Come Get It platformra, és mutasd meg a budapesti közönségnek!"
    },
    {
      number: "2",
      icon: Compass,
      title: "TESZTELD",
      description: "A közösség kipróbálja, értékeli, és azonnal visszajelzést ad."
    },
    {
      number: "3",
      icon: Gift,
      title: "GYŰJTS VISSZAJELZÉST",
      description: "Valódi, őszinte vélemények és adatok alapján optimalizálhatsz."
    },
    {
      number: "4",
      icon: Rocket,
      title: "SKÁLÁZD FEL",
      description: "Jusson el italod több helyre, növeld a márkaismertséget és az eladásokat!"
    }
  ];

  const benefits = [
    {
      icon: Compass,
      title: "TRACK CONSUMER JOURNEY",
      description: "Követd nyomon a fogyasztói utat"
    },
    {
      icon: CreditCard,
      title: "SCALE & FLEX YOUR ACTIVATION",
      description: "Skálázd és rugalmasan alakítsd aktivációdat"
    },
    {
      icon: Rocket,
      title: "INCREASE RATE OF SALE",
      description: "Növeld az eladási rátát"
    },
    {
      icon: Wine,
      title: "MEASURE & TARGET WITH REALTIME DATA",
      description: "Mérj és célozz valós idejű adatokkal"
    },
    {
      icon: Gift,
      title: "DRIVE BRAND AWARENESS",
      description: "Növeld a márkaismertséget"
    }
  ];

  const yourActivation = [
    {
      icon: Compass,
      title: "DRIVE VOLUME TRIAL",
      description: "Növeld a próbavásárlásokat"
    },
    {
      icon: Gift,
      title: "IMPROVE CUSTOMER RELATIONSHIPS",
      description: "Javítsd a vásárlói kapcsolatokat"
    },
    {
      icon: Wine,
      title: "TEST NEW SERVES & LIQUIDS",
      description: "Teszteld az új kínálatot és italokat"
    },
    {
      icon: Rocket,
      title: "360 CAMPAIGN TO FIT YOUR MARKETING PLAN",
      description: "360°-os kampány a marketing terveddhez"
    }
  ];

  const statistics = [
    {
      icon: Compass,
      number: "246+",
      label: "FELHASZNÁLÓ"
    },
    {
      icon: Wine,
      number: "91%",
      label: "WOMEN"
    },
    {
      icon: Gift,
      number: "250+",
      label: "PARTNER"
    },
    {
      icon: CreditCard,
      number: "4.8",
      label: "APP RATING"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <MobileNavigation />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-300/20 opacity-40 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ocean-600/20 opacity-25 blur-[80px]"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              ON-TRADE<br />
              <span className="text-electric-300">ACTIVATION</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Indítsd be a márkád Budapest legizgalmasabb közösségében, 
              és érj el új fogyasztói szegmenseket az on-trade piacon.
            </p>
          </div>
          
          <div className="mb-12">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 font-bold py-4 px-12 text-lg rounded-lg transition-all duration-300"
            >
              Request our deck
            </Button>
          </div>

          <div className="flex justify-center">
            <PhoneMockup imageUrl={brandImage} className="scale-90" />
          </div>
        </div>
      </section>

      {/* How It Works - Clean 2x2 Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight">
              HOW IT WORKS
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-6xl font-black text-black mb-6">
                  {step.number}
                </div>
                
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <h4 className="text-xl font-black text-black mb-4 tracking-wide">
                  {step.title}
                </h4>
                
                <p className="text-gray-600 leading-relaxed text-base">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-8 py-6 border-b border-gray-800 last:border-b-0">
                <div className="w-12 h-12 flex-shrink-0">
                  <benefit.icon className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-wide text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-lg mt-2">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phone showcase section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <PhoneMockup imageUrl={brandImage} />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
              YOUR KPIs,<br />
              YOUR<br />
              <span className="text-electric-300">ACTIVATION</span>
            </h2>
          </div>
        </div>
      </section>

      {/* Your Activation Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {yourActivation.map((item, index) => (
              <div key={index} className="flex items-center gap-8 py-6 border-b border-gray-800 last:border-b-0">
                <div className="w-12 h-12 flex-shrink-0">
                  <item.icon className="w-12 h-12 text-electric-300" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-lg mt-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-black" />
                <div className="text-4xl font-black text-black mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
            INDÍTSD EL AZ<br />
            <span className="text-electric-300">ÉLMÉNYKAMPÁNYT!</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Írj nekünk, csatlakozz az elsők között!
          </p>
          
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-gray-100 font-black py-6 px-16 text-xl rounded-lg transition-all duration-300"
          >
            KAPCSOLATFELVÉTEL
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </section>

      <CustomerSupport />
    </div>
  );
};

export default Italmarkak;
