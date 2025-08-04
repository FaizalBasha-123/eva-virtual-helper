import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Car, Bike } from "lucide-react";

interface VehicleTypeToggleProps {
  vehicleType: "car" | "bike";
  onToggleChange: (value: string) => void;
}

const VehicleTypeToggle: React.FC<VehicleTypeToggleProps> = ({
  vehicleType,
  onToggleChange,
}) => {
  const handleChange = (value: string) => {
    if (value === "car" || value === "bike") {
      onToggleChange(value);
    }
  };
  return (
    <div className="flex justify-center mb-6">
      <ToggleGroup
        type="single"
        value={vehicleType}
        onValueChange={handleChange}
        className="bg-muted p-1 rounded-full w-full max-w-[200px]"
      >
        <ToggleGroupItem
          value="car"
          className={`w-full rounded-full text-sm font-medium ${
            vehicleType === "car"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
          } transition-all duration-200`}
          aria-label="Car"
        >
          <Car className="h-4 w-4 mr-2" /> Car
        </ToggleGroupItem>

        <ToggleGroupItem
          value="bike"
          className={`w-full rounded-full text-sm font-medium ${
            vehicleType === "bike"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
          } transition-all duration-200`}
          aria-label="Bike"
        >
          <Bike className="h-4 w-4 mr-2" /> Bike
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default VehicleTypeToggle;
