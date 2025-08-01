
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Gauge, Map, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatIndianCurrency } from "@/utils/formatters";

interface MobileVehicleCardProps {
  vehicle: any;
}

const MobileVehicleCard = ({ vehicle }: MobileVehicleCardProps) => {
  // Generate link based on vehicle type
  const detailLink = vehicle.type === 'car' ? `/car/${vehicle.id}` : `/bike/${vehicle.id}`;

  // Format price with Indian currency format if available or use a fallback
  const formattedPrice = vehicle.price ? formatIndianCurrency(vehicle.price) : "Price on request";

  // Calculate truncated title
  const truncatedTitle = `${vehicle.brand || ''} ${vehicle.model || ''}`.trim();
  
  // Add feature badge (e.g. "EMI Available")
  const showFeatureBadge = vehicle.featured || Math.random() > 0.7; // For demo, randomize some listings to show badge
  
  return (
    <Link 
      to={detailLink}
      className="block w-full"
    >
      <div className="relative flex flex-col bg-white dark:bg-gray-900 overflow-hidden rounded-lg shadow-md transition-all">
        {/* Image Container with Fixed Aspect Ratio */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={vehicle.imageUrl || vehicle.image || '/placeholder.svg'}
            alt={truncatedTitle}
            className="w-full h-full object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {showFeatureBadge && (
              <Badge className="bg-green-500 hover:bg-green-600">EMI Available</Badge>
            )}
          </div>
          
          {/* Price Tag */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white">
            <div className="flex justify-between items-center">
              <p className="font-semibold">₹{formattedPrice}</p>
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                {vehicle.type === 'car' ? 'Car' : 'Bike'}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-base mb-1 truncate">{truncatedTitle}</h3>
          <p className="text-xs text-muted-foreground mb-3">{vehicle.variant || ''}</p>
          
          {/* Key Specifications */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{vehicle.year || 'N/A'}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{vehicle.kilometers || vehicle.kms || 'N/A'} km</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Map className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{vehicle.city || 'N/A'}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{vehicle.fuelType || vehicle.fuel || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MobileVehicleCard;
