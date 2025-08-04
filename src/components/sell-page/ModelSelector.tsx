
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchModelsByBrandAndYear, fetchBikeModelsByBrandAndYear } from "@/services/vehicleService";
import { Model } from "@/types/vehicleTypes";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface ModelSelectorProps {
  vehicleType: "car" | "bike";
  selectedBrand: string;
  selectedBrandId?: string;
  selectedYear: string;
  selectedModel: string;
  onSelectModel: (model: string, modelId?: string) => void;
  onBack: () => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  vehicleType,
  selectedBrand,
  selectedBrandId,
  selectedYear,
  selectedModel,
  onSelectModel,
  onBack,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customModelInput, setCustomModelInput] = useState("");

  useEffect(() => {
    const fetchModels = async () => {
      if (selectedBrandId && selectedYear) {
        setIsLoading(true);
        try {
          let fetchedModels: Model[] = [];
          
          if (vehicleType === "car") {
            fetchedModels = await fetchModelsByBrandAndYear(selectedBrandId, selectedYear);
          } else {
            // Use bike-specific function for bikes
            fetchedModels = await fetchBikeModelsByBrandAndYear(selectedBrandId, selectedYear);
          }
          
          console.log("Fetched models:", fetchedModels);
          setModels(fetchedModels);
        } catch (error) {
          console.error("Error fetching models:", error);
          toast.error(`Failed to load ${vehicleType} models. Please try again.`);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchModels();
  }, [vehicleType, selectedBrandId, selectedYear]);

  // Handle model selection with ID and update localStorage
  const handleModelSelect = (model: string, modelId?: string) => {
    // Update localStorage
    const existingData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
    const updatedData = { ...existingData, model: model };
    localStorage.setItem("sellFormData", JSON.stringify(updatedData));
    
    onSelectModel(model, modelId);
  };

  // Handle custom model input next button
  const handleCustomModelNext = () => {
    if (customModelInput.trim()) {
      // Update localStorage with custom model
      const existingData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
      const updatedData = { ...existingData, model: customModelInput.trim() };
      localStorage.setItem("sellFormData", JSON.stringify(updatedData));
      
      onSelectModel(customModelInput.trim());
    }
  };

  // Filter models based on search term
  const filteredModels = models.filter(
    model => model.model_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h3 className="text-xl font-medium">Select Model</h3>
      </div>
      
      {/* Custom model input with Next button */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter custom model name..."
          value={customModelInput}
          onChange={(e) => setCustomModelInput(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={handleCustomModelNext}
          disabled={!customModelInput.trim()}
          className="px-6"
        >
          Next
        </Button>
      </div>
      
      {/* Search input */}
      {/*<div className="mb-4">
        <Input
          type="text"
          placeholder="Search models..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>*/}
      
      {isLoading ? (
        <div className="flex flex-col space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          {filteredModels.length > 0 ? (
            filteredModels.map((model) => (
              <Button
                key={model.id}
                variant="outline"
                className={`h-auto py-3 w-full justify-start ${selectedModel === model.model_name ? 'border-primary border-2' : ''}`}
                onClick={() => handleModelSelect(model.model_name, model.id)}
              >
                {model.model_name}
              </Button>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-4">
              {searchTerm ? 
                `No models found matching "${searchTerm}".` : 
                `No models available for ${selectedBrand} in the selected year.`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
