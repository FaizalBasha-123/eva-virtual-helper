import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

const Posted: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 sm:p-12 max-w-lg w-full flex flex-col items-center text-center">
        <div className="mb-6">
          <svg width="80" height="80" fill="none" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="40" fill="#F97316" fillOpacity="0.1" />
            <path d="M28 41.5L36.5 50L52 34.5" stroke="#F97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Thank You for Reaching Us!</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Our team will contact you soon.<br />
          <span className="font-semibold text-primary">Have a Great Deal!</span>
        </p>
        <Button
          className="w-full max-w-xs bg-primary text-white text-lg font-semibold py-3 rounded-xl shadow-md hover:bg-primary/90 transition"
          onClick={() => navigate("/")}
        >
          Return to Home
        </Button>
      </div>
      
      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Posted; 
