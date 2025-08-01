
import React from 'react';
import CarCard from './CarCard';
import { CarType } from '@/types/car';

interface CarListingsProps {
  cars: CarType[];
  gridClass?: string;
}

const CarListings = ({ cars, gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" }: CarListingsProps) => {
  return (
    <div className={`grid ${gridClass} gap-4 md:gap-6 transition-all duration-[1500ms] ease-in-out`}>
      {cars.map((car) => {
        // Ensure all required properties are set with fallbacks
        const carWithRequiredProps = {
          ...car,
          imageUrl: car.imageUrl || car.image || '/placeholder.svg',
          fuelType: car.fuelType || car.fuel || 'Not specified'
        };
        
        return <CarCard key={car.id} car={carWithRequiredProps} />;
      })}
    </div>
  );
};

export default CarListings;
