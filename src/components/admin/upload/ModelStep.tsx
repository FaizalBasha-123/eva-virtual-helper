
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ModelStepProps {
  vehicleType: "car" | "bike";
  selectedBrand: string;
  onSelectModel: (model: string) => void;
}

const ModelStep: React.FC<ModelStepProps> = ({
  vehicleType,
  selectedBrand,
  onSelectModel,
}) => {
  const [modelInput, setModelInput] = useState("");
  
  const handleModelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModelInput(e.target.value);
  };
  
  const handleModelSubmit = () => {
    if (modelInput.trim()) {
      onSelectModel(modelInput.trim());
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Enter Model</h2>
      <p className="text-muted-foreground mb-6">
        Enter the model name for {selectedBrand}
      </p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Model Name
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Enter ${selectedBrand} model name`}
              className="pl-10"
              value={modelInput}
              onChange={handleModelInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleModelSubmit();
                }
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Examples: {vehicleType === "car" 
              ? "Swift, City, Creta, Nexon" 
              : "Splendor, Activa, Pulsar, Apache"}
          </p>
        </div>
        
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <p className="text-sm font-medium mb-2">Selected Information:</p>
          <div className="text-sm">
            <p><span className="font-medium">Brand:</span> {selectedBrand}</p>
            <p><span className="font-medium">Model:</span> {modelInput || "Not entered yet"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelStep;
