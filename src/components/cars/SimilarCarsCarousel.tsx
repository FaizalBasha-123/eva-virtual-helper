
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { CarType } from '@/types/car';
import VehicleCard from '@/components/shared/VehicleCard';

interface SimilarCarsCarouselProps {
  currentCarId: string;
  currentCarTitle: string;
  similarCars: CarType[];
}

const SimilarCarsCarousel = ({ currentCarId, currentCarTitle, similarCars }: SimilarCarsCarouselProps) => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Similar Cars to {currentCarTitle}</h2>
        <Carousel className="relative">
          <CarouselContent className="-ml-4">
            {similarCars.map((car) => (
              <CarouselItem key={car.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <VehicleCard
                  vehicle={{
                    ...car,
                    imageUrl: car.imageUrl || car.image || '/placeholder.svg',
                    fuelType: car.fuelType || car.fuel || 'Unknown',
                    transmission: car.transmission || 'Unknown', // Ensure transmission is always provided
                    type: 'car'
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default SimilarCarsCarousel;
