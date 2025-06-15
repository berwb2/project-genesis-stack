import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './Logo';
import { 
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { mainNavItems } from '@/config/nav';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => location.pathname === path;
  
  if (isMobile) {
    return null; // Use MobileNav on mobile
  }
  
  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-white dark:bg-slate-900 border-r border-blue-200 dark:border-slate-800 flex flex-col transition-all duration-300 relative`}>
      <div className="flex items-center h-20 border-b border-blue-200 dark:border-slate-800 px-4 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0 bg-background border rounded-full h-6 w-6 mr-3"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
        
        <div className="flex-1 flex justify-center">
          <Link to="/dashboard">
            <Logo showText={!collapsed} size="md" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <nav className="space-y-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                asChild
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`${collapsed ? 'w-10 h-10 p-0 justify-center' : 'w-full justify-start'}`}
                title={collapsed ? item.label : undefined}
              >
                <Link to={item.path} className={`${collapsed ? 'w-full h-full flex items-center justify-center' : ''}`}>
                  <Icon className={`h-4 w-4 ${!collapsed ? 'mr-3' : ''}`} />
                  {!collapsed && item.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-blue-200 dark:border-slate-800">
        <ThemeToggle collapsed={collapsed} />
      </div>
    </div>
  );
};

export default Sidebar;
