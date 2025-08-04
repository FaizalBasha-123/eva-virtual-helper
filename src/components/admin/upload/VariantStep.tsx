
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface VariantStepProps {
  selectedVariant: string;
  onSelectVariant: (variant: string) => void;
}

const VariantStep: React.FC<VariantStepProps> = ({
  selectedVariant,
  onSelectVariant,
}) => {
  const [variantInput, setVariantInput] = useState(selectedVariant || "");
  
  const handleVariantInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariantInput(e.target.value);
    onSelectVariant(e.target.value);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Enter Variant</h2>
      <p className="text-muted-foreground mb-6">
        Enter the specific variant details
      </p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Variant Name
          </label>
          <Input
            placeholder="Enter variant details (e.g., VXi, LXi, SX, ZX)"
            value={variantInput}
            onChange={handleVariantInputChange}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Examples: VXi, LXi, SX Option, ZX Diesel, DLX, Standard
          </p>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Variant tips:</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Include fuel type (Petrol/Diesel) if relevant</li>
            <li>Include transmission type (Manual/Automatic) if relevant</li>
            <li>Include trim level (Base/Mid/Top) if known</li>
            <li>If unsure, simply enter "Standard" or the engine size</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VariantStep;
