
import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCityStore } from '@/store/useCityStore';
import { useIsMobile } from '@/hooks/use-mobile';

interface LocationInputProps {
  onClick: () => void;
  className?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({ onClick, className = '' }) => {
  const { selectedCity } = useCityStore();
  const isMobile = useIsMobile();

  return (
    <Button
      variant="outline"
      className={`flex items-center justify-between gap-2 w-full md:w-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-left ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="truncate">
          {selectedCity ? selectedCity : isMobile ? 'Select city' : 'Select your city'}
        </span>
      </div>
      <span className="text-xs text-primary">Change</span>
    </Button>
  );
};

export default LocationInput;
