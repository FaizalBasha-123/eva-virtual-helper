
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Camera, 
  AlertTriangle, 
  FileText, 
  ImageIcon, 
  CheckCircle 
} from "lucide-react";
import CityModal from "@/components/cars/CityModal";
import { useCityStore } from "@/store/useCityStore";
import LocationInput from "@/components/shared/LocationInput";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Define key vehicle features
const KEY_FEATURES = [
  "Air Conditioning",
  "Power Steering",
  "Power Windows",
  "Anti-Lock Brakes",
  "Airbags",
  "Leather Seats",
  "Sunroof",
  "Navigation System",
  "Reverse Camera",
  "Bluetooth",
  "Keyless Entry",
  "Cruise Control"
];

// Define the step types for the upload process
type Step = "carDetails" | "pricingLocation" | "photos" | "review";

const AdminUploads = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCity, setSelectedCity } = useCityStore();
  
  // State for tracking the current step in the upload process
  const [currentStep, setCurrentStep] = useState<Step>("carDetails");
  const [vehicleType, setVehicleType] = useState<"car" | "bike">("car");
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  
  // Form setup with react-hook-form
  const form = useForm({
    defaultValues: {
      make: "",
      model: "",
      year: "",
      fuelType: "",
      transmission: "",
      kilometers: "",
      owners: "",
      insuranceValidUntil: "",
      adTitle: "",
      price: "",
      city: selectedCity || "",
      description: "",
      features: [] as string[],
    }
  });
  
  // Determine vehicle type based on the referrer path
  useEffect(() => {
    // Check state from location to determine vehicle type
    const state = location.state as { from?: string };
    if (state?.from === "/bikes") {
      setVehicleType("bike");
    } else {
      setVehicleType("car");
    }
  }, [location]);
  
  // Update city in form when selected city changes
  useEffect(() => {
    if (selectedCity) {
      form.setValue("city", selectedCity);
    }
  }, [selectedCity, form]);
  
  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      toast.error("You don't have permission to access this page");
    }
  }, [isAdmin, navigate]);
  
  // Progress indicator labels
  const stepsLabels = [
    { key: "carDetails", label: vehicleType === "car" ? "Car Details" : "Bike Details" },
    { key: "pricingLocation", label: "Pricing & Location" },
    { key: "photos", label: "Photos" },
    { key: "review", label: "Review & Submit" }
  ];
  
  // Handle city modal
  const openCityModal = () => {
    setIsCityModalOpen(true);
  };
  
  const closeCityModal = () => {
    setIsCityModalOpen(false);
  };
  
  // Navigation functions for steps
  const goToNextStep = () => {
    switch (currentStep) {
      case "carDetails":
        setCurrentStep("pricingLocation");
        break;
      case "pricingLocation":
        setCurrentStep("photos");
        break;
      case "photos":
        setCurrentStep("review");
        break;
      case "review":
        handleSubmit();
        break;
    }
  };
  
  const goToPreviousStep = () => {
    switch (currentStep) {
      case "pricingLocation":
        setCurrentStep("carDetails");
        break;
      case "photos":
        setCurrentStep("pricingLocation");
        break;
      case "review":
        setCurrentStep("photos");
        break;
    }
  };
  
  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Limit to 10 files max
    const totalFiles = [...uploadedPhotos, ...Array.from(files)];
    const limitedFiles = totalFiles.slice(0, 10);
    
    setUploadedPhotos(limitedFiles);
    
    // Create preview URLs
    const newPreviewUrls = limitedFiles.map(file => URL.createObjectURL(file));
    
    // Cleanup old previews to prevent memory leaks
    photoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setPhotoPreviewUrls(newPreviewUrls);
  };
  
  // Handle final submission
  const handleSubmit = () => {
    const formData = form.getValues();
    
    // Here you would typically submit the data to your backend
    console.log({
      ...formData,
      vehicleType,
      city: selectedCity,
      photos: uploadedPhotos
    });
    
    toast.success(`${vehicleType === 'car' ? 'Car' : 'Bike'} upload completed!`);
    navigate(vehicleType === 'car' ? '/search' : '/bikes');
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    const steps = stepsLabels.map(step => step.key);
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const currentFeatures = form.getValues("features");
    if (checked) {
      form.setValue("features", [...currentFeatures, feature]);
    } else {
      form.setValue(
        "features",
        currentFeatures.filter((f) => f !== feature)
      );
    }
  };
  
  // Enhanced validation functions for each step
  const validateCarDetails = () => {
    const values = form.getValues();
    
    // Required fields for car details step
    const requiredFields = {
      make: values.make?.trim(),
      model: values.model?.trim(),
      year: values.year?.trim(),
    };
    
    // Log validation details for debugging
    console.log('Car details validation:', { 
      requiredFields, 
      isValid: Object.values(requiredFields).every(value => value && value.length > 0) 
    });
    
    return Object.values(requiredFields).every(value => value && value.length > 0);
  };
  
  const validatePricingLocation = () => {
    const values = form.getValues();
    
    // Required fields for pricing & location step
    const requiredFields = {
      price: values.price?.trim(),
      city: selectedCity || values.city?.trim(),
    };
    
    // Log validation details for debugging
    console.log('Pricing validation:', { 
      requiredFields, 
      isValid: Object.values(requiredFields).every(value => value && value.length > 0),
      selectedCity
    });
    
    return Object.values(requiredFields).every(value => value && value.length > 0);
  };
  
  const validatePhotos = () => {
    // Photos are optional but we require at least one for better listings
    const hasPhotos = uploadedPhotos.length > 0;
    
    console.log('Photos validation:', {
      photoCount: uploadedPhotos.length,
      isValid: hasPhotos
    });
    
    return true; // Making photos optional, change to 'return hasPhotos' if photos required
  };
  
  // Get current step validation function
  const getCurrentStepValidation = () => {
    switch (currentStep) {
      case "carDetails":
        return validateCarDetails();
      case "pricingLocation":
        return validatePricingLocation();
      case "photos":
        return validatePhotos();
      case "review":
        return true; // Review step is always valid as it's just displaying data
      default:
        return false;
    }
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case "carDetails":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-3 dark:bg-blue-900">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {vehicleType === "car" ? "Car Details" : "Bike Details"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tell us about your {vehicleType}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  placeholder="e.g. BMW"
                  {...form.register("make")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g. 7 Series"
                  {...form.register("model")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="e.g. 2024"
                  min="1990"
                  max={new Date().getFullYear()}
                  {...form.register("year")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Input
                  id="fuelType"
                  placeholder="e.g. Diesel"
                  {...form.register("fuelType")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Input
                  id="transmission"
                  placeholder="e.g. Automatic"
                  {...form.register("transmission")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kilometers">Kilometers Driven</Label>
                <Input
                  id="kilometers"
                  type="number"
                  placeholder="e.g. 25000"
                  min="0"
                  {...form.register("kilometers")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="owners">Number of Owners</Label>
                <Input
                  id="owners"
                  placeholder="e.g. 1st Owner"
                  {...form.register("owners")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insuranceValidUntil">Insurance Valid Until</Label>
                <Input
                  id="insuranceValidUntil"
                  type="date"
                  {...form.register("insuranceValidUntil")}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adTitle">Ad Title</Label>
              <Input
                id="adTitle"
                placeholder="e.g., 2022 BMW 3 Series 330i Sport in Excellent Condition"
                {...form.register("adTitle")}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to auto-generate a title based on car details
              </p>
            </div>
          </div>
        );
      case "pricingLocation":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-3 dark:bg-blue-900">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Pricing & Details</h2>
                <p className="text-sm text-muted-foreground">
                  Set your price and provide additional information
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 1200000"
                  min="0"
                  {...form.register("price")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <div onClick={openCityModal} className="cursor-pointer">
                  <LocationInput onClick={openCityModal} className="w-full" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your vehicle in detail. Include any special features, modifications, or issues."
                  className="min-h-[150px]"
                  {...form.register("description")}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Key Features</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {KEY_FEATURES.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`feature-${feature}`} 
                        onCheckedChange={(checked) => 
                          handleFeatureChange(feature, checked === true)
                        }
                      />
                      <label
                        htmlFor={`feature-${feature}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
      case "photos":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-3 dark:bg-blue-900">
                <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Upload Photos</h2>
                <p className="text-sm text-muted-foreground">
                  Add photos of your {vehicleType} (up to 10 images)
                </p>
              </div>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="mx-auto flex flex-col items-center justify-center">
                <Camera className="h-10 w-10 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Drag & drop images here or click to browse</p>
                <p className="text-xs text-gray-500 mb-4">Maximum 10 photos, each under 5MB (JPG, PNG formats)</p>
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" /> Browse Images
                </Button>
              </div>
            </div>
            
            {photoPreviewUrls.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Uploaded Photos ({photoPreviewUrls.length}/10)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photoPreviewUrls.map((url, index) => (
                    <div 
                      key={index} 
                      className="relative aspect-square bg-gray-100 rounded-md overflow-hidden"
                    >
                      <img 
                        src={url} 
                        alt={`Preview ${index+1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => {
                          URL.revokeObjectURL(url);
                          setPhotoPreviewUrls(prev => prev.filter((_, i) => i !== index));
                          setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">Photo Tips</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Sun className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Take photos in good lighting during daylight hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Camera className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Include exterior photos: front, back, sides, and any damage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Camera className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Include interior photos: dashboard, seats, trunk space</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Include photos of special features or modifications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );
      case "review":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-3 dark:bg-blue-900">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Review Your Listing</h2>
                <p className="text-sm text-muted-foreground">
                  Check all the details before submitting
                </p>
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{vehicleType === "car" ? "Car Details" : "Bike Details"}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">Make</p>
                  <p>{form.getValues("make") || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Model</p>
                  <p>{form.getValues("model") || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Year</p>
                  <p>{form.getValues("year") || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Fuel Type</p>
                  <p>{form.getValues("fuelType") || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Transmission</p>
                  <p>{form.getValues("transmission") || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Kilometers Driven</p>
                  <p>{form.getValues("kilometers") || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Number of Owners</p>
                  <p>{form.getValues("owners") || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Insurance Valid Until</p>
                  <p>{form.getValues("insuranceValidUntil") || "-"}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pricing & Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium">Price</p>
                    <p>{form.getValues("price") ? `₹${form.getValues("price")}` : "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">City</p>
                    <p>{selectedCity || "-"}</p>
                  </div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p className="font-medium">Description</p>
                  <p className="whitespace-pre-line">{form.getValues("description") || "-"}</p>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p className="font-medium">Features</p>
                  {form.getValues("features").length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {form.getValues("features").map((feature) => (
                        <div key={feature} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                          {feature}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No features selected</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {uploadedPhotos.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photoPreviewUrls.map((url, index) => (
                      <div 
                        key={index} 
                        className="aspect-square bg-gray-100 rounded-md overflow-hidden"
                      >
                        <img 
                          src={url} 
                          alt={`Preview ${index+1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Debug logging effect to monitor form state changes
  useEffect(() => {
    console.log('Current step:', currentStep);
    console.log('Form values:', form.getValues());
    console.log('Step validation:', getCurrentStepValidation());
  }, [currentStep, form.watch()]);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          {vehicleType === 'car' ? 'Sell Your Car' : 'Sell Your Bike'}
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          List your {vehicleType} on VahaanXchange and reach thousands of potential buyers
        </p>
        
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full mb-2">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-4 px-2">
            {stepsLabels.map((step, index) => (
              <div
                key={step.key}
                className={`text-xs font-medium text-center ${
                  currentStep === step.key ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </div>
            ))}
          </div>
        </div>
        
        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-[400px]">
          {renderStep()}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          {currentStep !== "carDetails" ? (
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Cancel
            </Button>
          )}
          
          <Button
            onClick={goToNextStep}
            className="flex items-center gap-2"
            disabled={!getCurrentStepValidation()}
          >
            {currentStep === "review" ? "Submit" : "Continue"} <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Validation feedback message */}
        {!getCurrentStepValidation() && (
          <p className="text-destructive text-sm mt-2 text-center">
            {currentStep === "carDetails" && "Please fill in all the required details (Make, Model, and Year)"}
            {currentStep === "pricingLocation" && "Please enter a price and select a city"}
            {currentStep === "photos" && "Please upload at least one photo of your vehicle"}
          </p>
        )}
      </div>
      
      {/* City selection modal */}
      <CityModal
        isOpen={isCityModalOpen}
        onClose={closeCityModal}
      />
    </Layout>
  );
};

export default AdminUploads;
