
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

const EconomyHeroSection = () => {
  return (
    <div className="relative rounded-xl overflow-hidden mb-8">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/UserCars/used_cars_hero_banner.webp')",
          filter: "brightness(0.9)"
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/70 z-10" />
      
      {/* Content */}
      <div className="relative z-20 p-8 md:p-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          The Car You Need. The Price You Want.
        </h1>
        
        <p className="text-lg text-white/90 mb-6">
          Drive home with confidence — schedule your visit today and feel the difference.
        </p>
        
        <Link to="/search">
          <Button size="lg" className="gap-2 bg-orange-500 hover:bg-orange-600">
            <Car className="h-5 w-5" />Buy Used Cars
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EconomyHeroSection;
