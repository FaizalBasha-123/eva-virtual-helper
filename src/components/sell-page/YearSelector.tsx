
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface YearSelectorProps {
  selectedYear: string;
  onSelectYear: (year: string) => void;
  onBack: () => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ 
  selectedYear, 
  onSelectYear,
  onBack
}) => {
  // Years array for selection
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1993; year--) {
      years.push(year.toString());
    }
    return years;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-0 mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-xl font-medium">Select Year</h3>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto pr-1">
        {generateYears().map((year) => (
          <Button
            key={year}
            variant="outline"
            className={`h-auto py-3 ${selectedYear === year ? 'border-primary border-2' : ''}`}
            onClick={() => onSelectYear(year)}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default YearSelector;
