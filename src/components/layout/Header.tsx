
import React from 'react';
import { useGlobalStore } from '@/store';
import { Menu, Bell, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Header: React.FC = () => {
  const { toggleSidebar, notifications } = useGlobalStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Left section */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="md:hidden p-1 h-auto mr-4"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="sm" className="p-2 h-auto">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>

        {/* User menu */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
