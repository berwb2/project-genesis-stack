import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from './contexts/AuthContext';
import { SoundProvider } from './contexts/SoundContext';
import ErrorBoundary from '@/components/ErrorBoundary';

import Index from './pages/Index';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Documents from './pages/Documents';
import CreateDocument from './pages/CreateDocument';
import ViewDocument from './pages/ViewDocument';
import AccountSettings from './pages/AccountSettings';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Folders from './pages/Folders';
import FolderView from './pages/FolderView';
import Calendar from './pages/Calendar';
import Books from './pages/Books';
import BookWriter from './pages/BookWriter';
import GrandStrategist from './pages/GrandStrategist';
import GreatGeneral from './pages/GreatGeneral';

function AppRoutes() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/create" element={<CreateDocument />} />
        <Route path="/documents/:id" element={<ViewDocument />} />
        <Route path="/account" element={<AccountSettings />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/folders" element={<Folders />} />
        <Route path="/folders/:id" element={<FolderView />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<ViewDocument />} />
        <Route path="/book-writer" element={<BookWriter />} />
        <Route path="/grand-strategist" element={<GrandStrategist />} />
        <Route path="/great-general" element={<GreatGeneral />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
}

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="deepwaters-theme">
            <SoundProvider>
              <ErrorBoundary>
                <Toaster />
                <AppRoutes />
              </ErrorBoundary>
            </SoundProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
