
import React from 'react';
import Layout from '@/components/ui/layout';
import GrandStrategistAssistant from '@/components/GrandStrategistAssistant';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import Sidebar from '@/components/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const GrandStrategist = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileNav />
      <div className="flex">
        {!isMobile && <Sidebar />}
        <main className="flex-1">
          <div className="h-[calc(100vh-80px)] p-4">
            <GrandStrategistAssistant />
          </div>
        </main>
      </div>
    </div>
  );
};

export default GrandStrategist;
