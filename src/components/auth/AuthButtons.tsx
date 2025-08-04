import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Calendar, Star, Car, MessageSquare, Bell, FileText, CircleDollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

interface AuthButtonsProps {
  className?: string;
}

interface MenuOption {
  id: number;
  title: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ className }) => {
  const { currentUser, userProfile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [intendedPath, setIntendedPath] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // Menu options for both signed-in and non-signed-in users
  const menuOptions: MenuOption[] = [
    { 
      id: 1, 
      title: "Profile", 
      icon: <Star className="h-5 w-5 text-gray-600" />,
      path: "/profile"
    },
    { 
      id: 2, 
      title: "Favourites", 
      icon: <Star className="h-5 w-5 text-gray-600" />,
      path: "/favourites"
    },
    { 
      id: 3, 
      title: "My Ads", 
      icon: <Calendar className="h-5 w-5 text-gray-600" />,
      path: "/myads",
      badge: "SELL" 
    },
    { 
      id: 4, 
      title: "My Bookings", 
      icon: <Car className="h-5 w-5 text-gray-600" />,
      path: "/bookings",
      badge: "BUY" 
    },
    { 
      id: 4, 
      title: "Become a Partner", 
      icon: <Bell className="h-5 w-5 text-gray-600" />,
      path: "/partner"
    },
  ];

  const handleShowAuthModal = () => {
    window.dispatchEvent(new CustomEvent('openSignInModal'));
    setShowDropdown(false);
  };
  
  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
    
    // If there was an intended path after authentication, navigate there
    if (intendedPath && currentUser) {
      navigate(intendedPath);
      setIntendedPath(null);
    }
  };

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    // Set timeout to hide dropdown after 250ms
    hoverTimeoutRef.current = window.setTimeout(() => {
      setShowDropdown(false);
    }, 250);
  };

  // Handle menu item click
  const handleMenuItemClick = (path: string) => {
    if (currentUser) {
      // If authenticated, navigate directly
      navigate(path);
    } else {
      // If not authenticated, store intended path and show auth modal
      setIntendedPath(path);
      handleShowAuthModal();
    }
    setShowDropdown(false);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current !== null) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // For authenticated users, we show the avatar dropdown
  if (currentUser && userProfile) {
    return (
      <div className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={userProfile.photoURL || undefined} 
                  alt={userProfile.displayName || "User"}
                />
                <AvatarFallback>
                  {(() => {
                    const localName = typeof window !== 'undefined' ? localStorage.getItem('user_name') : null;
                    if (localName && localName.trim().length > 0) {
                      return localName.trim().charAt(0).toUpperCase();
                    }
                    return userProfile.displayName
                      ? userProfile.displayName.charAt(0).toUpperCase()
                      : "U";
                  })()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {menuOptions.map((option) => (
              <DropdownMenuItem 
                key={option.id} 
                className="cursor-pointer"
                onClick={() => handleMenuItemClick(option.path)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span className="text-sm font-medium">{option.title}</span>
                  </div>
                  {option.badge && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">{option.badge}</span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // For non-authenticated users, we show the sign-in button with dropdown
  return (
    <>
      <div 
        className={`relative ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Button 
          variant="default"
          className="bg-blue-500 hidden lg:inline-block hover:bg-blue-600 text-white font-medium px-4 sm:px-6 py-1 sm:py-2 rounded-full transition-colors duration-300"
        >
          Sign In
        </Button>
        <Button 
          variant="default"
          className="bg-blue-500 lg:hidden hover:bg-blue-600 text-white font-medium px-4 sm:px-6 py-1 sm:py-2 rounded-full transition-colors duration-300"
          onClick={handleShowAuthModal}
        >
          Sign In
        </Button>
        
        {showDropdown && (
          <div className="hidden lg:inline-block absolute right-0 top-full z-50 mt-2 w-64 sm:w-80 rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 p-4">
            
            <div className="space-y-3">
              {menuOptions.map((option) => (
                <div 
                  key={option.id} 
                  className="flex items-center justify-between py-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded"
                  onClick={() => handleMenuItemClick(option.path)}
                >
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span className="text-sm font-medium">{option.title}</span>
                  </div>
                  {option.badge && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">{option.badge}</span>
                  )}
                </div>
              ))}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3"></div>
              
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 mb-4 py-4 sm:py-6 text-base sm:text-lg"
                onClick={handleShowAuthModal}
              >
                SIGN IN/SIGN UP
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AuthButtons;
