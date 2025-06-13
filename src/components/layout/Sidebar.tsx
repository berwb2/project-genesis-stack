
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils';
import { useGlobalStore } from '@/store';
import { 
  Home, 
  Settings, 
  User, 
  Menu, 
  X,
  BarChart3,
  Users,
  FolderOpen
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Profile', href: '/profile', icon: User },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useGlobalStore();

  // Close sidebar on mobile when route changes
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarCollapsed]);

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity md:hidden z-20"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0',
        sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
      )}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-900">
              AppName
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="md:hidden p-1 h-auto"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 768) {
                      setSidebarCollapsed(true);
                    }
                  }}
                >
                  <item.icon className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
