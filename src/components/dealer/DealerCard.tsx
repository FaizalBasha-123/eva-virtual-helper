import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Car, Bike, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { generateVehicleSlug } from '@/utils/slugUtils';
import CarCard from '@/components/cars/CarCard';
import BikeCard from '@/components/bikes/BikeCard';

interface Dealer {
  id: string;
  name: string;
  phone_number: string;
  dealer_location?: string;
  location?: string;
  created_at?: string;
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

interface DealerCardProps {
  dealer: Dealer;
  vehicleType: 'car' | 'bike';
  vehicles?: Vehicle[];
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const DealerCard: React.FC<DealerCardProps> = ({ dealer, vehicleType }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const tableName = vehicleType === 'car' ? 'car_seller_listings' : 'bike_seller_listings';
        
        // Use direct API call to avoid TypeScript issues
        const response = await fetch(`https://iaptxaruwnwqeukrjibq.supabase.co/rest/v1/${tableName}?dealer_id=eq.${dealer.id}&select=id,brand,model,variant,fuel_type,year,sell_price,seller_location_city,photos&limit=10`, {
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
  }, [dealer.id, vehicleType]);

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

  return (
    <div className="w-full shadow-lg border bg-white dark:bg-gray-800 [&.sc-VHjGu.fAsLcW]:!transform-none [&.sc-VHjGu.fAsLcW]:!scale-100 [&.sc-VHjGu.fAsLcW]:!transition-none [&.sc-VHjGu.fAsLcW]:!animate-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{dealer.name}</CardTitle>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
          <Phone className="w-4 h-4 mr-1" />
          {dealer.phone_number}
        </div>
        {dealer.dealer_location && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1" />
            {dealer.dealer_location}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-lg text-gray-900 dark:text-white">
              {vehicleType === 'car' ? 'Cars Available' : 'Bikes Available'}
            </h4>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {vehicles.length} {vehicleType}{vehicles.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : vehicles.length > 0 ? (
            <div className="relative">
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
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none'
                }}
              >
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex-shrink-0 w-72">
                    {vehicleType === 'car' ? (
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
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No {vehicleType}s available from this dealer</p>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
};

export default DealerCard;
