
import React from "react";
import { Play } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FloatingVideoButtonProps {
  onClick: () => void;
}

const FloatingVideoButton: React.FC<FloatingVideoButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-32 right-6 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onClick}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105"
              aria-label="Watch Guide Video"
            >
              <Play className="h-6 w-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Watch Guide Video</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FloatingVideoButton;
