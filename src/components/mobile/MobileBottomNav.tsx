import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const { currentUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 40) {
        // Scrolling up, hide
        setVisible(false);
      } else {
        // Scrolling down or at top, show
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!currentUser) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('openSignInModal'));
    } else {
      // Directly navigate to profile page if user is logged in
      e.preventDefault();
      navigate("/profile");
    }
  };

  const handleFavouritesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) {
      window.dispatchEvent(new CustomEvent('openSignInModal'));
      return;
    }
    navigate("/favourites");
  };

  const handleMyAdsClick = (e: React.MouseEvent) => {
    if (!currentUser) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('openSignInModal'));
    } else {
      // Directly navigate to appointments page if user is logged in
      e.preventDefault();
      navigate("/myads");
    }
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('MobileBottomNav - Buy button clicked, navigating to /buy');
    navigate("/buy");
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 mobile-header:hidden transition-all duration-300 ease-in-out
      ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800`}>
      <div className="flex justify-around items-center h-16 px-2 relative">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("/") ? "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
          aria-label="Home"
        >
          <img 
            src="https://vahaanxchange-uploads.s3.ap-southeast-1.amazonaws.com/Mobile/navbar_home_icon.avif" 
            alt="" aria-hidden="true"
            className="h-6 w-6 mb-1" 
          />
          <span className="text-xs">Home</span>
        </Link>
        
        <a 
          href="#"
          onClick={handleBuyClick}
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("/buy") || isActive("/used-cars") || isActive("/bike-buy-section") || isActive("/search") ? 
            "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
          aria-label="Buy"
        >
          <img 
            src="https://vahaanxchange-uploads.s3.ap-southeast-1.amazonaws.com/Mobile/navbar_buy_icon.avif" 
            alt="" aria-hidden="true"
            className="h-6 w-6 mb-1" 
          />
          <span className="text-xs">Buy</span>
        </a>
        
        <Link 
          to="/sell" 
          className="flex flex-col items-center justify-center w-1/5 h-full"
          aria-label="Post Ad"
        >
          <div className="relative bg-white -top-2 dark:bg-gray-900 rounded-full p-2 shadow-lg">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-l from-pink-400 via-purple-500 to-orange-400">
              <img 
                src="https://vahaanxchange-uploads.s3.ap-southeast-1.amazonaws.com/Mobile/navbar_postad_icon.avif"
                alt="" aria-hidden="true"
                className="w-6 h-6"
              />
            </div>
          </div>
          <span className="text-xs mb-2 font-medium">Post Ad</span>
        </Link>
        
        {/* Modified: Using onClick handler instead of just Link */}
        <a 
          href="#"
          onClick={handleFavouritesClick}
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("/favourites") ? "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
          aria-label="Favourites"
        >
          <img 
            src="https://vahaanxchange-uploads.s3.ap-southeast-1.amazonaws.com/Mobile/navbar_favourites_icon.avif" 
            alt="" aria-hidden="true"
            className="h-6 w-6 mb-1" 
          />
          <span className="text-xs">Favourites</span>
        </a>
        
        {/* Updated: Profile now uses onClick handler */}
        <a 
          href="#"
          onClick={handleMyAdsClick}
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("/myads") ? "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
          aria-label="My Ads"
        >
          <img 
            src="https://vahaanxchange-uploads.s3.ap-southeast-1.amazonaws.com/Mobile/mobile_home_sell_icon.avif" 
            alt="" aria-hidden="true"
            className="h-6 w-6 mb-1" 
          />
          <span className="text-xs">My Ads</span>
        </a>
      </div>
    </div>
  );
};

export default MobileBottomNav;
