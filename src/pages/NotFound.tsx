import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

// Snowflake animation helper
const SNOWFLAKE_COUNT = 50;
const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [snowflakes, setSnowflakes] = useState(
    Array.from({ length: SNOWFLAKE_COUNT }, () => ({
      left: getRandom(0, 100),
      top: getRandom(0, 100),
      speed: getRandom(0.5, 1.5),
      drift: getRandom(-0.5, 0.5),
      size: getRandom(1, 3),
    }))
  );
  const isMobile = useIsMobile();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Animate snowflakes
  useEffect(() => {
    const interval = setInterval(() => {
      setSnowflakes((flakes) =>
        flakes.map((flake) => {
          let newTop = flake.top + flake.speed;
          let newLeft = flake.left + flake.drift;
          if (newTop > 100) newTop = 0;
          if (newLeft < 0) newLeft = 100;
          if (newLeft > 100) newLeft = 0;
          return { ...flake, top: newTop, left: newLeft };
        })
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#10131a] overflow-hidden relative text-white">
      {/* Animated Snow Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {snowflakes.map((flake, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-70"
            style={{
              left: `${flake.left}%`,
              top: `${flake.top}%`,
              width: `${flake.size * 2}px`,
              height: `${flake.size * 2}px`,
              background: "#e0e6f7",
              filter: "blur(0.5px)",
              transition: "none",
            }}
          />
        ))}
      </div>

      {/* Static Moon (no parallax) */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-200 rounded-full shadow-lg opacity-80 z-10" />

      {/* Road */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#23263a] to-[#23263a]/80 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent animate-pulse"></div>
        {/* Road lines */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-yellow-400/60">
          <div className="flex space-x-8 animate-pulse">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-8 h-1 bg-yellow-400"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Broken Car */}
      <div className="absolute bottom-32 left-1/3 transform -translate-x-1/2 z-10">
        {/* Car Body */}
        <div className="relative">
          <div className="w-32 h-16 bg-red-600 rounded-lg shadow-lg animate-bounce" style={{ animationDuration: "3s" }}>
            {/* Car Windows */}
            <div className="absolute top-2 left-4 w-6 h-6 bg-blue-200 rounded opacity-70"></div>
            <div className="absolute top-2 right-4 w-6 h-6 bg-blue-200 rounded opacity-70"></div>
            {/* Hazard Lights */}
            <div className="absolute -left-1 top-6 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
            <div className="absolute -right-1 top-6 w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
          </div>
          {/* Wheels */}
          <div className="absolute -bottom-2 left-2 w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-600"></div>
          <div className="absolute -bottom-2 right-2 w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-600"></div>
          {/* Steam/Smoke */}
          <div className="absolute -top-8 left-16">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gray-300 rounded-full opacity-60 animate-bounce"
                style={{
                  left: `${i * 3}px`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </div>
        </div>
        {/* Mechanic Character */}
        <div className="absolute -right-16 bottom-0">
          <div className="w-8 h-12 bg-blue-500 rounded-t-full animate-pulse">
            {/* Head */}
            <div className="absolute -top-4 left-1 w-6 h-6 bg-yellow-200 rounded-full"></div>
            {/* Tool */}
            <div className="absolute -right-2 top-2 w-1 h-6 bg-gray-400 rotate-45 animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Flickering 404 Sign */}
      <div className="absolute top-20 right-1/4 transform rotate-12 z-10">
        <div className="bg-yellow-400 p-4 rounded-lg shadow-lg animate-pulse border-4 border-yellow-600">
          <div className="text-black font-bold text-xl">404</div>
          <div className="text-black text-sm">Page Not Found</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="max-w-md mx-auto space-y-8">
          {/* Animated Title */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white animate-pulse">
              4<span className="text-yellow-500">0</span>4
            </h1>
            <h2 className="text-2xl font-semibold text-gray-300 animate-fade-in">
              Oops! Looks like your journey hit a roadblock
            </h2>
            <p className="text-gray-400 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              Don't worry, our virtual mechanic is on the way! 
              Let's get you back on track to find your perfect vehicle.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="space-y-4 animate-fade-in" style={{ animationDelay: "1s" }}>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search for cars, bikes, or pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-[#181c27] border-[#23263a] text-white placeholder-gray-400 backdrop-blur-sm"
              />
              <Button type="submit" size="icon" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <Button onClick={handleGoHome} className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg transition-all duration-300">
              Home
            </Button>
            <Button onClick={() => navigate('/search-used-cars')} className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg transition-all duration-300">
              Used Cars
            </Button>
            <Button onClick={() => navigate('/search-used-bikes')} className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg transition-all duration-300">
              Used Bikes
            </Button>
            <Button onClick={() => navigate('/contact-us')} className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg transition-all duration-300">
              Contact Us
            </Button>
            <Button onClick={() => navigate('/about-us')} className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg transition-all duration-300">
              About Us
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default NotFound;
