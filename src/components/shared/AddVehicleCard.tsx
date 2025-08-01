
import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AddVehicleCard = () => {
  return (
    <Link to="/sell" className="block h-full">
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow duration-300 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center min-h-[320px]">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Plus className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Sell Your Vehicle
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                List your car or bike
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default AddVehicleCard;
