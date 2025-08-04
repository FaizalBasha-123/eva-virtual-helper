
import React from "react";
import { Pagination } from "@/components/ui/pagination";
import { PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import MobileVehicleCard from "@/components/shared/MobileVehicleCard";

interface MobileBikeListingsProps {
  bikes: any[];
}

const MobileBikeListings: React.FC<MobileBikeListingsProps> = ({ bikes }) => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {bikes.map((bike) => (
          <MobileVehicleCard key={bike.id} vehicle={{...bike, type: 'bike'}} />
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

export default MobileBikeListings;
