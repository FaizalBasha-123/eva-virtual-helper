import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Separator } from "@/components/ui/separator";
import FilterSidebar from "@/components/cars/FilterSidebar";
import CarPopularBrands from "@/components/cars/PopularBrands";
import BikePopularBrands from "@/components/bikes/PopularBrands";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { useCityStore } from "@/store/useCityStore";
import { getCityFromURL } from "@/utils/queryHelpers";
import CityModal from "@/components/cars/CityModal";
import LocationInput from "@/components/cars/LocationInput";
import SearchBar from "@/components/cars/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useInfiniteVehicles } from "@/hooks/useInfiniteVehicles";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import UnifiedVehicleCard from "@/components/shared/UnifiedVehicleCard";
import { useCanonical } from "@/hooks/useCanonical";
import CarCard from "@/components/cars/CarCard";
import BikeCard from "@/components/bikes/BikeCard";
import { useIsMobile } from "@/hooks/use-mobile";
import DealerSection from "@/components/shared/DealerSection";

const BuyCar = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [pageBlocked, setPageBlocked] = useState(true);
  
  const { selectedCity, setSelectedCity } = useCityStore();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get vehicle type from URL params (defaults to car)
  const searchParams = new URLSearchParams(location.search);
  const vehicleType = searchParams.get('type') === 'bike' ? 'bike' : 'car';
  
  // Set canonical URL for used cars
  useCanonical('/search-used-cars');
  
  const { vehicles, loading, error, hasMore, loadMore } = useInfiniteVehicles({ 
    vehicleType 
  });

  useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    loading
  });

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
        "name": "Used Cars",
        "item": "https://www.vahaanxchange.com/search-used-cars"
      }
    ]
  };
  
  // Check for city in URL or open modal if no city is selected
  useEffect(() => {
    const cityFromURL = getCityFromURL();
    
    if (cityFromURL) {
      setSelectedCity(cityFromURL);
      setPageBlocked(false);
    } else if (!selectedCity) {
      // Open city modal immediately and keep it open until city is selected
      setIsCityModalOpen(true);
      setPageBlocked(true);
    } else {
      setPageBlocked(false);
    }
  }, [selectedCity, setSelectedCity]);
  
  // Filter toggle for mobile view
  const toggleFilters = () => {
    setIsFilterVisible(!isFilterVisible);
  };
  
  // Function to apply filters
  const applyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);
  };
  
  // Function to clear all filters
  const clearFilters = () => {
    setAppliedFilters({});
  };

  const openCityModal = () => {
    setIsCityModalOpen(true);
  };

  const closeCityModal = () => {
    // Only close the city modal if we have a selected city
    if (selectedCity) {
      setIsCityModalOpen(false);
      setPageBlocked(false);
    }
  };

  // If page is blocked, prevent scrolling on the body
  useEffect(() => {
    if (pageBlocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [pageBlocked]);

  const isMobile = useIsMobile();

  if (error) {
    return (
      <Layout>
        <SEOHead
          title={`Search Used Cars - VahaanXchange`}
          description={`Find quality used cars from verified sellers. Smart pricing, zero commission, and secure transactions.`}
          canonicalUrl={`https://www.vahaanxchange.com/search-used-cars`}
          breadcrumbSchema={breadcrumbSchema}
        />
        <div className="container mx-auto px-4 pt-6 lg:pt-24">
          <div className="text-center py-8 text-muted-foreground">
            Failed to load {vehicleType === 'bike' ? 'bikes' : 'cars'}: {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="Find Used Hand Cars - Zero Commission"
        description="Discover the best deals on pre-owned cars with zero commission fees. Browse a wide selection of verified used cars, enjoy transparent pricing, and connect directly with sellers for a hassle-free car buying experience."
        canonicalUrl={`https://www.vahaanxchange.com/search-used-cars`}
        breadcrumbSchema={breadcrumbSchema}
      />
      
      {/* Modal overlay to block interactions when city modal is open */}
      {pageBlocked && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
      )}
      
      <div className="container mx-auto px-4 pt-6 lg:pt-24">

        {/* Dealer Section */}
        <DealerSection vehicleType={vehicleType} />
        
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-6 mb-6">
          {/* Search Bar and Location Input */}
          <div className="mb-6 pl-0">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-grow">
                <SearchBar isCompact />
              </div>
              <LocationInput onClick={openCityModal} className="md:w-64 shadow" />
            </div>
          </div>

        
        {/* City Selection Modal */}
        <CityModal 
          isOpen={isCityModalOpen}
          onClose={closeCityModal}
          isMandatory={!selectedCity}
        />
        
        {/* Mobile filter toggle */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={toggleFilters}
              className="flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              {isFilterVisible ? (
                <>
                  <X className="h-4 w-4" /> Hide Filters
                </>
              ) : (
                <>
                  <SlidersHorizontal className="h-4 w-4" /> Advanced Search
                </>
              )}
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={clearFilters}
            className="text-primary"
          >
            Clear Filters
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Sidebar with slide animation */}
          <div 
            className={`absolute lg:relative lg:block w-full lg:w-1/4 xl:w-1/5 top-0 left-0 z-30 h-[calc(100vh-150px)] 
              overflow-y-auto transition-all duration-[1500ms] ease-in-out transform ${
              isFilterVisible ? 'translate-x-0 opacity-100 shadow-lg' : '-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100 lg:hidden'
            }`}
          >
            <FilterSidebar 
              onApplyFilters={applyFilters} 
              appliedFilters={appliedFilters}
              onClearFilters={clearFilters}
            />
          </div>
          
          {/* Main content */}
          <div className={`w-full transition-all duration-[1500ms] ease-in-out ${isFilterVisible ? 'lg:w-2/3 xl:w-3/4' : 'w-full'}`}>
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{vehicles.length} {vehicleType === 'bike' ? 'Bikes' : 'Cars'} Found</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedCity ? `in ${selectedCity}` : 'Based on your search criteria'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Sort options would go here */}
                  <Button variant="outline" className="text-sm">
                    Most Relevant
                  </Button>
                </div>
              </div>
              
              {/* Applied filters would display here */}
              {Object.keys(appliedFilters).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {/* This would be populated with active filter badges */}
                  <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    Budget: ₹5L - ₹10L
                    <button className="ml-1 text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Car listings - Update grid layout to be consistent */}
            <div className="transition-all duration-[1500ms] ease-in-out">
              {isMobile ? (
                <div className="flex flex-col items-center gap-6">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="w-3/4 max-w-sm flex-shrink-0 snap-start lg:min-w-0 lg:max-w-full">
                      {vehicleType === 'car' ? (
                        <CarCard car={vehicle} />
                      ) : (
                        <BikeCard bike={vehicle} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
              <div className={`grid gap-6 ${isFilterVisible ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
                {vehicles.map((vehicle) => (
                  <UnifiedVehicleCard key={vehicle.id} vehicle={vehicle} type={vehicleType} />
                ))}
              </div>
              )}
              
              {loading && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              
              {!hasMore && vehicles.length > 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  You've reached the end of the listings
                </div>
              )}
            </div>
            
            <Separator className="my-12" />
          </div>
        </div>
        
        {/* Popular brands section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Popular {vehicleType === 'bike' ? 'Bike' : 'Car'} Brands</h2>
          {vehicleType === 'bike' ? <BikePopularBrands /> : <CarPopularBrands />}
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuyCar;
