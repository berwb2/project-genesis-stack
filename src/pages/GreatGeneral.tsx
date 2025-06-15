import React from 'react';
import Layout from '@/components/ui/layout';
import GreatGeneralAssistant from '@/components/GreatGeneralAssistant';

const GreatGeneral = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-[calc(100vh-140px)]">
        <GreatGeneralAssistant />
      </div>
    </div>
  );
};

export default GreatGeneral;
