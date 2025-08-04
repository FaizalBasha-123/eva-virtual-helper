

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Phone } from "lucide-react";
import LocationInput from "../cars/LocationInput";
import CityModal from "../cars/CityModal";
import { useCityStore } from "@/store/useCityStore";
import { Button } from "../ui/button";
import VehicleTypeToggle from "../sell-page/VehicleTypeToggle";
import ManualEntryFormHome from "./ManualEntryFormHome";
import PhotoUploadHome from "./PhotoUploadHome";
import { Card, CardContent } from "@/components/ui/card";
import { useVehicle } from "@/context/VehicleContext";

const lightThemeBackgroundImages = [
  
"https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/Home/vx_lightThemeBackgroundImages_1.webp",

"https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/Home/vx_lightThemeBackgroundImages_2.webp"

];

const darkThemeBackgroundImages = [
  
"https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/Home/vx_darkThemeBackgroundImages_1.webp",

"https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/Home/vx_darkThemeBackgroundImages_2.webp"
];

const Hero = () => {
  const { vehicleType, setVehicleType } = useVehicle();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImagePreloaded, setNextImagePreloaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [showUploadPhotos, setShowUploadPhotos] = useState(false);
  const { selectedCity } = useCityStore();
  const navigate = useNavigate();
  
  // Check if dark mode is enabled
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    // Initial check
    checkDarkMode();
    
    // Set up a mutation observer to watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === 'class' &&
          mutation.target === document.documentElement
        ) {
          checkDarkMode();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    // Get the current background images array based on theme
    const backgroundImages = isDarkMode ? darkThemeBackgroundImages : lightThemeBackgroundImages;
    
    // Preload the next image
    const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
    const img = new Image();
    img.src = backgroundImages[nextIndex];
    img.onload = () => setNextImagePreloaded(true);
    
    // Change background image every 8 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
      setNextImagePreloaded(false);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [currentImageIndex, isDarkMode]);
  
  // Get the current background images array based on theme
  const backgroundImages = isDarkMode ? darkThemeBackgroundImages : lightThemeBackgroundImages;

  // Function to open city modal
  const openCityModal = () => {
    setIsCityModalOpen(true);
  };

  // Function to close city modal
  const closeCityModal = () => {
    setIsCityModalOpen(false);
  };
  
  // Function to handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchError("Please enter a search term.");
      return;
    }
    
    setSearchError("");
    
    // Build query parameters and navigate to search page
    const queryParams = new URLSearchParams();
    queryParams.append("query", searchQuery);
    
    if (selectedCity) {
      queryParams.append("location", selectedCity);
    }
    
    navigate(`/search?${queryParams.toString()}`);
  };
  
  return (
    <div className="relative min-h-[100dvh] lg:min-h-[950px] xl:min-h-[800px] 2xl:min-h-[850px] w-full overflow-hidden">
      {/* Background Images with Fade Transition */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: index === currentImageIndex ? 1 : 0
          }}
        /> 
      ))}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
      
      {/* Hero Content */}
      <div className="relative z-20 h-full w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-12 sm:pt-24 md:pt-22 lg:pt-22 xl:pt-22 2xl:pt-12 pb-10 sm:pb-12 lg:pb-16 flex flex-col items-center justify-center box-border">
        <div className="w-full max-w-full flex flex-col gap-8 items-center">
          {/* New Sell Form Section */}
          <div className="w-full max-w-7xl">
            <div className="text-center mt-2">
              <h1 className="inline-block text-4xl mb-6 mt-2 font-medium text-white bg-orange-600 px-6 py-2 rounded-full">Buy or Sell Your Vehicle – Directly, With No Commission</h1>
            </div>
            {/* Vehicle Type Toggle */}
            <div className="flex justify-center">
              <VehicleTypeToggle
                vehicleType={vehicleType}
                onToggleChange={(value) => {
                  if (value === "car" || value === "bike") {
                    setVehicleType(value);
                  }
                }}
              />
            </div>

            {/* Form Card */}
            <Card className="shadow-lg rounded-2xl border border-white/40 bg-white/25 backdrop-blur-lg dark:border-white/20 dark:bg-white/10">
              <CardContent className="p-6 md:p-8">
                {!showUploadPhotos ? (
                  <ManualEntryFormHome 
                    vehicleType={vehicleType}
                    onVehicleTypeChange={setVehicleType}
                    onUploadPhotos={() => setShowUploadPhotos(true)}
                  />
                ) : (
                  <PhotoUploadHome 
                    onBack={() => setShowUploadPhotos(false)}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2 sm:gap-3 animate-slide-up" style={{ animationDelay: '900ms' }}>
            <div className="w-full max-w-2xl bg-black/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 flex flex-wrap items-center gap-2 sm:gap-3">
              <p className="font-medium text-[clamp(0.875rem,2vw,1rem)] lg:text-[clamp(0.875rem,1.5vw,0.9375rem)] xl:text-[clamp(0.875rem,1.5vw,0.9375rem)] text-white">Contact : </p>
              <p className="font-medium text-[clamp(0.875rem,2vw,1rem)] lg:text-[clamp(0.875rem,1.5vw,0.9375rem)] xl:text-[clamp(0.875rem,1.5vw,0.9375rem)] text-white">+91 810-810-4175</p>
              <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                <a 
                  href="tel:+918108104175" 
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition-colors"
                  aria-label="Call us"
                >
                  <Phone size={20} />
                </a>
                <a 
                  href="https://wa.me/918108104175" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition-colors"
                  aria-label="WhatsApp"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    fill="currentColor" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      </div>
      
      {/* City Modal */}
      <CityModal
        isOpen={isCityModalOpen}
        onClose={closeCityModal}
        isMandatory={false}
      />
    </div>
  );
};

export default Hero;
