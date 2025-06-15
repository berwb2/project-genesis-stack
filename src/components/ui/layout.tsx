
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
  mainClassName?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className, mainClassName }) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn("flex flex-col h-screen bg-gray-50", className)}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MobileNav />
        <main className={cn(`flex-1 overflow-y-auto ${isMobile ? 'px-4 pt-4' : 'p-6'}`, mainClassName)}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
