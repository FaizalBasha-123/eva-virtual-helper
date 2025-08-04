import React, { ReactNode, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ManualEntryForm from "./ManualEntryForm";
import PhotoUpload from "@/components/appointment/PhotoUpload";

interface SellHeroProps {
  vehicleType: "car" | "bike";
  children: ReactNode;
  isManualEntryClicked: boolean;
  onVehicleTypeChange?: (type: "car" | "bike") => void;
  isPhotoUploadSectionVisible?: boolean;
}

const SellHero: React.FC<SellHeroProps> = ({
  vehicleType,
  children,
  isManualEntryClicked,
  onVehicleTypeChange,
  isPhotoUploadSectionVisible,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [photoUploadVisible, setPhotoUploadVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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

  // Mobile detection with responsive breakpoints
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 770);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle photo upload section visibility
  const handlePhotoUploadSectionVisible = (visible: boolean) => {
    setPhotoUploadVisible(visible);
  };

  // Mobile-first responsive card styles
  const getCardStyles = () => {
    const isFormActive = isManualEntryClicked || photoUploadVisible;
    
    if (isMobile) {
      // Mobile-first approach: Full width, dynamic height
      return {
        width: '100%',
        maxWidth: '100%',
        height: isFormActive ? 'calc(100vh - 120px)' : 'auto',
        minHeight: isFormActive ? '500px' : 'auto'
      };
    } else {
      // Desktop: Fixed dimensions
      return {
        width: '100%',
        maxWidth: isFormActive ? '420px' : '378px',
        height: isFormActive ? '540px' : 'auto'
      };
    }
  };

  // Mobile-first responsive content height
  const getContentHeight = () => {
    if (isMobile) {
      return 'max-h-[calc(100vh-200px)]';
    } else {
      return 'max-h-[420px]';
    }
  };

  // Mobile-first responsive padding
  const getCardPadding = () => {
    if (isMobile) {
      return 'p-3';
    } else {
      return 'p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8';
    }
  };

  // Mobile-first responsive gap
  const getContentGap = () => {
    if (isMobile) {
      return 'gap-3';
    } else {
      return 'gap-2 sm:gap-3 md:gap-4 lg:gap-6';
    }
  };
  
  return (
    <section className="relative w-full z-10 min-h-[100dvh] lg:min-h-[950px] xl:min-h-[800px] 2xl:min-h-[850px] flex items-stretch transition-colors duration-500">
      {/* Background Image with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: isDarkMode
            ? `url(https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/Home/vx_darkThemeBackgroundImages_2.webp)`
            : `url(https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/Home/vx_lightThemeBackgroundImages_1.webp)`
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
      
      {/* Main container */}
      <div className="relative z-20 flex flex-col md:flex-row container max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-12 items-center md:items-stretch w-full gap-8 lg:gap-4">
        {/* Left side: Content */}
        <div className="flex-10 lg:flex-1 w-full md:w-1/2 pt-2 md:pt-16 lg:pt-24 lg:flex lg:flex-col lg:justify-center">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 tracking-tight leading-tight">
            Sell Your Car or Bike <br/> By <span className="font-bold text-[#F97316]">Posting Ad</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-200 font-medium mb-1 mt-1 lg:mb-8 lg:mt-6">
            Ready to sell your car or bike? VahaanXchange makes it easy, fast, and commission-free. 
          </p>
          {/* Feature icons with consistent spacing and sizing - HIDDEN ON MOBILE */}
          <div className="hidden lg:flex flex-col sm:flex-row gap-6 sm:gap-8 mb-8">
            {/* Trusted Vehicle Seekers */}
            <div className="flex flex-col items-center min-w-[110px]">
              <span className="flex items-center justify-center rounded-full bg-[#FFF0E7]/20 backdrop-blur-sm border border-[#ffd1b0]/30 w-14 h-14 mb-3">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span className="text-sm font-semibold text-white text-center whitespace-nowrap">
                Trusted Vehicle Seekers
              </span>
            </div>
            {/* 100% Premium Selling */}
            <div className="flex flex-col items-center min-w-[110px]">
              <span className="flex items-center justify-center rounded-full bg-[#FFF0E7]/20 backdrop-blur-sm border border-[#ffd1b0]/30 w-14 h-14 mb-3">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span className="text-sm font-semibold text-white text-center whitespace-nowrap">
                100% Premium Selling
              </span>
            </div>
            {/* Hassle-Free Process */}
            <div className="flex flex-col items-center min-w-[110px]">
              <span className="flex items-center justify-center rounded-full bg-[#FFF0E7]/20 backdrop-blur-sm border border-[#ffd1b0]/30 w-14 h-14 mb-3">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <span className="text-sm font-semibold text-white text-center whitespace-nowrap">
                Hassle-Free Process
              </span>
            </div>
          </div>
          {/* Steps card with consistent spacing */}
          <div className="hidden lg:flex bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl flex-col md:flex-row items-stretch justify-center md:gap-0 px-2 md:px-4 py-2 w-full max-w-4xl mb-10 mx-auto md:mx-0 overflow-x-auto dark:bg-[#1F2633]/40">
            {/* Step Pills with uniform dimensions and spacing */}
            <div className="flex items-center justify-center space-x-3 px-4 py-3 min-w-[130px] max-w-[220px] relative group">
              <span className="w-6 h-6 text-orange-500">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="6" rx="3" />
                  <path d="M5 17v2a2 2 0 1 0 4 0v-2" />
                  <path d="M15 17v2a2 2 0 1 0 4 0v-2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <span className="font-medium text-white">Post Your Ad</span>
              <span className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2">
                <svg width="28" height="20" fill="none" viewBox="0 0 28 20">
                  <path d="M4 10H24M18 4l6 6-6 6" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
            </div>
            
            {/* Keep the other two step pills with consistent styling */}
            <div className="flex items-center justify-center space-x-3 px-4 py-3 min-w-[130px] max-w-[220px] relative group">
              <span className="w-6 h-6 text-orange-500">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M7 21v-2a4 4 0 0 1 3-3.87" />
                  <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
                  <path d="M19 8a2 2 0 1 1-2 2" />
                </svg>
              </span>
              <span className="font-medium text-white">Get Buyer Interest</span>
              <span className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2">
                <svg width="28" height="20" fill="none" viewBox="0 0 28 20">
                  <path d="M4 10H24M18 4l6 6-6 6" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-3 px-4 py-3 min-w-[130px] max-w-[220px] relative group">
              <span className="w-6 h-6 text-orange-500">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </span>
              <span className="font-medium text-white">Finalize the Deal</span>
            </div>
          </div>
        </div>
        {/* Right side: Mobile-first responsive form card */}
        <div className="flex-10 lg:flex-1 w-full md:w-[480px] lg:w-[520px] flex items-center justify-center md:justify-end md:mb-12 md:mb-0">
          <Card 
            className="shadow-lg rounded-2xl border border-white/40 bg-white/25 backdrop-blur-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl overflow-hidden dark:border-white/20 dark:bg-white/10"
            style={getCardStyles()}
          >
            <CardContent className={getCardPadding()}>
              {/* Mobile-first scrollable content area */}
              <div className={`${getContentHeight()} overflow-y-auto overflow-x-hidden rounded-xl transition-all duration-300 scrollbar-hide ${getContentGap()} flex flex-col`}>
                {photoUploadVisible ? (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto">
                      <PhotoUpload 
                        onBack={() => {
                          setPhotoUploadVisible(false);
                        }}
                        onNext={() => {
                          setPhotoUploadVisible(false);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <ManualEntryForm 
                    vehicleType={vehicleType} 
                    onVehicleTypeChange={onVehicleTypeChange}
                    onPhotoUploadSectionVisible={handlePhotoUploadSectionVisible}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SellHero;
