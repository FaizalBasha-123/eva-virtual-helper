
import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { getCityImageUrl } from "@/utils/cityImages";
import { Link } from "react-router-dom";

interface CityCardProps {
  city: string;
  href: string;
}

const CityCard: React.FC<CityCardProps> = ({ city, href }) => (
  <Link 
    to={href}
    role="link"
    aria-label={`Explore selling in ${city}`}
    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl transition-all duration-200"
    tabIndex={0}
  >
    <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 cursor-pointer group border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-black/90">
      <div className="flex flex-col items-center gap-3">
        <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">{city}</h3>
        <div className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Click to explore
        </div>
      </div>
    </Card>
  </Link>
);

const CityPresence: React.FC = () => {
  const cities = [
    "Chennai",
    "Tiruchirappalli",
    "Coimbatore",
    "Madurai",
    "Bengaluru",
    "Hyderabad"
  ];

  // Utility to build clean URLs from city names
  const cityToUrl = (city: string) =>
    `/sell/${city.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <section className="py-16 px-4 bg-[#F1F0FB] dark:bg-black/20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          We're Active in These Cities
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Sell your vehicle easily in any of our operational cities with doorstep service and instant payment
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {cities.map((city, index) => (
            <CityCard key={index} city={city} href={cityToUrl(city)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityPresence;

