
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// Brand logos - for simplicity, we'll use placeholder logos
const carBrands = [
  { name: "Maruti", logo: "/placeholder.svg" },
  { name: "Hyundai", logo: "/placeholder.svg" },
  { name: "Tata", logo: "/placeholder.svg" },
  { name: "Honda", logo: "/placeholder.svg" },
  { name: "Toyota", logo: "/placeholder.svg" },
  { name: "Mahindra", logo: "/placeholder.svg" },
  { name: "Kia", logo: "/placeholder.svg" },
  { name: "Mercedes", logo: "/placeholder.svg" },
  { name: "BMW", logo: "/placeholder.svg" },
  { name: "Audi", logo: "/placeholder.svg" },
  { name: "Volkswagen", logo: "/placeholder.svg" },
  { name: "Skoda", logo: "/placeholder.svg" },
];

const bikeBrands = [
  { name: "Hero", logo: "/placeholder.svg" },
  { name: "Honda", logo: "/placeholder.svg" },
  { name: "Bajaj", logo: "/placeholder.svg" },
  { name: "TVS", logo: "/placeholder.svg" },
  { name: "Royal Enfield", logo: "/placeholder.svg" },
  { name: "Yamaha", logo: "/placeholder.svg" },
  { name: "Suzuki", logo: "/placeholder.svg" },
  { name: "KTM", logo: "/placeholder.svg" },
  { name: "Kawasaki", logo: "/placeholder.svg" },
  { name: "Harley Davidson", logo: "/placeholder.svg" },
];

interface BrandStepProps {
  vehicleType: "car" | "bike";
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
}

const BrandStep: React.FC<BrandStepProps> = ({
  vehicleType,
  selectedBrand,
  onSelectBrand,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [customBrand, setCustomBrand] = useState("");

  // Determine which brands to display based on vehicle type
  const brands = vehicleType === "car" ? carBrands : bikeBrands;

  // Filter brands based on search term
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show first 6 brands initially, or all if showMore is true
  const displayedBrands = showMore ? filteredBrands : filteredBrands.slice(0, 6);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Select Brand</h2>
      <p className="text-muted-foreground mb-6">
        Choose the brand of the {vehicleType} you want to add
      </p>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${vehicleType} brands...`}
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Custom brand input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Can't find the brand? Enter manually:
        </label>
        <Input
          placeholder="Enter brand name"
          value={customBrand}
          onChange={(e) => setCustomBrand(e.target.value)}
          className="mb-2"
        />
        <Button
          variant="outline"
          onClick={() => {
            if (customBrand.trim()) {
              onSelectBrand(customBrand.trim());
            }
          }}
          disabled={!customBrand.trim()}
          className="w-full"
        >
          Use Custom Brand
        </Button>
      </div>

      {/* Brand pills */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
        {displayedBrands.map((brand) => (
          <div
            key={brand.name}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
              selectedBrand === brand.name
                ? "border-primary bg-primary/10"
                : "border-gray-200 hover:border-primary/50"
            }`}
            onClick={() => onSelectBrand(brand.name)}
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-12 w-12 mb-2"
            />
            <span className="text-sm font-medium text-center">{brand.name}</span>
          </div>
        ))}
      </div>

      {/* Show more/less button */}
      {filteredBrands.length > 6 && (
        <Button
          variant="ghost"
          className="w-full text-primary"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Show Less" : "More Brands >"}
        </Button>
      )}
    </div>
  );
};

export default BrandStep;
