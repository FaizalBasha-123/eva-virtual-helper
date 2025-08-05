import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Share2, Car, Bike, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import UnifiedVehicleCard from "@/components/shared/UnifiedVehicleCard";
import { useToast } from "@/hooks/use-toast";

interface Dealer {
  id: string;
  name: string;
  phone_number: string;
  dealer_location?: string;
}

interface Vehicle {
  id: string;
  brand?: string;
  model?: string;
  variant?: string;
  fuel_type?: string;
  year?: number;
  sell_price?: number;
  seller_location_city?: string;
  photos?: any;
  created_at?: string;
}

const DealerDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dealerIdFromUrl = searchParams.get('dealerId');
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [allDealers, setAllDealers] = useState<Dealer[]>([]);
  const [currentDealerIndex, setCurrentDealerIndex] = useState<number>(-1);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [vehicleType, setVehicleType] = useState<'car' | 'bike'>('car');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Fetch all dealers for navigation
  useEffect(() => {
    const fetchAllDealers = async () => {
      try {
        const { data, error } = await supabase
          .from('dealer_details')
          .select('id, name, phone_number')
          .order('name');
          
        if (error) {
          console.error('Error fetching all dealers:', error);
          return;
        }
        
        setAllDealers(data || []);
        
        // Find current dealer index
        if (dealerIdFromUrl && data) {
          const index = data.findIndex(d => d.id === dealerIdFromUrl);
          setCurrentDealerIndex(index);
        }
      } catch (error) {
        console.error('Error fetching all dealers:', error);
      }
    };
    
    fetchAllDealers();
  }, [dealerIdFromUrl]);

  // Fetch dealer details
  useEffect(() => {
    const fetchDealer = async () => {
      if (!dealerIdFromUrl) return;
      
      try {
        const { data, error } = await supabase
          .from('dealer_details')
          .select('id, name, phone_number, dealer_location')
          .eq('id', dealerIdFromUrl)
          .single();
          
        if (error) {
          console.error('Error fetching dealer:', error);
          return;
        }
        
        setDealer(data);
      } catch (error) {
        console.error('Error fetching dealer:', error);
      }
    };
    
    fetchDealer();
  }, [dealerIdFromUrl]);

  // Fetch vehicles based on dealer and vehicle type
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!dealerIdFromUrl) return;
      
      setLoading(true);
      try {
        const tableName = vehicleType === 'car' ? 'car_seller_listings' : 'bike_seller_listings';
        
        // Use direct API call to avoid TypeScript issues like in DealerCard
        const response = await fetch(`https://iaptxaruwnwqeukrjibq.supabase.co/rest/v1/${tableName}?dealer_id=eq.${dealerIdFromUrl}&select=id,brand,model,variant,fuel_type,year,sell_price,seller_location_city,photos`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhcHR4YXJ1d253cWV1a3JqaWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTQ0NTQsImV4cCI6MjA2OTA5MDQ1NH0.VxJGls9WiYXIATCUHmlZ2VjbJJKgiRSzgx6cqXTfKa8',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhcHR4YXJ1d253cWV1a3JqaWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTQ0NTQsImV4cCI6MjA2OTA5MDQ1NH0.VxJGls9WiYXIATCUHmlZ2VjbJJKgiRSzgx6cqXTfKa8',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setVehicles(data || []);
        } else {
          console.error('Error fetching vehicles:', response.statusText);
          setVehicles([]);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, [dealerIdFromUrl, vehicleType]);

  // Filter vehicles based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVehicles(vehicles);
      return;
    }
    
    const filtered = vehicles.filter(vehicle => {
      const searchLower = searchQuery.toLowerCase();
      return (
        vehicle.brand?.toLowerCase().includes(searchLower) ||
        vehicle.model?.toLowerCase().includes(searchLower) ||
        vehicle.variant?.toLowerCase().includes(searchLower)
      );
    });
    
    setFilteredVehicles(filtered);
  }, [vehicles, searchQuery]);

  const handleShare = async () => {
    const currentUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${dealer?.name || 'Dealer'} - VahaanXchange`,
          text: `Check out ${dealer?.name || 'this dealer'} on VahaanXchange`,
          url: currentUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
        fallbackShare(currentUrl);
      }
    } else {
      fallbackShare(currentUrl);
    }
  };

  const fallbackShare = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copied!",
        description: "The dealer page link has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Share failed",
        description: "Unable to share or copy link.",
        variant: "destructive"
      });
    });
  };

  // Navigation functions
  const navigateToPreviousDealer = () => {
    if (currentDealerIndex > 0) {
      const previousDealer = allDealers[currentDealerIndex - 1];
      navigate(`/dealerdetails?dealerId=${previousDealer.id}`);
    }
  };

  const navigateToNextDealer = () => {
    if (currentDealerIndex < allDealers.length - 1) {
      const nextDealer = allDealers[currentDealerIndex + 1];
      navigate(`/dealerdetails?dealerId=${nextDealer.id}`);
    }
  };

  if (!dealer && !loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 pt-6 lg:pt-24">
          <div className="text-center py-12">
            <div className="text-xl text-gray-500">Dealer not found</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={`${dealer?.name || 'Dealer'} - VahaanXchange`}
        description={`Find vehicles from ${dealer?.name || 'this dealer'} on VahaanXchange`}
        canonicalUrl={`https://www.vahaanxchange.com/dealerdetails?dealerId=${dealerIdFromUrl}`}
      />
      
      <div className="container mx-auto mb-12 px-4 pt-12 lg:pt-24">
        {/* Dealer Header */}
        <div className="mb-8">
          <div className="flex flex-col w-full md:flex-row md:items-center md:justify-between gap-4">
            {/* Dealer Name and Contact Info */}
            <div className="flex-1 bg-primary p-6 rounded-lg shadow-lg border border-white dark:border-gray-800">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left: Location */}
                <div className="flex items-center text-white">
                  {dealer?.dealer_location && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{dealer.dealer_location}</span>
                    </div>
                  )}
                </div>
                
                {/* Center: Dealer Name with Navigation Arrows and Location */}
                <div className="flex items-center gap-4">
                  {/* Previous Dealer Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={navigateToPreviousDealer}
                    disabled={currentDealerIndex <= 0}
                    className="text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed p-2"
                    title="Previous Dealer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  
                  {/* Dealer Name and Location */}
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">
                      {dealer?.name || 'Loading...'}
                    </h1>
                    {allDealers.length > 0 && (
                      <p className="text-white/80 text-xs mt-1">
                        {currentDealerIndex + 1} of {allDealers.length} dealers
                      </p>
                    )}
                  </div>
                  
                  {/* Next Dealer Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={navigateToNextDealer}
                    disabled={currentDealerIndex >= allDealers.length - 1}
                    className="text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed p-2"
                    title="Next Dealer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Right: Phone and Share */}
                <div className="flex items-center gap-4 text-white min-w-0 md:flex-1 justify-end">
                  {dealer?.phone_number && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      <span className="text-sm">{dealer.phone_number}</span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Search Bar */}
          <div className="lg:w-1/3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by brand, model, variant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Right: Vehicle Type Toggle */}
          <div className="lg:w-2/3 flex justify-end">
            <div className="flex gap-2">
              <Button 
                variant={vehicleType === 'car' ? 'default' : 'outline'}
                onClick={() => setVehicleType('car')}
                className="flex items-center gap-2"
              >
                <Car className="h-4 w-4" />
                Cars
              </Button>
              <Button 
                variant={vehicleType === 'bike' ? 'default' : 'outline'}
                onClick={() => setVehicleType('bike')}
                className="flex items-center gap-2"
              >
                <Bike className="h-4 w-4" />
                Bikes
              </Button>
            </div>
          </div>
        </div>

        {/* Vehicle Listings */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {filteredVehicles.length} {vehicleType === 'car' ? 'Cars' : 'Bikes'} Found
            </h2>
            {searchQuery && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing results for "{searchQuery}"
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <div className="text-lg ml-3">Loading {vehicleType}s...</div>
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredVehicles.map((vehicle) => (
                <UnifiedVehicleCard 
                  key={vehicle.id} 
                  vehicle={vehicle} 
                  type={vehicleType}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-xl text-gray-500">
                {searchQuery ? 'No vehicles found matching your search' : `No ${vehicleType}s available`}
              </div>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DealerDetails;
