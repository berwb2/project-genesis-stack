
import React from 'react';
import Layout from '@/components/ui/layout';

const Documents = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-water-light dark:from-slate-950 dark:to-slate-900 text-blue-900 dark:text-blue-100 transition-colors">
      <Layout>
        <div className="py-8 max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl text-water-deep dark:text-blue-200 mb-8">Documents</h1>
          {/* Documents listing */}
        </div>
      </Layout>
    </div>
  );
};

export default Documents;
