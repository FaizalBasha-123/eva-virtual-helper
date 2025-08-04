
import React, { useState } from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface MobileFilterDrawerProps {
  trigger: React.ReactNode;
  title?: string;
  onApplyFilters?: (filters: Record<string, any>) => void;
  onClearFilters?: () => void;
  defaultFilters?: Record<string, any>;
  children?: React.ReactNode;
}

const MobileFilterDrawer = ({
  trigger,
  title = "Filters",
  onApplyFilters,
  onClearFilters,
  defaultFilters = {},
  children
}: MobileFilterDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Record<string, any>>(defaultFilters);
  
  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    }
    setIsOpen(false);
  };
  
  const handleClear = () => {
    setLocalFilters({});
    if (onClearFilters) {
      onClearFilters();
    }
  };
  
  const updateFilter = (key: string, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        filters: localFilters,
        updateFilter
      });
    }
    return child;
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>{title}</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100%-130px)] p-4">
          {childrenWithProps}
        </ScrollArea>
        
        <div className="border-t p-4 flex justify-between">
          <Button variant="outline" onClick={handleClear} className="w-[48%]">
            Clear All
          </Button>
          <Button onClick={handleApply} className="w-[48%]">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterDrawer;
