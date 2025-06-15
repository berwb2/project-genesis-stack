
import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-water-light dark:from-slate-950 dark:to-slate-900 text-blue-900 dark:text-blue-100 transition-colors">
      <div className="p-6 bg-white/80 dark:bg-slate-900/90 rounded-xl shadow-lg max-w-lg text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-water-deep dark:text-blue-200 mb-4">404</h1>
        <p className="mb-4">We can't seem to find the page you're looking for.</p>
        <a href="/dashboard" className="btn-primary mt-2 inline-block">Go Home</a>
      </div>
    </div>
  );
};

export default NotFound;
