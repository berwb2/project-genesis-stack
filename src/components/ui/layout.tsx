
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
  mainClassName?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className, mainClassName }) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn("flex flex-col h-screen bg-background", className)}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className={cn(`flex-1 overflow-y-auto ${isMobile ? 'px-4 pt-4' : 'p-6'} animate-fade-in`, mainClassName)}>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Maintenance Notice</AlertTitle>
            <AlertDescription>
              The app is undergoing major issues, please be aware maintenance is underway.
            </AlertDescription>
          </Alert>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
