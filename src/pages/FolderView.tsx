
import React from 'react';
import Layout from '@/components/ui/layout';

const FolderView = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-water-light dark:from-slate-950 dark:to-slate-900 text-blue-900 dark:text-blue-100 transition-colors">
      <Layout>
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="font-serif text-3xl text-water-deep dark:text-blue-200 mb-8">Folder View</h1>
          {/* Folder contents here */}
          <p className="text-blue-900 dark:text-blue-100">Folder content will appear here.</p>
        </div>
      </Layout>
    </div>
  );
};

export default FolderView;
