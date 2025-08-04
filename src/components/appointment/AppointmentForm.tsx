
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AppointmentFormProps {
  onNext: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    vehicleType: "",
    brand: "",
    model: "",
    year: "",
    registrationNumber: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Save form data to localStorage
    localStorage.setItem("appointment_step1_data", JSON.stringify(formData));
    onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
      
      <div>
        <Label htmlFor="vehicleType">Vehicle Type</Label>
        <Input
          id="vehicleType"
          value={formData.vehicleType}
          onChange={(e) => handleInputChange("vehicleType", e.target.value)}
          placeholder="Car, Bike, etc."
        />
      </div>

      <div>
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          value={formData.brand}
          onChange={(e) => handleInputChange("brand", e.target.value)}
          placeholder="Toyota, Honda, etc."
        />
      </div>

      <div>
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          value={formData.model}
          onChange={(e) => handleInputChange("model", e.target.value)}
          placeholder="Camry, Civic, etc."
        />
      </div>

      <div>
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          value={formData.year}
          onChange={(e) => handleInputChange("year", e.target.value)}
          placeholder="2020"
        />
      </div>

      <div>
        <Label htmlFor="registrationNumber">Registration Number</Label>
        <Input
          id="registrationNumber"
          value={formData.registrationNumber}
          onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
          placeholder="AB12CD3456"
        />
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
};
