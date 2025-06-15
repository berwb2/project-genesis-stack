
import { 
  Home, 
  FileText, 
  FolderOpen, 
  BookOpen,
  Edit3,
  Brain,
  Shield,
  Sparkles,
  Calendar as CalendarIcon, 
  Settings,
  Folder,
  Book,
  Calendar
} from 'lucide-react';

export const mainNavItems = [
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

export const documentsNavItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Documents', path: '/documents' },
  { icon: Folder, label: 'Folders', path: '/folders' },
  { icon: Book, label: 'Books', path: '/books' },
  { icon: Brain, label: 'Grand Strategist', path: '/grand-strategist' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
];
