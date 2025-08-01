
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PriceInputProps {
  onBack: () => void;
  onNext: (price: string, features: string[]) => void;
  expectedPrice?: string;
  setExpectedPrice?: React.Dispatch<React.SetStateAction<string>>;
  selectedFeatures?: string[];
  setSelectedFeatures?: React.Dispatch<React.SetStateAction<string[]>>;
}

const PriceInput: React.FC<PriceInputProps> = ({ 
  onBack, 
  onNext,
  expectedPrice: externalPrice,
  setExpectedPrice: setExternalPrice,
  selectedFeatures: externalFeatures,
  setSelectedFeatures: setExternalFeatures
}) => {
  // Use internal state if external state is not provided
  const [internalPrice, setInternalPrice] = useState<string>("");
  const [internalFeatures, setInternalFeatures] = useState<string[]>([]);
  
  // Use either external or internal state
  const price = externalPrice !== undefined ? externalPrice : internalPrice;
  const setPrice = setExternalPrice || setInternalPrice;
  const selectedFeatures = externalFeatures !== undefined ? externalFeatures : internalFeatures;
  const setSelectedFeatures = setExternalFeatures || setInternalFeatures;
  
  const features = [
    "Air Conditioning", "Power Steering", "Power Windows",
    "Anti-Lock Brakes", "Airbags", "Leather Seats",
    "Sunroof", "Navigation System", "Reverse Camera",
    "Bluetooth", "Keyless Entry", "Cruise Control"
  ];
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPrice(value);
  };
  
  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };
  
  const handleSubmit = () => {
    if (!price || parseInt(price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    
    // Store data directly in localStorage here for redundancy
    localStorage.setItem("seller_price", price);
    localStorage.setItem("key_features", JSON.stringify(selectedFeatures));
    
    onNext(price, selectedFeatures);
  };
  
  // Format the price with commas for display
  const formattedPrice = price 
    ? new Intl.NumberFormat("en-IN").format(parseInt(price))
    : "";
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Tell Us What Will Be Your Selling Price</h2>
      
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <span className="text-gray-500 text-lg">₹</span>
          </div>
          <Input
            type="text"
            value={formattedPrice}
            onChange={handlePriceChange}
            className="pl-8 text-lg py-6 h-auto"
            placeholder="Enter your expected price"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Enter the price you expect to receive for your vehicle
        </p>
      </div>
      
      {/* Key Features Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Key Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox 
                id={`feature-${feature}`}
                checked={selectedFeatures.includes(feature)}
                onCheckedChange={() => handleFeatureChange(feature)}
              />
              <Label 
                htmlFor={`feature-${feature}`}
                className="text-sm cursor-pointer"
              >
                {feature}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleSubmit} className="flex items-center gap-2">
          Continue to Pricing
        </Button>
      </div>
    </div>
  );
};

export default PriceInput;
