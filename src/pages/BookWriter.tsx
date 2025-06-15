
import React from 'react';
import Layout from '@/components/ui/layout';

const BookWriter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-water-light dark:from-slate-950 dark:to-slate-900 text-blue-900 dark:text-blue-100 transition-colors">
      <Layout>
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="font-serif text-3xl text-water-deep dark:text-blue-200 mb-8">Book Writer</h1>
          {/* Book writer tools and editor go here */}
          <p className="text-blue-900 dark:text-blue-100">Book writer tools and editor will appear here.</p>
        </div>
      </Layout>
    </div>
  );
};

export default BookWriter;
