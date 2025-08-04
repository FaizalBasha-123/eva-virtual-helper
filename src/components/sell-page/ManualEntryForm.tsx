import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchAllBrands, fetchAllBikeBrands, fetchModelsByBrandAndYear, fetchBikeModelsByBrandAndYear, fetchVariantsByModel, fetchBikeVariantsByModel, findBrandIdByName, findBikeBrandIdByName } from "@/services/vehicleService";

import { Brand, Model, Variant } from "@/types/vehicleTypes";
import CityModal from "@/components/cars/CityModal";
import PhotoUpload from "@/components/appointment/PhotoUpload";
import VehicleTypeToggle from "./VehicleTypeToggle";

interface ManualEntryFormProps {
  vehicleType: "car" | "bike";
  onVehicleTypeChange?: (type: "car" | "bike") => void;
  onPhotoUploadSectionVisible?: (visible: boolean) => void;
}

// Typable + Listable Input for Brand, Year, Model, Variant
interface TypableSelectInputProps {
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

const TypableSelectInput: React.FC<TypableSelectInputProps> = ({
  label,
  placeholder,
  value,
  options,
  onChange,
  disabled = false,
  required = false,
}) => {
  const [inputValue, setInputValue] = useState<string>(value || "");
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    setFilteredOptions(
      options.filter(opt =>
        opt.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [inputValue, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setShowSuggestions(true);
    setHighlightIndex(-1);
    onChange(val);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex(prev => (prev + 1) % filteredOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && filteredOptions[highlightIndex]) {
        const selected = filteredOptions[highlightIndex];
        setInputValue(selected);
        onChange(selected);
        setShowSuggestions(false);
      } else {
        onChange(inputValue);
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    onChange(option);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative">
      <Label className="text-foreground">{label}{required && ' *'}</Label>
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`h-12 bg-background border-input text-foreground placeholder:text-muted-foreground ${highlightIndex === -1 ? '' : 'border-accent text-accent-foreground'}`}
        autoComplete="off"
      />
      {showSuggestions && filteredOptions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-background border border-input rounded-md shadow-lg max-h-56 overflow-auto">
          {filteredOptions.map((opt, idx) => (
            <div
              key={opt}
              className={`px-4 py-2 cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground ${highlightIndex === idx ? 'bg-accent text-accent-foreground' : ''}`}
              onMouseDown={() => handleOptionClick(opt)}
              onMouseEnter={() => setHighlightIndex(idx)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// TypableSuggestionInput: UI-only enhancement for suggestion dropdowns
interface TypableSuggestionInputProps {
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const TypableSuggestionInput: React.FC<TypableSuggestionInputProps> = ({
  label,
  placeholder,
  value,
  options,
  onChange,
  disabled = false,
  required = false,
  className = "",
}) => {
  const [inputValue, setInputValue] = useState<string>(value || "");
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    setFilteredOptions(
      options.filter(opt =>
        opt.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [inputValue, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setShowSuggestions(true);
    setHighlightIndex(-1);
    onChange(val);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex(prev => (prev + 1) % filteredOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && filteredOptions[highlightIndex]) {
        const selected = filteredOptions[highlightIndex];
        setInputValue(selected);
        onChange(selected);
        setShowSuggestions(false);
      } else {
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    onChange(option);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative">
      <Label className="text-foreground">{label}{required && ' *'}</Label>
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`h-12 bg-background border-input text-foreground placeholder:text-muted-foreground ${className} ${highlightIndex === -1 ? '' : 'border-accent text-accent-foreground'}`}
        autoComplete="off"
      />
      {showSuggestions && filteredOptions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-background border border-input rounded-md shadow-lg max-h-56 overflow-auto">
          {filteredOptions.map((opt, idx) => (
            <div
              key={opt}
              className={`px-4 py-2 cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground ${highlightIndex === idx ? 'bg-accent text-accent-foreground' : ''}`}
              onMouseDown={() => handleOptionClick(opt)}
              onMouseEnter={() => setHighlightIndex(idx)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ vehicleType, onVehicleTypeChange, onPhotoUploadSectionVisible }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Form states
  const [brand, setBrand] = useState("");
  const [brandId, setBrandId] = useState("");
  const [year, setYear] = useState("");
  const [model, setModel] = useState("");
  const [modelId, setModelId] = useState("");
  const [variant, setVariant] = useState("");
  const [city, setCity] = useState("");
  const [kilometers, setKilometers] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [numberOfOwners, setNumberOfOwners] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmissionType, setTransmissionType] = useState("");
  const [showCarFields, setShowCarFields] = useState(false);
  const [kilometerOption, setKilometerOption] = useState("");
  
  // Data states
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [isSwitchingVehicleType, setIsSwitchingVehicleType] = useState(false);
  
  // Add a handler to allow toggling vehicle type (if needed, you may need to lift state up in the parent for full control)
  const [localVehicleType, setLocalVehicleType] = useState(vehicleType);
  useEffect(() => { setLocalVehicleType(vehicleType); }, [vehicleType]);
  const handleToggleChange = (val: string) => {
    if (val === "car" || val === "bike") {
      // Set flag to prevent auto-save during switch
      setIsSwitchingVehicleType(true);
      
      // Clear all form data when switching vehicle types
      setBrand("");
      setBrandId("");
      setYear("");
      setModel("");
      setModelId("");
      setVariant("");
      setKilometers("");
      setKilometerOption("");
      setSellerName("");
      setExpectedPrice("");
      setContactNumber("");
      setSellerType("");
      setNumberOfOwners("");
      setFuelType("");
      setTransmissionType("");
      
      // Clear models and variants
      setModels([]);
      setVariants([]);
      
      // Clear all localStorage data
      clearAllFormData();
      
      // Update vehicle type
      setLocalVehicleType(val);
      if (onVehicleTypeChange) onVehicleTypeChange(val);
      
      // Reset flag after a short delay
      setTimeout(() => {
        setIsSwitchingVehicleType(false);
      }, 100);
    }
  };

  // Show Fuel/Transmission only if vehicle is car
  useEffect(() => {
    const vehicle = localStorage.getItem("vehicle");
    setShowCarFields(vehicle === "car");
  }, [localVehicleType]);



  // Mobile-first responsive container sizing
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 770);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile-first responsive container styles
  const getContainerStyles = () => {
    if (isMobile) {
      return {
        width: '100%',
        maxWidth: '100%'
      };
    } else {
      return {
        width: '328px',
        maxWidth: '328px'
      };
    }
  };

  // Mobile-first responsive spacing
  const getContainerClasses = () => {
    if (isMobile) {
      return "space-y-4 overflow-y-auto text-foreground";
    } else {
      return "space-y-6 overflow-y-auto text-foreground";
    }
  };

  // Generate years
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 1993; y--) {
      years.push(y.toString());
    }
    return years;
  };

  // Load brands on mount
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const fetchedBrands = localVehicleType === "car" ? await fetchAllBrands() : await fetchAllBikeBrands();
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("Error loading brands:", error);
        toast.error("Failed to load brands");
      }
    };
    loadBrands();
  }, [localVehicleType]);

  // Load models when brand and year change
  useEffect(() => {
    const loadModels = async () => {
      if (brandId && year) {
        try {
          const fetchedModels = localVehicleType === "car" 
            ? await fetchModelsByBrandAndYear(brandId, year)
            : await fetchBikeModelsByBrandAndYear(brandId, year);
          setModels(fetchedModels);
          
          // If we have a model already selected, find its ID
          if (model && fetchedModels.length > 0) {
            const selectedModel = fetchedModels.find(m => m.model_name === model);
            if (selectedModel) {
              setModelId(selectedModel.id);
            }
          }
        } catch (error) {
          console.error("Error loading models:", error);
          toast.error("Failed to load models");
        }
      }
    };
    loadModels();
  }, [brandId, year, localVehicleType, model]);

  // Load variants when model changes
  useEffect(() => {
    const loadVariants = async () => {
      if (modelId) {
        try {
          const fetchedVariants = localVehicleType === "car" 
            ? await fetchVariantsByModel(modelId)
            : await fetchBikeVariantsByModel(modelId);
          setVariants(fetchedVariants);
        } catch (error) {
          console.error("Error loading variants:", error);
          toast.error("Failed to load variants");
        }
      }
    };
    loadVariants();
  }, [modelId, localVehicleType]);

  // Load city from localStorage
  useEffect(() => {
    // Set initial city from localStorage
    setCity(localStorage.getItem('selectedCity') || '');

    // Handler to update city state
    const updateCity = () => setCity(localStorage.getItem('selectedCity') || '');

    // Listen for custom event (from CityModal)
    window.addEventListener('citySelected', updateCity);

    // Listen for storage event (cross-tab)
    window.addEventListener('storage', (e) => {
      if (e.key === 'selectedCity') updateCity();
    });

    return () => {
      window.removeEventListener('citySelected', updateCity);
      window.removeEventListener('storage', updateCity);
    };
  }, []);

  // Restore all form data from localStorage on component mount
  useEffect(() => {
    const restoreFormData = async () => {
      try {
        // Check if we're switching vehicle types to prevent restoring incompatible data
        const storedVehicleType = localStorage.getItem("vehicle");
        const isVehicleTypeChanged = storedVehicleType !== localVehicleType;
        
        // If vehicle type changed, don't restore vehicle-specific data
        if (isVehicleTypeChanged) {
          console.log("Vehicle type changed, skipping form data restoration");
          return;
        }

        // Restore sellFormData
        const sellFormData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
        if (sellFormData.brand) {
          setBrand(sellFormData.brand);
          // Find brand ID for the restored brand
          try {
            const id = localVehicleType === "car" 
              ? await findBrandIdByName(sellFormData.brand)
              : await findBikeBrandIdByName(sellFormData.brand);
            setBrandId(id || "");
          } catch (error) {
            console.error("Error finding brand ID for restored brand:", error);
            // If brand ID lookup fails, clear the brand to prevent inconsistency
            setBrand("");
            setBrandId("");
          }
        }
        if (sellFormData.year) setYear(sellFormData.year);
        if (sellFormData.model) {
          setModel(sellFormData.model);
          // Note: modelId will be set when models are loaded and the model is found
        }
        if (sellFormData.variant) setVariant(sellFormData.variant);
        if (sellFormData.kilometers) setKilometers(sellFormData.kilometers);

        // Restore appointment_step5_data
        const step5Data = JSON.parse(localStorage.getItem("appointment_step5_data") || "{}");
        if (step5Data.seller_name) setSellerName(step5Data.seller_name);
        if (step5Data.seller_price) setExpectedPrice(step5Data.seller_price);
        if (step5Data.phone_number) setContactNumber(step5Data.phone_number);

        // Restore appointment_step2_data
        const step2Data = JSON.parse(localStorage.getItem("appointment_step2_data") || "{}");
        if (step2Data.number_of_owners) setNumberOfOwners(step2Data.number_of_owners);
        if (step2Data.fuel_type) setFuelType(step2Data.fuel_type);
        if (step2Data.transmission_type) setTransmissionType(step2Data.transmission_type);

        // Restore individual localStorage items
        const sellerType = localStorage.getItem("seller_type");
        if (sellerType) setSellerType(sellerType);

        const fuelType = localStorage.getItem("fuel_type");
        if (fuelType) setFuelType(fuelType);

        const transmissionType = localStorage.getItem("transmission_type");
        if (transmissionType) setTransmissionType(transmissionType);

        const kilometers = localStorage.getItem("kilometers");
        if (kilometers) {
          setKilometers(kilometers);
          if (kilometers === "0") {
            setKilometerOption("na");
          } else if (kilometers && kilometers !== "na") {
            setKilometerOption("manual");
          }
        }

        const sellerPrice = localStorage.getItem("seller_price");
        if (sellerPrice) setExpectedPrice(sellerPrice);

      } catch (error) {
        console.error("Error restoring form data:", error);
      }
    };

    restoreFormData();
  }, [localVehicleType]); // Re-run when vehicle type changes

  // Auto-save form data when any field changes
  useEffect(() => {
    // Don't save if we're switching vehicle types
    if (isSwitchingVehicleType) return;
    
    // Only save if we have some data to save (to avoid overwriting with empty data on initial load)
    if (brand || year || model || variant || sellerName || expectedPrice || contactNumber || sellerType || numberOfOwners || fuelType || transmissionType) {
      saveAllFormData();
    }
  }, [brand, year, model, variant, sellerName, expectedPrice, contactNumber, sellerType, numberOfOwners, fuelType, transmissionType, kilometers, isSwitchingVehicleType]);



  // Update localStorage functions
  const updateSellFormData = (key: string, value: any) => {
    const prev = JSON.parse(localStorage.getItem("sellFormData") || "{}");
    const updated = { ...prev, [key]: value };
    localStorage.setItem("sellFormData", JSON.stringify(updated));
  };

  const updateAppointmentStep5Data = (key: string, value: any) => {
    const prev = JSON.parse(localStorage.getItem("appointment_step5_data") || "{}");
    const updated = { ...prev, [key]: value };
    localStorage.setItem("appointment_step5_data", JSON.stringify(updated));
  };

  const updateAppointmentStep2Data = (key: string, value: any) => {
    const prev = JSON.parse(localStorage.getItem("appointment_step2_data") || "{}");
    const updated = { ...prev, [key]: value };
    localStorage.setItem("appointment_step2_data", JSON.stringify(updated));
  };

  // Function to clear all form data from localStorage
  const clearAllFormData = () => {
    localStorage.removeItem("sellFormData");
    localStorage.removeItem("appointment_step1_data");
    localStorage.removeItem("appointment_step2_data");
    localStorage.removeItem("appointment_step3_data");
    localStorage.removeItem("appointment_step5_data");
    localStorage.removeItem("appointment_step6_data");
    localStorage.removeItem("uploadedFileNames");
    localStorage.removeItem("uploadedFileUrls");
    localStorage.removeItem("seller_type");
    localStorage.removeItem("fuel_type");
    localStorage.removeItem("transmission_type");
    localStorage.removeItem("kilometers");
    localStorage.removeItem("seller_price");
  };

  // Function to save all current form data to localStorage
  const saveAllFormData = () => {
    // Save sellFormData
    const sellFormData = {
      brand,
      year,
      model,
      variant,
      kilometers
    };
    localStorage.setItem("sellFormData", JSON.stringify(sellFormData));

    // Save appointment_step5_data
    const step5Data = {
      seller_name: sellerName,
      seller_price: expectedPrice,
      phone_number: contactNumber
    };
    localStorage.setItem("appointment_step5_data", JSON.stringify(step5Data));

    // Save appointment_step2_data
    const step2Data = {
      number_of_owners: numberOfOwners,
      fuel_type: fuelType,
      transmission_type: transmissionType
    };
    localStorage.setItem("appointment_step2_data", JSON.stringify(step2Data));

  // Save individual items
  if (sellerType) localStorage.setItem("seller_type", sellerType);
  if (fuelType) localStorage.setItem("fuel_type", fuelType);
  if (transmissionType) localStorage.setItem("transmission_type", transmissionType);
  if (kilometers) localStorage.setItem("kilometers", kilometers === "na" ? "0" : kilometers);
  if (expectedPrice) localStorage.setItem("seller_price", expectedPrice);
  };

  // Handlers
  const handleBrandChange = async (value: string) => {
    setBrand(value);
    updateSellFormData("brand", value);
    
    try {
      const id = localVehicleType === "car" 
        ? await findBrandIdByName(value)
        : await findBikeBrandIdByName(value);
      setBrandId(id || "");
    } catch (error) {
      console.error("Error finding brand ID:", error);
    }
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    updateSellFormData("year", value);
  };

  const handleModelChange = (value: string) => {
    setModel(value);
    updateSellFormData("model", value);
    
    const selectedModel = models.find(m => m.model_name === value);
    setModelId(selectedModel?.id || "");
  };

  const handleVariantChange = (value: string) => {
    setVariant(value);
    updateSellFormData("variant", value);
  };

  const handleCityChange = (selectedCity: string) => {
    setCity(selectedCity);
    updateSellFormData("city", selectedCity);
  };

  const handleKilometerOptionChange = (value: string) => {
    setKilometerOption(value);
    if (value === "na") {
      setKilometers("na");
      updateSellFormData("kilometers", "0");
      localStorage.setItem("kilometers", "0");
    } else if (value === "manual") {
      setKilometers("");
    }
  };

  const handleKilometersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (kilometerOption === "manual") {
      const value = e.target.value.replace(/[^0-9]/g, '');
      setKilometers(value);
      updateSellFormData("kilometers", value);
      localStorage.setItem("kilometers", value);
    }
  };

  const handleSellerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSellerName(e.target.value);
    updateAppointmentStep5Data("seller_name", e.target.value);
  };

  const handleExpectedPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setExpectedPrice(value);
    updateAppointmentStep5Data("seller_price", value);
    localStorage.setItem("seller_price", value);
  };

  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactNumber(e.target.value);
    updateAppointmentStep5Data("phone_number", e.target.value);
  };

  const handleNumberOfOwnersChange = (value: string) => {
    setNumberOfOwners(value);
    updateAppointmentStep2Data("number_of_owners", value);
  };

  // Add a ref to track if validation should be enforced
  const [enforceAllRequired, setEnforceAllRequired] = useState(false);

  // Validation function for all required fields
  const validateAllFields = () => {
    const errors = [];
    if (!brand) errors.push("Brand");
    if (!year) errors.push("Year");
    if (!model) errors.push("Model");
    if (!variant) errors.push("Variant");
    if (!city) errors.push("City");
    if (!kilometerOption) errors.push("Kilometers Option");
    if (!sellerName) errors.push("Seller Name");
    if (!expectedPrice) errors.push("Expected Price");
    if (!contactNumber) errors.push("Contact Number");
    if (!sellerType) errors.push("Seller Type");
    if (!numberOfOwners) errors.push("Number of Owners");
    if (!fuelType) errors.push("Fuel Type");
    if (showCarFields && !transmissionType) errors.push("Transmission Type");
    return errors;
  };

  const handleUploadPhotos = () => {
    setEnforceAllRequired(true);
    const errors = validateAllFields();
    if (errors.length > 0) {
      toast.error(`Please fill all required fields: ${errors.join(", ")}`);
      return;
    }
    // Store fuelType and transmissionType in appointment_step2_data
    const existingStep2 = JSON.parse(localStorage.getItem("appointment_step2_data") || "{}") || {};
    const updatedStep2 = {
      ...existingStep2,
      fuel_type: fuelType,
      transmission_type: transmissionType
    };
    localStorage.setItem("appointment_step2_data", JSON.stringify(updatedStep2));
    if (!currentUser) {
      window.dispatchEvent(new CustomEvent('openSignInModal'));
      return;
    }
    setShowPhotoUpload(true);
  };

  const handleProceedToPay = () => {
    // Remove fuel_type and transmission_type if vehicle is bike
    const vehicleType = localStorage.getItem("vehicle");
    if (vehicleType === "bike") {
      const step2Data = JSON.parse(localStorage.getItem("appointment_step2_data") || "{}");
      let changed = false;
      if ("fuel_type" in step2Data) { delete step2Data.fuel_type; changed = true; }
      if ("transmission_type" in step2Data) { delete step2Data.transmission_type; changed = true; }
      if (changed) {
        localStorage.setItem("appointment_step2_data", JSON.stringify(step2Data));
      }
    }
    // Check for uploadedFileUrls before navigating
    const uploadedFileUrls = localStorage.getItem("uploadedFileUrls");
    if (!uploadedFileUrls) {
      toast.error("Please reupload the files");
      return;
    }
    navigate('/posting');
  };

  useEffect(() => {
    if (typeof onPhotoUploadSectionVisible === 'function') {
      onPhotoUploadSectionVisible(!!showPhotoUpload);
    }
  }, [showPhotoUpload]);

  const getKilometerPlaceholder = () => {
    if (!kilometerOption) return "Select Option";
    if (kilometerOption === "manual") return "Enter kilometers";
    if (kilometerOption === "na") return "NA";
    return "Select Option";
  };

  const getKilometerDropdownOptions = [
    { value: "manual", label: "Enter Manually" },
    { value: "na", label: "NA" }
  ];

  if (showPhotoUpload) {
    return (
      <div 
        className="flex flex-col h-full overflow-y-auto"
        style={getContainerStyles()}
      >
        <div className="flex-1 overflow-y-auto">
          <PhotoUpload 
            onBack={() => {
              setShowPhotoUpload(false);
              if (typeof onPhotoUploadSectionVisible === 'function') onPhotoUploadSectionVisible(false);
            }}
            onNext={() => {
              if (typeof onPhotoUploadSectionVisible === 'function') onPhotoUploadSectionVisible(false);
            }}
          />
        </div>
        <div className="mt-6 pb-6">
          <Button 
            onClick={() => {
              handleProceedToPay();
              if (typeof onPhotoUploadSectionVisible === 'function') onPhotoUploadSectionVisible(false);
            }}
            className="w-full bg-primary text-white hover:bg-primary/90 h-12"
          >
            Proceed to Pay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={getContainerClasses()}
      style={getContainerStyles()}
    >
      {/* Static VehicleTypeToggle at the top */}
      <VehicleTypeToggle vehicleType={localVehicleType} onToggleChange={handleToggleChange} />
      <h3 className="text-xl font-medium text-foreground">Enter Vehicle Details</h3>
      
      {/* Brand */}
      <div className="space-y-2">
        <TypableSuggestionInput
          label="Brand"
          placeholder="Select or type brand"
          value={brand}
          options={brands.map(b => b.name)}
          onChange={handleBrandChange}
          required
          className={enforceAllRequired && !brand ? 'border-red-500' : ''}
        />
      </div>

      {/* Year */}
      <div className="space-y-2">
        <TypableSuggestionInput
          label="Year"
          placeholder="Select or type year"
          value={year}
          options={generateYears()}
          onChange={handleYearChange}
          required
          className={enforceAllRequired && !year ? 'border-red-500' : ''}
        />
      </div>

      {/* Model */}
      <div className="space-y-2">
        <TypableSuggestionInput
          label="Model"
          placeholder="Select or type model"
          value={model}
          options={models.map(m => m.model_name)}
          onChange={handleModelChange}
          required
          className={enforceAllRequired && !model ? 'border-red-500' : ''}
        />
      </div>

      {/* Variant */}
      <div className="space-y-2">
        <TypableSuggestionInput
          label="Variant"
          placeholder="Select or type variant"
          value={variant}
          options={variants.map(v => v.variant_name)}
          onChange={handleVariantChange}
          required
          className={enforceAllRequired && !variant ? 'border-red-500' : ''}
        />
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label className="text-foreground">Vehicle City *</Label>
        <Button
          variant="outline"
          onClick={() => setShowCityModal(true)}
          aria-label="Select Vehicle City"
          className={`w-full h-12 justify-start bg-background border-input text-foreground hover:bg-accent hover:text-accent-foreground${enforceAllRequired && !city ? ' border-red-500' : ''}`}
        >
          {city || "Select Vehicle City"}
        </Button>
      </div>

      {/* Kilometers */}
      <div className="space-y-2">
        <Label htmlFor="kilometers" className="text-foreground">Kilometers Driven *</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="kilometers"
              type="text"
              placeholder={getKilometerPlaceholder()}
              value={kilometerOption === "manual" ? kilometers : kilometerOption === "na" ? "NA" : ""}
              onChange={handleKilometersChange}
              disabled={kilometerOption !== "manual"}
              className="h-12 bg-background border-input text-foreground placeholder:text-muted-foreground pr-2 min-w-[48px] min-h-[48px]"
            />
          </div>
          <div className="relative">
            <Select value={kilometerOption} onValueChange={handleKilometerOptionChange}>
              <SelectTrigger className="h-12 w-12 bg-background border-l-0 flex items-center justify-center min-w-[48px] min-h-[48px]" aria-label="Kilometers option" />
              <SelectContent className="bg-background border shadow-lg">
                {getKilometerDropdownOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Fuel Type (for both car and bike) */}
      <div className="space-y-2">
        <Label className="text-foreground">Fuel Type *</Label>
        <Select 
          value={fuelType} 
          onValueChange={value => {
            setFuelType(value);
            localStorage.setItem("fuel_type", value);
          }}
        >
          <SelectTrigger className={`h-12 bg-background border-input text-foreground${enforceAllRequired && !fuelType ? ' border-red-500' : ''}`} aria-label="Select fuel type" onFocus={() => { localStorage.setItem("fuel_type", fuelType); }}>
            <SelectValue placeholder="Select fuel type" />
          </SelectTrigger>
          <SelectContent className="bg-background border-input">
            <SelectItem value="Petrol" className="text-foreground hover:bg-accent hover:text-accent-foreground">Petrol</SelectItem>
            <SelectItem value="Diesel" className="text-foreground hover:bg-accent hover:text-accent-foreground">Diesel</SelectItem>
            <SelectItem value="CNG" className="text-foreground hover:bg-accent hover:text-accent-foreground">CNG</SelectItem>
            <SelectItem value="Electric" className="text-foreground hover:bg-accent hover:text-accent-foreground">Electric</SelectItem>
            <SelectItem value="Hybrid" className="text-foreground hover:bg-accent hover:text-accent-foreground">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

            {/* Transmission Type (only for car) */}
      {showCarFields && (
        <div className="space-y-2">
          <Label className="text-foreground">Transmission Type *</Label>
          <Select value={transmissionType} onValueChange={setTransmissionType}>
            <SelectTrigger className={`h-12 bg-background border-input text-foreground${enforceAllRequired && !transmissionType ? ' border-red-500' : ''}`} aria-label="Select transmission type">
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent className="bg-background border-input">
              <SelectItem value="Manual" className="text-foreground hover:bg-accent hover:text-accent-foreground">Manual</SelectItem>
              <SelectItem value="Automatic" className="text-foreground hover:bg-accent hover:text-accent-foreground">Automatic</SelectItem>
              <SelectItem value="AMT" className="text-foreground hover:bg-accent hover:text-accent-foreground">AMT</SelectItem>
              <SelectItem value="CVT" className="text-foreground hover:bg-accent hover:text-accent-foreground">CVT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Seller Details */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h4 className="text-lg font-medium text-foreground">Seller Details</h4>
        
        <div className="space-y-2">
          <Label htmlFor="sellerName" className="text-foreground">Seller Name *</Label>
          <Input
            id="sellerName"
            value={sellerName}
            onChange={handleSellerNameChange}
            placeholder="Enter your full name"
            className={`h-12 bg-background border-input text-foreground placeholder:text-muted-foreground${enforceAllRequired && !sellerName ? ' border-red-500' : ''}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedPrice" className="text-foreground">Expected Price (₹) *</Label>
          <Input
            id="expectedPrice"
            type="text"
            value={expectedPrice}
            onChange={handleExpectedPriceChange}
            onFocus={e => {
              localStorage.setItem("seller_price", e.target.value);
            }}
            placeholder="Enter your expected price"
            className={`h-12 bg-background border-input text-foreground placeholder:text-muted-foreground${enforceAllRequired && !expectedPrice ? ' border-red-500' : ''}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber" className="text-foreground">Contact Number *</Label>
          <Input
            id="contactNumber"
            type="tel"
            value={contactNumber}
            onChange={handleContactNumberChange}
            placeholder="Enter your phone number"
            className={`h-12 bg-background border-input text-foreground placeholder:text-muted-foreground${enforceAllRequired && !contactNumber ? ' border-red-500' : ''}`}
          />
          <div className="space-y-2 mt-2">
            <Label className="text-foreground">Seller Type *</Label>
            <Select
              value={sellerType}
              onValueChange={value => {
                setSellerType(value);
                localStorage.setItem("seller_type", value);
              }}
            >
              <SelectTrigger
                className="h-12 bg-background border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                aria-label="Select seller type"
                onFocus={() => {
                  localStorage.setItem("seller_type", sellerType);
                }}
              >
                <SelectValue placeholder="Select seller type" />
              </SelectTrigger>
              <SelectContent className="bg-background border-input">
                <SelectItem value="Owner" className="text-foreground hover:bg-accent hover:text-accent-foreground">Owner</SelectItem>
                <SelectItem value="Dealer" className="text-foreground hover:bg-accent hover:text-accent-foreground">Dealer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfOwners" className="text-foreground">Number of Owners *</Label>
          <Select value={numberOfOwners} onValueChange={handleNumberOfOwnersChange}>
            <SelectTrigger className={`h-12 bg-background border-input text-foreground${enforceAllRequired && !numberOfOwners ? ' border-red-500' : ''}`} aria-label="Select number of owners">
              <SelectValue placeholder="Select number of owners" />
            </SelectTrigger>
            <SelectContent className="bg-background border-input">
              <SelectItem value="1" className="text-foreground hover:bg-accent hover:text-accent-foreground">1st Owner</SelectItem>
              <SelectItem value="2" className="text-foreground hover:bg-accent hover:text-accent-foreground">2nd Owner</SelectItem>
              <SelectItem value="3" className="text-foreground hover:bg-accent hover:text-accent-foreground">3rd Owner</SelectItem>
              <SelectItem value="4+" className="text-foreground hover:bg-accent hover:text-accent-foreground">4+ Owners</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Upload Photos Button */}
      <Button 
        onClick={handleUploadPhotos}
        aria-label="Upload Photos"
        className={`w-full bg-primary text-primary-foreground h-16 text-xl font-bold shadow-lg mt-8 mb-2 hover:bg-primary/90`}
      >
        Upload Photos
      </Button>

      {/* City Modal */}
      <CityModal
        isOpen={showCityModal}
        onClose={() => setShowCityModal(false)}
        isMandatory={false}
      />
    </div>
  );
};

export default ManualEntryForm;
