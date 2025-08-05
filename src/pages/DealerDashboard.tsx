import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Separator } from "@/components/ui/separator";
import FilterSidebar from "@/components/cars/FilterSidebar";
import PopularBrands from "@/components/cars/PopularBrands";
import BikeFilterSidebar from "@/components/bikes/FilterSidebar";
import BikePopularBrands from "@/components/bikes/PopularBrands";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { useCityStore } from "@/store/useCityStore";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import UnifiedVehicleCard from "@/components/shared/UnifiedVehicleCard";
import { useCanonical } from "@/hooks/useCanonical";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DealerDashboard = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [vehicleType, setVehicleType] = useState<'car' | 'bike'>('car');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dealerName, setDealerName] = useState<string>("");
  
  const { selectedCity } = useCityStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Set canonical URL for dealer dashboard
  useCanonical('/dealer-dashboard');

  const isMobile = useIsMobile();

  // Fetch dealer details and vehicles
  useEffect(() => {
    const fetchDealerData = async () => {
      // Get dealerId from localStorage
      const dealerId = localStorage.getItem('dealerId');
      if (!dealerId) {
        toast({
          title: "Error",
          description: "Dealer ID not found. Please sign in again.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      await fetchVehicles(dealerId);
      // Set dealer name from localStorage
      const dealerNameStored = localStorage.getItem('dealerName');
      if (dealerNameStored) setDealerName(dealerNameStored);
    };
    fetchDealerData();
    setLoading(false);
  }, [navigate, toast]);

  const fetchVehicles = async (dealerId: string) => {
    try {
      const tableName = vehicleType === 'car' ? 'car_seller_listings' : 'bike_seller_listings';
      // Filter vehicles by dealer_id
      const { data: vehicleData, error: vehicleError } = await supabase
        .from(tableName)
        .select('*')
        .eq('dealer_id', dealerId)
        .limit(10);

      if (vehicleError) {
        console.error('Error fetching vehicles:', vehicleError);
        return;
      }

      setVehicles(vehicleData || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  // Refetch vehicles when vehicle type changes
  useEffect(() => {
    const dealerId = localStorage.getItem('dealerId');
    if (dealerId) {
      fetchVehicles(dealerId);
    }
  }, [vehicleType]);

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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 pt-6 lg:pt-24">
          <div className="text-center py-8">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="Dealer Dashboard - VahaanXchange"
        description="Manage your vehicle listings and view your dealer dashboard"
        canonicalUrl="https://www.vahaanxchange.com/dealer-dashboard"
      />
      
      <div className="container mx-auto px-4 pt-6 lg:pt-24">
        
        {/* Header with Dealer Name and Vehicle Type Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {dealerName}</h1>
            <p className="text-muted-foreground">Manage your vehicle listings</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={vehicleType === 'car' ? 'default' : 'outline'}
              onClick={() => setVehicleType('car')}
            >
              Cars
            </Button>
            <Button 
              variant={vehicleType === 'bike' ? 'default' : 'outline'}
              onClick={() => setVehicleType('bike')}
            >
              Bikes
            </Button>
          </div>
        </div>
        
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
              {vehicleType === 'car' ? (
                <FilterSidebar 
                  onApplyFilters={applyFilters} 
                  appliedFilters={appliedFilters}
                  onClearFilters={clearFilters}
                />
              ) : (
                <BikeFilterSidebar 
                  onApplyFilters={applyFilters} 
                  appliedFilters={appliedFilters}
                  onClearFilters={clearFilters}
                />
              )}
            </div>
          )}
          <div className="w-full">
            {/* Heading and sort */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{vehicles.length} {vehicleType === 'car' ? 'Cars' : 'Bikes'} Found</h2>
                  <p className="text-sm text-muted-foreground">
                    Your {vehicleType} listings
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="text-sm">
                    Most Recent
                  </Button>
                </div>
              </div>
            </div>
            {/* Vehicle Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {vehicles.map((vehicle: any) => (
                <UnifiedVehicleCard key={vehicle.id} vehicle={vehicle} type={vehicleType} />
              ))}
            </div>
            {vehicles.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No {vehicleType}s found. Start adding your vehicle listings!
              </div>
            )}
            <Separator className="my-12" />
            {/* Popular Brands at the bottom */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Popular {vehicleType === 'car' ? 'Car' : 'Bike'} Brands</h2>
              {vehicleType === 'car' ? <PopularBrands /> : <BikePopularBrands />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DealerDashboard;
