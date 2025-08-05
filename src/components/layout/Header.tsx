import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import SearchBar from "../cars/SearchBar";
import { useVehicle } from "@/context/VehicleContext";
import AuthButtons from "../auth/AuthButtons";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import MobileHeader from "../mobile/MobileHeader";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicleType } = useVehicle();
  const { userProfile } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
      
      const heroHeight = window.innerHeight * 0.4;
      setShowSearchBar(scrollPosition > heroHeight);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const getActiveItem = () => {
    const { pathname, search } = location;
    const searchParams = new URLSearchParams(search);
    const type = searchParams.get('type');
    
    if (pathname === '/') return 'home';
    // if (pathname.includes('/about') || pathname.includes('/services')) return 'services';
    if (pathname === '/search' && type === 'car') return 'cars';
    if (pathname === '/search' && type === 'bike') return 'bikes';
    if (pathname.includes('/cars-buy-section')) return 'cars';
    if (pathname.includes('/bikes')) return 'bikes';
    
    if (pathname.includes('/sell')) {
      return vehicleType === 'car' ? 'cars' : 'bikes';
    }
    
    return null;
  };

  const activeItem = getActiveItem();

  const isNavItemActive = (item: string) => {
    if (hoveredItem) return hoveredItem === item;
    return activeItem === item;
  };

  const handleProfessionalServicesClick = () => {
    navigate('/about');
    setTimeout(() => {
      const findProfessionalsButton = document.getElementById('find-professionals');
      if (findProfessionalsButton) {
        findProfessionalsButton.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleSellNavigation = (mode: 'car' | 'bike') => {
    navigate(`/sell?mode=${mode}`);
  };

  return (
    <>
      <div className="mobile-header:hidden">
        <MobileHeader currentPath="/" />
      </div>
      <header 
        className={`hidden mobile-header:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm" 
            : "py-5 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="text-2xl font-bold text-primary flex items-center gap-2 group"
            >
              <img 
                src="/resource-uploads/a47ef4ec-4126-4237-8391-444437db8ec1.png" 
                alt="VahaanXchange Logo" 
                className="h-12 w-auto"
              />
              <span className="inline-block bg-gradient-to-r from-orange-600 via-[#552277] to-blue-700 bg-clip-text text-transparent font-bold">VahaanXchange</span>
            </Link>
            <div 
              ref={searchBarRef}
              className={`absolute left-[40%] transform -translate-x-1/2 transition-all duration-500 ease-out ${
                showSearchBar 
                  ? 'opacity-100 scale-100 top-1/2 -translate-y-1/2' 
                  : 'opacity-0 scale-95 top-0 -translate-y-full pointer-events-none'
              }`}
            >
              <SearchBar isCompact={true} className="w-64 md:w-72 lg:w-80 xl:w-96 shadow transition-all" />
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              {/* Dealer Dashboard button if dealerName exists in localStorage */}
              {typeof window !== 'undefined' && localStorage.getItem('dealerName') && (
                <Button
                  variant="outline"
                  className="font-semibold text-primary border-white bg-gray-100"
                  onClick={() => navigate('/dealer-dashboard')}
                >
                  {localStorage.getItem('dealerName')}
                </Button>
              )}
              <Link 
                to="/" 
                className={`nav-link font-medium transition-colors ${
                  isNavItemActive('home') 
                    ? 'text-primary link-underline after:scale-x-100 after:origin-bottom-left' 
                    : 'text-foreground hover:text-primary link-underline'
                }`}
                onMouseEnter={() => setHoveredItem('home')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Home
              </Link>
                <Link
                  to="/search-used-cars"
                  className={`nav-link font-medium transition-colors flex items-center ${location.pathname === '/search-used-cars' ? 'text-primary link-underline after:scale-x-100 after:origin-bottom-left' : 'text-foreground hover:text-primary link-underline'}`}
              >
                Buy Cars
              </Link>
              <Link
                  to="/search-used-bikes"
                  className={`nav-link font-medium transition-colors flex items-center ${location.pathname === '/search-used-bikes' ? 'text-primary link-underline after:scale-x-100 after:origin-bottom-left' : 'text-foreground hover:text-primary link-underline'}`}
                >
                  Buy Bikes
                </Link>
              <Link
                  to="/dealers"
                  className={`nav-link font-medium transition-colors flex items-center ${location.pathname === '/dealer' ? 'text-primary link-underline after:scale-x-100 after:origin-bottom-left' : 'text-foreground hover:text-primary link-underline'}`}
                >
                  Dealer
                </Link>
              <div className="flex items-center space-x-4">
                <AuthButtons className="ml-2" />
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
