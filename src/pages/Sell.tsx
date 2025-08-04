import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import VideoGuideModal from "@/components/appointment/VideoGuideModal";
import FloatingVideoButton from "@/components/appointment/FloatingVideoButton";
import CityModal from "@/components/cars/CityModal";
import VehicleTypeToggle from "@/components/sell-page/VehicleTypeToggle";
import RegistrationForm from "@/components/sell-page/RegistrationForm";
import SeparatorOr from "@/components/sell-page/SeparatorOr";
import ManualEntryButton from "@/components/sell-page/ManualEntryButton";
import BrandSelector from "@/components/sell-page/BrandSelector";
import YearSelector from "@/components/sell-page/YearSelector";
import ModelSelector from "@/components/sell-page/ModelSelector";
import VariantSelector from "@/components/sell-page/VariantSelector";
import KilometersInput from "@/components/sell-page/KilometersInput";
import SellerDetails from "@/components/sell-page/SellerDetails";
import PhotoUpload from "@/components/appointment/PhotoUpload";
import CitySelector from "@/components/sell-page/CitySelector";
import SellHero from "@/components/sell-page/SellHero";
import { z } from "zod";
import { useVehicle } from "@/context/VehicleContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useCanonical } from "@/hooks/useCanonical";
import SEOContent from "@/components/seo/SEOContent";
import SEOHead from "@/components/seo/SEOHead";

// New components for the redesigned page
import SellProcess from "@/components/sell-page/SellProcess";
import WhySellWithUs from "@/components/sell-page/WhySellWithUs";
import TestimonialsSection from "@/components/sell-page/TestimonialsSection";
import CityPresence from "@/components/sell-page/CityPresence";
import FAQSection from "@/components/sell-page/FAQSection";

// Email.js dependency
import { loadEmailJsScript, setupPostLoginHandler, sendVehicleDataEmail } from "@/utils/emailjs-loader";

// Step types - updated with new steps
type Step = 
  | "initial" 
  | "brand" 
  | "year" 
  | "model" 
  | "variant" 
  | "kilometers" 
  | "seller-details"
  | "photo-upload"
  | "city";

// Define the kilometers form schema
const kilometersSchema = z.object({
  kilometers: z.string()
    .refine(value => /^\d+$/.test(value), { message: "🛑 Enter only the numbers" })
    .refine(value => parseInt(value) >= 0, { message: "Kilometers cannot be negative" }),
});

