import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Calendar as CalendarIcon, Calendar, Clock, MapPin, AlertCircle, CheckCircle2, Plus, MoreVertical, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/formatters";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "@/hooks/use-toast";

interface VehicleAppointment {
  id: string;
  photos: any;
  brand: string;
  model: string;
  year: number;
  kilometers_driven: number;
  fuel_type: string;
  sell_price: number;
  seller_location_city: string;
  created_at: string;
  vehicleType: 'car' | 'bike';
}

const AppointmentCard = ({ appointment, onDelete }: { appointment: VehicleAppointment; onDelete: (id: string, vehicleType: 'car' | 'bike', vehicleName: string) => void }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    const targetUrl = appointment.vehicleType === 'car' 
      ? `/used-car/${appointment.id}` 
      : `/used-bike/${appointment.id}`;
    navigate(targetUrl);
  };

  const handleDelete = () => {
    const vehicleName = `${appointment.year} ${appointment.brand} ${appointment.model}`;
    onDelete(appointment.id, appointment.vehicleType, vehicleName);
  };

  const getMainImage = () => {
    if (appointment.photos && typeof appointment.photos === 'object') {
      const categories = Object.values(appointment.photos);
      for (const category of categories) {
        if (Array.isArray(category) && category.length > 0) {
          return category[0];
        }
      }
    }
    return "/placeholder.svg";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const vehicleName = `${appointment.year} ${appointment.brand} ${appointment.model}`;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative">
              <img 
                src={getMainImage()} 
                alt={vehicleName}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild aria-label="Open appointment actions">
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
                <MoreVertical className="h-4 w-4 text-muted-foreground dark:text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewDetails}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{vehicleName}</h3>
          <p className="font-bold text-primary">{formatPrice(appointment.sell_price)}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{appointment.year}</span>
                  <span>•</span>
          <span>{appointment.kilometers_driven?.toLocaleString() || 0} km</span>
                  <span>•</span>
          <span>{appointment.seller_location_city}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Listed on: {formatDate(appointment.created_at)}</span>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={handleViewDetails}
        >
          <Eye className="h-4 w-4" /> View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

const Appointments = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [appointments, setAppointments] = useState<VehicleAppointment[]>([]);
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
  
  // Check authentication - wait for auth loading to complete
  useEffect(() => {
    if (authLoading) return;
    
  if (!currentUser) {
    navigate("/");
    }
  }, [currentUser, navigate, authLoading]);

  const handleDeleteAppointment = async (id: string, vehicleType: 'car' | 'bike', vehicleName: string) => {
    setDeleteConfirmation({
      isOpen: true,
      vehicleId: id,
      vehicleType,
      vehicleName
    });
  };

  const confirmDelete = async () => {
    const { vehicleId, vehicleType } = deleteConfirmation;
    try {
      const tableName = vehicleType === 'car' ? 'car_seller_listings' : 'bike_seller_listings';
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', vehicleId);

      if (error) {
        throw error;
      }

      // Remove from local state
      setAppointments(prev => prev.filter(apt => !(apt.id === vehicleId && apt.vehicleType === vehicleType)));

      toast({
        title: "Post Deleted",
        description: "Your vehicle listing has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the listing. Please try again.",
      });
    }
    setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const cancelDelete = () => {
    setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          console.error('No user ID found in localStorage');
          setLoading(false);
          return;
        }

        // Fetch car listings
        const { data: carListings, error: carError } = await supabase
          .from('car_seller_listings')
          .select('id, photos, brand, model, year, kilometers_driven, fuel_type, sell_price, seller_location_city, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (carError) {
          console.error('Error fetching car listings:', carError);
        }

        // Fetch bike listings
        const { data: bikeListings, error: bikeError } = await supabase
          .from('bike_seller_listings')
          .select('id, photos, brand, model, year, kilometers_driven, fuel_type, sell_price, seller_location_city, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (bikeError) {
          console.error('Error fetching bike listings:', bikeError);
        }

        // Merge and tag listings
        const allListings: VehicleAppointment[] = [
          ...(carListings || []).map(listing => ({
            ...listing,
            vehicleType: 'car' as const
          })),
          ...(bikeListings || []).map(listing => ({
            ...listing,
            vehicleType: 'bike' as const
          }))
        ];

        // Sort by creation date
        allListings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setAppointments(allListings);
      } catch (error) {
        console.error('Error in fetchUserListings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
    fetchUserListings();
    }
  }, [currentUser]);

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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your listings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const MobileAppointmentsView = () => {
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

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(price);
    };

    const handleViewDetails = (appointment: VehicleAppointment) => {
      const targetUrl = appointment.vehicleType === 'car' 
        ? `/used-car/${appointment.id}` 
        : `/used-bike/${appointment.id}`;
      navigate(targetUrl);
    };

  return (
      <div className="px-4 pt-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-center">My Vehicle Listings</h1>
          <p className="text-center text-muted-foreground mt-1">Manage all your vehicle sale listings</p>
        </motion.div>
        
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <motion.div 
                key={`${appointment.vehicleType}-${appointment.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={getMainImage(appointment.photos)} 
                      alt={`${appointment.brand} ${appointment.model}`}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild aria-label="Open appointment actions">
                          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(appointment)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteAppointment(appointment.id, appointment.vehicleType, `${appointment.year} ${appointment.brand} ${appointment.model}`)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
                  </div>
                  <CardContent className="pt-3 pb-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{appointment.year} {appointment.brand} {appointment.model}</h3>
                      <p className="font-bold text-primary">{formatPrice(appointment.sell_price)}</p>
                </div>
                    <div className="flex flex-wrap gap-1 text-xs text-muted-foreground mt-1">
                      <span>{appointment.year}</span>
                      <span>•</span>
                      <span>{appointment.kilometers_driven?.toLocaleString() || 0} km</span>
                      <span>•</span>
                      <span>{appointment.seller_location_city}</span>
                </div>
              </CardContent>
                  <CardFooter className="flex justify-between pt-2 pb-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleViewDetails(appointment)}
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteAppointment(appointment.id, appointment.vehicleType, `${appointment.year} ${appointment.brand} ${appointment.model}`)}
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
                <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
              <h3 className="text-lg font-medium">No listings yet</h3>
              <p className="text-muted-foreground mt-1">Start by listing your vehicle for sale</p>
                      <Button className="mt-4" onClick={() => navigate("/sell")}>List Vehicle</Button>
            </motion.div>
                  )}
                </div>
      </div>
    );
  };

  const DesktopAppointmentsView = () => (
    <div className="container mx-auto px-4 pt-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">My Vehicle Listings</h1>
        <p className="text-muted-foreground mt-2">Manage all your vehicle sale listings in one place.</p>
      </div>
      
      {appointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <AppointmentCard 
              key={`${appointment.vehicleType}-${appointment.id}`} 
              appointment={appointment} 
              onDelete={handleDeleteAppointment}
            />
          ))}
        </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
          <h3 className="text-lg font-medium">No listings yet</h3>
          <p className="text-muted-foreground mt-1">Start by listing your vehicle for sale</p>
                      <Button className="mt-4" onClick={() => navigate("/sell")}>List Vehicle</Button>
                    </div>
                  )}
                </div>
  );

  return (
    <Layout>
      {isMobile ? <MobileAppointmentsView /> : <DesktopAppointmentsView />}
      <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={cancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your {deleteConfirmation.vehicleName} listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Appointments;
