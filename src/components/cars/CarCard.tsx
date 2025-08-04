
import React from "react";
import UnifiedVehicleCard from "@/components/shared/UnifiedVehicleCard";

const CarCard = ({ car }: { car: any }) => {
  return <UnifiedVehicleCard vehicle={car} type="car" />;
};

export default CarCard;
