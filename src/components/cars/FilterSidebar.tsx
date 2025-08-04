
import React, { useState } from "react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronUp, 
  Fuel, 
  Zap, 
  Car, 
  Settings, 
  Search,
  Gauge,
  Shield,
  Users,
  Banknote,
  Car as CarIcon,
  Battery,
  BatteryCharging,
  AlertTriangle,
  CircleDot,
  Cog
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSidebarProps {
  onApplyFilters: (filters: Record<string, any>) => void;
  appliedFilters: Record<string, any>;
  onClearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onApplyFilters,
  appliedFilters,
  onClearFilters
}) => {
  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([500000, 3000000]);
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [transmission, setTransmission] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [mileageRange, setMileageRange] = useState<number[]>([10, 30]);
  const [evRange, setEvRange] = useState<number[]>([200, 600]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [safetyRating, setSafetyRating] = useState<string>("");
  const [engineDisplacement, setEngineDisplacement] = useState<number[]>([800, 3000]);
  const [selectedAirbags, setSelectedAirbags] = useState<string[]>([]);
  const [selectedCylinders, setSelectedCylinders] = useState<string[]>([]);
  const [wheelDrive, setWheelDrive] = useState<string>("");
  
  // Open/close state for collapsible sections
  const [openSections, setOpenSections] = useState({
    budget: true,
    brand: true,
    vehicleType: true,
    fuelType: true,
    transmission: true,
    features: true,
    mileage: true,
    evRange: true,
    seats: true,
    safetyRating: true,
    engineDisplacement: true,
    airbags: true,
    cylinders: true,
    wheelDrive: true
  });
  
  // Toggle section
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section]
    });
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    const filters = {
      priceRange,
      brands: selectedBrands,
      vehicleTypes: selectedVehicleTypes,
      fuelTypes: selectedFuelTypes,
      transmission,
      features: selectedFeatures,
      mileageRange,
      evRange,
      seats: selectedSeats,
      safetyRating,
      engineDisplacement,
      airbags: selectedAirbags,
      cylinders: selectedCylinders,
      wheelDrive
    };
    
    onApplyFilters(filters);
  };
  
  // Helper function to format currency
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(0)}K`;
    }
    return `₹${value}`;
  };
  
  // Filter data
  const brandOptions = [
    { id: "maruti", label: "Maruti Suzuki", count: 245 },
    { id: "hyundai", label: "Hyundai", count: 187 },
    { id: "tata", label: "Tata Motors", count: 163 },
    { id: "mahindra", label: "Mahindra", count: 142 },
    { id: "kia", label: "Kia", count: 89 },
    { id: "toyota", label: "Toyota", count: 78 },
    { id: "honda", label: "Honda", count: 65 },
    { id: "ford", label: "Ford", count: 54 },
    { id: "volkswagen", label: "Volkswagen", count: 48 },
    { id: "renault", label: "Renault", count: 42 },
    { id: "bmw", label: "BMW", count: 32 },
    { id: "mercedes", label: "Mercedes-Benz", count: 29 },
    { id: "audi", label: "Audi", count: 27 },
    { id: "mg", label: "MG", count: 25 },
    { id: "nissan", label: "Nissan", count: 18 }
  ];
  
  const vehicleTypeOptions = [
    { id: "suv", label: "SUV", icon: <Car className="h-4 w-4" />, count: 124 },
    { id: "sedan", label: "Sedan", icon: <Car className="h-4 w-4" />, count: 93 },
    { id: "hatchback", label: "Hatchback", icon: <Car className="h-4 w-4" />, count: 87 },
    { id: "van", label: "Van", icon: <Car className="h-4 w-4" />, count: 15 }
  ];
  
  const fuelTypeOptions = [
    { id: "petrol", label: "Petrol", count: 256 },
    { id: "diesel", label: "Diesel", count: 184 },
    { id: "cng", label: "CNG", count: 45 },
    { id: "electric", label: "Electric", count: 28 }
  ];
  
  const featureOptions = [
    { id: "sunroof", label: "Sunroof", count: 135 },
    { id: "cruise", label: "Cruise Control", count: 178 },
    { id: "abs", label: "ABS", count: 284 },
    { id: "parking", label: "Parking Sensors", count: 212 },
    { id: "camera", label: "Rear Camera", count: 189 },
    { id: "keyless", label: "Keyless Entry", count: 167 },
    { id: "touchscreen", label: "Touchscreen", count: 198 },
    { id: "carplay", label: "Android Auto/Apple CarPlay", count: 152 }
  ];
  
  const seatsOptions = [
    { id: "2", label: "2 Seater", count: 8 },
    { id: "4", label: "4 Seater", count: 56 },
    { id: "5", label: "5 Seater", count: 378 },
    { id: "6", label: "6 Seater", count: 43 },
    { id: "7", label: "7 Seater", count: 65 },
    { id: "8+", label: "8+ Seater", count: 20 }
  ];
  
  const airbagsOptions = [
    { id: "2", label: "2 Airbags", count: 187 },
    { id: "4", label: "4 Airbags", count: 145 },
    { id: "6", label: "6 Airbags", count: 124 },
    { id: "8+", label: "8+ Airbags", count: 56 }
  ];
  
  const cylindersOptions = [
    { id: "2", label: "2 Cylinders", count: 32 },
    { id: "3", label: "3 Cylinders", count: 87 },
    { id: "4", label: "4 Cylinders", count: 324 },
    { id: "6", label: "6 Cylinders", count: 56 },
    { id: "8", label: "8 Cylinders", count: 28 },
    { id: "12", label: "12 Cylinders", count: 5 }
  ];
  
  const wheelDriveOptions = [
    { id: "fwd", label: "FWD", count: 356 },
    { id: "rwd", label: "RWD", count: 87 },
    { id: "awd", label: "AWD", count: 48 },
    { id: "4wd", label: "4WD", count: 32 }
  ];
  
  // Filter the brands based on search input
  const filteredBrands = brandSearch 
    ? brandOptions.filter(brand => 
        brand.label.toLowerCase().includes(brandSearch.toLowerCase())
      )
    : brandOptions;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-border h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      {/* Scrollable filter content area */}
      <div className="flex-grow overflow-auto pr-1">
        {/* Budget Filter */}
        <Collapsible open={openSections.budget} className="mb-4">
          <CollapsibleTrigger 
            onClick={() => toggleSection('budget')}
            className="flex justify-between items-center w-full py-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              <span>Budget</span>
            </div>
            {openSections.budget ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <div className="space-y-4">
              <Slider 
                defaultValue={priceRange} 
                min={100000}
                max={5000000}
                step={100000}
                onValueChange={(value) => setPriceRange(value as number[])}
                className="mt-6"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium">{formatCurrency(priceRange[0])}</span>
                <span className="text-sm font-medium">{formatCurrency(priceRange[1])}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Separator className="my-2" />
        
        {/* Brand Filter */}
        <Collapsible open={openSections.brand} className="mb-4">
          <CollapsibleTrigger 
            onClick={() => toggleSection('brand')}
            className="flex justify-between items-center w-full py-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              <span>Brand</span>
            </div>
            {openSections.brand ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search brands..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-3">
                {filteredBrands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`brand-${brand.id}`} 
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBrands([...selectedBrands, brand.id]);
                        } else {
                          setSelectedBrands(selectedBrands.filter(id => id !== brand.id));
                        }
                      }}
                    />
                    <label 
                      htmlFor={`brand-${brand.id}`}
                      className="flex items-center justify-between w-full text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <span>{brand.label}</span>
                      <span className="text-xs text-muted-foreground">({brand.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Separator className="my-2" />
        
        {/* Vehicle Type */}
        <Collapsible open={openSections.vehicleType} className="mb-4">
          <CollapsibleTrigger 
            onClick={() => toggleSection('vehicleType')}
            className="flex justify-between items-center w-full py-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              <span>Vehicle Type</span>
            </div>
            {openSections.vehicleType ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <div className="grid grid-cols-3 gap-2">
              {vehicleTypeOptions.map((option) => (
                <div 
                  key={option.id}
                  onClick={() => {
                    if (selectedVehicleTypes.includes(option.id)) {
                      setSelectedVehicleTypes(selectedVehicleTypes.filter(id => id !== option.id));
                    } else {
                      setSelectedVehicleTypes([...selectedVehicleTypes, option.id]);
                    }
                  }}
                  className={`relative flex flex-col items-center border rounded-md p-2 cursor-pointer transition-all hover:border-primary ${
                    selectedVehicleTypes.includes(option.id) ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="mb-1">{option.icon}</div>
                  <div className="text-xs text-center">
                    {option.label}
                    <div className="text-[10px] text-muted-foreground">({option.count})</div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Separator className="my-2" />
        
        {/* Fuel Type */}
        <Collapsible open={openSections.fuelType} className="mb-4">
          <CollapsibleTrigger 
            onClick={() => toggleSection('fuelType')}
            className="flex justify-between items-center w-full py-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              <span>Fuel Type</span>
            </div>
            {openSections.fuelType ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <div className="space-y-2">
              {fuelTypeOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`fuel-${option.id}`} 
                    checked={selectedFuelTypes.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFuelTypes([...selectedFuelTypes, option.id]);
                      } else {
                        setSelectedFuelTypes(selectedFuelTypes.filter(id => id !== option.id));
                      }
                    }}
                  />
                  <label 
                    htmlFor={`fuel-${option.id}`}
                    className="flex items-center justify-between w-full text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <div className="flex items-center gap-2">
                      <span>{option.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({option.count})</span>
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Separator className="my-2" />
        
        {/* Transmission */}
        <Collapsible open={openSections.transmission} className="mb-4">
          <CollapsibleTrigger 
            onClick={() => toggleSection('transmission')}
            className="flex justify-between items-center w-full py-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              <span>Transmission</span>
            </div>
            {openSections.transmission ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <RadioGroup value={transmission} onValueChange={setTransmission}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="manual" id="transmission-manual" />
                <Label htmlFor="transmission-manual" className="flex items-center gap-2">
                  <span>Manual</span>
                </Label>
                <span className="text-xs text-muted-foreground ml-auto">(342)</span>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="automatic" id="transmission-automatic" />
                <Label htmlFor="transmission-automatic" className="flex items-center gap-2">
                  <span>Automatic</span>
                </Label>
                <span className="text-xs text-muted-foreground ml-auto">(220)</span>
              </div>
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>
        
        <Separator className="my-2" />
        
        {/* Features */}
        <Collapsible open={openSections.features} className="mb-4">
          <CollapsibleTrigger 
            onClick={() => toggleSection('features')}
            className="flex justify-between items-center w-full py-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              <span>Features</span>
            </div>
            {openSections.features ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <div className="space-y-4 max-h-48 overflow-y-auto">
              {featureOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`feature-${option.id}`} 
                    checked={selectedFeatures.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFeatures([...selectedFeatures, option.id]);
                      } else {
                        setSelectedFeatures(selectedFeatures.filter(id => id !== option.id));
                      }
                    }}
                  />
                  <label 
                    htmlFor={`feature-${option.id}`}
                    className="flex items-center justify-between w-full text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <div className="flex items-center gap-2">
                      <span>{option.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({option.count})</span>
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Separator className="my-2" />
        
        {/* Mileage */}
        <Collapsible open={openSections.mileage} className="mb-4">
          <CollapsibleTrigger 
            onClick={() => toggleSection('mileage')}
            className="flex justify-between items-center w-full py-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              <span>Mileage</span>
            </div>
            {openSections.mileage ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <div className="space-y-4">
              <Slider 
                defaultValue={mileageRange} 
                min={5}
                max={40}
                step={1}
                onValueChange={(value) => setMileageRange(value as number[])}
                className="mt-6"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium">{mileageRange[0]} km/l</span>
                <span className="text-sm font-medium">{mileageRange[1]} km/l</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Separator className="my-2" />
        
        {/* EV Range */}
        <Collapsible open={openSections.evRange} className="mb-4">
          <CollapsibleTrigger 
            onClick={() => toggleSection('evRange')}
            className="flex justify-between items-center w-full py-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              <span>Electric Car Range</span>
            </div>
            {openSections.evRange ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <div className="space-y-4">
              <Slider 
                defaultValue={evRange} 
                min={100}
                max={800}
                step={10}
                onValueChange={(value) => setEvRange(value as number[])}
                className="mt-6"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium">{evRange[0]} km</span>
                <span className="text-sm font-medium">{evRange[1]} km</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Separator className="my-2" />
        
        {/* Seats */}
        <Collapsible open={openSections.seats} className="mb-4">
          <CollapsibleTrigger 
            onClick={() => toggleSection('seats')}
            className="flex justify-between items-center w-full py-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              <span>Seats</span>
            </div>
            {openSections.seats ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <div className="space-y-2">
              {seatsOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`seats-${option.id}`} 
                    checked={selectedSeats.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSeats([...selectedSeats, option.id]);
                      } else {
                        setSelectedSeats(selectedSeats.filter(id => id !== option.id));
                      }
                    }}
                  />
                  <label 
                    htmlFor={`seats-${option.id}`}
                    className="flex items-center justify-between w-full text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <div className="flex items-center gap-2">
                      <span>{option.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({option.count})</span>
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Separator className="my-2" />
        
        {/* Safety Rating */}
        <Collapsible open={openSections.safetyRating} className="mb-4">
          <CollapsibleTrigger 
            onClick={() => toggleSection('safetyRating')}
            className="flex justify-between items-center w-full py-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              <span>GNCAP Safety Rating</span>
            </div>
            {openSections.safetyRating ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <Select value={safetyRating} onValueChange={setSafetyRating}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">⭐ 1 Star</SelectItem>
                <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>
        
        <Separator className="my-2" />
        
        {/* Engine Displacement */}
        <Collapsible open={openSections.engineDisplacement} className="mb-4">
          <CollapsibleTrigger 
            onClick={() => toggleSection('engineDisplacement')}
            className="flex justify-between items-center w-full py-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              <span>Engine Displacement</span>
            </div>
            {openSections.engineDisplacement ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <div className="space-y-4">
              <Slider 
                defaultValue={engineDisplacement} 
                min={500}
                max={5000}
                step={100}
                onValueChange={(value) => setEngineDisplacement(value as number[])}
                className="mt-6"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium">{engineDisplacement[0]} cc</span>
                <span className="text-sm font-medium">{engineDisplacement[1]} cc</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Separator className="my-2" />
        
        {/* Airbags */}
        <Collapsible open={openSections.airbags} className="mb-4">
          <CollapsibleTrigger 
            onClick={() => toggleSection('airbags')}
            className="flex justify-between items-center w-full py-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              <span>Airbags</span>
            </div>
            {openSections.airbags ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <div className="space-y-2">
              {airbagsOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`airbags-${option.id}`} 
                    checked={selectedAirbags.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedAirbags([...selectedAirbags, option.id]);
                      } else {
                        setSelectedAirbags(selectedAirbags.filter(id => id !== option.id));
                      }
                    }}
                  />
                  <label 
                    htmlFor={`airbags-${option.id}`}
                    className="flex items-center justify-between w-full text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <div className="flex items-center gap-2">
                      <span>{option.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({option.count})</span>
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Separator className="my-2" />
        
        {/* Cylinders */}
        <Collapsible open={openSections.cylinders} className="mb-4">
          <CollapsibleTrigger 
            onClick={() => toggleSection('cylinders')}
            className="flex justify-between items-center w-full py-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              <span>Cylinders</span>
            </div>
            {openSections.cylinders ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <div className="space-y-2">
              {cylindersOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cylinders-${option.id}`} 
                    checked={selectedCylinders.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCylinders([...selectedCylinders, option.id]);
                      } else {
                        setSelectedCylinders(selectedCylinders.filter(id => id !== option.id));
                      }
                    }}
                  />
                  <label 
                    htmlFor={`cylinders-${option.id}`}
                    className="flex items-center justify-between w-full text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <div className="flex items-center gap-2">
                      <span>{option.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({option.count})</span>
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Separator className="my-2" />
        
        {/* Wheel Drive */}
        <Collapsible open={openSections.wheelDrive} className="mb-4">
          <CollapsibleTrigger 
            onClick={() => toggleSection('wheelDrive')}
            className="flex justify-between items-center w-full py-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              <span>Wheel Drive</span>
            </div>
            {openSections.wheelDrive ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4">
            <Select value={wheelDrive} onValueChange={setWheelDrive}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select wheel drive" />
              </SelectTrigger>
              <SelectContent>
                {wheelDriveOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label} <span className="text-xs text-muted-foreground">({option.count})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      {/* Apply filters button - fixed at bottom */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex gap-2">
          <Button 
            onClick={handleApplyFilters}
            className="w-full"
          >
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="w-1/3"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
