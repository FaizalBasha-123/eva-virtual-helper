
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, MapPin, CalendarIcon, Fuel, Bike } from "lucide-react";

interface SearchBarProps {
  className?: string;
  isCompact?: boolean;
}

const SearchBar = ({ className = "", isCompact = false }: SearchBarProps) => {
  const navigate = useNavigate();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    query: "",
    make: "",
    model: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    fuelType: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build query string from search params
    const queryParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    navigate(`/search?${queryParams.toString()}`);
  };

  const makes = ["Honda", "Hero", "Bajaj", "TVS", "Yamaha", "Suzuki", "Royal Enfield", "KTM", "Mahindra", "Jawa"];
  const models = ["Any Model", "Splendor", "Pulsar", "Activa", "Apache", "FZ", "Classic 350", "Duke", "Access", "Bullet"];
  const years = ["Any Year", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];
  const fuelTypes = ["Any Fuel Type", "Petrol", "Electric", "Hybrid"];

  return (
    <div className={`glass-card rounded-xl overflow-hidden p-1 transition-all duration-300 ${isCompact ? 'scale-95 shadow-md' : ''} ${className}`}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className={`flex flex-col md:flex-row md:items-center ${isCompact ? 'md:h-10' : ''}`}>
          {/* Bike Icon - Hide in compact mode */}
          {!isCompact && (
            <div className="px-3 py-2">
              <div className="relative">
                <Bike className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-muted-foreground h-5 w-5" />
                <select
                  name="make"
                  className="w-full pl-10 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-black dark:text-foreground appearance-none [&>option]:text-black"
                  value={searchParams.make}
                  onChange={handleChange}
                >
                  {makes.map((make) => (
                    <option key={make} value={make === "Any Make" ? "" : make}>
                      {make}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black dark:text-muted-foreground h-5 w-5 pointer-events-none" />
              </div>
            </div>
          )}
          <div className={`flex-1 ${isCompact ? 'px-2' : 'px-3 py-2'}`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-muted-foreground ${isCompact ? 'h-4 w-4' : 'h-5 w-5'}`} />
              <input
                type="text"
                name="query"
                placeholder={isCompact ? "Search Bikes or Brands " : "Search by make, model, or keyword..."}
                className={`w-full pl-10 pr-4 ${isCompact ? 'py-2 text-sm' : 'py-3'} bg-transparent border-0 focus:outline-none focus:ring-0 text-black dark:text-foreground placeholder:text-black dark:placeholder:text-muted-foreground`}
                value={searchParams.query}
                onChange={handleChange}
              />
            </div>
          </div>
          {!isCompact && (
            <div className="relative px-3 py-2 border-t md:border-t-0 md:border-l border-border">
              <Input
                name="location"
                placeholder="Location"
                className="border-none shadow-none hover:shadow-none pl-10 bg-background dark:bg-background"
                value={searchParams.location}
                onChange={handleChange}
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          )}
          {!isCompact && (
            <div className="p-2">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Search
              </button>
            </div>
          )}
        </div>
        {/* Advanced Search (optional, can be added for full parity) */}
      </form>
    </div>
  );
};

export default SearchBar;
