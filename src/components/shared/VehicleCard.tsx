import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, MapPin, Calendar, Fuel, BatteryCharging, 
  Gauge, Tag, User 
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

interface VehicleCardProps {
  vehicle: {
    id: string | number;
    title?: string;
    name?: string;
    price: number;
    emi?: number;
    year: number;
    mileage?: number;
    kmDriven?: number;
    location: string;
    imageUrl?: string;
    image?: string;
    fuelType: string;
    transmission: string;
    owner?: string;
    seller?: string;
    featured?: boolean;
    badges?: string[];
    features?: string[];
    type: 'car' | 'bike';
    seller_type?: string;
  };
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const [favorite, setFavorite] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const getFuelIcon = (fuelType: string) => {
    if (fuelType.toLowerCase().includes('electric')) {
      return <BatteryCharging className="h-4 w-4 mr-2 text-muted-foreground" />;
    }
    return <Fuel className="h-4 w-4 mr-2 text-muted-foreground" />;
  };
  
  const vehicleName = vehicle.title || vehicle.name || "Vehicle";
  const vehicleImageUrl = vehicle.imageUrl || vehicle.image || "/placeholder.svg";
  const vehicleDistance = vehicle.mileage || vehicle.kmDriven || 0;
  const vehicleOwner = vehicle.owner || vehicle.seller || "Not specified";
  const detailRoute = vehicle.type === 'car' ? `/buy/${vehicle.id}` : `/bike/${vehicle.id}`;

  return (
    <Link to={detailRoute} className="block h-full">
      <Card className="overflow-hidden h-[360px] w-full sm:h-[380px] hover:shadow-md transition-shadow duration-300 lg:h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[16/9]">
          <img 
            src={vehicleImageUrl} 
            alt={vehicleName}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
          
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-colors"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-5 w-5 ${
                favorite 
                  ? "fill-red-500 text-red-500" 
                  : "text-gray-600 dark:text-gray-400"
              }`} 
            />
          </button>
          
          {vehicle.featured && (
            <div className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md z-10">
              Featured
            </div>
          )}
          
          {vehicle.badges && vehicle.badges.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex flex-wrap gap-1">
                {vehicle.badges.map((badge, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs bg-primary/80 text-white">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Content */}
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold line-clamp-1">{vehicleName}</h3>
            <p className="font-bold text-black">{formatPrice(vehicle.price)}</p>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="truncate">{vehicle.location}</span>
          </div>
          
          {/* Specifications */}
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{vehicle.year}</span>
            </div>
            
            <div className="flex items-center">
              <Gauge className="h-3.5 w-3.5 mr-1" />
              <span>{vehicleDistance.toLocaleString()} km</span>
            </div>
            
            <div className="flex items-center">
              {getFuelIcon(vehicle.fuelType)}
              <span>{vehicle.fuelType}</span>
            </div>
            
            <div className="flex items-center">
              <span>Seller : {vehicle.seller_type || "Owner"}</span>
            </div>
          </div>
          
          {/* Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {vehicle.features.slice(0, 3).map((feature, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{feature}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {vehicle.features.length > 3 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs">
                      +{vehicle.features.length - 3} more
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {vehicle.features.slice(3).join(", ")}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
          
          {/* Seller/Owner Info */}
          {vehicleOwner && (
            <div className="mt-3 pt-2 border-t text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="h-3.5 w-3.5 mr-1" />
                <span>{vehicleOwner}</span>
              </div>
            </div>
          )}
          
          {/* EMI Information */}
          {vehicle.emi && (
            <div className="mt-2 text-xs text-right text-muted-foreground">
              EMI from {formatPrice(vehicle.emi)}/mo
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default VehicleCard;
