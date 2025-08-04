import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import SpecialSellSection from "./SpecialSellSection";
import AppDownloadSection from "./AppDownloadSection";
import ReviewsSection from "./ReviewsSection";
import CarCard from "@/components/cars/CarCard";
import BikeCard from "@/components/bikes/BikeCard";
import AddVehicleCard from "@/components/shared/AddVehicleCard";
import FloatingWhatsappButton from "@/components/appointment/FloatingWhatsappButton";
import { useInfiniteVehicles } from "@/hooks/useInfiniteVehicles";
import { useVehicle } from "@/context/VehicleContext";
import { 
  ArrowRight, 
  Car, 
  DollarSign, 
  Handshake, 
  Shield, 
  Lock, 
  Tag, 
  Menu,
  User
} from "lucide-react";
import SEOContent from "@/components/seo/SEOContent";

const MobileHomeUI = () => {
  // Parallax effect for hero section
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Scroll effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update dealerId in localStorage if phoneNumber is present (for mobile)
  useEffect(() => {
    const updateDealerInfo = async () => {
      const phoneNumber = localStorage.getItem('phoneNumber');
      if (phoneNumber) {
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data: dealerDetails, error: dealerError } = await supabase
            .from('dealer_details')
            .select('id, name')
            .eq('phone_number', parseInt(phoneNumber))
            .single();
          if (!dealerError && dealerDetails && dealerDetails.id) {
            localStorage.setItem('dealerId', dealerDetails.id.toString());
            if (dealerDetails.name) {
              localStorage.setItem('dealerName', dealerDetails.name);
            }
          }
        } catch (err) {
          console.error('Error fetching dealer info:', err);
        }
      }
    };
    updateDealerInfo();
  }, []);
  const { setVehicleType } = useVehicle();
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 2;

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

  // Function to handle sell car click with conditional data clearing
  const handleSellCarClick = () => {
    const currentVehicleType = localStorage.getItem("vehicle");
    
    // If current vehicle type is not car, clear the data
    if (currentVehicleType !== "car") {
      clearFormData();
    }
    
    setVehicleType("car");
  };

  // Function to handle sell bike click with conditional data clearing
  const handleSellBikeClick = () => {
    const currentVehicleType = localStorage.getItem("vehicle");
    
    // If current vehicle type is not bike, clear the data
    if (currentVehicleType !== "bike") {
      clearFormData();
    }
    
    setVehicleType("bike");
  };
  
  // Fetch data from Supabase
  const { vehicles: featuredCars, loading: loadingCars } = useInfiniteVehicles({ vehicleType: 'car', pageSize: 12, filter: 'latest' });
  const { vehicles: featuredBikes, loading: loadingBikes } = useInfiniteVehicles({ vehicleType: 'bike', pageSize: 12, filter: 'latest' });

  // Auto-sliding functionality - updated to 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 8000); // Change slide every 6 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Handle manual navigation
  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Container with only text */}
      <div
        className="w-full bg-[#192684] pt-20 pb-4 flex flex-col items-start justify-start px-6"
        style={{
          transform: `translateY(${scrollY * 0.4}px)`,
          willChange: 'transform',
        }}
      >
        <h1 className="text-4xl font-extrabold text-white text-left leading-tight">
          Vahaanxchange
        </h1>
        <div className="mt-1">
          <span className="text-2xl text-orange-500 font-semibold">zero commission</span>
          <span className="text-2xl text-white font-semibold"> Deals</span>
        </div>
        {/* Looping video below hero text */}
        <div className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 mt-4">
          <video
            src="https://vahaanxchange-uploads.s3.ap-southeast-1.amazonaws.com/Mobile/Animated_Video_Generation_Complete.mp4"
            className="rounded-nonew-full"
            autoPlay
            loop
            muted
            playsInline
            poster="/videos/hero-poster.jpg"
            style={{ objectFit: 'cover', height: '180px', width: '100%' }}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-[#192684] border-0 pt-4">
      <div
        className="w-full bg-gray-100 dark:bg-gray-800 pt-9 rounded-t-3xl border-t-2 border-white dark:border-black"
        style={{
          boxShadow: "0 -8px 24px -8px rgba(0,0,0,0.18), inset 0 12px 24px -12px rgba(0,0,0,0.18)",
          transform: `translateY(${-scrollY * 0.2}px)`,
          willChange: 'transform',
          zIndex: 2,
          position: 'relative',
        }}
      >
        {/* Quick Access Cards */}
        <div className="px-6 mb-8">
          <div className="grid grid-cols-2 gap-7">
        <Link to="/search?type=car" className="block">
        <Card className="border border-grey bg-white dark:bg-gray-900 rounded-t-xl">
        <CardContent className="py-3 px-4 flex flex-col items-center">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-1">
        <img 
          src="https://vahaanxchange-uploads.s3.ap-southeast-1.amazonaws.com/Mobile/mobile_home_buy_cars_icon.avif" 
          alt="Buy Used Car icon" 
          className="h-10 w-10 object-contain"
          width="40"
          height="27"
          decoding="async"
          loading="eager"
          fetchPriority="high"
        />
          </div>
          <span className="font-medium text-sm">Buy Used Car</span>
          <p className="text-xs text-muted-foreground mt-1">Buy from Sellers</p>
        </CardContent>
          </Card>
        </Link>
        
        <Link to="/search?type=bike" className="block">
        <Card className="border border-grey bg-white dark:bg-gray-900 rounded-t-xl">
        <CardContent className="py-3 px-4 flex flex-col items-center">
          <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-1">
        <img 
          src="https://vahaanxchange-uploads.s3.ap-southeast-1.amazonaws.com/Mobile/mobile_home_buy_bikes_icon.avif" 
          alt="Buy Used Bike icon" 
          className="h-10 w-10 object-contain"
          width="40"
          height="31"
          decoding="async"
          loading="lazy"
        />
          </div>
          <span className="font-medium text-sm">Buy Used Bike</span>
          <p className="text-xs text-muted-foreground mt-1">Buy from Sellers</p>
        </CardContent>
          </Card>
        </Link>
        
        <Link to="/sell?mode=car" className="block" onClick={handleSellCarClick}>
        <Card className="border border-grey bg-white dark:bg-gray-900 rounded-t-xl">
        <CardContent className="py-3 px-4 flex flex-col items-center">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-1">
        <img 
          src="https://vahaanxchange-uploads.s3.ap-southeast-1.amazonaws.com/Mobile/mobile_home_sell_icon.avif" 
          alt="Sell Car icon" 
          className="h-10 w-10 object-contain"
          width="40"
          height="40"
          decoding="async"
          loading="lazy"
        />
          </div>
          <span className="font-medium text-sm">Sell Car</span>
          <p className="text-xs text-muted-foreground mt-1">Sell to Buyers</p>
        </CardContent>
          </Card>
        </Link>
        
        <Link to="/sell?mode=bike" className="block" onClick={handleSellBikeClick}>
        <Card className="border border-grey bg-white dark:bg-gray-900 rounded-t-xl">
        <CardContent className="py-3 px-4 flex flex-col items-center">
          <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-1">
        <img 
          src="https://vahaanxchange-uploads.s3.ap-southeast-1.amazonaws.com/Mobile/mobile_home_sell_icon.avif" 
          alt="Sell Bike icon" 
          className="h-10 w-10 object-contain"
          width="40"
          height="40"
          decoding="async"
          loading="lazy"
        />
          </div>
          <span className="font-medium text-sm">Sell Bike</span>
          <p className="text-xs text-muted-foreground mt-1">Sell to Buyers</p>
        </CardContent>
          </Card>
        </Link>
          </div>
        </div>

        {/* Rest of the content sections */}
        <div className="px-4">
          {/* Browse Cars by Category */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 mb-6">
        <div className="mb-0">
          <h2 className="text-lg font-semibold mb-3">Browse Cars by Category</h2>
          <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex space-x-4">
          <Link to="/search?budget=5 Lakhs" className="flex flex-col items-center">
          <div className="w-24 h-12 border border-grey bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)] border border-white">
          <span className="text-sm font-medium text-gray-800 dark:text-white">5 Lakhs</span>
        </div>
          </Link>
          
          <Link to="/search?budget=10 Lakhs" className="flex flex-col items-center">
          <div className="w-24 h-12 border border-grey bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)] border border-white">
          <span className="text-sm font-medium text-gray-800 dark:text-white">10 Lakhs</span>
        </div>
          </Link>
          
          <Link to="/search?budget=15 Lakhs" className="flex flex-col items-center">
          <div className="w-24 h-12 border border-grey bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)] border border-white">
          <span className="text-sm font-medium text-gray-800 dark:text-white">15 Lakhs</span>
        </div>
          </Link>
        </div>
          </ScrollArea>
        </div>
          </div>

          {/* Browse Bikes by Category */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 mb-6">
        <div className="mb-0">
          <h2 className="text-lg font-semibold mb-3">Browse Bikes by Category</h2>
          <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex space-x-4">
          <Link to="/bikes?budget=5 Lakhs" className="flex flex-col items-center">
          <div className="w-24 h-12 border border-grey bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)] border border-white">
          <span className="text-sm font-medium text-gray-800 dark:text-white">5 Lakhs</span>
        </div>
          </Link>
          
          <Link to="/bikes?budget=10 Lakhs" className="flex flex-col items-center">
          <div className="w-24 h-12 border border-grey bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)] border border-white">
          <span className="text-sm font-medium text-gray-800 dark:text-white">10 Lakhs</span>
        </div>
          </Link>
          
          <Link to="/bikes?budget=15 Lakhs" className="flex flex-col items-center">
          <div className="w-24 h-12 border border-grey bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)] border border-white">
          <span className="text-sm font-medium text-gray-800 dark:text-white">15 Lakhs</span>
        </div>
          </Link>
        </div>
          </ScrollArea>
        </div>
          </div>

          {/* Featured Cars */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md mb-6">
        <section className="">
          <h2 className="text-lg font-semibold mb-3 pl-4 pt-4">Latest Cars</h2>
          <div className="container-fluid mx-auto px-0 sm:px-0 lg:px-0">
        {/* Scrollable carousel below 1024px */}
        {loadingCars ? (
          <div className="flex gap-8 overflow-x-auto snap-mandatory pb-4 pl-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:snap-none">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-3/4 max-w-sm flex-shrink-0 snap-start lg:min-w-0 lg:max-w-full">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
          </div>
        ))}
          </div>
        ) : (
          <div className="flex gap-8 overflow-x-auto snap-mandatory pb-4 pl-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:snap-none">
        {featuredCars.map((car) => (
          <div
        key={car.id}
        className="w-3/4 max-w-sm flex-shrink-0 snap-start lg:min-w-0 lg:max-w-full"
          >
        <CarCard car={car} />
          </div>
        ))}
        <div className="w-3/4 max-w-sm flex-shrink-0 snap-start lg:min-w-0 lg:max-w-full">
          <AddVehicleCard />
        </div>
          </div>
        )}

        <div className="mt-0 mb-2 text-center pb-4">
          <Link
        to="/search?type=car"
        className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
        View all listings
        <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
          </div>
        </section>
          </div>

          {/* Featured Bikes */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md mb-6">
        <section className="">
          <h2 className="text-lg font-semibold mb-3 pl-4 pt-4">Latest Bikes</h2>
          <div className="container-fluid mx-auto px-0 sm:px-0 lg:px-0">
        {/* Scrollable carousel below 1024px */}
        {loadingBikes ? (
          <div className="flex gap-8 overflow-x-auto snap-mandatory pb-4 pl-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:snap-none">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-3/4 max-w-sm flex-shrink-0 snap-start lg:min-w-0 lg:max-w-full">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
          </div>
        ))}
          </div>
        ) : (
          <div className="flex gap-8 overflow-x-auto snap-mandatory pb-4 pl-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:snap-none">
        {featuredBikes.map((bike) => (
          <div
        key={bike.id}
        className="w-3/4 max-w-sm flex-shrink-0 snap-start lg:min-w-0 lg:max-w-full"
          >
        <BikeCard bike={bike} />
          </div>
        ))}
        <div className="w-3/4 max-w-sm flex-shrink-0 snap-start lg:min-w-0 lg:max-w-full">
          <AddVehicleCard />
        </div>
          </div>
        )}

        <div className="mt-0 mb-2 text-center pb-4">
          <Link
        to="/search?type=bike"
        className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
        View all listings
        <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
          </div>
        </section>
          </div>

          {/* Special Mobile-Only Sections */}
          {/* What's Special About Us Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">What's Special About Us</h2>
        <SpecialSellSection />
          </div>
          {/* What Our Users Say + SEO Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 mb-6">
        <ReviewsSection />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

// If this component is used directly in a route, export a property to disable mobilePadding
MobileHomeUI.mobilePadding = false;

export default MobileHomeUI;
