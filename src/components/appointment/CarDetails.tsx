import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CarDetailsProps {
  onBack: () => void;
  onNext: () => void;
  vehicleType: string | null;
}

interface FormData {
  brand: string | null;
  year: string | null;
  model: string | null;
  variant: string | null;
  kilometersDriven: string | null;
  city: string | null;
  vehicleType: string | null;
  fuelType: string | null;
  transmission: string | null;
}

const CarDetails: React.FC<CarDetailsProps> = ({ onBack, onNext, vehicleType }) => {
  const [formData, setFormData] = useState<FormData>({
    brand: localStorage.getItem('brand') || "",
    year: localStorage.getItem('year') || "",
    model: localStorage.getItem('model') || "",
    variant: localStorage.getItem('variant') || "",
    kilometersDriven: localStorage.getItem('kilometers') || "",
    city: localStorage.getItem('selectedCity') || "",
    vehicleType: localStorage.getItem('vehicle_type') || vehicleType || "",
    fuelType: localStorage.getItem('fuel_type') || "",
    transmission: localStorage.getItem('transmission') || "",
  });
  
  const years = Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => new Date().getFullYear() - i);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = () => {
    // Store form data in localStorage
    localStorage.setItem("brand", formData.brand || "");
    localStorage.setItem("year", formData.year || "");
    localStorage.setItem("model", formData.model || "");
    localStorage.setItem("variant", formData.variant || "");
    localStorage.setItem("kilometers", formData.kilometersDriven || "");
    localStorage.setItem("vehicle_type", formData.vehicleType || "");
    localStorage.setItem("fuel_type", formData.fuelType || "");
    localStorage.setItem("transmission", formData.transmission || "");
    
    // Also store in sellFormData
    const sellFormData = {
      brand: formData.brand,
      year: formData.year,
      model: formData.model,
      variant: formData.variant,
      kilometersDriven: formData.kilometersDriven,
      city: formData.city,
    };
    localStorage.setItem("sellFormData", JSON.stringify(sellFormData));
    
    // Basic validation
    if (!formData.vehicleType || !formData.fuelType) {
      toast("Missing Information - Please fill in all required fields.");
      return;
    }
    
    onNext();
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Tell us more about your vehicle</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Brand */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Brand <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="brand"
            value={formData.brand || ""}
            onChange={handleChange}
            placeholder="Enter brand"
            required
          />
        </div>
        
        {/* Year */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Year <span className="text-red-500">*</span>
          </label>
          <Select onValueChange={(value) => handleSelectChange("year", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select year" defaultValue={formData.year || ""}/>
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Model */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Model <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="model"
            value={formData.model || ""}
            onChange={handleChange}
            placeholder="Enter model"
            required
          />
        </div>
        
        {/* Variant */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Variant <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="variant"
            value={formData.variant || ""}
            onChange={handleChange}
            placeholder="Enter variant"
            required
          />
        </div>
        
        {/* Kilometers Driven */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Kilometers Driven <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            name="kilometersDriven"
            value={formData.kilometersDriven || ""}
            onChange={handleChange}
            placeholder="Enter kilometers driven"
            required
          />
        </div>
        
        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            placeholder="Enter city"
            required
          />
        </div>
        
        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Vehicle Type <span className="text-red-500">*</span>
          </label>
          <Select onValueChange={(value) => handleSelectChange("vehicleType", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select vehicle type" defaultValue={formData.vehicleType || ""}/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="bike">Bike</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Fuel Type <span className="text-red-500">*</span>
          </label>
          <Select onValueChange={(value) => handleSelectChange("fuelType", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select fuel type" defaultValue={formData.fuelType || ""}/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="petrol">Petrol</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="cng">CNG</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Transmission <span className="text-red-500">*</span>
          </label>
          <Select onValueChange={(value) => handleSelectChange("transmission", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select transmission" defaultValue={formData.transmission || ""}/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="automatic">Automatic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleSubmit} className="flex items-center gap-2">
          Continue to Next Step
        </Button>
      </div>
    </div>
  );
};

export default CarDetails;
