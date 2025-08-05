import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BuyCar from "./pages/BuyCar";
import BuyBikes from "./pages/BuyBikes";
import Sell from "./pages/Sell";
import AI from "./pages/AI";
import { createCSSVariables } from "./lib/utils";
import { VehicleProvider } from "./context/VehicleContext";
import { AuthProvider } from "./context/AuthContext";
import CarDetail from "./pages/CarDetail";
import BikeDetail from "./pages/BikeDetail";
import UsedCarDetail from "./pages/UsedCarDetail";
import UsedBikeDetail from "./pages/UsedBikeDetail";
import SellCity from "./pages/SellCity";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AdminUploads from "@/pages/AdminUploads";
import Appointment from "@/pages/appointment";
import AboutUs from "./pages/AboutUs";
import Profile from "./pages/Profile";
import Posted from "@/components/sell-page/Posted";
import SEOProvider from "./components/seo/SEOProvider";
import PhoneAuthModal from "@/components/auth/PhoneAuthModal";
import SocialMediaRedirect from "@/components/seo/SocialMediaRedirect";

// Import other pages
import Favourites from "./pages/Favourites";
import Appointments from "./pages/Appointments";
import Bookings from "./pages/Bookings";
import DealerDetails from "./pages/DealerDetails";
import ApplyDealerPage from "./pages/ApplyDealer";
import DealerDashboard from "./pages/DealerDashboard";
import Dealers from "./pages/Dealers";
import Partner from "./pages/Partner";
import Buy from "./pages/Buy";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialize CSS variables for animations
    createCSSVariables();
  }, []);

  // Global sign-in modal logic
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const handleOpenModal = () => setModalOpen(true);
    window.addEventListener('openSignInModal', handleOpenModal);
    return () => window.removeEventListener('openSignInModal', handleOpenModal);
  }, []);

  return (
    <SEOProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <VehicleProvider>
            <SocialMediaRedirect />
            <Toaster />
            <Sonner />
            <PhoneAuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
            <div className="w-full">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<Navigate to="/about-us" replace />} />
                <Route path="/about-us" element={<AboutUs />} />
                
                {/* New SEO-friendly dynamic routes */}
                <Route path="/used-car-details/:slug" element={<UsedCarDetail />} />
                <Route path="/used-bike-details/:slug" element={<UsedBikeDetail />} />
                
                {/* SEO-friendly routes */}
                <Route path="/search-used-cars" element={<BuyCar />} />
                <Route path="/search-used-bikes" element={<BuyBikes />} />
                <Route path="/search" element={<Navigate to='/search-used-cars' replace />} />
                <Route path="/search?type=car" element={<Navigate to='/search-used-cars' replace />} />
                <Route path="/search?type=bike" element={<Navigate to='/search-used-bikes' replace />} />
                
                {/* Legacy routes with 301 redirects to new slug format */}
                <Route path="/used-car/:id" element={<CarDetail />} />
                <Route path="/used-bike/:id" element={<BikeDetail />} />
                
                {/* 301 Redirects for SEO preservation */}
                <Route path="/bikes" element={<Navigate to="/search?type=bike" replace />} />
                <Route path="/buy/:id" element={<Navigate to="/used-car/:id" replace />} />
                <Route path="/bike/:id" element={<Navigate to="/used-bike/:id" replace />} />
                
                {/* Other existing routes */}
                <Route path="/sell-car" element={<Sell />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/sell/:city" element={<SellCity />} />
                <Route path="/ai" element={<AI />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/contact-us" element={<Contact />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/admin-uploads" element={<AdminUploads />} />
                <Route path="/posting" element={<Appointment />} />
                
                {/* New routes for authenticated user pages */}
                <Route path="/favourites" element={<Favourites />} />
                <Route path="/myads" element={<Appointments />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/partner" element={<Partner />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/dealerdetails" element={<DealerDetails />} />
                <Route path="/dealer-dashboard" element={<DealerDashboard />} />
                <Route path="/apply-dealer" element={<ApplyDealerPage />} />
                <Route path="/dealers" element={<Dealers />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/posted" element={<Posted />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </VehicleProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SEOProvider>
  );
}

export default App;
