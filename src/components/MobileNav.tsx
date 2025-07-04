
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from './Logo';
import { 
  Menu,
  Home,
  FileText, 
  FolderOpen, 
  BookOpen,
  Edit3,
  Brain,
  Calendar as CalendarIcon,
  Settings,
  Sparkles,
  Shield,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/folders', icon: FolderOpen, label: 'Folders' },
    { path: '/books', icon: BookOpen, label: 'Books' },
    { path: '/book-writer', icon: Edit3, label: 'Book Writer' },
    { path: '/grand-strategist', icon: Brain, label: 'Grand Strategist' },
    { path: '/great-general', icon: Shield, label: 'Great General' },
    { path: '/ai-playground', icon: Sparkles, label: 'AI Playground' },
    { path: '/calendar', icon: CalendarIcon, label: 'Calendar' },
    { path: '/account', icon: Settings, label: 'Settings' },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden fixed top-3 left-3 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 dark:bg-slate-900 border-r-0 dark:border-slate-800">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-20 border-b border-blue-200 dark:border-slate-800">
            <Link to="/dashboard" onClick={() => setOpen(false)}>
              <Logo size="md" />
            </Link>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  asChild
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setOpen(false)}
                >
                  <Link to={item.path}>
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-blue-200 dark:border-slate-800">
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
