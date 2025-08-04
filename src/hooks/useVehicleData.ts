import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VehicleData {
  id: string;
  photos: any;
  seller_location_city: string;
  year: number;
  brand: string;
  model: string;
  variant: string;
  sell_price: number;
  kilometers_driven: number;
  color: string;
  number_of_owners: number;
  tag?: string;
  created_at?: string;
  seller_type?: string;
}

export interface DetailedVehicleData extends VehicleData {
  fuel_type: string;
  cc: number;
  features?: string;
}

export const useBikeData = (filter?: 'recommended' | 'discounted' | 'all', limit?: number) => {
  const [bikes, setBikes] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('bike_seller_listings')
          .select('id, photos, seller_location_city, year, brand, model, variant, sell_price, kilometers_driven, color, number_of_owners');

        if (filter === 'recommended') {
          query = query.eq('recommended', 'yes');
        } else if (filter === 'discounted') {
          query = query.eq('discounted', 'yes');
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        setBikes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, [filter, limit]);

  return { bikes, loading, error };
};

export const useVehicleDetails = (id: string, type: 'car' | 'bike') => {
  const [vehicle, setVehicle] = useState<DetailedVehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        const table = type === 'car' ? 'car_seller_listings' : 'bike_seller_listings';
        
        const { data, error } = await supabase
          .from(table)
          .select('id, photos, seller_location_city, year, brand, model, variant, sell_price, kilometers_driven, color, number_of_owners, fuel_type, cc')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        setVehicle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicleDetails();
    }
  }, [id, type]);

  return { vehicle, loading, error };
};
