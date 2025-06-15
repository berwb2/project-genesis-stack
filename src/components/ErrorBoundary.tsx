
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: string | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, errorInfo: error?.toString?.() || 'Unknown error' };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Here you could integrate with a real error tracking service
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center p-8 bg-red-50 dark:bg-red-950">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-red-700 mb-2">Something went wrong.</h1>
            <div className="mb-3 text-gray-700 dark:text-red-300">{this.state.errorInfo}</div>
            <button
              className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
