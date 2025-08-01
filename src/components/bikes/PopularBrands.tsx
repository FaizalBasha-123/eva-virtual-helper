
import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface BrandProps {
  id: string;
  name: string;
  logo: string;
  count: number;
}

// data for bike brands
const bikeBrands: BrandProps[] = [
  { id: "hero", name: "Hero", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/hero.webp", count: 82 },
  { id: "honda", name: "Honda", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/honda.webp", count: 95 },
  { id: "royalenfield", name: "Royal Enfield", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/royal_enfield.webp", count: 62 },
  { id: "tvs", name: "TVS", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/tvs.webp", count: 48 },
  { id: "bajaj", name: "Bajaj", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/bajaj.webp", count: 78 },
  { id: "yamaha", name: "Yamaha", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/yamaha.webp", count: 55 },
  { id: "suzuki", name: "Suzuki", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/suzuki.webp", count: 42 },
  { id: "ktm", name: "KTM", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/ktm.webp", count: 28 },
  { id: "jawa", name: "Jawa", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/jawa.webp", count: 15 },
  { id: "mahindra", name: "Mahindra", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/mahindra.webp", count: 20 },
  { id: "vespa", name: "Vespa", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/vespa.webp", count: 12 },
  { id: "harleydavidson", name: "Harley-Davidson", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/harley_davidson.webp", count: 8 },
  { id: "ducati", name: "Ducati", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/ducati.webp", count: 6 },
  { id: "kawasaki", name: "Kawasaki", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/kawasaki.webp", count: 10 },
  { id: "ummotorcycles", name: "UM Motorcycles", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/um_motorcycles.webp", count: 5 },
  { id: "benelli", name: "Benelli", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/benelli.webp", count: 7 },
  { id: "heroelectric", name: "Hero Electric", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/hero_electric.webp", count: 4 },
  { id: "hyosung", name: "Hyosung", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/hyosung.webp", count: 3 },
  { id: "triumph", name: "Triumph", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/triumph.webp", count: 5 },
  { id: "bmw", name: "BMW", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/bmw.webp", count: 12 },
  { id: "aprilia", name: "Aprilia", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/aprilia.webp", count: 6 },
  { id: "revolt", name: "Revolt", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/revolt.webp", count: 2 },
  { id: "benling", name: "Benling India", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/benling_india.webp", count: 2 },
  { id: "keeway", name: "Keeway", logo: "/placeholder.svg", count: 2 },
  { id: "okinawa", name: "Okinawa", logo: "/placeholder.svg", count: 2 },
  { id: "yezdi", name: "Yezdi", logo: "/placeholder.svg", count: 2 },
  { id: "komaki", name: "Komaki", logo: "/placeholder.svg", count: 2 },
  { id: "ampere", name: "Ampere", logo: "/placeholder.svg", count: 2 },
  { id: "herohonda", name: "Hero Honda", logo: "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/PopularBrands/hero_honda.webp", count: 2 },
];


const PopularBrands = () => {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex w-max space-x-4 p-4">
        {bikeBrands.map((brand) => (
          <div 
            key={brand.id}
            className="flex flex-col items-center space-y-2 hover-scale"
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white border shadow-sm p-2">
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="w-32 h-12 object-contain"
              />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{brand.name}</div>
              <div className="text-xs text-muted-foreground">({brand.count})</div>
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default PopularBrands;