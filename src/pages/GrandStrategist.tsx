import React from 'react';
import Layout from '@/components/ui/layout';
import GrandStrategistAssistant from '@/components/GrandStrategistAssistant';

const GrandStrategist = () => {
  return (
    <div className="min-h-screen bg-background">
      <Layout>
        <div className="h-[calc(100vh-140px)]">
          <GrandStrategistAssistant />
        </div>
      </Layout>
    </div>
  );
};

export default GrandStrategist;
