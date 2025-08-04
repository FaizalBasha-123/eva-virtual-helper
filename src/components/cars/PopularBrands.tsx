
import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface BrandProps {
  id: string;
  name: string;
  logo: string;
  count: number;
}

interface PopularBrandsProps {
  variant?: "circle" | "square";
}

// Updated car brands list with all the requested brands
const carBrands: BrandProps[] = [
  { id: "maruti", name: "Maruti Suzuki", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/maruti_suzuki.webp", count: 156 },
  { id: "hyundai", name: "Hyundai", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/hyundai.webp", count: 124 },
  { id: "mahindra", name: "Mahindra", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/mahindra.webp", count: 92 },
  { id: "tata", name: "Tata", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/tata.webp", count: 98 },
  { id: "honda", name: "Honda", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/honda.webp", count: 87 },
  { id: "toyota", name: "Toyota", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/toyota.webp", count: 76 },
  { id: "ford", name: "Ford", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/ford.webp", count: 43 },
  { id: "renault", name: "Renault", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/renault.webp", count: 64 },
  { id: "volkswagen", name: "Volkswagen", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/volkswagon.webp", count: 38 },
  { id: "chevrolet", name: "Chevrolet", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/chevrolet.webp", count: 35 },
  { id: "skoda", name: "Skoda", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/skoda.webp", count: 25 },
  { id: "kia", name: "KIA", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/kia.webp", count: 58 },
  { id: "fiat", name: "Fiat", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/fiat.webp", count: 18 },
  { id: "nissan", name: "Nissan", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/nissan.webp", count: 22 },
  { id: "mercedes", name: "Mercedes Benz", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/mercedes-benz.webp", count: 28 },
  { id: "bmw", name: "BMW", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/bmw.webp", count: 32 },
  { id: "audi", name: "Audi", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/audi.webp", count: 30 },
  { id: "bentley", name: "Bentley", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/bentley.webp", count: 5 },
  { id: "jaguar", name: "Jaguar", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/jaguar.webp", count: 12 },
  { id: "landrover", name: "Landrover", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/land_rover.webp", count: 15 },
  { id: "maserati", name: "Maserati", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/maserati.webp", count: 3 },
  { id: "volvo", name: "Volvo", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/volvo.webp", count: 20 },
];

const PopularBrands = ({ variant = "circle" }: PopularBrandsProps) => {
  const isSquare = variant === "square";

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      {isSquare ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 p-1">
          {carBrands.map((brand) => (
            <div 
              key={brand.id}
              className="flex flex-col items-center space-y-2 hover-scale"
            >
              <div className="w-24 h-24 aspect-square flex items-center justify-center bg-white border shadow-sm p-2 rounded-lg">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{brand.name}</div>
                <div className="text-xs text-muted-foreground">({brand.count})</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex w-max space-x-4 p-4">
          {carBrands.map((brand) => (
            <div 
              key={brand.id}
              className="flex flex-col items-center space-y-2 hover-scale"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white border shadow-sm p-2">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{brand.name}</div>
                <div className="text-xs text-muted-foreground">({brand.count})</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default PopularBrands;
