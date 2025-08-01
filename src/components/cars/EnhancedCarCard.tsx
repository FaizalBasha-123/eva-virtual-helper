
import React from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, Calendar, Fuel, BatteryCharging, 
  Gauge, Tag, Users, Shield, Star, User 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnimatedCardWrapper from "../ui/animated-card-wrapper";
import FavouriteButton from "@/components/shared/FavouriteButton";

interface EnhancedCarCardProps {
  car: {
    id: string;
    title: string;
    price: number;
    emi?: number;
    year: number;
    mileage: number;
    location: string;
    imageUrl: string;
    fuelType: string;
    transmission: string;
    seats: number;
    owner: string;
    featured?: boolean;
    assured?: boolean;
    highlightFeatures?: string[];
  };
}

const EnhancedCarCard = ({ car }: EnhancedCarCardProps) => {
  const getFuelIcon = (fuelType: string) => {
    if (fuelType.toLowerCase().includes('electric')) {
      return <BatteryCharging className="h-4 w-4" />;
    }
    return <Fuel className="h-4 w-4" />;
  };
  
  // Helper function to format currency in Indian format
  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <AnimatedCardWrapper>
      <div className="block overflow-hidden rounded-xl transition-all duration-300 card-shadow bg-card hover-scale hover:shadow-lg">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[16/9]">
          <img 
            src={car.imageUrl} 
            alt={car.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
          
          {/* Bookmark Button */}
          <FavouriteButton
            vehicleId={car.id}
            vehicleType="car"
            className="absolute top-3 right-3"
          />
          
          {/* Featured Tag */}
          {car.featured && (
            <div className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md">
              Featured
            </div>
          )}
          
          {/* Assured Badge */}
          {car.assured && (
            <div className="absolute bottom-3 left-3 px-2 py-1 text-xs font-medium bg-white text-blue-600 rounded-md flex items-center gap-1">
              <Shield className="h-3 w-3" /> 
              <span className="font-bold">CARS24</span> Assured
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{car.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span className="truncate">{car.location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary text-lg">{formatIndianCurrency(car.price)}</p>
              {car.emi && (
                <p className="text-xs text-muted-foreground">EMI: {formatIndianCurrency(car.emi)}/mo</p>
              )}
            </div>
          </div>
          
          {/* Highlights */}
          {car.highlightFeatures && car.highlightFeatures.length > 0 && (
            <div className="flex flex-wrap gap-1 my-2">
              {car.highlightFeatures.map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-[10px] py-0 px-1.5 bg-secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Divider */}
          <div className="h-px bg-border my-3"></div>
          
          {/* Specifications */}
          <div className="grid grid-cols-2 gap-y-2 mt-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{car.year}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Gauge className="h-4 w-4 mr-2" />
              <span>{car.mileage.toLocaleString()} km</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              {getFuelIcon(car.fuelType)}
              <span className="ml-2">{car.fuelType}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Tag className="h-4 w-4 mr-2" />
              <span>{car.transmission}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>{car.seats} Seater</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <User className="h-4 w-4 mr-2" />
              <span>{car.owner}</span>
            </div>
          </div>
          
          {/* View Details Button */}
          <div className="mt-4">
            <Link 
              to={`/car/${car.id}`} 
              className="block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </AnimatedCardWrapper>
  );
};

export default EnhancedCarCard;
