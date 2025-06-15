
import React from 'react';
import Layout from '@/components/ui/layout';

const CreateDocument = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-water-light dark:from-slate-950 dark:to-slate-900 text-blue-900 dark:text-blue-100 transition-colors">
      <Layout>
        <div className="py-8 max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl text-water-deep dark:text-blue-200 mb-8">Create Document</h1>
          {/* Create document form goes here */}
        </div>
      </Layout>
    </div>
  );
};

export default CreateDocument;
