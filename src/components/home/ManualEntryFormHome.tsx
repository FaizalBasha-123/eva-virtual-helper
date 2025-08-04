import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchAllBrands, fetchAllBikeBrands, fetchModelsByBrandAndYear, fetchBikeModelsByBrandAndYear, fetchVariantsByModel, fetchBikeVariantsByModel, findBrandIdByName, findBikeBrandIdByName } from "@/services/vehicleService";
import { supabase } from "@/lib/supabaseClient";
import { Brand, Model, Variant } from "@/types/vehicleTypes";
import CityModal from "@/components/cars/CityModal";
import DealerSignInModal from "@/components/auth/DealerSignInModal";
import PhoneAuthModal from "@/components/auth/PhoneAuthModal";
import { ChevronDown } from "lucide-react";

interface ManualEntryFormHomeProps {
  vehicleType: "car" | "bike";
  onVehicleTypeChange?: (type: "car" | "bike") => void;
  onUploadPhotos?: () => void;
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
      <Label>{label}{required && ' *'}</Label>
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
        className="h-12 dark:bg-gray-700"
        autoComplete="off"
      />
      {showSuggestions && filteredOptions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-background border rounded-md shadow-lg max-h-56 overflow-auto">
          {filteredOptions.map((opt, idx) => (
            <div
              key={opt}
              className={`px-4 py-2 cursor-pointer hover:bg-accent ${highlightIndex === idx ? 'bg-accent font-semibold' : ''}`}
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

const ManualEntryFormHome: React.FC<ManualEntryFormHomeProps> = ({ vehicleType, onVehicleTypeChange, onUploadPhotos }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showPhoneAuthModal, setShowPhoneAuthModal] = useState(false);
  
  // Form states
  const [brand, setBrand] = useState("");
  const [brandId, setBrandId] = useState("");
  const [year, setYear] = useState("");
  const [model, setModel] = useState("");
  const [modelId, setModelId] = useState("");
  const [variant, setVariant] = useState("");
  const [city, setCity] = useState("");
  const [kilometers, setKilometers] = useState("");
  const [kilometerOption, setKilometerOption] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [numberOfOwners, setNumberOfOwners] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmissionType, setTransmissionType] = useState("");
  const [showCarFields, setShowCarFields] = useState(false);
  const [dealerName, setDealerName] = useState("");
  const [dealerOptions, setDealerOptions] = useState<string[]>([]);
  const [showDealerSignIn, setShowDealerSignIn] = useState(false);
  // Fetch dealer names from 'dealer_details' table
  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const { data, error } = await supabase
          .from('dealer_details')
          .select('name');
        if (error) throw error;
        setDealerOptions(data?.map((d: { name: string }) => d.name) || []);
      } catch (error) {
        console.error('Error fetching dealer names:', error);
        setDealerOptions([]);
      }
    };
    fetchDealers();
  }, []);
  
  // Data states
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [showCityModal, setShowCityModal] = useState(false);
  const [isSwitchingVehicleType, setIsSwitchingVehicleType] = useState(false);
  
  // Track previous vehicle type to detect changes
  const [previousVehicleType, setPreviousVehicleType] = useState(vehicleType);
  
  // Show Fuel/Transmission only if vehicle is car
  useEffect(() => {
    setShowCarFields(vehicleType === "car");
  }, [vehicleType]);

  // Handle vehicle type changes and clear form data
  useEffect(() => {
    // Check if vehicle type has changed
    if (previousVehicleType !== vehicleType) {
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
      
      // Update previous vehicle type
      setPreviousVehicleType(vehicleType);
      
      // Reset flag after a short delay
      setTimeout(() => {
        setIsSwitchingVehicleType(false);
      }, 100);
    }
  }, [vehicleType, previousVehicleType]);





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
        const fetchedBrands = vehicleType === "car" ? await fetchAllBrands() : await fetchAllBikeBrands();
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("Error loading brands:", error);
        toast.error("Failed to load brands");
      }
    };
    loadBrands();
  }, [vehicleType]);

  // Load models when brand and year change
  useEffect(() => {
    const loadModels = async () => {
      if (brandId && year) {
        try {
          const fetchedModels = vehicleType === "car" 
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
  }, [brandId, year, vehicleType, model]);

  // Load variants when model changes
  useEffect(() => {
    const loadVariants = async () => {
      if (modelId) {
        try {
          const fetchedVariants = vehicleType === "car" 
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
  }, [modelId, vehicleType]);

  // Load city from localStorage
  useEffect(() => {
    setCity(localStorage.getItem('selectedCity') || '');

    const updateCity = () => setCity(localStorage.getItem('selectedCity') || '');
    window.addEventListener('citySelected', updateCity);
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
        // Don't restore if we're switching vehicle types
        if (isSwitchingVehicleType) {
          console.log("Switching vehicle type, skipping form data restoration");
          return;
        }

        // Restore sellFormData
        const sellFormData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
        if (sellFormData.brand) {
          setBrand(sellFormData.brand);
          // Find brand ID for the restored brand
          try {
            const id = vehicleType === "car" 
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
  }, [vehicleType, isSwitchingVehicleType]); // Re-run when vehicle type changes or switching flag changes



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

  // Auto-save form data when any field changes
  useEffect(() => {
    // Don't save if we're switching vehicle types
    if (isSwitchingVehicleType) return;
    
    // Only save if we have some data to save (to avoid overwriting with empty data on initial load)
    if (brand || year || model || variant || sellerName || expectedPrice || contactNumber || sellerType || numberOfOwners || fuelType || transmissionType) {
      saveAllFormData();
    }
  }, [brand, year, model, variant, sellerName, expectedPrice, contactNumber, sellerType, numberOfOwners, fuelType, transmissionType, kilometers, isSwitchingVehicleType]);



  // Handlers
  const handleBrandChange = async (value: string) => {
    setBrand(value);
    updateSellFormData("brand", value);
    
    try {
      const id = vehicleType === "car" 
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
    const value = e.target.value.replace(/[^0-9]/g, '');
    setKilometers(value);
    updateSellFormData("kilometers", value);
    localStorage.setItem("kilometers", value);
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
    
    if (onUploadPhotos) {
      onUploadPhotos();
    }
  };

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

  return (
    <div className="space-y-6">    
      {/* Three-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {/* Column 1: Vehicle Basic Info */}
        <div className="space-y-4">
          <TypableSelectInput
            label="Brand"
            placeholder="Select or type brand"
            value={brand}
            options={brands.map(b => b.name)}
            onChange={handleBrandChange}
            required
          />

          <TypableSelectInput
            label="Year"
            placeholder="Select or type year"
            value={year}
            options={generateYears()}
            onChange={handleYearChange}
            required
          />

          <TypableSelectInput
            label="Model"
            placeholder="Select or type model"
            value={model}
            options={models.map(m => m.model_name)}
            onChange={handleModelChange}
            disabled={!brand || !year}
            required
          />

          <TypableSelectInput
            label="Variant"
            placeholder="Select or type variant"
            value={variant}
            options={variants.map(v => v.variant_name)}
            onChange={handleVariantChange}
            disabled={!model}
            required
          />
        </div>

        {/* Column 2: Location & Usage */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>City *</Label>
            <Button
              variant="outline"
              onClick={() => setShowCityModal(true)}
              aria-label="Select City"
              className="w-full h-12 justify-start min-w-[48px] min-h-[48px]"
            >
              {city || "Select City"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Kilometers Driven *</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder={kilometerOption === 'manual' ? 'Enter kilometers' : kilometerOption === 'na' ? 'NA' : 'Select Option'}
                  value={kilometerOption === "manual" ? kilometers : kilometerOption === "na" ? "NA" : ""}
                  onChange={handleKilometersChange}
                  disabled={kilometerOption !== "manual"}
                  className="h-12 dark:bg-gray-700 pr-2 min-w-[48px] min-h-[48px]"
                />
              </div>
              <div className="relative">
                <Select value={kilometerOption} onValueChange={handleKilometerOptionChange}>
                  <SelectTrigger className="h-12 w-12 dark:bg-gray-700 p-0 border-l-0 flex items-center justify-center min-w-[48px] min-h-[48px]" aria-label="Kilometers option" />
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

          <div className="space-y-2">
            <Label>Number of Owners *</Label>
            <Select value={numberOfOwners} onValueChange={handleNumberOfOwnersChange}>
              <SelectTrigger className="h-12 dark:bg-gray-700 min-w-[48px] min-h-[48px]" aria-label="Select number of owners">
                <SelectValue placeholder="Select owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Owner</SelectItem>
                <SelectItem value="2">2nd Owner</SelectItem>
                <SelectItem value="3">3rd Owner</SelectItem>
                <SelectItem value="4+">4+ Owners</SelectItem>
              </SelectContent>
            </Select>
          </div>

              <div className="space-y-2">
                <Label>Fuel Type *</Label>
                <Select 
                  value={fuelType} 
                  onValueChange={value => {
                    setFuelType(value);
                    localStorage.setItem("fuel_type", value);
                  }}
                >
                  <SelectTrigger className="h-12 dark:bg-gray-700 min-w-[48px] min-h-[48px]" aria-label="Select fuel type" onFocus={() => { localStorage.setItem("fuel_type", fuelType); }}>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="CNG">CNG</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

          {showCarFields && (
              <div className="space-y-2">
                <Label>Transmission Type *</Label>
                <Select value={transmissionType} onValueChange={setTransmissionType}>
                  <SelectTrigger className="h-12 dark:bg-gray-700 min-w-[48px] min-h-[48px]" aria-label="Select transmission type">
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="AMT">AMT</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          )}
        </div>

        {/* Column 3: Seller Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Seller Name *</Label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={sellerName}
              onChange={handleSellerNameChange}
              className="h-12 dark:bg-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label>Expected Price (₹) *</Label>
            <Input
              type="text"
              placeholder="Enter expected price"
              value={expectedPrice}
              onChange={e => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setExpectedPrice(value);
                updateAppointmentStep5Data("seller_price", value);
                localStorage.setItem("seller_price", value);
              }}
              onFocus={e => {
                localStorage.setItem("seller_price", e.target.value);
              }}
              className="h-12 dark:bg-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label>Contact Number *</Label>
            <Input
              type="tel"
              placeholder="Enter contact number"
              value={contactNumber}
              onChange={handleContactNumberChange}
              className="h-12 dark:bg-gray-700"
            />
          </div>

          <div className="space-y-2 mt-2">
            <Label>Seller Type *</Label>
            <Select
              value={sellerType}
              onValueChange={value => {
                setSellerType(value);
                localStorage.setItem("seller_type", value);
              }}
            >
              <SelectTrigger
                className="h-12 dark:bg-gray-700 min-w-[48px] min-h-[48px]"
                aria-label="Select seller type"
                onFocus={() => {
                  localStorage.setItem("seller_type", sellerType);
                }}
              >
                <SelectValue placeholder="Select seller type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Owner">Owner</SelectItem>
                <SelectItem value="Dealer">Dealer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dealer Selection - Show when seller type is Dealer */}
          {sellerType === "Dealer" && (
            <>
              <div className="space-y-2">
                <Label>Dealer Name *</Label>
                <Select value={dealerName} onValueChange={setDealerName}>
                  <SelectTrigger className="h-12 dark:bg-gray-700 min-w-[48px] min-h-[48px]">
                    <SelectValue placeholder="Select dealer" />
                  </SelectTrigger>
                  <SelectContent>
                    {dealerOptions.length === 0
                      ? <SelectItem value="no-dealers" disabled>No dealers found</SelectItem>
                      : dealerOptions.filter(name => name !== "").map((name) => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => {
                  if (!currentUser) {
                    setShowPhoneAuthModal(true);
                  } else {
                    setShowDealerSignIn(true);
                  }
                }}
                variant="outline"
                className="w-full h-12"
              >
                Apply as Dealer
              </Button>
            </>
          )}

          <Button 
            onClick={handleUploadPhotos}
            aria-label="Upload Photos"
            className="w-full bg-primary text-white hover:bg-primary/90 h-12 mt-4 min-w-[48px] min-h-[48px]"
          >
            Upload Photos
          </Button>
        </div>
      </div>

      <CityModal 
        isOpen={showCityModal} 
        onClose={() => setShowCityModal(false)} 
        isMandatory={true}
      />
      
      <DealerSignInModal 
        isOpen={showDealerSignIn}
        onClose={() => setShowDealerSignIn(false)}
      />
      {/* Show PhoneAuthModal if user is not logged in and clicks Apply as Dealer */}
      <PhoneAuthModal 
        isOpen={showPhoneAuthModal}
        onClose={() => setShowPhoneAuthModal(false)}
      />
    </div>
  );
};

export default ManualEntryFormHome;
