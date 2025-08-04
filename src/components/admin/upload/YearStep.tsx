
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface YearStepProps {
  selectedYear: string;
  onSelectYear: (year: string) => void;
}

const YearStep: React.FC<YearStepProps> = ({ selectedYear, onSelectYear }) => {
  const [customYear, setCustomYear] = useState("");
  
  // Generate years from current year to 1993
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1992 }, (_, i) => (currentYear - i).toString());

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Select Year</h2>
      <p className="text-muted-foreground mb-6">
        Choose the manufacturing year
      </p>
      
      {/* Custom year input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Enter year manually:
        </label>
        <Input
          placeholder="Enter year (e.g., 2022)"
          value={customYear}
          onChange={(e) => {
            const value = e.target.value;
            // Only allow numbers
            if (/^\d*$/.test(value)) {
              setCustomYear(value);
              if (value.length === 4) {
                onSelectYear(value);
              }
            }
          }}
          maxLength={4}
          className="mb-2"
        />
      </div>
      
      {/* Year list */}
      <ScrollArea className="h-[300px] rounded-md border">
        <div className="p-4">
          {years.map((year) => (
            <div
              key={year}
              className={`py-3 px-4 my-1 rounded-md cursor-pointer transition-all ${
                selectedYear === year
                  ? "bg-primary text-white"
                  : "hover:bg-primary/10"
              }`}
              onClick={() => onSelectYear(year)}
            >
              {year}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default YearStep;
