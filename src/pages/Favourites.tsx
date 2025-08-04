import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, Eye, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useFavourites } from "@/hooks/useFavourites";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VehicleData {
  id: string;
  brand: string;
  model: string;
  year: number;
  sell_price: number;
  kilometers_driven: number;
  seller_location_city: string;
  photos: any;
}

const Favourites = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("cars");
  const isMobile = useIsMobile();
  const { favourites, removeFromFavourites, fetchFavourites } = useFavourites();
  const [favouriteCars, setFavouriteCars] = useState<VehicleData[]>([]);
  const [favouriteBikes, setFavouriteBikes] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    vehicleId: string;
    vehicleType: 'car' | 'bike';
    vehicleName: string;
  }>({
    isOpen: false,
    vehicleId: '',
    vehicleType: 'car',
    vehicleName: ''
  });

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMainImage = (photos: any) => {
    if (photos && typeof photos === 'object') {
      const categories = Object.values(photos);
      for (const category of categories) {
        if (Array.isArray(category) && category.length > 0) {
          return category[0];
        }
      }
    }
    return "/placeholder.svg";
  };

  const fetchFavouriteVehicles = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get favourite car IDs
      const carFavourites = favourites.filter(fav => fav.vehicle_type === 'car');
      const carIds = carFavourites.map(fav => fav.vehicle_id);
      
      // Get favourite bike IDs
      const bikeFavourites = favourites.filter(fav => fav.vehicle_type === 'bike');
      const bikeIds = bikeFavourites.map(fav => fav.vehicle_id);

      // Fetch car data
      if (carIds.length > 0) {
        const { data: carData, error: carError } = await supabase
          .from('car_seller_listings')
          .select('id, brand, model, year, sell_price, kilometers_driven, seller_location_city, photos')
          .in('id', carIds);

        if (carError) throw carError;
        setFavouriteCars(carData || []);
      } else {
        setFavouriteCars([]);
      }

      // Fetch bike data
      if (bikeIds.length > 0) {
        const { data: bikeData, error: bikeError } = await supabase
          .from('bike_seller_listings')
          .select('id, brand, model, year, sell_price, kilometers_driven, seller_location_city, photos')
          .in('id', bikeIds);

        if (bikeError) throw bikeError;
        setFavouriteBikes(bikeData || []);
      } else {
        setFavouriteBikes([]);
      }
    } catch (error) {
      console.error('Error fetching favourite vehicles:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load favourite vehicles.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavourite = async (vehicleId: string, vehicleType: 'car' | 'bike', vehicleName: string) => {
    setDeleteConfirmation({
      isOpen: true,
      vehicleId,
      vehicleType,
      vehicleName
    });
  };

  const confirmDelete = async () => {
    const { vehicleId, vehicleType } = deleteConfirmation;
    const success = await removeFromFavourites(vehicleId, vehicleType);
    if (success) {
      // Update local state
      if (vehicleType === 'car') {
        setFavouriteCars(prev => prev.filter(car => car.id !== vehicleId));
      } else {
        setFavouriteBikes(prev => prev.filter(bike => bike.id !== vehicleId));
      }
      
      toast({
        title: "Removed from favourites",
        description: "Vehicle has been removed from your favourites.",
      });
    }
    setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const cancelDelete = () => {
    setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  // Fixed toggle handler
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  useEffect(() => {
    if (favourites.length >= 0) {
      fetchFavouriteVehicles();
    }
  }, [favourites]);
  
  // Check authentication - BUT don't redirect immediately on mobile
  useEffect(() => {
    // Wait for auth loading to complete before checking authentication
    if (authLoading) return;
    
    // Only redirect on desktop if not authenticated
    if (!currentUser && isMobile === false) {
      navigate("/");
    }
  }, [currentUser, navigate, isMobile, authLoading]);

  // If we're still determining if it's mobile, don't render anything
  if (isMobile === undefined) {
    return null;
  }

  // Show loading while auth is being initialized
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Special handling for mobile - Show auth modal via bottom nav instead
  // of immediate redirect
  if (!currentUser && isMobile) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Sign in to view favorites</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Please sign in to see your saved vehicles
            </p>
            <Button onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }
  
  const MobileFavouritesView = () => (
    <div className="px-4 pt-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-center">Your Saved Cars & Bikes</h1>
        <p className="text-center text-muted-foreground mt-1">Vehicles you've added to favorites</p>
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="cars">Saved Cars</TabsTrigger>
          <TabsTrigger value="bikes">Saved Bikes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cars" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading your saved cars...</p>
            </div>
          ) : favouriteCars.length > 0 ? (
            favouriteCars.map((car, index) => (
              <motion.div 
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={getMainImage(car.photos)} 
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <CardContent className="pt-3 pb-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{car.year} {car.brand} {car.model}</h3>
                      <p className="font-bold text-primary">{formatIndianCurrency(car.sell_price)}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 text-xs text-muted-foreground mt-1">
                      <span>{car.year}</span>
                      <span>•</span>
                      <span>{car.kilometers_driven?.toLocaleString() || 0} km</span>
                      <span>•</span>
                      <span>{car.seller_location_city}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 pb-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => navigate(`/used-car/${car.id}`)}
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveFavourite(car.id, 'car', `${car.brand} ${car.model}`)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No saved cars yet</h3>
              <p className="text-muted-foreground mt-1">Start browsing and add cars to your favourites</p>
              <Button className="mt-4" onClick={() => navigate("/search?type=car")}>Browse Cars</Button>
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="bikes" className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading your saved bikes...</p>
            </div>
          ) : favouriteBikes.length > 0 ? (
            favouriteBikes.map((bike, index) => (
              <motion.div 
                key={bike.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={getMainImage(bike.photos)} 
                      alt={`${bike.brand} ${bike.model}`}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <CardContent className="pt-3 pb-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{bike.year} {bike.brand} {bike.model}</h3>
                      <p className="font-bold text-primary">{formatIndianCurrency(bike.sell_price)}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 text-xs text-muted-foreground mt-1">
                      <span>{bike.year}</span>
                      <span>•</span>
                      <span>{bike.kilometers_driven?.toLocaleString() || 0} km</span>
                      <span>•</span>
                      <span>{bike.seller_location_city}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 pb-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => navigate(`/used-bike/${bike.id}`)}
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveFavourite(bike.id, 'bike', `${bike.brand} ${bike.model}`)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No saved bikes yet</h3>
              <p className="text-muted-foreground mt-1">Start browsing and add bikes to your favourites</p>
              <Button className="mt-4" onClick={() => navigate("/search?type=bike")}>Browse Bikes</Button>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  // Desktop view (similar structure with actual data)
  const DesktopFavouritesView = () => (
    <div className="container mx-auto px-4 pt-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Your Favourite Listings</h1>
        <p className="text-muted-foreground mt-2">Easily access the cars and bikes you've shortlisted.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="cars">Cars</TabsTrigger>
          <TabsTrigger value="bikes">Bikes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cars" className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading your saved cars...</p>
            </div>
          ) : favouriteCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favouriteCars.map((car) => (
                <Card key={car.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative">
                    <img 
                      src={getMainImage(car.photos)} 
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{car.year} {car.brand} {car.model}</h3>
                      <p className="font-bold text-primary">{formatIndianCurrency(car.sell_price)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>{car.year}</span>
                      <span>•</span>
                      <span>{car.kilometers_driven?.toLocaleString() || 0} km</span>
                      <span>•</span>
                      <span>{car.seller_location_city}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-1"
                      onClick={() => navigate(`/used-car/${car.id}`)}
                    >
                      <Eye className="h-4 w-4" /> View Details
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveFavourite(car.id, 'car', `${car.brand} ${car.model}`)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No favourite cars yet</h3>
              <p className="text-muted-foreground mt-1">Start browsing and add cars to your favourites</p>
              <Button className="mt-4" onClick={() => navigate("/search?type=car")}>Browse Cars</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bikes" className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading your saved bikes...</p>
            </div>
          ) : favouriteBikes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favouriteBikes.map((bike) => (
                <Card key={bike.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative">
                    <img 
                      src={getMainImage(bike.photos)} 
                      alt={`${bike.brand} ${bike.model}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{bike.year} {bike.brand} {bike.model}</h3>
                      <p className="font-bold text-primary">{formatIndianCurrency(bike.sell_price)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>{bike.year}</span>
                      <span>•</span>
                      <span>{bike.kilometers_driven?.toLocaleString() || 0} km</span>
                      <span>•</span>
                      <span>{bike.seller_location_city}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-1"
                      onClick={() => navigate(`/used-bike/${bike.id}`)}
                    >
                      <Eye className="h-4 w-4" /> View Details
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveFavourite(bike.id, 'bike', `${bike.brand} ${bike.model}`)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No favourite bikes yet</h3>
              <p className="text-muted-foreground mt-1">Start browsing and add bikes to your favourites</p>
              <Button className="mt-4" onClick={() => navigate("/search?type=bike")}>Browse Bikes</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <Layout>
      {isMobile ? <MobileFavouritesView /> : <DesktopFavouritesView />}
      <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={cancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to remove this vehicle from favourites?</AlertDialogTitle>
            <AlertDialogDescription>{deleteConfirmation.vehicleName}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Favourites;
