
import React from "react";
import UnifiedVehicleCard from "@/components/shared/UnifiedVehicleCard";

const BikeCard = ({ bike }: { bike: any }) => {
  return <UnifiedVehicleCard vehicle={bike} type="bike" />;
};

export default BikeCard;
