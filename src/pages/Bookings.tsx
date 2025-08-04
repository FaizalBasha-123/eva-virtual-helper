import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, MapPin, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/utils/formatters";

interface BookingData {
  id: string;
  user_id: string;
  user_name: string;
  phone_number: number;
  vehicle_id: string;
  vehicle: 'car' | 'bike';
  created_at: string;
  vehicleDetails?: {
    photos: any;
    brand: string;
    model: string;
    year: number;
    fuel_type: string;
    kilometers_driven: number;
    sell_price: number;
    seller_location_city: string;
  };
}

const BookingCard = ({ booking, onDelete }: { booking: BookingData; onDelete: (bookingId: string) => void }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCardClick = () => {
    const targetUrl = booking.vehicle === 'car' 
      ? `/used-car/${booking.vehicle_id}` 
      : `/used-bike/${booking.vehicle_id}`;
    navigate(targetUrl);
  };

  const getMainImage = () => {
    if (booking.vehicleDetails?.photos && typeof booking.vehicleDetails.photos === 'object') {
      const categories = Object.values(booking.vehicleDetails.photos);
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

  const vehicleName = booking.vehicleDetails 
    ? `${booking.vehicleDetails.brand} ${booking.vehicleDetails.model}`
    : 'Vehicle Sold or Removed By the Seller';

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when chat button is clicked
    window.open("https://wa.me/918108104175", "_blank", "noopener,noreferrer");
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when delete button is clicked
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setIsDeleting(true);
      try {
        const { error } = await supabase
          .from('buy_booking_listings')
          .delete()
          .eq('id', booking.id);

        if (error) {
          console.error('Error deleting booking:', error);
          alert('Failed to delete booking. Please try again.');
        } else {
          onDelete(booking.id);
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer" onClick={handleCardClick}>
      <div className="relative">
              <img 
                src={getMainImage()} 
                alt={vehicleName}
          className="w-full h-48 object-cover"
        />
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">
            {booking.vehicleDetails?.year} {vehicleName}
          </h3>
          <p className="font-bold text-primary">
            {booking.vehicleDetails ? formatPrice(booking.vehicleDetails.sell_price) : 'Price not available'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                {booking.vehicleDetails && (
                  <>
                      <span>{booking.vehicleDetails.year}</span>
                      <span>•</span>
                      <span>{booking.vehicleDetails.fuel_type}</span>
                      <span>•</span>
              <span>{booking.vehicleDetails.kilometers_driven?.toLocaleString()} km</span>
                  </>
                )}
              </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{booking.vehicleDetails?.seller_location_city || 'Location not available'}</span>
            </div>
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Booked on: {formatDate(booking.created_at)}</span>
                </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
            <Button 
              variant="outline" 
          className="flex items-center gap-1"
              onClick={handleChatClick}
            >
              <MessageCircle className="h-4 w-4" /> Chat
            </Button>
        <Button 
          variant="ghost" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={handleDeleteClick}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? 'Deleting...' : ''}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Bookings = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const handleDeleteBooking = (bookingId: string) => {
    setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          console.error('No user ID found in localStorage');
          setLoading(false);
          return;
        }

        // Fetch bookings for the current user
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('buy_booking_listings')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
          setLoading(false);
          return;
        }

        // Fetch vehicle details for each booking
        const bookingsWithDetails = await Promise.all(
          (bookingsData || []).map(async (booking) => {
            try {
              // Ensure vehicle type is properly typed
              const vehicleType = booking.vehicle as 'car' | 'bike';
              const table = vehicleType === 'car' ? 'car_seller_listings' : 'bike_seller_listings';
              
              const { data: vehicleData, error: vehicleError } = await supabase
                .from(table)
                .select('photos, brand, model, year, fuel_type, kilometers_driven, sell_price, seller_location_city')
                .eq('id', booking.vehicle_id)
                .maybeSingle();

              if (vehicleError) {
                console.error(`Error fetching ${vehicleType} details:`, vehicleError);
                return {
                  ...booking,
                  vehicle: vehicleType
                } as BookingData;
              }

              return {
                ...booking,
                vehicle: vehicleType,
                vehicleDetails: vehicleData
              } as BookingData;
            } catch (error) {
              console.error('Error processing booking:', error);
              return {
                ...booking,
                vehicle: booking.vehicle as 'car' | 'bike'
              } as BookingData;
            }
          })
        );

        setBookings(bookingsWithDetails);
      } catch (error) {
        console.error('Error in fetchBookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Set up realtime subscription
    const channel = supabase
      .channel('booking-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'buy_booking_listings'
        },
        () => {
          fetchBookings(); // Refetch when data changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Show loading while auth is being initialized
  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Check authentication after loading is complete
  if (!currentUser) {
    // Use setTimeout to avoid navigation during render
    setTimeout(() => {
      navigate("/");
    }, 0);
    return (
      <Layout>
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Redirecting...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading your bookings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">My Vehicle Bookings</h1>
          <p className="text-muted-foreground mt-2">Manage all your vehicle purchase bookings in one place.</p>
        </div>
        
        <div className="w-full">
          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} onDelete={handleDeleteBooking} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No bookings yet</h3>
              <p className="text-muted-foreground mt-1">Start browsing vehicles to make your first booking</p>
              <Button className="mt-4" onClick={() => navigate("/search")}>Browse Vehicles</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Bookings;
