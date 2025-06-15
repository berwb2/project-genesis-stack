import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from './contexts/AuthContext';
import { SoundProvider } from './contexts/SoundContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import GlobalPageLoader from '@/components/GlobalPageLoader';

// Lazy load main pages
const Index = lazy(() => import('./pages/Index'));
const Login = lazy(() => import('./pages/Login'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Documents = lazy(() => import('./pages/Documents'));
const CreateDocument = lazy(() => import('./pages/CreateDocument'));
const ViewDocument = lazy(() => import('./pages/ViewDocument'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Folders = lazy(() => import('./pages/Folders'));
const FolderView = lazy(() => import('./pages/FolderView'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Books = lazy(() => import('./pages/Books'));
const BookWriter = lazy(() => import('./pages/BookWriter'));
const GrandStrategist = lazy(() => import('./pages/GrandStrategist'));
const GreatGeneral = lazy(() => import('./pages/GreatGeneral'));

function AppRoutes() {
  return (
    <TooltipProvider>
      <Suspense fallback={<GlobalPageLoader />}>
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
      </Suspense>
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
