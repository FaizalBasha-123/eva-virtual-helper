
import React from 'react';

interface SEOContentProps {
  title: string;
  content: string;
  keywords?: string[];
  className?: string;
}

const SEOContent = ({ title, content, keywords = [], className = "" }: SEOContentProps) => {
  return (
    <section className={`mt-12 px-4 max-w-7xl mx-auto text-gray-700 dark:text-gray-300 text-sm leading-6 ${className}`}>
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h2>
      <div className="space-y-3">
        <p>{content}</p>
        {keywords.length > 0 && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Popular searches: {keywords.join(', ')}
          </p>
        )}
      </div>
    </section>
  );
};

export default SEOContent;
