import React, { useState } from "react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronUp, 
  Fuel, 
  Zap, 
  Bike, 
  Users, 
  User,
  Settings,
  Palette
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

interface FilterSidebarProps {
  onApplyFilters?: (filters: Record<string, any>) => void;
  appliedFilters?: Record<string, any>;
  onClearFilters?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onApplyFilters = () => {},
  appliedFilters = {},
  onClearFilters = () => {}
}) => {
  // Filter states
  const [yearRange, setYearRange] = useState<number[]>([2015, 2025]);
  const [kmsRange, setKmsRange] = useState<number[]>([0, 50000]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedBikeType, setSelectedBikeType] = useState<string>("");
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  
  // Open/close state for collapsible sections
  const [openSections, setOpenSections] = useState({
    modelYear: true,
    kmsDriven: true,
    fuelType: true,
    bikeType: true,
    transmission: true,
    color: true,
    seats: true,
    features: true,
    owners: true
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
      yearRange,
      kmsRange,
      fuelType: selectedFuelTypes,
      bikeType: selectedBikeType,
      transmission: selectedTransmission,
      color: selectedColor,
      seats: selectedSeats,
      features: selectedFeatures,
      owners: selectedOwners
    };
    
    onApplyFilters(filters);
  };
  
  // Mock data for the filter options
  const fuelTypes = [
    { id: "petrol", label: "Petrol", icon: <Fuel className="h-4 w-4" />, count: 425 },
    { id: "electric", label: "Electric", icon: <Zap className="h-4 w-4" />, count: 32 },
    { id: "cng", label: "CNG", icon: <Fuel className="h-4 w-4" />, count: 28 }
  ];

  const bikeTypes = [
    { id: "commuter", label: "Commuter", image: "/placeholder.svg", count: 178 },
    { id: "cruiser", label: "Cruiser", image: "/placeholder.svg", count: 85 },
    { id: "sports", label: "Sports", image: "/placeholder.svg", count: 93 },
    { id: "adventure", label: "Adventure", image: "/placeholder.svg", count: 47 },
    { id: "electric", label: "Electric", image: "/placeholder.svg", count: 32 },
    { id: "scooty", label: "Scooty", image: "/placeholder.svg", count: 112 }
  ];

  const transmissionTypes = [
    { id: "manual", label: "Manual", icon: <Settings className="h-4 w-4" />, count: 375 },
    { id: "automatic", label: "Automatic", icon: <Settings className="h-4 w-4" />, count: 110 }
  ];

  const colorOptions = [
    { id: "black", label: "Black", colorCode: "#000000", count: 145 },
    { id: "blue", label: "Blue", colorCode: "#0000FF", count: 78 },
    { id: "red", label: "Red", colorCode: "#FF0000", count: 92 },
    { id: "white", label: "White", colorCode: "#FFFFFF", count: 105 },
    { id: "silver", label: "Silver", colorCode: "#C0C0C0", count: 87 },
    { id: "green", label: "Green", colorCode: "#008000", count: 28 },
    { id: "yellow", label: "Yellow", colorCode: "#FFFF00", count: 32 },
    { id: "orange", label: "Orange", colorCode: "#FFA500", count: 25 },
    { id: "grey", label: "Grey", colorCode: "#808080", count: 68 }
  ];

  const seatOptions = [
    { id: "single", label: "Single Seater", icon: <User className="h-4 w-4" />, count: 85 },
    { id: "double", label: "Double Seater", icon: <Users className="h-4 w-4" />, count: 400 }
  ];

  const featureOptions = {
    premium: [
      { id: "digital-console", label: "Digital Console", icon: <Zap className="h-4 w-4" />, count: 245 },
      { id: "led-headlights", label: "LED Headlights", icon: <Zap className="h-4 w-4" />, count: 178 },
      { id: "alloy-wheels", label: "Alloy Wheels", icon: <Bike className="h-4 w-4" />, count: 280 },
      { id: "bluetooth", label: "Bluetooth Connectivity", icon: <Zap className="h-4 w-4" />, count: 120 }
    ],
    smart: [
      { id: "abs", label: "ABS", icon: <Bike className="h-4 w-4" />, count: 195 },
      { id: "traction-control", label: "Traction Control", icon: <Bike className="h-4 w-4" />, count: 85 },
      { id: "cruise-control", label: "Cruise Control", icon: <Bike className="h-4 w-4" />, count: 45 },
      { id: "keyless-start", label: "Keyless Start", icon: <Zap className="h-4 w-4" />, count: 92 }
    ],
    vip: [
      { id: "special-edition", label: "Special Edition", icon: <Bike className="h-4 w-4" />, count: 28 },
      { id: "top-model", label: "Top Model", icon: <Bike className="h-4 w-4" />, count: 65 }
    ],
    other: [
      { id: "dual-disc", label: "Dual Disc Brakes", icon: <Bike className="h-4 w-4" />, count: 145 },
      { id: "adjustable-suspension", label: "Adjustable Suspension", icon: <Bike className="h-4 w-4" />, count: 78 },
      { id: "gps", label: "GPS Navigation", icon: <Bike className="h-4 w-4" />, count: 45 }
    ]
  };

  const ownerOptions = [
    { id: "first", label: "First Owner", icon: <User className="h-4 w-4" />, count: 285 },
    { id: "second", label: "Second Owner", icon: <Users className="h-4 w-4" />, count: 142 },
    { id: "third", label: "Third Owner", icon: <div className="flex"><Users className="h-4 w-4 mr-1" /><User className="h-4 w-4" /></div>, count: 45 },
    { id: "fourth", label: "Fourth Owner", icon: <div className="flex"><Users className="h-4 w-4 mr-1" /><Users className="h-4 w-4" /></div>, count: 13 }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-border h-full animate-slide-in-right">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      {/* Model Year Filter */}
      <Collapsible open={openSections.modelYear} className="mb-4">
        <CollapsibleTrigger 
          onClick={() => toggleSection('modelYear')}
          className="flex justify-between items-center w-full py-2 text-left font-medium"
        >
          Model Year
          {openSections.modelYear ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4">
          <div className="space-y-4">
            <Slider 
              defaultValue={yearRange} 
              min={2000}
              max={2023}
              step={1}
              onValueChange={(value) => setYearRange(value as number[])}
              className="mt-6"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium">{yearRange[0]}</span>
              <span className="text-sm font-medium">{yearRange[1]}</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator className="my-2" />
      
      {/* KMs Driven */}
      <Collapsible open={openSections.kmsDriven} className="mb-4">
        <CollapsibleTrigger 
          onClick={() => toggleSection('kmsDriven')}
          className="flex justify-between items-center w-full py-2 text-left font-medium"
        >
          KMs Driven
          {openSections.kmsDriven ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4">
          <div className="space-y-4">
            <Slider 
              defaultValue={kmsRange} 
              min={0}
              max={50000}
              step={500}
              onValueChange={(value) => setKmsRange(value as number[])}
              className="mt-6"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium">{kmsRange[0].toLocaleString()} km</span>
              <span className="text-sm font-medium">{kmsRange[1].toLocaleString()} km</span>
            </div>
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
          Fuel Type
          {openSections.fuelType ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4">
          <div className="space-y-2">
            {fuelTypes.map((option) => (
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
                    {option.icon}
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
      
      {/* Bike Type */}
      <Collapsible open={openSections.bikeType} className="mb-4">
        <CollapsibleTrigger 
          onClick={() => toggleSection('bikeType')}
          className="flex justify-between items-center w-full py-2 text-left font-medium"
        >
          Bike Type
          {openSections.bikeType ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4">
          <RadioGroup 
            value={selectedBikeType}
            onValueChange={setSelectedBikeType}
            className="grid grid-cols-3 gap-2"
          >
            {bikeTypes.map((option) => (
              <div 
                key={option.id} 
                className={`relative flex flex-col items-center border rounded-md p-2 cursor-pointer transition-all hover:border-primary ${
                  selectedBikeType === option.id ? 'border-primary ring-1 ring-primary' : 'border-border'
                }`}
              >
                <RadioGroupItem 
                  value={option.id} 
                  id={`type-${option.id}`}
                  className="sr-only"
                />
                <img 
                  src={option.image} 
                  alt={option.label} 
                  className="h-8 w-8 mb-1"
                />
                <label 
                  htmlFor={`type-${option.id}`}
                  className="text-xs text-center cursor-pointer"
                >
                  {option.label}
                  <div className="text-[10px] text-muted-foreground">({option.count})</div>
                </label>
              </div>
            ))}
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator className="my-2" />
      
      {/* Transmission */}
      <Collapsible open={openSections.transmission} className="mb-4">
        <CollapsibleTrigger 
          onClick={() => toggleSection('transmission')}
          className="flex justify-between items-center w-full py-2 text-left font-medium"
        >
          Transmission
          {openSections.transmission ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4">
          <div className="space-y-2">
            {transmissionTypes.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`transmission-${option.id}`} 
                  checked={selectedTransmission.includes(option.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedTransmission([...selectedTransmission, option.id]);
                    } else {
                      setSelectedTransmission(selectedTransmission.filter(id => id !== option.id));
                    }
                  }}
                />
                <label 
                  htmlFor={`transmission-${option.id}`}
                  className="flex items-center justify-between w-full text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <div className="flex items-center gap-2">
                    {option.icon}
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
      
      {/* Color */}
      <Collapsible open={openSections.color} className="mb-4">
        <CollapsibleTrigger 
          onClick={() => toggleSection('color')}
          className="flex justify-between items-center w-full py-2 text-left font-medium"
        >
          Color
          {openSections.color ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4">
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((option) => (
              <div 
                key={option.id}
                onClick={() => setSelectedColor(selectedColor === option.id ? "" : option.id)}
                className={`relative flex flex-col items-center border rounded-md p-2 cursor-pointer transition-all hover:border-primary ${
                  selectedColor === option.id ? 'border-primary ring-1 ring-primary' : 'border-border'
                }`}
              >
                <div 
                  className="h-6 w-6 rounded-full border mb-1" 
                  style={{ 
                    backgroundColor: option.colorCode,
                    borderColor: option.colorCode === "#FFFFFF" ? "#E5E7EB" : option.colorCode
                  }}
                />
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
      
      {/* Seats */}
      <Collapsible open={openSections.seats} className="mb-4">
        <CollapsibleTrigger 
          onClick={() => toggleSection('seats')}
          className="flex justify-between items-center w-full py-2 text-left font-medium"
        >
          Seats
          {openSections.seats ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4">
          <RadioGroup 
            value={selectedSeats}
            onValueChange={setSelectedSeats}
            className="grid grid-cols-2 gap-2"
          >
            {seatOptions.map((option) => (
              <div 
                key={option.id} 
                className={`relative flex flex-col items-center border rounded-md p-2 cursor-pointer transition-all hover:border-primary ${
                  selectedSeats === option.id ? 'border-primary ring-1 ring-primary' : 'border-border'
                }`}
              >
                <RadioGroupItem 
                  value={option.id} 
                  id={`seats-${option.id}`}
                  className="sr-only"
                />
                <div className="flex items-center justify-center mb-1">
                  {option.icon}
                </div>
                <label 
                  htmlFor={`seats-${option.id}`}
                  className="text-xs text-center cursor-pointer"
                >
                  {option.label}
                  <div className="text-[10px] text-muted-foreground">({option.count})</div>
                </label>
              </div>
            ))}
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
          Features
          {openSections.features ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Premium Features</h4>
              <div className="space-y-2">
                {featureOptions.premium.map((option) => (
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
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({option.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Smart Features</h4>
              <div className="space-y-2">
                {featureOptions.smart.map((option) => (
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
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({option.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">VIP Features</h4>
              <div className="space-y-2">
                {featureOptions.vip.map((option) => (
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
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({option.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Other Features</h4>
              <div className="space-y-2">
                {featureOptions.other.map((option) => (
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
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({option.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Separator className="my-2" />
      
      {/* Owners */}
      <Collapsible open={openSections.owners} className="mb-4">
        <CollapsibleTrigger 
          onClick={() => toggleSection('owners')}
          className="flex justify-between items-center w-full py-2 text-left font-medium"
        >
          Owners
          {openSections.owners ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4">
          <div className="space-y-2">
            {ownerOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`owner-${option.id}`} 
                  checked={selectedOwners.includes(option.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedOwners([...selectedOwners, option.id]);
                    } else {
                      setSelectedOwners(selectedOwners.filter(id => id !== option.id));
                    }
                  }}
                />
                <label 
                  htmlFor={`owner-${option.id}`}
                  className="flex items-center justify-between w-full text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({option.count})</span>
                </label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Apply filters button */}
      <div className="flex gap-2 mt-6">
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
  );
};

export default FilterSidebar;
