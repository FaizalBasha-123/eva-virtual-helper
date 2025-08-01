
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileNavVisible, setMobileNavVisible] = useState(true);
  const [mobileHeaderVisible, setMobileHeaderVisible] = useState(true);
  const isMobile = useIsMobile();

  // Use a module-level variable for lastScrollY
  const scrollState = {
    lastScrollY: 0,
    lastDirection: null,
  };
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      let direction = null;
      if (currentScrollY > scrollState.lastScrollY) {
        direction = "down";
      } else if (currentScrollY < scrollState.lastScrollY) {
        direction = "up";
      }
      // Mobile header/nav logic
      if (currentScrollY <= 300) {
        setMobileNavVisible(true);
        setMobileHeaderVisible(true);
        setIsVisible(false);
      } else {
        if (direction === "down") {
          setMobileNavVisible(false);
          setMobileHeaderVisible(false);
          setIsVisible(false); // Show button when scrolling down
        } else if (direction === "up") {
          setMobileNavVisible(true);
          setMobileHeaderVisible(true);
          setIsVisible(true); // Hide button when scrolling up
        }
      }
      scrollState.lastScrollY = currentScrollY;
      scrollState.lastDirection = direction;
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Adjust position for mobile to prevent overlap with bottom navigation
  const mobileBottomPosition = isMobile ? "bottom-24" : "bottom-6 md:bottom-8";

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-6 md:right-8 z-50 px-4 py-2 
        rounded-full bg-black text-white dark:bg-white dark:text-black
        shadow-md hover:shadow-lg 
        transition-all duration-300 flex items-center gap-2 text-sm font-medium
        ${mobileBottomPosition}
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-label="Back to top"
    >
      <ChevronUp size={16} />
      Reach top
    </button>
  );
};

export default ScrollToTopButton;
