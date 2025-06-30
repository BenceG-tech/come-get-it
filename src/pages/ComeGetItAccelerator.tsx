
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { PhoneMockup } from '@/components/PhoneMockup';
import { ArrowRight, Rocket, Target, TrendingUp, Users, Lightbulb, Award } from 'lucide-react';
import { CustomerSupport } from '@/components/CustomerSupport';

const ComeGetItAccelerator = () => {
  const acceleratorImage = "/lovable-uploads/15d3c320-446b-4d7c-87b4-8a214e9d2546.png";

  const features = [
    {
      icon: Rocket,
      title: "Gyorsított növekedés",
      description: "Specializált programunk segítségével exponenciálisan növelheted az üzleted."
    },
    {
      icon: Target,
      title: "Személyre szabott stratégia",
      description: "Minden résztvevő egyedi üzleti tervet kap a maximális eredmény érdekében."
    },
    {
      icon: TrendingUp,
      title: "Mérhető eredmények",
      description: "Követhető KPI-k és jelentések a program hatékonyságának mérésére."
    },
    {
      icon: Users,
      title: "Mentor támogatás",
      description: "Tapasztalt szakértők segítik a programban való részvételed."
    },
    {
      icon: Lightbulb,
      title: "Innovatív megoldások",
      description: "A legújabb technológiák és trendek alkalmazása az üzletedben."
    },
    {
      icon: Award,
      title: "Exkluzív előnyök",
      description: "Különleges kedvezmények és szolgáltatások a program résztvevőinek."
    }
  ];

  const stats = [
    { value: "300%", label: "Átlagos forgalom növekedés" },
    { value: "50+", label: "Sikeres program befejező" },
    { value: "6 hónap", label: "Program időtartam" },
    { value: "95%", label: "Sikeres befejezési arány" }
  ];

  const testimonials = [
    {
      name: "Kovács Péter",
      position: "Tulajdonos, Central Café",
      text: "A Come Get It Accelerator program teljesen megváltoztatta az üzletem. Hat hónap alatt 250%-kal nőtt a forgalmam."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-ocean-900"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unified-glow-primary opacity-30 blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-unified-glow-secondary opacity-20 blur-[80px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
                <span className="block text-white mb-2">COME GET IT</span>
                <span className="block text-electric-300">ACCELERATOR</span>
              </h1>
              
              <p className="text-xl text-electric-100 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Válj a jövő vendéglátóhelyévé! Exkluzív fejlesztési programunk 
                segítségével revolutionalizálhatod az üzleted és elérheted a maximális növekedést.
              </p>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-electric-300 to-ocean-600 text-white font-bold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105 unified-neon-glow border-0"
              >
                Jelentkezés a programra
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex justify-center">
              <PhoneMockup imageUrl={acceleratorImage} className="animate-glow-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Hogyan működik?
            </h2>
            <p className="text-lg text-electric-100 max-w-2xl mx-auto">
              Hat hónapos intenzív program egyedi üzleti fejlesztéssel
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "01", title: "Felmérés", description: "Részletes üzleti audit és potenciál elemzés minden jelentkezőnél." },
              { number: "02", title: "Stratégia", description: "Személyre szabott fejlesztési terv készítése tapasztalt tanácsadókkal." },
              { number: "03", title: "Implementáció", description: "6 hónapos intenzív fejlesztési és mentorálási program." },
              { number: "04", title: "Eredmény", description: "Mérhető növekedés és fenntartható üzleti modell kialakítása." }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-electric-300 to-ocean-600 rounded-full flex items-center justify-center text-2xl font-bold text-white unified-neon-glow transition-all duration-300 group-hover:scale-110 mb-6">
                  {step.number}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                <p className="text-electric-100 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Program előnyök
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-effect rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-electric-300" />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-electric-100 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-ocean-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Program eredmények
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="glass-effect rounded-2xl p-8 text-center">
                <div className="text-4xl font-black text-electric-300 mb-2">{stat.value}</div>
                <div className="text-electric-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Résztvevői visszajelzések
          </h2>
          
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass-effect rounded-2xl p-8 mb-8">
              <p className="text-lg text-electric-100 mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="text-white font-bold">{testimonial.name}</div>
              <div className="text-electric-300 text-sm">{testimonial.position}</div>
            </div>
          ))}
        </div>
      </section>

      <CustomerSupport />
    </div>
  );
};

export default ComeGetItAccelerator;
