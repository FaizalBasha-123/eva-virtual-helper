import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Fuel, Phone, Gauge, 
  ChevronRight, Star, Share, ThumbsUp, Lock, BatteryCharging, User
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useVehicleDetails } from '@/hooks/useVehicleData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import FavouriteButton from '@/components/shared/FavouriteButton';
import { ShareButton } from '@/components/shared/ShareButton';
import VehicleSEOHead from '@/components/seo/VehicleSEOHead';
import { generateVehicleSlug } from '@/utils/slugUtils';

interface BikeDetailProps {
  vehicleId?: string;
}

const BikeDetail = ({ vehicleId: propVehicleId }: BikeDetailProps) => {
  const { id: paramId } = useParams<{ id: string }>();
  
  // Use prop vehicleId if provided, otherwise fall back to URL param
  const vehicleId = propVehicleId || paramId;
  
  const { vehicle: bike, loading, error } = useVehicleDetails(vehicleId || '', 'bike');
  const [activePhotoCategory, setActivePhotoCategory] = useState<string>('');
  
  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getFuelIcon = (fuelType: string) => {
    if (fuelType?.toLowerCase().includes('electric')) {
      return <BatteryCharging className="h-5 w-5 text-muted-foreground mb-1" />;
    }
    return <Fuel className="h-5 w-5 text-muted-foreground mb-1" />;
  };

  const handleContactSeller = async () => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const phoneNumber = localStorage.getItem('userPhoneNumber') || localStorage.getItem('phoneNumber');

    // Check if user is signed in
    if (!userId || !userName || !phoneNumber) {
      // Trigger sign-in modal
      window.dispatchEvent(new CustomEvent('openSignInModal'));
      return;
    }

    try {
      // Convert phone number to number type to match database schema
      const phoneNumberAsNumber = parseInt(phoneNumber, 10);
      
      // Insert booking record - pass single object, not array
      const { error } = await supabase.from('buy_booking_listings').insert({
        user_id: userId,
        user_name: userName,
        phone_number: phoneNumberAsNumber,
        vehicle_id: vehicleId,
        vehicle: 'bike'
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Contact Request Submitted",
        description: "Our VahaanXchange team will contact you soon.",
      });
    } catch (error) {
      console.error('Error inserting booking:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit contact request. Please try again.",
      });
    }
  };

  const getPhotoCategories = () => {
    if (!bike?.photos || typeof bike.photos !== 'object') return {};
    return bike.photos as Record<string, string[]>;
  };

  const photoCategories = getPhotoCategories();
  const categoryNames = Object.keys(photoCategories);

  // Generate slug for SEO
  const slug = bike ? generateVehicleSlug({
    brand: bike.brand || 'unknown',
    model: bike.model || 'unknown',
    variant: bike.variant || 'base',
    fuel_type: bike.fuel_type || 'petrol',
    year: bike.year || new Date().getFullYear(),
    seller_location_city: bike.seller_location_city || 'india',
    id: bike.id
  }) : '';

  // Get all images for carousel
  const getAllImages = () => {
    const categories = Object.values(photoCategories);
    const allImages: string[] = [];
    for (const category of categories) {
      if (Array.isArray(category)) {
        allImages.push(...category);
      }
    }
    return allImages;
  };

  const allImages = getAllImages();

  useEffect(() => {
    if (categoryNames.length > 0 && !activePhotoCategory) {
      setActivePhotoCategory(categoryNames[0]);
    }
  }, [categoryNames, activePhotoCategory]);

  const handleImageClick = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  const getMainImage = () => {
    const categories = Object.values(photoCategories);
    for (const category of categories) {
      if (Array.isArray(category) && category.length > 0) {
        return category[0];
      }
    }
    return "/placeholder.svg";
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse text-center">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto"></div>
            <div className="h-64 w-full max-w-2xl bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !bike) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Bike Not Found</h1>
          <p className="mb-6">The bike you are looking for does not exist or has been removed.</p>
          <Link to="/search-used-bikes">
            <Button>Browse Other Bikes</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <VehicleSEOHead vehicle={bike} type="bike" slug={slug} />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 pt-6 lg:pt-24 pb-6">
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight className="h-3 w-3 mx-2" />
            <Link to="/search?type=bike" className="hover:underline">Buy Bikes</Link>
            <ChevronRight className="h-3 w-3 mx-2" />
            <span className="text-foreground font-medium truncate">{bike.brand} {bike.model}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3">
              {/* Main Image Carousel */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-8 shadow-sm">
                {allImages.length > 0 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {allImages.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-700">
                            <img 
                              src={image} 
                              alt={`${bike.brand} ${bike.model} ${index + 1}`} 
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => handleImageClick(image)}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                ) : (
                  <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-700">
                    <img 
                      src="/placeholder.svg" 
                      alt={`${bike.brand} ${bike.model}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              {/* Overview Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Overview</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="flex flex-col items-center text-center">
                    <Calendar className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Year</span>
                    <span className="font-semibold text-foreground">{bike.year}</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    {getFuelIcon(bike.fuel_type)}
                    <span className="text-sm text-muted-foreground">Fuel Type</span>
                    <span className="font-semibold text-foreground">{bike.fuel_type ? bike.fuel_type : 'No Data'}</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <User className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">No. of Owners</span>
                    <span className="font-semibold text-foreground">{bike.number_of_owners != null ? bike.number_of_owners : 'No Data'}</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <Gauge className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">KM Driven</span>
                    <span className="font-semibold text-foreground">{bike.kilometers_driven === 0 ? 'NA' : bike.kilometers_driven != null ? bike.kilometers_driven.toLocaleString() : 'No Data'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">Registration Number</h3>
                        <div className="flex items-center mt-1">
                          <span className="blur-sm select-none pointer-events-none text-muted-foreground">UP-14-CD-2706</span>
                          <Lock className="h-4 w-4 ml-2 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">Seller Contact</h3>
                        <div className="flex items-center mt-1">
                          <span className="blur-sm select-none pointer-events-none text-muted-foreground">+91 9898989898</span>
                          <Lock className="h-4 w-4 ml-2 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {bike.features && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-foreground">Features</h3>
                    <p className="text-muted-foreground">{bike.features}</p>
                  </div>
                )}
              </div>
              
              {/* Photos Section */}
              {categoryNames.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Photos</h2>
                  
                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categoryNames.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActivePhotoCategory(category)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activePhotoCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-foreground'
                        }`}
                      >
                        {category} ({photoCategories[category]?.length || 0})
                      </button>
                    ))}
                  </div>
                  
                  {/* Photo Grid */}
                  {activePhotoCategory && photoCategories[activePhotoCategory] && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {photoCategories[activePhotoCategory].map((photo, index) => (
                        <div 
                          key={index}
                          className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleImageClick(photo)}
                        >
                          <img 
                            src={photo} 
                            alt={`${activePhotoCategory} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-20">
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h1 className="text-xl font-bold text-foreground">
                        {bike.year} {bike.brand} {bike.model}
                      </h1>
                      <div className="flex gap-2">
                        <ShareButton
                          title={`Check out this ${bike.brand} ${bike.model} on VahaanXchange!`}
                          text={`${bike.year} ${bike.brand} ${bike.model} ${bike.variant} - ${bike.fuel_type} | ${formatIndianCurrency(bike.sell_price)} | ${bike.seller_location_city}`}
                          className="h-8 w-8"
                          vehicleId={bike.id}
                          vehicleType="bike"
                        />
                        <FavouriteButton
                          vehicleId={bike.id}
                          vehicleType="bike"
                          className="h-8 w-8 p-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{bike.seller_location_city}</span>
                    </div>
                    
                    <div className="text-2xl font-bold text-primary mb-4">
                      {/*
                      {bike.sell_price === 0 ? (
                        <a
                          href="https://wa.me/918108104175"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline hover:text-primary/80 flex items-center gap-1"
                        >For price contact seller
                        </a>
                      ) : formatIndianCurrency(bike.sell_price)}
                      */}
                      {formatIndianCurrency(bike.sell_price)}
                    </div>
                    
                    <Separator className="mb-4" />
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex flex-col items-center text-center">
                        <Calendar className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Year</span>
                        <span className="text-sm font-medium text-foreground">{bike.year}</span>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <Gauge className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">KM Driven</span>
                        <span className="text-sm font-medium text-foreground">{bike.kilometers_driven === 0 ? 'NA' : bike.kilometers_driven != null ? bike.kilometers_driven.toLocaleString() : 'No Data'}</span>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        {getFuelIcon(bike.fuel_type)}
                        <span className="text-xs text-muted-foreground">Fuel</span>
                        <span className="text-sm font-medium text-foreground">{bike.fuel_type ? bike.fuel_type : 'No Data'}</span>
                      </div>
                    </div>                    
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-orange-600 hover:bg-orange-700 flex items-center shadow-sm justify-center gap-2 py-6"
                        onClick={handleContactSeller}
                      >
                        <Phone className="h-5 w-5" />
                        Contact Seller
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BikeDetail;
