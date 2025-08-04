
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface ManualEntryButtonProps {
  onClick: () => void;
}

const ManualEntryButton: React.FC<ManualEntryButtonProps> = ({ onClick }) => {
  return (
    <div className="text-center">
      <Button 
        onClick={onClick}
        className="bg-secondary hover:bg-secondary/80 text-black dark:text-[#ffffff] h-12 px-8"
      >
        Enter Details Manually
        <ChevronRight className="ml-1" size={18} />
      </Button>
    </div>
  );
};

export default ManualEntryButton;