// Define seller details schema
const sellerDetailsSchema = z.object({
  seller_name: z.string().min(1, "Seller name is required"),
  seller_price: z.string().min(1, "Expected price is required"),
  phone_number: z.string().min(10, "Valid phone number is required"),
  number_of_owners: z.string().min(1, "Number of owners is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

import ManualEntryForm from "@/components/sell-page/ManualEntryForm";

const Sell = () => {
  useCanonical("/sell");
  
  const [searchParams] = useSearchParams();
  const { vehicleType, setVehicleType } = useVehicle();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("initial");
  
  // Brand selection state
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  
  // Year selection state
  const [selectedYear, setSelectedYear] = useState<string>("");
  
  // Model selection state
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  
  // Other state variables
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [kilometers, setKilometers] = useState<string>("");
  const [sellerDetails, setSellerDetails] = useState<any>({});
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isManualEntryClicked, setIsManualEntryClicked] = useState(false);
  const [isManualCityModalOpen, setIsManualCityModalOpen] = useState(false);
  const [isPhotoUploadSectionVisible, setPhotoUploadSectionVisible] = useState(false);

  // Load EmailJS script
  useEffect(() => {
    loadEmailJsScript();
  }, []);
  
  // Setup handler for post-login auto submission
  useEffect(() => {
    const cleanup = setupPostLoginHandler(() => {
      // Success callback after auto-submitting email
      toast.success("Vehicle details sent successfully!");
    });
    
    return cleanup;
  }, []);

  // Function to clear form data from localStorage
  const clearFormData = () => {
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

  // Check for mode query parameter with conditional data clearing
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'bike' || mode === 'car') {
      const currentVehicleType = localStorage.getItem("vehicle");
      
      // If the mode is different from current vehicle type, clear the data
      if (currentVehicleType !== mode) {
        clearFormData();
      }
      
      setVehicleType(mode);
    }
  }, [searchParams, setVehicleType]);

  // Reset selections when vehicle type changes
  useEffect(() => {
    setSelectedBrand("");
    setSelectedBrandId("");
    setSelectedYear("");
    setSelectedModel("");
    setSelectedModelId("");
    setSelectedVariant("");
    setSellerDetails({});
    setCurrentStep("initial");
    setIsManualEntryClicked(false);
  }, [vehicleType]);

  // Check for saved form data after login
  useEffect(() => {
    if (currentUser) {
      const savedFormData = localStorage.getItem('vehicleFormData');
      if (savedFormData) {
        try {
          const formData = JSON.parse(savedFormData);
          
          // Only restore if user just logged in and was on the city page
          if (formData.currentPage === 'city') {
            setVehicleType(formData.vehicleType);
            setSelectedBrand(formData.brand);
            setSelectedYear(formData.year);
            setSelectedModel(formData.model);
            setSelectedVariant(formData.variant);
            setKilometers(formData.kilometers);
            setCurrentStep('city');
            setIsManualEntryClicked(true);
            
            // Process the email sending with the restored data
            const phoneNumber = currentUser.phoneNumber || 'Not provided';
            
            // Show loading toast
            const loadingToast = toast.loading("Sending vehicle details...");
            
            // Send email with vehicle data
            sendVehicleDataEmail({
              vehicleType: formData.vehicleType,
              brand: formData.brand,
              year: formData.year,
              model: formData.model,
              variant: formData.variant,
              kilometers: formData.kilometers,
              city: formData.city || 'Not selected',
              phoneNumber
            }).then(result => {
              toast.dismiss(loadingToast);
              
              if (result.success) {
                toast.success("Vehicle details sent successfully!");
              } else {
                toast.error("Failed to send vehicle details");
              }
            });
            
            // Clear the saved form data
            localStorage.removeItem('vehicleFormData');
          }
        } catch (error) {
          console.error("Error restoring form data:", error);
          localStorage.removeItem('vehicleFormData');
        }
      }
    }
  }, [currentUser, setVehicleType]);

  // Function to handle user selection and save to localStorage
  const handleUserSelection = (field: string, value: string) => {
    const existingData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
    const updatedData = { ...existingData, [field]: value };
    localStorage.setItem("sellFormData", JSON.stringify(updatedData));
  };

  const handleToggleChange = (value: string) => {
    if (value === "car" || value === "bike") {
      setVehicleType(value);
      // Reset to initial state when toggle is changed
      setCurrentStep("initial");
      setIsManualEntryClicked(false);
    }
  };

  const handleManualEntryClick = () => {
    setIsManualEntryClicked(true);
    setIsManualCityModalOpen(true);
  };

  const handleManualCityModalClose = () => {
    setIsManualCityModalOpen(false);
    setCurrentStep("brand");
  };

  const handleKilometersSubmit = (data: z.infer<typeof kilometersSchema>) => {
    setKilometers(data.kilometers);
    // Save kilometers to localStorage
    handleUserSelection("kilometersDriven", data.kilometers);
    setCurrentStep("seller-details");
  };

  const handleSellerDetailsSubmit = (data: z.infer<typeof sellerDetailsSchema>) => {
    setSellerDetails(data);
    
    // Save seller details to localStorage
    localStorage.setItem("appointment_step5_data", JSON.stringify({
      seller_name: data.seller_name,
      seller_price: data.seller_price,
      phone_number: data.phone_number,
      description: data.description
    }));

    // Save number of owners to appointment_step2_data
    const existingStep2Data = JSON.parse(localStorage.getItem("appointment_step2_data") || "{}");
    localStorage.setItem("appointment_step2_data", JSON.stringify({
      ...existingStep2Data,
      number_of_owners: data.number_of_owners
    }));

    setCurrentStep("photo-upload");
  };

  const handlePhotoUploadNext = () => {
    setCurrentStep("city");
  };

  const handlePhotoUploadBack = () => {
    setCurrentStep("seller-details");
  };

  const goBack = () => {
    switch (currentStep) {
      case "year":
        setCurrentStep("brand");
        break;
      case "model":
        setCurrentStep("year");
        break;
      case "variant":
        setCurrentStep("model");
        break;
      case "kilometers":
        setCurrentStep("variant");
        break;
      case "seller-details":
        setCurrentStep("kilometers");
        break;
      case "photo-upload":
        setCurrentStep("seller-details");
        break;
      case "city":
        setCurrentStep("photo-upload");
        break;
      default:
        setCurrentStep("initial");
        setIsManualEntryClicked(false); // Reset card size when returning to initial
    }
  };

  const openCityModal = () => {
    setIsCityModalOpen(true);
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.vahaanxchange.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Sell Vehicle",
        "item": "https://www.vahaanxchange.com/sell"
      }
    ]
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "initial":
        return (
          <div className="space-y-8">
            <RegistrationForm vehicleType={vehicleType} />
            <SeparatorOr />
            <ManualEntryButton onClick={handleManualEntryClick} />
          </div>
        );
      case "brand":
        return (
          <BrandSelector 
            vehicleType={vehicleType}
            selectedBrand={selectedBrand}
            onSelectBrand={(brand, brandId) => {
              setSelectedBrand(brand);
              setSelectedBrandId(brandId);
              setCurrentStep("year");
            }}
            onBack={() => {
              setCurrentStep("initial");
              setIsManualEntryClicked(false); // Reset card size when going back to initial
            }}
          />
        );
      case "year":
        return (
          <YearSelector
            selectedYear={selectedYear}
            onSelectYear={(year) => {
              setSelectedYear(year);
              setCurrentStep("model");
            }}
            onBack={goBack}
          />
        );
      case "model":
        return (
          <ModelSelector
            vehicleType={vehicleType}
            selectedBrand={selectedBrand}
            selectedBrandId={selectedBrandId}
            selectedYear={selectedYear}
            selectedModel={selectedModel}
            onSelectModel={(model, modelId) => {
              setSelectedModel(model);
              setSelectedModelId(modelId);
              setCurrentStep("variant");
            }}
            onBack={goBack}
          />
        );
      case "variant":
        return (
          <VariantSelector
            vehicleType={vehicleType}
            selectedModel={selectedModel}
            selectedModelId={selectedModelId}
            selectedVariant={selectedVariant}
            onSelectVariant={(variant) => {
              setSelectedVariant(variant);
              setCurrentStep("kilometers");
            }}
            onBack={goBack}
          />
        );
      case "kilometers":
        return (
          <KilometersInput
            onSubmit={handleKilometersSubmit}
            onBack={goBack}
          />
        );
      case "seller-details":
        return (
          <SellerDetails
            onSubmit={handleSellerDetailsSubmit}
            onBack={goBack}
          />
        );
      case "photo-upload":
        return (
          <PhotoUpload
            onNext={handlePhotoUploadNext}
            onBack={handlePhotoUploadBack}
          />
        );
      case "city":
        return (
          <CitySelector
            onOpenCityModal={openCityModal}
            onBack={goBack}
            selectedBrand={selectedBrand}
            selectedYear={selectedYear}
            selectedModel={selectedModel}
            selectedVariant={selectedVariant}
            kilometers={kilometers}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Sell Your Car or Bike Online – VahaanXchange | Zero Commission"
        description="Sell your car or bike online with VahaanXchange. Get instant valuation, connect with verified buyers, and enjoy a zero-commission selling experience. Start selling today!"
        canonicalUrl="https://www.vahaanxchange.com/sell"
      />
      <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Sell Your Car or Bike Online",
          "provider": {
            "@type": "Organization",
            "name": "VahaanXchange",
            "url": "https://www.vahaanxchange.com"
          },
          "areaServed": "IN",
          "serviceType": "Vehicle Selling Platform",
          "url": "https://www.vahaanxchange.com/sell",
          "description": "Sell your car or bike online with VahaanXchange. Get instant valuation, connect with verified buyers, and enjoy a zero-commission selling experience."
        }
      `}</script>
      <div className="min-h-screen bg-[#fefbff] dark:bg-black font-poppins">
        <SellHero 
          vehicleType={vehicleType} 
          isManualEntryClicked={isManualEntryClicked}
          isPhotoUploadSectionVisible={isPhotoUploadSectionVisible}
          onVehicleTypeChange={(type) => {
            setVehicleType(type);
            setIsManualEntryClicked(false);
            setCurrentStep('initial');
          }}
        >
          {/* Always pass ManualEntryForm to SellHero */}
          <ManualEntryForm 
            vehicleType={vehicleType} 
            onVehicleTypeChange={handleToggleChange}
            onPhotoUploadSectionVisible={setPhotoUploadSectionVisible}
          />

          {/* Commented out the original conditional content - keeping for future reference */}Add commentMore actions
          {/*
          {isManualEntryClicked ? (
            <ManualEntryForm 
              vehicleType={vehicleType} 
              onVehicleTypeChange={handleToggleChange}
              onPhotoUploadSectionVisible={setPhotoUploadSectionVisible}
            />
          ) : (
            <>
              <VehicleTypeToggle
                vehicleType={vehicleType}
                onToggleChange={handleToggleChange}
              />
              <div className="min-h-[350px]">
                {renderStepContent()}
              </div>
            </>
          )}
          */}

        </SellHero>
        
        <SellProcess />
        <WhySellWithUs />
        <TestimonialsSection />
        <CityPresence />
        <FAQSection />

        {/* SEO Content Section */}
        <SEOContent 
          title="Sell Your Vehicle Online with Zero Commission"
          content="VahaanXchange revolutionizes vehicle selling by connecting you directly with verified buyers without any commission charges. Our AI-powered valuation system ensures you get the best market price for your car or bike. From instant online quotes to secure document verification, we handle the entire selling process. List your vehicle, upload photos, set your price, and connect with genuine buyers in your city. Experience transparent, hassle-free vehicle selling with complete ownership transfer assistance and secure payment processing."
          keywords={["sell car online", "sell bike online", "zero commission vehicle selling", "instant car valuation", "direct buyer contact"]}
          className="bg-gray-50 dark:bg-gray-900 py-8 rounded-lg"
        />
      </div>
        
        {/* Video Guide Modal */}
        {/* <VideoGuideModal 
          isOpen={isVideoModalOpen}
          onClose={() => {
            setIsVideoModalOpen(false);
            sessionStorage.setItem('videoModalShown', 'true');
          }}
        /> */}
        
        {/* Floating Video Button */}
        {/* <FloatingVideoButton onClick={() => setIsVideoModalOpen(true)} /> */}
        
        <CityModal 
          isOpen={isManualCityModalOpen} 
          onClose={handleManualCityModalClose} 
          isMandatory={true}
        />
        <CityModal 
          isOpen={isCityModalOpen} 
          onClose={() => setIsCityModalOpen(false)} 
        />
      </Layout>
  );
};

export default Sell;
