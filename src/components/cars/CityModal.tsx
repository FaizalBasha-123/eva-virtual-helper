
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Check } from 'lucide-react';
import { useCityStore } from '@/store/useCityStore';
import { indianCities } from '@/utils/cityList';
import { updateURLWithCity } from '@/utils/queryHelpers';
import { toast } from 'sonner';

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMandatory?: boolean;
}

const CityModal = ({ isOpen, onClose, isMandatory = false }: CityModalProps) => {
  const { selectedCity, setSelectedCity } = useCityStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>(indianCities);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter cities based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCities(indianCities);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCities(
        indianCities.filter(city => 
          city.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    updateURLWithCity(city);
    
    // Store in localStorage and dispatch custom event to notify CitySelector
    localStorage.setItem('selectedCity', city);
    window.dispatchEvent(new Event('citySelected'));
    
    toast.success(`Location set to ${city}`);
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Only allow closing the dialog if it's not mandatory
        // or if a city is already selected
        if (!open && (!isMandatory || selectedCity)) {
          onClose();
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-[600px] max-h-[80vh] md:max-h-[90vh] w-[90vw] flex flex-col"
        // Remove the close button if the modal is mandatory
        closeButton={!isMandatory || !!selectedCity}
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Select Your City
          </DialogTitle>
        </DialogHeader>

        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search cities..."
            className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* City grid with scrollable area */}
        <div className="overflow-y-auto flex-grow pr-1">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredCities.map((city) => (
              <Button
                key={city}
                variant={selectedCity === city ? "default" : "outline"}
                className={`justify-start h-auto py-2 px-3 text-left text-sm sm:text-base ${
                  selectedCity === city 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-secondary'
                }`}
                onClick={() => handleCitySelect(city)}
              >
                {selectedCity === city && <Check className="h-4 w-4 mr-2 flex-shrink-0" />}
                <span className="truncate">{city}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CityModal;
