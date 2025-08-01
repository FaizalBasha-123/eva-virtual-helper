import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Bike } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import SEOHead from "@/components/seo/SEOHead";

const Buy = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  // Use window width detection for mobile (consistent with other components)
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 770;
      console.log('Buy page - Window width:', window.innerWidth, 'Is mobile:', mobile);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Redirect to homepage if not on mobile
  useEffect(() => {
    console.log('Buy page - isMobile state:', isMobile);
    if (isMobile === false) {
      console.log('Buy page - Redirecting to homepage');
      navigate("/");
    }
  }, [isMobile, navigate]);

  // If we're still determining if it's mobile, don't render anything
  if (isMobile === undefined) {
    return null;
  }

  // If it's not mobile, don't render anything
  if (isMobile === false) {
    return null;
  }

  return (
    <Layout>
      <SEOHead
        title="Buy Used Cars & Bikes – VahaanXchange"
        description="Choose your perfect used car or bike from thousands of verified listings. Start your journey with VahaanXchange."
        canonicalUrl="https://www.vahaanxchange.com/buy"
      />
      <div className="min-h-screen pt-8 pb-24 px-4 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-3 text-blue bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Start Your New Journey with Perfect Ride <br/>🚗🏍️
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Choose a vehicles for you
            </p>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={() => navigate("/search-used-cars")}
                className="w-full py-8 rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-row items-center">
                  <span className="text-lg font-medium">Buy Used Cars</span>
                </div>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={() => navigate("/search-used-bikes")}
                variant="secondary"
                className="w-full py-8 rounded-xl dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-row items-center">
                  <span className="text-lg font-medium">Buy Used Bikes</span>
                </div>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Browse through thousands of verified vehicles
              <br />
              with complete history and inspection reports
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Buy;
