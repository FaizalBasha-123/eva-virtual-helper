
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

interface AppointmentLocationProps {
  onNext: () => void;
  onBack: () => void;
}

export const AppointmentLocation: React.FC<AppointmentLocationProps> = ({ onNext, onBack }) => {
  const [locationData, setLocationData] = useState({
    address: "",
    city: "",
    pincode: "",
    landmark: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setLocationData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    localStorage.setItem("appointment_step3_data", JSON.stringify(locationData));
    onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Inspection Location</h2>
      
      <div>
        <Label htmlFor="address">Full Address</Label>
        <Input
          id="address"
          value={locationData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          placeholder="Enter your complete address"
        />
      </div>

      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={locationData.city}
          onChange={(e) => handleInputChange("city", e.target.value)}
          placeholder="City name"
        />
      </div>

      <div>
        <Label htmlFor="pincode">PIN Code</Label>
        <Input
          id="pincode"
          value={locationData.pincode}
          onChange={(e) => handleInputChange("pincode", e.target.value)}
          placeholder="6-digit PIN code"
        />
      </div>

      <div>
        <Label htmlFor="landmark">Landmark (Optional)</Label>
        <Input
          id="landmark"
          value={locationData.landmark}
          onChange={(e) => handleInputChange("landmark", e.target.value)}
          placeholder="Nearby landmark"
        />
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!locationData.address || !locationData.city || !locationData.pincode}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
