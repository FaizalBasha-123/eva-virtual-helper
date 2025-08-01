
import React from "react";
import { Pagination } from "@/components/ui/pagination";
import { PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import MobileVehicleCard from "@/components/shared/MobileVehicleCard";

interface MobileCarListingsProps {
  cars: any[];
}

const MobileCarListings: React.FC<MobileCarListingsProps> = ({ cars }) => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {cars.map((car) => (
          <MobileVehicleCard key={car.id} vehicle={{...car, type: 'car'}} />
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default MobileCarListings;
