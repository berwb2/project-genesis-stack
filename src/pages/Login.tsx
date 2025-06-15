import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-water-light dark:from-slate-950 dark:to-slate-900 transition-colors text-blue-900 dark:text-blue-100">
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/90 shadow-lg rounded-xl p-6">
        <h1 className="font-serif text-3xl text-center text-water-deep dark:text-blue-200 mb-8">Sign in to DeepWaters</h1>
        {/* Login form logic here */}
      </div>
    </div>
  );
};

export default Login;
