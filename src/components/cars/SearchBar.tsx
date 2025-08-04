
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, MapPin, CalendarIcon, Fuel, DollarSign, Car } from "lucide-react";
import LocationInput from "./LocationInput";

interface SearchBarProps {
  className?: string;
  isCompact?: boolean;
}

const SearchBar = ({ className = "", isCompact = false }: SearchBarProps) => {
  const navigate = useNavigate();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const [searchParams, setSearchParams] = useState({
    vehicleType: "Car",
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
  
  const vehicleTypes = ["Car", "Bike"];
  const makes = ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi", "Tesla", "Volkswagen", "Hyundai"];
  const models = ["Any Model", "Corolla", "Civic", "F-150", "3 Series", "C-Class", "A4", "Model 3", "Golf", "Elantra"];
  const years = ["Any Year", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];
  const fuelTypes = ["Any Fuel Type", "Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
  
  // Handle location click
  const handleLocationClick = () => {
    // We'll trigger the city modal here
    const cityModal = document.getElementById("city-modal");
    if (cityModal) {
      const openModalButton = cityModal.querySelector("[data-modal-open]");
      if (openModalButton) {
        (openModalButton as HTMLButtonElement).click();
      }
    }
  };
  
  return (
    <div className={`glass-card rounded-xl overflow-hidden p-1 transition-all duration-300 ${isCompact ? 'scale-95 shadow-md' : ''} ${className}`}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className={`flex flex-col md:flex-row md:items-center ${isCompact ? 'md:h-10' : ''}`}>
          {!isCompact && (
            <div className="px-3 py-2">
              <div className="relative">
                <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-muted-foreground h-5 w-5" />
                <select
                  name="vehicleType"
                  className="w-full pl-10 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-black dark:text-foreground appearance-none cursor-pointer [&>option]:text-black"
                  value={searchParams.vehicleType}
                  onChange={handleChange}
                >
                  {vehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
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
                placeholder={isCompact ? "Search Cars or Brands " : "Search by make, model, or keyword..."}
                className={`w-full pl-10 pr-4 ${isCompact ? 'py-2 text-sm' : 'py-3'} bg-transparent border-0 focus:outline-none focus:ring-0 text-black dark:text-foreground placeholder:text-black dark:placeholder:text-muted-foreground`}
                value={searchParams.query}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {!isCompact && (
            <div className="relative px-3 py-2 border-t md:border-t-0 md:border-l border-border">
              <LocationInput 
                onClick={handleLocationClick} 
                className="border-none shadow-none hover:shadow-none"
              />
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
        
        {!isCompact && (
          <>
            <div className="px-3 py-2">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="flex items-center text-sm font-medium text-black dark:text-muted-foreground hover:text-foreground transition-colors"
              >
                Advanced Search
                <ChevronDown 
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`} 
                />
              </button>
            </div>
            
            <div 
              className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-3 pb-3 overflow-hidden transition-all duration-300 ease-in-out ${
                isAdvancedOpen ? 'max-h-96 opacity-100 pt-3' : 'max-h-0 opacity-0 pt-0'
              }`}
            >
              <div>
                <label className="block text-sm font-medium text-black dark:text-muted-foreground mb-1">Model</label>
                <select
                  name="model"
                  className="w-full p-2 rounded-md glass-input focus:outline-none focus:ring-1 focus:ring-primary text-black dark:text-foreground [&>option]:text-black"
                  value={searchParams.model}
                  onChange={handleChange}
                >
                  {models.map((model) => (
                    <option key={model} value={model === "Any Model" ? "" : model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black dark:text-muted-foreground mb-1">Min Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-muted-foreground h-4 w-4" />
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    className="w-full pl-9 p-2 rounded-md glass-input focus:outline-none focus:ring-1 focus:ring-primary text-black dark:text-foreground placeholder:text-black dark:placeholder:text-muted-foreground"
                    value={searchParams.minPrice}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black dark:text-muted-foreground mb-1">Max Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-muted-foreground h-4 w-4" />
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    className="w-full pl-9 p-2 rounded-md glass-input focus:outline-none focus:ring-1 focus:ring-primary text-black dark:text-foreground placeholder:text-black dark:placeholder:text-muted-foreground"
                    value={searchParams.maxPrice}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black dark:text-muted-foreground mb-1">Min Year</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-muted-foreground h-4 w-4" />
                  <select
                    name="minYear"
                    className="w-full pl-9 p-2 rounded-md glass-input focus:outline-none focus:ring-1 focus:ring-primary text-black dark:text-foreground appearance-none [&>option]:text-black"
                    value={searchParams.minYear}
                    onChange={handleChange}
                  >
                    {years.map((year) => (
                      <option key={year} value={year === "Any Year" ? "" : year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black dark:text-muted-foreground mb-1">Fuel Type</label>
                <div className="relative">
                  <Fuel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-muted-foreground h-4 w-4" />
                  <select
                    name="fuelType"
                    className="w-full pl-9 p-2 rounded-md glass-input focus:outline-none focus:ring-1 focus:ring-primary text-black dark:text-foreground appearance-none [&>option]:text-black"
                    value={searchParams.fuelType}
                    onChange={handleChange}
                  >
                    {fuelTypes.map((fuel) => (
                      <option key={fuel} value={fuel === "Any Fuel Type" ? "" : fuel}>
                        {fuel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
