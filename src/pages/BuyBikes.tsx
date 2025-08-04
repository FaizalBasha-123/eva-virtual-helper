import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Separator } from "@/components/ui/separator";
import FilterSidebar from "@/components/bikes/FilterSidebar";
import BikePopularBrands from "@/components/bikes/PopularBrands";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { useCityStore } from "@/store/useCityStore";
import { getCityFromURL } from "@/utils/queryHelpers";
import CityModal from "@/components/cars/CityModal";
import LocationInput from "@/components/bikes/LocationInput";
import SearchBar from "@/components/bikes/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useInfiniteVehicles } from "@/hooks/useInfiniteVehicles";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import UnifiedVehicleCard from "@/components/shared/UnifiedVehicleCard";
import { useCanonical } from "@/hooks/useCanonical";
import { useIsMobile } from "@/hooks/use-mobile";
import DealerSection from "@/components/shared/DealerSection";

const BuyBikes = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [pageBlocked, setPageBlocked] = useState(true);
  
  const { selectedCity, setSelectedCity } = useCityStore();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Hardcode vehicleType to 'bike'
  const vehicleType = 'bike';
  
  // Set canonical URL for used bikes
  useCanonical('/search-used-bikes');
  
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
        "name": "Used Bikes",
        "item": "https://www.vahaanxchange.com/search-used-bikes"
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
          title={`Search Used Bikes - VahaanXchange`}
          description={`Find quality used bikes from verified sellers. Smart pricing, zero commission, and secure transactions.`}
          canonicalUrl={`https://www.vahaanxchange.com/search-used-bikes`}
          breadcrumbSchema={breadcrumbSchema}
        />
        <div className="container mx-auto px-4 pt-6 lg:pt-24">
          <div className="text-center py-8 text-muted-foreground">
            Failed to load bikes: {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="Find Used Hand Bikes - Zero Commission"
        description="Explore top deals on second-hand bikes with zero commission. Choose from a variety of verified bikes, connect directly with sellers, and ride away with confidence and savings."
        canonicalUrl={`https://www.vahaanxchange.com/search-used-bikes`}
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
          <div className="mt-6 mb-6 pl-0">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-grow">
                <SearchBar isCompact className="rounded-xl overflow-hidden transition-all duration-300" />
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
        
        {/* Vehicle Cards Grid */}
        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Sidebar for filters on desktop */}
          {!isMobile && isFilterVisible && (
            <div className="w-full lg:w-1/4 xl:w-1/5">
              <FilterSidebar 
                onApplyFilters={applyFilters} 
                appliedFilters={appliedFilters}
                onClearFilters={clearFilters}
              />
            </div>
          )}
          <div className="w-full">
            {/* Heading and sort */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{vehicles.length} Bikes Found</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedCity ? `in ${selectedCity}` : 'Based on your search criteria'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="text-sm">
                    Most Relevant
                  </Button>
                </div>
              </div>
              {/* Applied filters badges could go here if needed */}
            </div>
            {/* Vehicle Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {vehicles.map((vehicle: any) => (
                <UnifiedVehicleCard key={vehicle.id} vehicle={vehicle} type="bike" />
              ))}
            </div>
            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="flex justify-center mt-6">
                <Button onClick={loadMore} variant="outline">
                  Load More
                </Button>
              </div>
            )}
            {loading && (
              <div className="flex justify-center mt-6">
                <span>Loading...</span>
              </div>
            )}
            <Separator className="my-12" />
          </div>
        </div>
        
        {/* Popular Brands at the bottom */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Popular Bike Brands</h2>
          <BikePopularBrands />
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuyBikes;
