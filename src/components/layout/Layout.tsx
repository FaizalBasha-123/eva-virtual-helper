import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTopButton from "../ui/ScrollToTopButton";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileHeader from "../mobile/MobileHeader";
import MobileBottomNav from "../mobile/MobileBottomNav";
import FloatingWhatsappButton from "@/components/appointment/FloatingWhatsappButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";

const Layout = ({ children, mobilePadding = true }) => {
  // This useEffect ensures scroll is reset when Layout is mounted (which happens on each page change)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isMobile = useIsMobile();
  const location = useLocation();

  // Disable mobile top padding for the mobile home page and sell page
  const noMobilePaddingPaths = ["/", "/sell"];
  const disableMobilePadding = noMobilePaddingPaths.includes(location.pathname);

  // Don't render anything until we know if it's mobile or not
  if (isMobile === undefined) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        {/* Show desktop header on non-mobile, mobile header on mobile */}
        <div className="hidden md:block">
          <Header />
        </div>
        <div className="block md:hidden">
          <MobileHeader currentPath={location.pathname} />
        </div>
        
        <main className="flex-1">
          {/* Content with paddings adjusted for mobile */}
          <div className={`w-full mx-auto ${isMobile && mobilePadding && !disableMobilePadding ? 'pt-14' : ''}`}>  
            {children}
          </div>
        </main>
        
        {/* Show desktop footer on non-mobile */}
        <div className={`${isMobile ? 'pb-16' : ''}`}>
          <Footer />
        </div>
        
        {/* Show mobile bottom nav on all pages for mobile devices */}
        {isMobile && <MobileBottomNav />}
        
        <ScrollToTopButton />
        
        {/* Global FloatingWhatsappButton - appears on all pages */}
        <FloatingWhatsappButton />
      </div>
    </TooltipProvider>
  );
};

export default Layout;
