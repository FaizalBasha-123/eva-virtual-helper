import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import ManualEntryFormHome from "@/components/home/ManualEntryFormHome";
import PhotoUploadHome from "@/components/home/PhotoUploadHome";
import VehicleTypeToggle from "@/components/sell-page/VehicleTypeToggle";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import FeaturedCars from "@/components/cars/FeaturedCars";
import FeaturedBikes from "@/components/bikes/FeaturedBikes";
import {
  ArrowRight,
  Car,
  DollarSign,
  Handshake,
  Shield,
  Lock,
  Tag,
} from "lucide-react";
import AIFloatingButton from "@/components/ui/AIFloatingButton";
import SEOContent from "@/components/seo/SEOContent";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileHomeUI from "@/components/mobile/MobileHomeUI";
import Layout from "@/components/layout/Layout";
import { useCanonical } from "@/hooks/useCanonical";
import SEOHead from "@/components/seo/SEOHead";
import { useVehicle } from "@/context/VehicleContext";

const Index: React.FC = () => {
  const { vehicleType, setVehicleType } = useVehicle();
  const [showUploadPhotos, setShowUploadPhotos] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [api, setApi] = useState<ReturnType<typeof useEmblaCarousel>[1]>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const isMobile = useIsMobile();
  useCanonical("/");

  // Update dealerId in localStorage if phoneNumber is present
  useEffect(() => {
    const updateDealerInfo = async () => {
      const phoneNumber = localStorage.getItem('phoneNumber');
      if (phoneNumber) {
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data: dealerDetails, error: dealerError } = await supabase
            .from('dealer_details')
            .select('id, name')
            .eq('phone_number', parseInt(phoneNumber))
            .single();
          if (!dealerError && dealerDetails && dealerDetails.id) {
            localStorage.setItem('dealerId', dealerDetails.id.toString());
            if (dealerDetails.name) {
              localStorage.setItem('dealerName', dealerDetails.name);
            }
          }
        } catch (err) {
          console.error('Error fetching dealer info:', err);
        }
      }
    };
    updateDealerInfo();
  }, []);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.vahaanxchange.com"
      }
    ]
  };

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / 400);
  const formScale = Math.min(1.15, 1 + scrollY / 1000);
  const contentMarginTop = -80 - scrollY / 5;

  if (isMobile) {
    return (
      <Layout>
        <SEOHead
          title="Buy & Sell Used Cars & Bikes – VahaanXchange"
          description="India's trusted platform to buy and sell used vehicles with zero commission. Fast, secure, and verified listings across all major cities."
          canonicalUrl="https://www.vahaanxchange.com"
          breadcrumbSchema={breadcrumbSchema}
          openGraph={{
            title: "Buy & Sell Used Cars & Bikes – VahaanXchange",
            description: "India's trusted platform to buy and sell used vehicles with zero commission. Fast, secure, and verified listings across all major cities.",
            url: "https://www.vahaanxchange.com",
            image: "https://www.vahaanxchange.com/og-image.png"
          }}
          twitter={{
            card: "summary_large_image",
            title: "Buy & Sell Used Cars & Bikes – VahaanXchange",
            description: "India's trusted platform to buy and sell used vehicles with zero commission. Fast, secure, and verified listings across all major cities.",
            image: "https://www.vahaanxchange.com/og-image.png"
          }}
        />
        <MobileHomeUI />
        <AIFloatingButton />
        <div className="max-h-screen">
          <h1 className="sr-only">Buy or Sell Your Used Vehicle Online – VahaanXchange</h1>        
          <SEOContent 
            title="Why Choose VahaanXchange for Used Vehicles?"
            content="VahaanXchange is India's leading platform for buying and selling used cars and bikes with zero commission. We connect verified buyers and sellers directly, ensuring transparent pricing and secure transactions. Our AI-powered valuation system provides accurate market prices, while our comprehensive vehicle inspection reports give you complete confidence in your purchase. Whether you're looking for a budget-friendly hatchback, a premium sedan, or a reliable two-wheeler, our platform offers thousands of verified listings across all major Indian cities. Experience hassle-free vehicle trading with instant price quotes, detailed vehicle history, and secure payment processing. Join millions of satisfied customers who trust VahaanXchange for their vehicle buying and selling needs."
            keywords={["buy used cars", "sell used cars", "zero commission", "verified vehicle listings", "used bikes", "car valuation", "vehicle inspection"]}
          />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <SEOHead
        title="Buy & Sell Used Cars & Bikes – VahaanXchange"
        description="India's trusted platform to buy and sell used vehicles with zero commission. Fast, secure, and verified listings across all major cities."
        canonicalUrl="https://www.vahaanxchange.com"
        breadcrumbSchema={breadcrumbSchema}
        openGraph={{
          title: "Buy & Sell Used Cars & Bikes – VahaanXchange",
          description: "India's trusted platform to buy and sell used vehicles with zero commission. Fast, secure, and verified listings across all major cities.",
          url: "https://www.vahaanxchange.com",
          image: "https://www.vahaanxchange.com/og-image.png"
        }}
        twitter={{
          card: "summary_large_image",
          title: "Buy & Sell Used Cars & Bikes – VahaanXchange",
          description: "India's trusted platform to buy and sell used vehicles with zero commission. Fast, secure, and verified listings across all major cities.",
          image: "https://www.vahaanxchange.com/og-image.png"
        }}
      />
      <div className="bg-gradient-to-b from-[#1a237e] to-[#283593] dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <section
          className="relative pt-36 pb-16 px-4 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto"
          style={{ opacity: heroOpacity }}
        >
          <div className="max-w-xl z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Your Trusted Platform for{" "}
              <span className="text-orange-400">Zero-Commission</span> Deals
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              AI-powered price predictions. Aadhar-verified buyers & sellers.
              Transparent and secure.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <input
                className="px-4 py-2 rounded border border-gray-300 w-64"
                placeholder="Search for cars..."
              />
              <button className="ml-2 bg-orange-500 text-white px-6 py-2 rounded font-semibold">
                Search
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0 z-10">
            <img
              src="https://vahaanxchange-uploads.s3.ap-southeast-1.amazonaws.com/Home/home_hero.avif"
              alt="Handshake, car, bike, and 0% commission illustration"
              title="VahaanXchange Hero - Handshake, Car, Bike, Zero Commission"
              decoding="async"
              loading="eager"
              fetchPriority="high"
              className="rounded-lg shadow-2xl w-full max-w-md h-auto object-contain mb-4 md:mb-0 border-2 border-gray-700"
            />
          </div>
        </section>

        {/* Scrolling Content Block (Form + Old Content) */}
        <div
          className="relative z-10"
          style={{
            marginTop: `${contentMarginTop}px`,
          }}
        >
          {/* Form Panel */}
          <div className="w-full max-w-4xl mx-auto">
            <div
              className="rounded-xl shadow-2xl bg-white dark:bg-gray-800 text-card-foreground p-6 glowing-border max-w-xs sm:max-w-md md:max-w-2xl xl:max-w-4xl mx-auto gap-2 sm:gap-4 md:gap-6"
              style={{
                transform: `scale(${formScale})`,
                transformOrigin: "bottom",
              }}
            >
              <div className="flex items-center justify-around mb-4 w-full">
                <div className="text-xl font-semibold text-foreground">
                  Wanna Sell ?
                </div>
                <div>
                  <VehicleTypeToggle
                    vehicleType={vehicleType}
                    onToggleChange={(value) => {
                      if (value === "car" || value === "bike") {
                        setVehicleType(value);
                      }
                    }}
                  />
                </div>
                <div className="text-xl font-semibold text-foreground">
                  Fill the Details
                </div>
              </div>
              {!showUploadPhotos ? (
                <ManualEntryFormHome
                  vehicleType={vehicleType}
                  onVehicleTypeChange={setVehicleType}
                  onUploadPhotos={() => setShowUploadPhotos(true)}
                />
              ) : (
                <PhotoUploadHome onBack={() => setShowUploadPhotos(false)} />
              )}
            </div>
          </div>

          {/* Old Home Page Content */}
          <div className="bg-background mt-12">
            <div className="bg-gray-100 dark:bg-gray-800 pt-8">
              {/* Why VahaanXchange is Different Section */}
              <div className="container mx-auto px-2 sm:px-4 lg:px-2 my-8">
                <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 md:p-12">
                  <div className="text-center mb-10 md:mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                      Why VahaanXchange is Different
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      We're revolutionizing how vehicles are bought and sold in
                      India with our transparent, secure platform.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {/* Feature 1 - Zero Brokerage */}
                    <div className="glass-card p-6 rounded-xl hover-scale transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                          <DollarSign size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Zero Brokerage, Zero Commission
                          </h3>
                          <p className="text-muted-foreground">
                            No middlemen. Buyers and sellers connect directly –
                            no extra charges.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Feature 2 - Transparent Pricing */}
                    <div className="glass-card p-6 rounded-xl hover-scale transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                          <Car size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Transparent Pricing with AI-Powered Prediction
                          </h3>
                          <p className="text-muted-foreground">
                            Our smart price predictor suggests a fair market price
                            to help both parties decide confidently.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Feature 3 - Direct Negotiation */}
                    <div className="glass-card p-6 rounded-xl hover-scale transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                          <Handshake size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Direct Negotiation & Deal Finalization
                          </h3>
                          <p className="text-muted-foreground">
                            We don't interfere in your deal. You meet directly
                            and decide on the price yourself.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Feature 4 - Verified Buyers & Sellers */}
                    <div className="glass-card p-6 rounded-xl hover-scale transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                          <Shield size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Verified Buyers & Sellers
                          </h3>
                          <p className="text-muted-foreground">
                            Every buyer is Aadhar-verified. Every seller is
                            matched with their vehicle's RC name and Aadhar –
                            ensuring authenticity.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Feature 5 - Security & Trust */}
                    <div className="glass-card p-6 rounded-xl hover-scale transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                          <Lock size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Security & Trust Built-In
                          </h3>
                          <p className="text-muted-foreground">
                            With document verification and a monitored platform,
                            you can transact with peace of mind.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Feature 6 - No Hidden Charges */}
                    <div className="glass-card p-6 rounded-xl hover-scale transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                          <Tag size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            No Hidden Charges, Ever
                          </h3>
                          <p className="text-muted-foreground">
                            What you see is what you get. No last-minute
                            surprises.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Featured Cars Section */}
              <div className="container mx-auto px-2 sm:px-4 lg:px-2 my-8">
                <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 md:p-12">
                  <div className="relative">
                    <div
                      className="featured-cars-scroll flex overflow-x-auto gap-4 pb-2"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      <FeaturedCars />
                    </div>
                    {/* Horizontal scroll arrows for FeaturedCars */}
                    <button
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 text-foreground rounded-full p-2 shadow-md hover:bg-background z-10"
                      aria-label="Scroll left"
                      onClick={() => {
                        const el = document.querySelector('.featured-cars-scroll');
                        if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
                      }}
                      style={{ display: 'block' }}
                    >
                      <ArrowRight style={{ transform: 'rotate(180deg)' }} className="h-6 w-6" />
                    </button>
                    <button
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 text-foreground rounded-full p-2 shadow-md hover:bg-background z-10"
                      aria-label="Scroll right"
                      onClick={() => {
                        const el = document.querySelector('.featured-cars-scroll');
                        if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
                      }}
                      style={{ display: 'block' }}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="mt-10 text-center">
                    <Link
                      to="/search-used-cars"
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                    >
                      View all listings
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </section>
              </div>

              {/* Featured Bikes Section */}
              <div className="container mx-auto px-2 sm:px-4 lg:px-2 my-8">
                <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 md:p-12">
                  <div className="relative">
                    <div
                      className="featured-bikes-scroll flex overflow-x-auto gap-4 pb-2"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      <FeaturedBikes />
                    </div>
                    {/* Horizontal scroll arrows for FeaturedBikes */}
                    <button
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 text-foreground rounded-full p-2 shadow-md hover:bg-background z-10"
                      aria-label="Scroll left"
                      onClick={() => {
                        const el = document.querySelector('.featured-bikes-scroll');
                        if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
                      }}
                      style={{ display: 'block' }}
                    >
                      <ArrowRight style={{ transform: 'rotate(180deg)' }} className="h-6 w-6" />
                    </button>
                    <button
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 text-foreground rounded-full p-2 shadow-md hover:bg-background z-10"
                      aria-label="Scroll right"
                      onClick={() => {
                        const el = document.querySelector('.featured-bikes-scroll');
                        if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
                      }}
                      style={{ display: 'block' }}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="mt-10 text-center">
                    <Link
                      to="/search?type=bike"
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                    >
                      View all listings
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </section>
              </div>

              {/* Ready to Sell Section */}
              <div className="container mx-auto px-2 sm:px-4 lg:px-2 my-8">
                <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                  <Carousel
                    setApi={setApi}
                    className="w-full relative"
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {/* Car Slide */}
                      <CarouselItem className="md:basis-full">
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold mb-4">
                              Ready to Sell Your Car?
                            </h2>
                            <p className="text-muted-foreground mb-6">
                              List your car on VahaanXchange and reach thousands
                              of potential buyers in your area. It's quick, easy,
                              and free to get started.
                            </p>
                            <div>
                              <Link
                                to="/sell?mode=car"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-6"
                              >
                                Post Your Car Ad
                              </Link>
                            </div>
                          </div>
                          <div className="md:w-1/2 h-64 md:h-auto relative">
                            <img
                              src="https://vahaanxchange-uploads.s3.ap-southeast-1.amazonaws.com/Home/post_ad_car.webp"
                              alt="Selling your car"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </CarouselItem>

                      {/* Bike Slide */}
                      <CarouselItem className="md:basis-full">
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold mb-4">
                              Ready to Sell Your Bike?
                            </h2>
                            <p className="text-muted-foreground mb-6">
                              List your bike on VahaanXchange and connect with
                              passionate riders in your area. It's quick, easy,
                              and free to get started.
                            </p>
                            <div>
                              <Link
                                to="/sell?mode=bike"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-6"
                              >
                                Post Your Bike Ad
                              </Link>
                            </div>
                          </div>
                          <div className="md:w-1/2 h-64 md:h-auto relative">
                            <img
                              src="https://vahaanxchange-uploads.s3.ap-southeast-1.amazonaws.com/Home/post_ad_bike.webp"
                              alt="Selling your bike"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    </CarouselContent>

                    <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-10">
                      <CarouselPrevious className="h-8 w-8 md:h-10 md:w-10 bg-background/80 text-foreground backdrop-blur-sm border-background hover:bg-background" />
                    </div>

                    <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-10">
                      <CarouselNext className="h-8 w-8 md:h-10 md:w-10 bg-background/80 text-foreground backdrop-blur-sm border-background hover:bg-background" />
                    </div>

                    {/* Slide indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {Array.from({ length: count }).map((_, i) => (
                        <button
                          key={i}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            i === current - 1
                              ? "bg-primary w-4"
                              : "bg-primary/30"
                          )}
                          onClick={() => api?.scrollTo(i)}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </Carousel>
                </section>
              </div>

              {/* Testimonials Section */}
              <div className="container mx-auto px-2 sm:px-4 lg:px-2 my-8">
                <section className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 md:p-12">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">What Our Users Say</h2>
                    <p className="text-muted-foreground mt-2">
                      Hear from our satisfied buyers and sellers
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Testimonial 1 */}
                    <div className="glass-card p-6 rounded-xl hover-scale">
                      <div className="flex items-center mb-4">
                        <div className="mr-4 w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
                          U1
                        </div>
                        <div>
                          <h4 className="font-semibold">User 1</h4>
                          <p className="text-sm text-muted-foreground">
                            Car Buyer
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        "I found my dream car within a week of searching on
                        VahaanXchange. The filters made it easy to narrow down
                        exactly what I was looking for, and the seller was
                        verified which gave me extra confidence."
                      </p>
                      <div className="mt-4 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-primary"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="glass-card p-6 rounded-xl hover-scale">
                      <div className="flex items-center mb-4">
                        <div className="mr-4 w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
                          U2
                        </div>
                        <div>
                          <h4 className="font-semibold">User 2</h4>
                          <p className="text-sm text-muted-foreground">
                            Car Seller
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        "Selling my car on VahaanXchange was incredibly simple. I
                        had multiple inquiries within days and sold for a great
                        price. The platform made it easy to communicate with
                        potential buyers."
                      </p>
                      <div className="mt-4 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-primary"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="glass-card p-6 rounded-xl hover-scale">
                      <div className="flex items-center mb-4">
                        <div className="mr-4 w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
                          U3
                        </div>
                        <div>
                          <h4 className="font-semibold">User 3</h4>
                          <p className="text-sm text-muted-foreground">
                            Car Dealer
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        "As a small dealership, VahaanXchange has become an
                        essential part of our business. The platform's reach and
                        user-friendly interface has helped us connect with more
                        customers than ever before."
                      </p>
                      <div className="mt-4 flex">
                        {[1, 2, 3, 4, 5].map((star, index) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={index === 4 ? "none" : "currentColor"}
                            stroke={index === 4 ? "currentColor" : "none"}
                            strokeWidth="2"
                            className="text-primary"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-12">
                    <h1 className="sr-only">
                      Buy or Sell Your Used Vehicle Online – VahaanXchange
                    </h1>
                    <SEOContent
                      title="Why Choose VahaanXchange for Used Vehicles?"
                      content="VahaanXchange is India's leading platform for buying and selling used cars and bikes with zero commission. We connect verified buyers and sellers directly, ensuring transparent pricing and secure transactions. Our AI-powered valuation system provides accurate market prices, while our comprehensive vehicle inspection reports give you complete confidence in your purchase. Whether you're looking for a budget-friendly hatchback, a premium sedan, or a reliable two-wheeler, our platform offers thousands of verified listings across all major Indian cities. Experience hassle-free vehicle trading with instant price quotes, detailed vehicle history, and secure payment processing. Join millions of satisfied customers who trust VahaanXchange for their vehicle buying and selling needs."
                      keywords={[
                        "buy used cars",
                        "sell used cars",
                        "zero commission",
                        "verified vehicle listings",
                        "used bikes",
                        "car valuation",
                        "vehicle inspection",
                      ]}
                    />
                  </div>
                </section>
              </div>

              <AIFloatingButton />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index; 
