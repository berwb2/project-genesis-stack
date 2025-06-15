
import React from 'react';
import Logo from './Logo';

const ContentLoader = () => {
  return (
    <div className="flex flex-1 items-center justify-center p-8 h-full">
      <div className="animate-pulse-soft">
        <Logo size="lg" />
      </div>
    </div>
  );
};

export default ContentLoader;
