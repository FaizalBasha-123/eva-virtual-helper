
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface FavouriteItem {
  id: string;
  user_id: string;
  vehicle_id: string;
  vehicle_type: string;
}

export const useFavourites = () => {
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavourites = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favourites')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setFavourites(data || []);
    } catch (error) {
      console.error('Error fetching favourites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavourites = async (vehicleId: string, vehicleType: 'car' | 'bike') => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // Trigger sign-in modal
      window.dispatchEvent(new CustomEvent('openSignInModal'));
      return false;
    }

    try {
      const { error } = await supabase.from('favourites').insert({
        user_id: userId,
        vehicle_id: vehicleId,
        vehicle_type: vehicleType
      });

      if (error) throw error;

      // Update local state
      const newFavourite = {
        id: crypto.randomUUID(),
        user_id: userId,
        vehicle_id: vehicleId,
        vehicle_type: vehicleType
      };
      setFavourites(prev => [...prev, newFavourite]);

      toast({
        title: "Added to Favourites",
        description: `${vehicleType} has been added to your favourites.`,
      });

      return true;
    } catch (error) {
      console.error('Error adding to favourites:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add to favourites. Please try again.",
      });
      return false;
    }
  };

  const removeFromFavourites = async (vehicleId: string, vehicleType: 'car' | 'bike') => {
    const userId = localStorage.getItem('userId');
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('favourites')
        .delete()
        .eq('user_id', userId)
        .eq('vehicle_id', vehicleId)
        .eq('vehicle_type', vehicleType);

      if (error) throw error;

      // Update local state
      setFavourites(prev => 
        prev.filter(fav => !(fav.vehicle_id === vehicleId && fav.vehicle_type === vehicleType))
      );

      toast({
        title: "Removed from Favourites",
        description: `${vehicleType} has been removed from your favourites.`,
      });

      return true;
    } catch (error) {
      console.error('Error removing from favourites:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove from favourites. Please try again.",
      });
      return false;
    }
  };

  const isFavourite = (vehicleId: string, vehicleType: 'car' | 'bike') => {
    return favourites.some(fav => fav.vehicle_id === vehicleId && fav.vehicle_type === vehicleType);
  };

  const toggleFavourite = async (vehicleId: string, vehicleType: 'car' | 'bike') => {
    if (isFavourite(vehicleId, vehicleType)) {
      return await removeFromFavourites(vehicleId, vehicleType);
    } else {
      return await addToFavourites(vehicleId, vehicleType);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return {
    favourites,
    loading,
    addToFavourites,
    removeFromFavourites,
    isFavourite,
    toggleFavourite,
    fetchFavourites
  };
};
