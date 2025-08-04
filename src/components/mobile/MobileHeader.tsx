import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, ChevronDown, ChevronRight, LogOut } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useAuth } from "@/context/AuthContext";
import AuthButtons from "../auth/AuthButtons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "../ui/separator";

// Accept currentPath as a prop
const MobileHeader = ({ currentPath }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [openDropdowns, setOpenDropdowns] = useState<{
    cars: boolean;
    bikes: boolean;
  }>({
    cars: false,
    bikes: false,
  });
  const [isScrolled, setIsScrolled] = useState(false);

  // Determine if we are on home or sell page
  const isSpecialPage = currentPath === "/" || currentPath === "/sell";

  const iconColor = isSpecialPage && !isScrolled ? "white" : undefined;

  const toggleDropdown = (dropdown: 'cars' | 'bikes') => {
    setOpenDropdowns({
      ...openDropdowns,
      [dropdown]: !openDropdowns[dropdown],
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAuthenticatedNavigation = (targetPath: string) => {
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      // User is signed in, proceed with navigation
      navigate(targetPath);
    } else {
      // User is not signed in, open sign-in modal
      window.dispatchEvent(new CustomEvent('openSignInModal'));
        // Store the target path for redirect after sign-in
        localStorage.setItem('redirectAfterSignIn', targetPath);
    }
  };

  // Listen for sign-in completion
  useEffect(() => {
    const handleSignInComplete = () => {
      setIsSignInModalOpen(false);
      const redirectPath = localStorage.getItem('redirectAfterSignIn');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterSignIn');
        navigate(redirectPath);
      }
    };
    const handleModalClose = () => {
      setIsSignInModalOpen(false);
    };
    window.addEventListener('signInComplete', handleSignInComplete);
    window.addEventListener('modalClosed', handleModalClose);
    return () => {
      window.removeEventListener('signInComplete', handleSignInComplete);
      window.removeEventListener('modalClosed', handleModalClose);
    };
  }, [navigate]);

  // Hide/show header on scroll (like MobileBottomNav)
  const [visible, setVisible] = useState(true);
  const lastScrollY = React.useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 250) {
        setVisible(true);
      } else {
        if (currentScrollY > lastScrollY.current) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      }
      lastScrollY.current = currentScrollY;
      setIsScrolled(currentScrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800" : "bg-transparent"
    } mobile-header:hidden ${visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo and brand name side-by-side */}
        <Link to="/" className="flex items-center">
          <img 
            src="/resource-uploads/a47ef4ec-4126-4237-8391-444437db8ec1.png" 
            alt="VahaanXchange Logo" 
            className="h-8 w-auto"
          />
          <span className="inline-block bg-gradient-to-r from-orange-600 via-[#552277] to-blue-700 bg-clip-text text-transparent font-bold ml-2 text-sm">VahaanXchange</span>
        </Link>

        {/* Search and Menu */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            aria-label="Open search"
          >
            <Search className="h-5 w-5" color={iconColor} />
          </Button>

          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" aria-haspopup="dialog">
                <Menu className="h-5 w-5" color={iconColor} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-[350px] p-0 pt-6">
              <ScrollArea className="h-full pt-2 pb-16">
                <div className="flex flex-col h-full px-4">
                  <div className="mb-6 flex justify-center">
                    {currentUser ? (
                      <div className="flex items-center space-x-2 py-4">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium">{currentUser.displayName || "User"}</p>
                          <p className="text-xs text-gray-500">{currentUser.phoneNumber}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full py-4">
                        <AuthButtons className="w-full justify-center" />
                      </div>
                    )}
                  </div>

                  <nav className="space-y-1">
                    {/* Dealer Dashboard button if dealerName exists in localStorage */}
                    {typeof window !== 'undefined' && localStorage.getItem('dealerName') && (
                      <button
                        onClick={() => navigate('/dealer-dashboard')}
                        className="block w-full text-left px-2 py-3 font-semibold text-primary hover:bg-primary/10 rounded-md"
                      >
                        {localStorage.getItem('dealerName')}
                      </button>
                    )}
                    <button 
                      onClick={() => handleAuthenticatedNavigation('/profile')}
                      className="block w-full text-left px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      Profile
                    </button>
                    <Link to="/" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                      Home
                    </Link>
                    
                    <Link to="/search-used-cars" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                      Buy Car
                    </Link>

                    <Link to="/search-used-bikes" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                      Buy Bike
                    </Link>

                    <Link to="/sell" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                      Post Ad
                    </Link>

                    <Separator className="my-2" />

                    <button 
                      onClick={() => handleAuthenticatedNavigation('/favourites')}
                      className="block w-full text-left px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      Favourites
                    </button>
                    <button 
                      onClick={() => handleAuthenticatedNavigation('/myads')}
                      className="block w-full text-left px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      My Ads
                    </button>
                    <button 
                      onClick={() => handleAuthenticatedNavigation('/bookings')}
                      className="block w-full text-left px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      My Bookings
                    </button>
                    <button 
                      onClick={() => handleAuthenticatedNavigation('/partner')}
                      className="block w-full text-left px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      Become a Partner
                    </button>
                  </nav>

                  {currentUser && (
                    <div className="mt-auto pt-4 pb-6">
                      <Button
                        variant="destructive"
                        className="w-full flex items-center justify-center"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchVisible && (
        <div className="px-4 py-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search cars, bikes..." 
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setIsSearchVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
