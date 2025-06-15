
import React from 'react';
import Layout from '@/components/ui/layout';
import GreatGeneralAssistant from '@/components/GreatGeneralAssistant';

const GreatGeneral = () => {
  return (
    <Layout>
      <div className="h-[calc(100vh-140px)]">
        <GreatGeneralAssistant />
      </div>
    </Layout>
  );
};

export default GreatGeneral;
