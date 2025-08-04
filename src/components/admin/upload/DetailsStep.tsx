
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import LocationInput from "@/components/shared/LocationInput";

interface DetailsStepProps {
  vehicleType: "car" | "bike";
  kilometers: string;
  price: string;
  description: string;
  features: string[];
  onKilometersChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onFeaturesChange: (value: string[]) => void;
  openCityModal: () => void;
}

const DetailsStep: React.FC<DetailsStepProps> = ({
  vehicleType,
  kilometers,
  price,
  description,
  features,
  onKilometersChange,
  onPriceChange,
  onDescriptionChange,
  onFeaturesChange,
  openCityModal,
}) => {
  // Available features based on vehicle type
  const carFeatures = [
    "Air Conditioning", "Power Steering", "Power Windows", "Airbags", 
    "Anti-Lock Brakes", "Leather Seats", "Sunroof", "Navigation System", 
    "Bluetooth", "Keyless Entry", "Reverse Camera", "Cruise Control"
  ];
  
  const bikeFeatures = [
    "Disc Brake", "ABS", "Electric Start", "Digital Speedometer", 
    "LED Headlight", "USB Charging", "Tubeless Tyres", "Bluetooth Connectivity"
  ];
  
  const availableFeatures = vehicleType === "car" ? carFeatures : bikeFeatures;
  
  const toggleFeature = (feature: string) => {
    if (features.includes(feature)) {
      onFeaturesChange(features.filter(f => f !== feature));
    } else {
      onFeaturesChange([...features, feature]);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Enter {vehicleType === "car" ? "Car" : "Bike"} Details
      </h2>
      <p className="text-muted-foreground mb-6">
        Fill in the remaining details to complete your listing
      </p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kilometers */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {vehicleType === "car" ? "Kilometers" : "Kilometers"} Driven
            </label>
            <Input
              placeholder="e.g., 25000"
              value={kilometers}
              onChange={(e) => {
                // Only allow numbers
                if (/^\d*$/.test(e.target.value)) {
                  onKilometersChange(e.target.value);
                }
              }}
            />
          </div>
          
          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-2">
              City
            </label>
            <LocationInput onClick={openCityModal} className="h-10" />
          </div>
          
          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Price (₹)
            </label>
            <Input
              placeholder="e.g., 500000"
              value={price}
              onChange={(e) => {
                // Only allow numbers
                if (/^\d*$/.test(e.target.value)) {
                  onPriceChange(e.target.value);
                }
              }}
            />
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <Textarea
            placeholder={`Describe the ${vehicleType} in detail. Include any special features, modifications, or issues.`}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={4}
          />
        </div>
        
        {/* Key Features */}
        <div>
          <label className="block text-sm font-medium mb-4">
            Key Features
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {availableFeatures.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox 
                  id={`feature-${feature}`}
                  checked={features.includes(feature)}
                  onCheckedChange={() => toggleFeature(feature)}
                />
                <label 
                  htmlFor={`feature-${feature}`}
                  className="text-sm"
                >
                  {feature}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
