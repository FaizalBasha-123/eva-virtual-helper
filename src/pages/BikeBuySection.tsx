import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bike, Calendar, Fuel, Tag, Users, Shield, Star, ChevronLeft, ChevronRight } from "lucide-react";
import BikeHeroSection from "@/components/bikes/BikeHeroSection";
import { useBikeData } from "@/hooks/useVehicleData";
import UnifiedVehicleCard from "@/components/shared/UnifiedVehicleCard";
import AddVehicleCard from "@/components/shared/AddVehicleCard";
import PopularBrands from "@/components/bikes/PopularBrands";
import { getCityImageUrl } from "@/utils/cityImages";
import { useCanonical } from "@/hooks/useCanonical";
import SEOContent from "@/components/seo/SEOContent";
import SEOHead from "@/components/seo/SEOHead";
import BikeCard from "@/components/bikes/BikeCard";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const BikeBuySection = () => {
  useCanonical("/used-bikes");
  const isMobile = useIsMobile();
  const { bikes: recommendedBikes, loading: loadingRecommended } = useBikeData('recommended', 4);
  const { bikes: discountedBikes, loading: loadingDiscounted } = useBikeData('discounted', 4);
  
  const bodyTypes = ["Sport", "Cruiser", "Commuter", "Scooter", "Adventure", "Off-Road"];
  const budgetRanges = ["Under 50K", "50K-1 Lakh", "1-1.5 Lakh", "1.5-2 Lakh", "Above 2 Lakh"];
  const popularCities = ["Ahmedabad", "Bangalore", "Chandigarh", "Chennai", "Delhi NCR", "Gurgaon", "Hyderabad", "Jaipur", "Mumbai", "New Delhi", "Noida", "Pune"];
  const fuelTypes = ["Petrol", "Electric", "CNG"];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.vahaanxchange.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Used Bikes",
        "item": "https://www.vahaanxchange.com/used-bikes"
      }
    ]
  };

  const renderBikeSection = (title: string, bikes: any[], loading: boolean, viewAllLink: string) => {
    if (isMobile) {
      return (
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-6">{title}</h2>
          <div className="container-fluid mx-auto px-0 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex gap-8 overflow-x-auto snap-mandatory pb-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:snap-none">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-3/4 max-w-sm flex-shrink-0 snap-start lg:min-w-0 lg:max-w-full">
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-8 overflow-x-auto snap-mandatory pb-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:snap-none">
                {bikes.map((bike: any) => (
                  <div key={bike.id} className="w-3/4 max-w-sm flex-shrink-0 snap-start lg:min-w-0 lg:max-w-full">
                    <BikeCard bike={bike} />
                  </div>
                ))}
                <div className="w-3/4 max-w-sm flex-shrink-0 snap-start lg:min-w-0 lg:max-w-full">
                  <AddVehicleCard />
                </div>
              </div>
            )}
            <div className="mt-10 text-center">
              <Link to="/search?type=bike" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
                View all listings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      );
    } else {
      return (
    <section className="mb-12 px-0 sm:px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
            <Link to="/search?type=bike" className="text-blue-600 dark:text-blue-400 hover:underline">
          View All
        </Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64 p-2"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible">
              {bikes.map((bike: any) => (
            <div key={bike.id} className="p-2">
              <UnifiedVehicleCard vehicle={bike} type="bike" />
            </div>
          ))}
          <div className="p-2">
            <AddVehicleCard />
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" size="icon" className="rounded-full">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Buy Used Bikes at Best Price in India - VahaanXchange"
        description="Browse quality used bikes from top brands. Verified listings, instant quotes, and easy buying experience."
        canonicalUrl="https://www.vahaanxchange.com/used-bikes"
        breadcrumbSchema={breadcrumbSchema}
      />
      
      <div className="container mx-auto px-4 pt-6 lg:pt-24">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Buy Used Bikes Near You</h1>
        </div>
        
        <BikeHeroSection />

        <div className="w-full">
          {/* Popular Bike Brands Section */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Popular Bike Brands</h2>
            <div className="square-brands-container">
              <PopularBrands />
            </div>
          </section>

          {renderBikeSection("Recommended Bikes", recommendedBikes, loadingRecommended, "/used-bikes")}
          {renderBikeSection("Discounted Bikes", discountedBikes, loadingDiscounted, "/used-bikes")}

          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Shop by Budget</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {budgetRanges.map(range => (
                <Link to={`/used-bikes?budget=${range}`} key={range}>
                  <Card className="shadow-sm">
                    <CardContent className="p-6 flex flex-col">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">{range}</h3>
                      <p className="text-sm text-muted-foreground mb-4">Find the perfect bike in your budget range</p>
                      <div className="mt-auto">
                        <Button variant="outline" className="w-full">Explore Bikes</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Browse by Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {bodyTypes.map(type => (
                <Link to={`/bikes?bodyType=${type}`} key={type}>
                  <Card className="shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="w-16 sm:w-20 h-16 sm:h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
                        <Bike className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-medium text-center">{type}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Shop by Fuel Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {fuelTypes.map(type => (
                <Link to={`/bikes?fuelType=${type}`} key={type}>
                  <Card className="shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="w-14 sm:w-16 h-14 sm:h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-3">
                        <Fuel className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 dark:text-orange-400" />
                      </div>
                      <h3 className="font-medium text-center">{type}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Popular Cities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {popularCities.map(city => (
                <Link to={`/bikes?city=${city}`} key={city}>
                  <Card className="shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="w-26 h-26 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
                        <img 
                          src={getCityImageUrl(city)}
                          alt={`${city} Icon`} 
                          className="h-50 sm:h-50 w-40 sm:w-40 rounded-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="font-medium text-center">{city}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
          
          <section className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Why Choose VahaanXchange?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Bike className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Trusted by Millions</h3>
                <p className="text-sm text-muted-foreground">Buy or sell bikes easily and confidently.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Sell in Minutes</h3>
                <p className="text-sm text-muted-foreground">No wait, no hassle — just quick, fair deals.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Tag className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Smart Pricing</h3>
                <p className="text-sm text-muted-foreground">AI ensures the best value for your bike or budget.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Compare with Ease</h3>
                <p className="text-sm text-muted-foreground">Side-by-side bike comparisons to find your perfect match.</p>
              </div>
            </div>
          </section>
          
          <section className="mb-8 text-center">
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-4 sm:p-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">Ready to find your dream bike?</h2>
              <p className="text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto">Browse our extensive collection of quality used bikes and find the perfect match for your needs and budget.</p>
              <Link to="/used-bikes">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Buy Used Bikes
                </Button>
              </Link>
            </div>
          </section>

          {/* SEO Content Section */}
          <SEOContent 
            title="Buy Verified Used Bikes in India"
            content="At VahaanXchange, we provide a wide range of certified second-hand bikes at the best market prices. Our smart valuation, zero-commission listings, and real-time appointment scheduling make buying or selling a vehicle fast and simple. Whether you're looking for a budget-friendly sport, a premium Yamaha, or a sporty Bajaj, our platform connects you directly with verified sellers across India. Experience hassle-free bike buying with instant price comparisons, and secure payment options."
            keywords={["buy used bikes", "second hand bikes", "verified bike dealers", "zero commission bike buying", "pre-owned vehicles India"]}
          />
        </div>
      </div>
    </Layout>
  );
};

export default BikeBuySection;
