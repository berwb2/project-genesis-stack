
import React from 'react';
import Layout from '@/components/ui/layout';
import GreatGeneralAssistant from '@/components/GreatGeneralAssistant';

const GreatGeneral = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-water-light dark:from-slate-950 dark:to-slate-900 text-blue-900 dark:text-blue-100 transition-colors">
      <Layout>
        <div className="h-[calc(100vh-140px)] max-w-5xl mx-auto">
          <GreatGeneralAssistant />
        </div>
      </Layout>
    </div>
  );
};

export default GreatGeneral;
