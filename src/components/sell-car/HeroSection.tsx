
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    // Check on load
    checkTheme();

    // Set up a mutation observer to detect theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const scrollToForm = () => {
    const formElement = document.getElementById("car-details-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      className={`relative w-full overflow-hidden h-[100vh] flex items-center mt-[-64px] pt-16 ${
        isDarkMode 
          ? "bg-[#010b1d]" 
          : "bg-[#e5e5f7] opacity-100"
      }`}
      style={{
        backgroundImage: isDarkMode 
          ? 'none' 
          : 'radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px)',
        backgroundSize: '10px 10px',
      }}
    >
      {/* Background with slight gradient overlay */}
      <div 
        className={`absolute inset-0 ${
          isDarkMode 
            ? "bg-gradient-to-r from-[#010b1d]/95 via-[#010b1d]/90 to-[#010b1d]/95" 
            : "bg-gradient-to-r from-white/10 via-transparent to-white/10"
        } z-0`}
      >
        {isDarkMode && <div className="absolute inset-0 dot-pattern opacity-10"></div>}
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10 flex flex-col md:flex-row items-center">
        {/* Left side - Motorcycle image */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full md:w-2/5 mb-8 md:mb-0"
        >
          <img 
            src={isDarkMode 
              ? "/resource-uploads/caf85c35-5a19-4ac7-a0e3-030286fb9aab.png" 
              : "/resource-uploads/a47ef4ec-4126-4237-8391-444437db8ec1.png"
            } 
            alt="Motorcycle with glowing lights" 
            className="w-full h-auto max-w-md mx-auto md:mx-0"
          />
        </motion.div>
        
        {/* Right side - Text content */}
        <div className="w-full md:w-3/5 text-center md:text-left md:pl-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 md:mb-6"
          >
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${
              isDarkMode ? "text-[#0d76fd]" : "text-[#444cf7]"
            }`}>
              Ready to Sell? <br className="hidden md:block" />
              We Make It Simple
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-lg md:text-xl mb-8 max-w-2xl ${
              isDarkMode ? "text-white/80" : "text-gray-700"
            }`}
          >
            Ready to sell your car or bike? Get a quick, fair AI-powered valuation and sell hassle-free — it's simple, secure, and fast!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-4"
          >
            <Button 
              onClick={scrollToForm}
              size="lg" 
              className={`${
                isDarkMode 
                  ? "bg-[#0d76fd] hover:bg-[#0d76fd]/90" 
                  : "bg-[#444cf7] hover:bg-[#444cf7]/90"
              } text-white text-lg py-6 px-10 rounded-full font-semibold`}
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <Button 
          variant="ghost" 
          onClick={scrollToForm}
          className={`${
            isDarkMode ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-900"
          } rounded-full`} 
          size="icon"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
};

export default HeroSection;
