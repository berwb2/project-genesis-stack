
import React from 'react';
import Layout from '@/components/ui/layout';

const AccountSettings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-water-light dark:from-slate-950 dark:to-slate-900 text-blue-900 dark:text-blue-100 transition-colors">
      <Layout>
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl text-water-deep dark:text-blue-200 mb-6">Account Settings</h1>
          {/* ... your form & content here ... */}
          <p className="text-blue-900 dark:text-blue-100">Account settings content will appear here.</p>
        </div>
      </Layout>
    </div>
  );
};

export default AccountSettings;
