import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import CarCard from "@/components/cars/CarCard";
import BikeCard from "@/components/bikes/BikeCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Dealer {
  id: string;
  name: string;
}

interface DealerSectionProps {
  vehicleType: "car" | "bike";
}

const DealerSection: React.FC<DealerSectionProps> = ({ vehicleType }) => {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [selectedDealerId, setSelectedDealerId] = useState<string>("");
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch dealers on component mount
  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const { data, error } = await supabase
          .from('dealer_details')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setDealers(data);
          // Set first dealer as selected by default
          setSelectedDealerId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching dealers:', error);
      }
    };

    fetchDealers();
  }, []);

  // Fetch vehicles when dealer selection changes
  useEffect(() => {
    if (!selectedDealerId) return;

    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const tableName = vehicleType === "car" ? "car_seller_listings" : "bike_seller_listings";
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('dealer_id', selectedDealerId)
          .limit(8); // Limit to 8 vehicles initially
        
        if (error) throw error;
        setVehicles(data || []);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [selectedDealerId, vehicleType]);

  if (dealers.length === 0) {
    return null; // Don't render if no dealers
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleMoreClick = () => {
    const selectedDealer = dealers.find(d => d.id === selectedDealerId);
    if (selectedDealer) {
      navigate(`/dealer/${selectedDealer.id}`);
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-6">
        {/* Header */}
        <div className="mb-6 pt-5 px-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Our Active Dealers
          </h2>
        </div>

        {/* Dealer Selection - Horizontal Scroll */}
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2 px-8 scrollbar-hide">
            {dealers.map((dealer) => (
              <button
                key={dealer.id}
                onClick={() => setSelectedDealerId(dealer.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedDealerId === dealer.id
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {dealer.name}
              </button>
            ))}
            <button
              onClick={handleMoreClick}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200"
            >
              More
            </button>
          </div>
        </div>

        {/* Vehicle Cards */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : vehicles.length > 0 ? (
            <>
              {/* Left Arrow */}
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Scrollable Container */}
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex-shrink-0 w-72">
                    {vehicleType === "car" ? (
                      <CarCard car={vehicle} />
                    ) : (
                      <BikeCard bike={vehicle} />
                    )}
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No {vehicleType}s available from this dealer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerSection;
