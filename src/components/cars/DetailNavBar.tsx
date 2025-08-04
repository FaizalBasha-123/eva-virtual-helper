
import React from 'react';
import { cn } from '@/lib/utils';

interface DetailNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOriginalNavVisible: boolean;
}

const DetailNavBar = ({ activeTab, onTabChange, isOriginalNavVisible }: DetailNavBarProps) => {
  const tabs = [
    { id: 'overview', label: 'OVERVIEW & SPECS' },
    { id: 'photos', label: 'PHOTOS' },
    { id: 'inspection', label: 'INSPECTION REPORT' },
    { id: 'faq', label: 'FAQ' }
  ];

  return (
    <nav 
      className={cn(
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 border rounded-xl shadow-lg transition-all duration-300 z-50 w-[95%] max-w-md",
        isOriginalNavVisible ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
      )}
    >
      <div className="px-3 py-2">
        <div className="flex justify-start space-x-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "py-1 sm:py-2 px-2 sm:px-3 text-xs font-medium whitespace-nowrap transition-colors rounded-lg",
                activeTab === tab.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-gray-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DetailNavBar;
