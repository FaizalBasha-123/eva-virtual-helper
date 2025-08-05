import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/seo/SEOHead';
import DealerSignInModal from '@/components/auth/DealerSignInModal';
import DealerCard from '@/components/dealer/DealerCard';
import { Car, Bike } from 'lucide-react';

interface Dealer {
  id: string;
  name: string;
  phone_number: string;
  dealer_location?: string;
  created_at?: string;
}

interface Vehicle {
  id: string;
  title?: string;
  brand?: string;
  model?: string;
  variant?: string;
  fuel_type?: string;
  year?: number;
  sell_price?: number;
  price?: number;
  location?: string;
  seller_location_city?: string;
  photos?: any;
  image?: string;
  dealer_id?: string;
  created_at?: string;
}

interface DealerWithVehicles extends Dealer {
  vehicles: Vehicle[];
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const Dealers: React.FC = () => {
  const [vehicleType, setVehicleType] = useState<'car' | 'bike'>('car');
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDealers = async () => {
      setLoading(true);
      try {
        // Fetch all dealers
        const { data: dealersData, error: dealersError } = await supabase
          .from('dealer_details')
          .select('id, name, phone_number, dealer_location');
          
        if (dealersError || !Array.isArray(dealersData)) {
          setDealers([]);
          return;
        }

        // Only keep valid dealer objects
        const validDealers = (dealersData as any[]).filter(
          d => d && typeof d === 'object' && d.id && d.name && d.phone_number
        );

        setDealers(validDealers);
      } catch (error) {
        console.error('Error fetching dealers:', error);
        setDealers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDealers();
  }, [vehicleType]);

  const dealerId = localStorage.getItem('dealerId');

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 pt-6 lg:pt-24">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <div className="text-lg ml-3">Loading dealers...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="Dealers - VahaanXchange"
        description="Find verified dealers and their vehicle listings on VahaanXchange. Browse cars and bikes from trusted dealers."
        canonicalUrl="https://www.vahaanxchange.com/dealers"
      />
      
      <div className="container mx-auto px-4 mb-8 pt-6 lg:pt-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-2xl font-bold mb-4 md:mb-0">
            Pick your Favourite vehicle from our dealers
          </div>
          <div className="flex gap-2 items-center">
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
            {!dealerId && (
              <Button 
                variant="default"
                onClick={() => setShowSignInModal(true)}
                className="ml-4"
              >
                Apply Dealer
              </Button>
            )}
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        {/* Dealer Cards Section */}
        {dealers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-500">No dealers found</div>
            <div className="text-sm text-gray-400 mt-2">
              Be the first dealer to list your {vehicleType}s!
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {dealers.map((dealer) => (
              <DealerCard key={dealer.id} dealer={dealer} vehicleType={vehicleType} />
            ))}
          </div>
        )}
        
        {/* Dealer Sign In Modal */}
        {showSignInModal && (
          <DealerSignInModal 
            isOpen={showSignInModal} 
            onClose={() => setShowSignInModal(false)} 
          />
        )}
      </div>
    </Layout>
  );
};

export default Dealers;
