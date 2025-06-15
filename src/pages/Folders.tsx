
import React from 'react';
import Layout from '@/components/ui/layout';

const Folders = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-water-light dark:from-slate-950 dark:to-slate-900 text-blue-900 dark:text-blue-100 transition-colors">
      <Layout>
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl text-water-deep dark:text-blue-200 mb-8">Folders</h1>
          <p className="text-blue-900 dark:text-blue-100">This is the folders page content.</p>
        </div>
      </Layout>
    </div>
  );
};

export default Folders;
