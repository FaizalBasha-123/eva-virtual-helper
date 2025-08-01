import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useVehicle } from "@/context/VehicleContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface CitySelectorProps {
  onOpenCityModal: () => void;
  onBack: () => void;
  selectedBrand: string;
  selectedYear: string;
  selectedModel: string;
  selectedVariant: string;
  kilometers: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  onOpenCityModal,
  onBack,
  selectedBrand,
  selectedYear,
  selectedModel,
  selectedVariant,
  kilometers,
}) => {
  const { vehicleType } = useVehicle();
  const { currentUser } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Handle user selection for localStorage
  const handleUserSelection = (field: string, value: string) => {
    const existingData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
    const updatedData = { ...existingData, [field]: value };
    localStorage.setItem("sellFormData", JSON.stringify(updatedData));
  };
  
  // Load selected city from localStorage when component mounts
  useEffect(() => {
    const cityFromStorage = localStorage.getItem('selectedCity');
    if (cityFromStorage) {
      setSelectedCity(cityFromStorage);
      // Also save city to sellFormData
      handleUserSelection("city", cityFromStorage);
    }
  }, []);
  
  // Update state whenever localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const cityFromStorage = localStorage.getItem('selectedCity');
      if (cityFromStorage) {
        setSelectedCity(cityFromStorage);
        // Also save city to sellFormData
        handleUserSelection("city", cityFromStorage);
      }
    };
    
    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for updates from the same window
    window.addEventListener('citySelected', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('citySelected', handleStorageChange);
    };
  }, []);
  
  const handleGetPrice = () => {
    // Check if city is selected
    if (!selectedCity) {
      toast.error("Please select your city before proceeding.");
      return;
    }
    
    // Save city to sellFormData
    handleUserSelection("city", selectedCity);
    
    // Check if user is logged in
    if (!currentUser) {
      // Store form data for use after login
      localStorage.setItem('vehicleFormData', JSON.stringify({
        vehicleType,
        brand: selectedBrand,
        year: selectedYear,
        model: selectedModel,
        variant: selectedVariant,
        kilometers,
        city: selectedCity,
        currentPage: 'city'
      }));
      
      // Dispatch custom event to open the sign-in modal
      window.dispatchEvent(new CustomEvent('openSignInModal'));
      return;
    } else {
      // Navigate to appointment page
      navigate('/posting');
    }
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
        <h3 className="text-xl font-medium">Select Your City</h3>
      </div>
      
      <div className="text-center space-y-6">
        <div className="p-6 border border-dashed rounded-lg border-gray-300 dark:border-gray-600 flex items-center bg-white justify-center cursor-pointer" onClick={onOpenCityModal}>
          <div className="text-center">
            <div className="text-2xl font-semibold mb-3">
              {selectedCity || 'Select City'}
            </div>
            <p className="text-muted-foreground">
              Click to select your city and get a personalized price
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleGetPrice}
          className="w-full bg-primary text-white hover:bg-primary/90 h-12"
        >
          Continue to Enter Details
        </Button>
      </div>
    </div>
  );
};

export default CitySelector;
