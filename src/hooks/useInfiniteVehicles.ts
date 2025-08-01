import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VehicleData } from '@/hooks/useVehicleData';

interface UseInfiniteVehiclesOptions {
  vehicleType: 'car' | 'bike';
  pageSize?: number;
  filter?: 'recommended' | 'discounted' | 'latest';
}

export const useInfiniteVehicles = ({ vehicleType, pageSize = 32, filter }: UseInfiniteVehiclesOptions) => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const tableName = vehicleType === 'car' ? 'car_seller_listings' : 'bike_seller_listings';

  const fetchVehicles = useCallback(async (page: number, reset = false) => {
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);

      const from = page * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from(tableName)
        .select('id, photos, seller_location_city, year, brand, model, variant, sell_price, kilometers_driven, color, number_of_owners, created_at, seller_type');

      if (filter === 'recommended') {
        query = query.eq('recommended', 'yes');
      } else if (filter === 'discounted') {
        query = query.eq('discounted', 'yes');
      } else if (filter === 'latest') {
        query = query.order('created_at', { ascending: false });
      }

      query = query.range(from, to);

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Filter out any error objects and ensure correct shape
      const newVehicles: VehicleData[] = (data || []).filter((item: any) =>
        item &&
        !item.error &&
        typeof item.id !== 'undefined' &&
        typeof item.seller_location_city !== 'undefined' &&
        typeof item.year !== 'undefined' &&
        typeof item.brand !== 'undefined' &&
        typeof item.model !== 'undefined' &&
        typeof item.variant !== 'undefined' &&
        typeof item.sell_price !== 'undefined' &&
        typeof item.kilometers_driven !== 'undefined' &&
        typeof item.color !== 'undefined' &&
        typeof item.number_of_owners !== 'undefined'
      ) as VehicleData[];
      
      if (reset) {
        setVehicles(newVehicles);
      } else {
        setVehicles(prev => [...prev, ...newVehicles]);
      }

      setHasMore(newVehicles.length === pageSize);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [tableName, pageSize, loading, filter]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchVehicles(currentPage + 1);
    }
  }, [fetchVehicles, hasMore, loading, currentPage]);

  const refresh = useCallback(() => {
    setCurrentPage(0);
    setHasMore(true);
    fetchVehicles(0, true);
  }, [fetchVehicles]);

  useEffect(() => {
    fetchVehicles(0, true);
  }, [vehicleType, filter]);

  return {
    vehicles,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
};
