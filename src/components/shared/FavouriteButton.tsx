
import React from 'react';
import { Heart } from 'lucide-react';
import { useFavourites } from '@/hooks/useFavourites';

interface FavouriteButtonProps {
  vehicleId: string;
  vehicleType: 'car' | 'bike';
  className?: string;
}

const FavouriteButton = ({ vehicleId, vehicleType, className = "" }: FavouriteButtonProps) => {
  const { isFavourite, toggleFavourite } = useFavourites();
  const isActive = isFavourite(vehicleId, vehicleType);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavourite(vehicleId, vehicleType);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-colors ${className}`}
      aria-label={isActive ? "Remove from favourites" : "Add to favourites"}
    >
      <Heart 
        className={`h-5 w-5 ${
          isActive 
            ? "fill-pink-500 text-pink-500" 
            : "text-gray-600 dark:text-gray-400"
        }`} 
      />
    </button>
  );
};

export default FavouriteButton;
