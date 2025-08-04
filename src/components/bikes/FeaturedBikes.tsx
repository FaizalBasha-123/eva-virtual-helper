import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInfiniteVehicles } from "@/hooks/useInfiniteVehicles";
import UnifiedVehicleCard from "@/components/shared/UnifiedVehicleCard";
import AddVehicleCard from "@/components/shared/AddVehicleCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const FeaturedBikes = () => {
  const { vehicles: bikes, loading, error } = useInfiniteVehicles({ vehicleType: 'bike', pageSize: 12, filter: 'latest' });

  if (loading) {
    return (
      <div className="relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Latest Bikes</h2>
        </div>
        <ScrollArea className="w-full">
          <div className="flex space-x-6 pb-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
          ))}
        </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Latest Bikes</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Failed to load bikes: {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Latest Bikes</h2>
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex space-x-6 pb-4">
          {bikes.map((bike) => (
            <div key={bike.id} className="flex-shrink-0 w-80">
            <UnifiedVehicleCard vehicle={bike} type="bike" />
          </div>
        ))}
          <div className="flex-shrink-0 w-80">
            <AddVehicleCard />
          </div>
      </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default FeaturedBikes;
