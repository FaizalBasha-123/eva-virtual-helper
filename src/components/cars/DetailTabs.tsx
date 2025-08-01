
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface DetailTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DetailTabs = ({ activeTab, onTabChange }: DetailTabsProps) => {
  const tabs = [
    { id: 'overview', label: 'OVERVIEW & SPECS' },
    { id: 'photos', label: 'PHOTOS' },
    { id: 'inspection', label: 'INSPECTION REPORT' },
    { id: 'faq', label: 'FAQ' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm mb-6" id="top-nav">
      <div className="border-b">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "py-2 sm:py-3 px-3 sm:px-4 font-medium text-xs sm:text-sm whitespace-nowrap",
                  activeTab === tab.id && "text-primary border-b-2 border-primary"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default DetailTabs;
