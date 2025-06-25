
import React from 'react';

export const Navigation: React.FC = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-[#3ba1cb]/20 hidden lg:block">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end items-center">
      <div className="flex space-x-8">
        <a href="#drink" className="text-white hover:text-[#27dddf] transition-colors">Drink</a>
        <a href="#link" className="text-white hover:text-[#27dddf] transition-colors">Link</a>
        <a href="#earn" className="text-white hover:text-[#27dddf] transition-colors">Earn</a>
        <a href="#partnerek" className="text-white hover:text-[#27dddf] transition-colors">Partnerek</a>
        <a href="#signup" className="text-white hover:text-[#27dddf] transition-colors">Regisztrálj</a>
      </div>
    </div>
  </nav>
);
