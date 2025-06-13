
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useGlobalStore } from '@/store';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Layout: React.FC = () => {
  const { isLoading } = useGlobalStore();

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          {isLoading && (
            <div className="fixed top-20 right-6 z-50">
              <div className="bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            </div>
          )}
          
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
