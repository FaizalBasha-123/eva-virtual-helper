
import React from 'react';
import { CarType } from '@/types/car';
import VehicleCard from '@/components/shared/VehicleCard';

interface SimilarCarsSectionProps {
  currentCarId: string;
  currentCarTitle: string;
  similarCars: CarType[];
}

const SimilarCarsSection = ({ currentCarId, currentCarTitle, similarCars }: SimilarCarsSectionProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Similar cars to {currentCarTitle}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similarCars.map((similarCar) => (
          <VehicleCard 
            key={similarCar.id} 
            vehicle={{
              ...similarCar,
              type: 'car',
              transmission: similarCar.transmission || 'Unknown',
              fuelType: similarCar.fuelType || similarCar.fuel || 'Unknown'
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default SimilarCarsSection;
