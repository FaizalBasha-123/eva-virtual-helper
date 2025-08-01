
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllBrands, findBrandIdByName, fetchAllBikeBrands, findBikeBrandIdByName } from "@/services/vehicleService";
import { Brand } from "@/types/vehicleTypes";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface BrandSelectorProps {
  vehicleType: "car" | "bike";
  selectedBrand: string;
  onSelectBrand: (brand: string, brandId?: string) => void;
  onBack: () => void;
}

// List of popular brands to show at the top
const popularCarBrands = [
  "Maruti Suzuki",
  "Hyundai",
  "Tata",
  "Mahindra",
  "Honda",
  "Toyota",
  "Kia",
  "Mercedes Benz",
  "BMW",
];

const popularBikeBrands = [
  "Hero",
  "Bajaj",
  "Honda",
  "TVS",
  "Yamaha",
  "Royal Enfield",
  "Suzuki",
  "KTM",
  "Jawa",
];

const BrandSelector: React.FC<BrandSelectorProps> = ({
  vehicleType,
  selectedBrand,
  onSelectBrand,
  onBack,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMoreBrands, setShowMoreBrands] = useState(false);

  // Define popular brands based on vehicle type
  const popularBrands = vehicleType === "car" ? popularCarBrands : popularBikeBrands;

  useEffect(() => {
    const loadBrands = async () => {
      setIsLoading(true);
      try {
        if (vehicleType === "car") {
          const fetchedBrands = await fetchAllBrands();
          setBrands(fetchedBrands);
        } else {
          // For bikes, fetch from the bike_brand table
          const fetchedBrands = await fetchAllBikeBrands();
          setBrands(fetchedBrands);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading brands:", error);
        toast.error(`Failed to load ${vehicleType} brands. Please try again.`);
        setIsLoading(false);
      }
    };

    loadBrands();
  }, [vehicleType]);

  // Handle brand selection with ID lookup
  const handleBrandSelect = async (brandName: string) => {
    try {
      if (vehicleType === "car") {
        const brandId = await findBrandIdByName(brandName);
        onSelectBrand(brandName, brandId || undefined);
      } else {
        // For bikes, use the bike-specific function
        const brandId = await findBikeBrandIdByName(brandName);
        onSelectBrand(brandName, brandId || undefined);
      }
    } catch (error) {
      console.error("Error selecting brand:", error);
      toast.error(`Failed to select ${vehicleType} brand. Please try again.`);
    }
  };

  // Group brands into popular and other categories
  const { popularBrandsList, otherBrandsList } = useMemo(() => {
    const brandNames = brands.map(brand => brand.name);
    
    const popularBrandsList = popularBrands
      .filter(brand => brandNames.includes(brand))
      .sort();
    
    const otherBrandsList = brandNames
      .filter(brand => !popularBrands.includes(brand))
      .sort();
    
    return { popularBrandsList, otherBrandsList };
  }, [brands, popularBrands]);

  // Filter brands based on search term
  const filteredPopularBrands = useMemo(() => {
    return popularBrandsList.filter(
      brand => brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [popularBrandsList, searchTerm]);

  const filteredOtherBrands = useMemo(() => {
    return otherBrandsList.filter(
      brand => brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [otherBrandsList, searchTerm]);

  // Determine if we should show the "More brands" toggle
  const hasFilteredOtherBrands = filteredOtherBrands.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-0 mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-xl font-medium">Select Brand</h3>
      </div>
      
      {/* Search input */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Popular brands */}
          <ScrollArea className="w-full max-h-96 overflow-y-auto pr-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredPopularBrands.map((brand) => (
                <Button
                  key={brand}
                  variant="outline"
                  className={`h-auto py-3 ${selectedBrand === brand ? 'border-primary border-2' : ''}`}
                  onClick={() => handleBrandSelect(brand)}
                >
                  {brand}
                </Button>
              ))}
              
              {/* Show other brands if toggle is on */}
              {showMoreBrands && filteredOtherBrands.map((brand) => (
                <Button
                  key={brand}
                  variant="outline"
                  className={`h-auto py-3 ${selectedBrand === brand ? 'border-primary border-2' : ''}`}
                  onClick={() => handleBrandSelect(brand)}
                >
                  {brand}
                </Button>
              ))}
            </div>
          </ScrollArea>
          
          {/* More brands toggle */}
          {hasFilteredOtherBrands && (
            <Button
              variant="ghost"
              className="w-full justify-between text-primary"
              onClick={() => setShowMoreBrands(!showMoreBrands)}
            >
              <span>{showMoreBrands ? "Show less brands" : "More brands"}</span>
              <ChevronRight className={`h-5 w-5 transition-transform ${showMoreBrands ? 'rotate-90' : ''}`} />
            </Button>
          )}
          
          {filteredPopularBrands.length === 0 && filteredOtherBrands.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No brands found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandSelector;
