
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import VariantFilters from "./VariantFilters";
import {
  fetchVariantsByModel,
  fetchFuelTypesByModel,
  fetchTransmissionsByModel,
  fetchBikeVariantsByModel,
  fetchBikeFuelTypesByModel
} from "@/services/vehicleService";
import { Variant } from "@/types/vehicleTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface VariantSelectorProps {
  vehicleType: "car" | "bike";
  selectedModel: string;
  selectedModelId?: string;
  selectedVariant: string;
  onSelectVariant: (variant: string) => void;
  onBack: () => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  vehicleType,
  selectedModel,
  selectedModelId,
  selectedVariant,
  onSelectVariant,
  onBack,
}) => {
  const [selectedFuelType, setSelectedFuelType] = useState<string | null>(null);
  const [selectedTransmission, setSelectedTransmission] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [availableFuelTypes, setAvailableFuelTypes] = useState<string[]>([]);
  const [availableTransmissions, setAvailableTransmissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customVariantInput, setCustomVariantInput] = useState("");
  
  // Load variants from Supabase when model changes or filters change
  useEffect(() => {
    const loadVariants = async () => {
      if (selectedModelId) {
        setIsLoading(true);
        try {
          let fetchedVariants: Variant[] = [];
          
          if (vehicleType === "car") {
            // Use car-specific functions
            fetchedVariants = await fetchVariantsByModel(
              selectedModelId, 
              selectedFuelType, 
              selectedTransmission
            );
          } else {
            // Use bike-specific functions
            fetchedVariants = await fetchBikeVariantsByModel(
              selectedModelId,
              selectedFuelType
            );
          }
          
          console.log("Fetched variants:", fetchedVariants);
          setVariants(fetchedVariants);
        } catch (error) {
          console.error("Error loading variants:", error);
          toast.error(`Failed to load ${vehicleType} variants. Please try again.`);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadVariants();
  }, [vehicleType, selectedModelId, selectedFuelType, selectedTransmission]);

  // Load available filter options when model changes
  useEffect(() => {
    const loadFilterOptions = async () => {
      if (selectedModelId) {
        try {
          let fuelTypes: string[] = [];
          let transmissions: string[] = [];
          
          if (vehicleType === "car") {
            // Use car-specific functions
            fuelTypes = await fetchFuelTypesByModel(selectedModelId);
            transmissions = await fetchTransmissionsByModel(selectedModelId);
          } else {
            // Use bike-specific functions
            fuelTypes = await fetchBikeFuelTypesByModel(selectedModelId);
            // Bikes generally don't have transmission filters in the same way cars do
            transmissions = [];
          }
          
          setAvailableFuelTypes(fuelTypes);
          setAvailableTransmissions(transmissions);
        } catch (error) {
          console.error("Error loading filter options:", error);
        }
      }
    };

    loadFilterOptions();
  }, [vehicleType, selectedModelId]);

  // Handle variant selection and update localStorage
  const handleVariantSelect = (variant: string) => {
    // Update localStorage
    const existingData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
    const updatedData = { ...existingData, variant: variant };
    localStorage.setItem("sellFormData", JSON.stringify(updatedData));
    
    onSelectVariant(variant);
  };

  // Handle custom variant input next button
  const handleCustomVariantNext = () => {
    if (customVariantInput.trim()) {
      // Update localStorage with custom variant
      const existingData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
      const updatedData = { ...existingData, variant: customVariantInput.trim() };
      localStorage.setItem("sellFormData", JSON.stringify(updatedData));
      
      onSelectVariant(customVariantInput.trim());
    }
  };

  // Filter variants based on search term
  const filteredVariants = variants.filter(variant => 
    variant.variant_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset selected variant if it's no longer in filtered results
  useEffect(() => {
    if (selectedVariant && !filteredVariants.some(v => v.variant_name === selectedVariant)) {
      onSelectVariant("");
    }
  }, [selectedFuelType, selectedTransmission, selectedVariant, onSelectVariant, filteredVariants]);

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
        <h3 className="text-xl font-medium">Select Variant</h3>
      </div>
      
      {/* Custom variant input with Next button */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter custom variant name..."
          value={customVariantInput}
          onChange={(e) => setCustomVariantInput(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={handleCustomVariantNext}
          disabled={!customVariantInput.trim()}
          className="px-6"
        >
          Next
        </Button>
      </div>
      
      {/* Search input */}
      {/*<div className="mb-4">
        <Input
          type="text"
          placeholder="Search variants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>*/}
      
      {/* Variant filters - Only show for cars or if bike has multiple fuel types */}
      {(vehicleType === "car" || availableFuelTypes.length > 1) && (
        <VariantFilters 
          availableFuelTypes={availableFuelTypes}
          availableTransmissions={availableTransmissions}
          selectedFuelType={selectedFuelType}
          selectedTransmission={selectedTransmission}
          onSelectFuelType={setSelectedFuelType}
          onSelectTransmission={setSelectedTransmission}
        />
      )}
      
      {/* Variant list */}
      {isLoading ? (
        <div className="flex flex-col space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          {filteredVariants.length > 0 ? (
            filteredVariants.map((variant) => (
              <Button
                key={variant.id}
                variant="outline"
                className={`h-auto py-3 w-full ${selectedVariant === variant.variant_name ? 'border-primary border-2' : ''}`}
                onClick={() => handleVariantSelect(variant.variant_name)}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-sm font-medium">{variant.variant_name}</span>
                  {(variant.fuel_type || vehicleType === "car") && (
                    <div className="flex gap-2">
                      {variant.fuel_type && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                          {variant.fuel_type}
                        </span>
                      )}
                      {variant.transmission && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                          {variant.transmission}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Button>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-4">
              {searchTerm ? 
                `No variants found matching "${searchTerm}".` : 
                "No variants available with the selected filters."}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VariantSelector;
