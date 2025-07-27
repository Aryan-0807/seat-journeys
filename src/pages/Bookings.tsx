import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingCard, type Booking } from "@/components/BookingCard";
import { useToast } from "@/hooks/use-toast";
import { Ticket, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data - replace with Supabase queries
const mockBookings: Booking[] = [
  {
    id: '1',
    route: {
      type: 'train' as const,
      origin: 'Mumbai',
      destination: 'Delhi',
      departure_time: '2024-07-28T14:30:00',
      arrival_time: '2024-07-29T06:30:00',
      vehicle_number: 'RAJ-2024'
    },
    seat_number: 'A1',
    status: 'booked' as const,
    booked_at: '2024-07-27T10:30:00',
    price: 1250
  },
  {
    id: '2',
    route: {
      type: 'bus' as const,
      origin: 'Pune',
      destination: 'Mumbai',
      departure_time: '2024-07-25T09:00:00',
      arrival_time: '2024-07-25T12:30:00',
      vehicle_number: 'MH-12-BUS-1234'
    },
    seat_number: 'B3',
    status: 'cancelled' as const,
    booked_at: '2024-07-24T15:20:00',
    price: 450
  },
  {
    id: '3',
    route: {
      type: 'train' as const,
      origin: 'Delhi',
      destination: 'Bangalore',
      departure_time: '2024-07-20T22:15:00',
      arrival_time: '2024-07-22T04:45:00',
      vehicle_number: 'KTK-EXP'
    },
    seat_number: 'C2',
    status: 'booked' as const,
    booked_at: '2024-07-18T12:15:00',
    price: 2100
  }
];

export default function Bookings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState(mockBookings);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingBooking(bookingId);
    
    // Simulate cancellation process
    setTimeout(() => {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      );
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
        variant: "destructive"
      });
      
      setCancellingBooking(null);
    }, 1000);
  };

  const activeBookings = bookings.filter(b => b.status === 'booked');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-primary">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Bookings</h1>
              <p className="text-muted-foreground">Manage your travel bookings</p>
            </div>
          </div>
        </div>

        {/* Active Bookings */}
        {activeBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Bookings</h2>
            <div className="space-y-4">
              {activeBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelBooking}
                  isLoading={cancellingBooking === booking.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Cancelled Bookings */}
        {cancelledBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Cancelled Bookings</h2>
            <div className="space-y-4">
              {cancelledBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelBooking}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {bookings.length === 0 && (
          <div className="text-center py-16">
            <div className="p-4 rounded-full bg-muted w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Ticket className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6">
              Start your journey by booking your first ticket!
            </p>
            <Button variant="accent" onClick={() => navigate('/')}>
              Browse Routes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}