import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative">
      <div className="h-screen bg-hero-image bg-cover bg-center">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold text-center">
          Shamarwa Co
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
