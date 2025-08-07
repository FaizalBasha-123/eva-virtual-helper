
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, Calendar, Fuel, BatteryCharging, 
  Gauge, Tag, User 
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import FavouriteButton from "./FavouriteButton";
import { generateVehicleSlug } from "@/utils/slugUtils";

interface UnifiedVehicleCardProps {
  vehicle: any;
  type: 'car' | 'bike';
}

const UnifiedVehicleCard = ({ vehicle, type }: UnifiedVehicleCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const getFuelIcon = (fuelType: string) => {
    if (fuelType?.toLowerCase().includes('electric')) {
      return <BatteryCharging className="h-4 w-4 mr-2 text-muted-foreground" />;
    }
    return <Fuel className="h-4 w-4 mr-2 text-muted-foreground" />;
  };

  const getMainImage = () => {
    if (vehicle.photos && typeof vehicle.photos === 'object') {
      const categories = Object.values(vehicle.photos);
      for (const category of categories) {
        if (Array.isArray(category) && category.length > 0) {
          return category[0];
        }
      }
    }
    return "/placeholder.svg";
  };
  
  const vehicleName = `${vehicle.year ? vehicle.year : 'No Data'} ${vehicle.brand ? vehicle.brand : 'No Data'} ${vehicle.model ? vehicle.model : 'No Data'}`;
  const vehicleImageUrl = getMainImage();
  
  // Generate SEO-friendly slug
  const slug = generateVehicleSlug({
    brand: vehicle.brand || 'unknown',
    model: vehicle.model || 'unknown',
    variant: vehicle.variant || 'base',
    fuel_type: vehicle.fuel_type || 'petrol',
    year: vehicle.year || new Date().getFullYear(),
    seller_location_city: vehicle.seller_location_city || 'india',
    id: vehicle.id
  });
  
  const detailRoute = type === 'car' ? `/used-car-details/${slug}` : `/used-bike-details/${slug}`;

  return (
    <Link to={detailRoute} className="block h-full">
      <Card className="overflow-hidden min-h-[360px] w-full hover:shadow-md transition-shadow duration-300 lg:h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[16/9]">
          <img 
            src={vehicleImageUrl} 
            alt={vehicleName}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
            decoding="async"
            width="320"
            height="180"
            style={{ aspectRatio: '16/9' }}
          />
          
          <FavouriteButton
            vehicleId={vehicle.id}
            vehicleType={type}
            className="absolute top-3 right-3"
          />
          
          {/* Tag */}
          {vehicle.tag && vehicle.tag.trim() !== '' && (
          <div className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-md z-10">
              {vehicle.tag}
            </div>
          )}
        </div>
        
        {/* Content */}
        <CardContent className="p-4">
          {/* Price */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold line-clamp-1">{vehicleName}</h3>
            <p className="font-bold text-black dark:text-white">
              {/*
              {vehicle.sell_price === 0 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open("https://wa.me/918108104175", "_blank", "noopener,noreferrer");
                  }}
                  className="text-primary underline hover:text-primary/80 bg-transparent border-none p-0 m-0 cursor-pointer"
                  style={{ font: 'inherit' }}
                  type="button"
                >
                  Contact Seller
                </button>
              ) : vehicle.sell_price != null ? formatPrice(vehicle.sell_price) : 'No Data'}
              */}
              {vehicle.sell_price != null ? formatPrice(vehicle.sell_price) : 'No Data'}
            </p>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="truncate">{vehicle.seller_location_city ? vehicle.seller_location_city : 'No Data'}</span>
          </div>
          
          {/* Specifications */}
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{vehicle.year ? vehicle.year : 'No Data'}</span>
            </div>
            
            <div className="flex items-center">
              <Gauge className="h-3.5 w-3.5 mr-1" />
              <span>{vehicle.kilometers_driven === 0 ? 'NA' : vehicle.kilometers_driven != null ? vehicle.kilometers_driven.toLocaleString() : 'No Data'} km</span>
            </div>
            
            <div className="flex items-center">
              <Tag className="h-3.5 w-3.5 mr-1" />
              <span>{vehicle.variant ? vehicle.variant : 'No Data'}</span>
            </div>
            
            <div className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1" />
              <span>{vehicle.number_of_owners != null ? vehicle.number_of_owners : 'No Data'} Owner</span>
            </div>
          </div>
          
          {/* Features */}
            <div className="mt-3 pt-2 border-t text-sm text-muted-foreground">
              <span>Seller : {vehicle.seller_type || "Owner"}</span>
            </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default UnifiedVehicleCard;
