import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeatMap } from "@/components/SeatMap";
import { ArrowLeft, Train, Bus, MapPin, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - replace with Supabase queries
const mockRoute = {
  id: '1',
  type: 'train' as const,
  origin: 'Mumbai',
  destination: 'Delhi',
  departure_time: '2024-07-28T14:30:00',
  arrival_time: '2024-07-29T06:30:00',
  vehicle_number: 'RAJ-2024',
  seats_total: 72,
  price: 1250
};

const mockSeats = Array.from({ length: 72 }, (_, i) => {
  const row = String.fromCharCode(65 + Math.floor(i / 4)); // A, B, C, etc.
  const seatNum = (i % 4) + 1;
  return {
    id: `seat-${i}`,
    seat_number: `${row}${seatNum}`,
    is_booked: Math.random() > 0.7, // Random booking status
    booked_by: Math.random() > 0.7 ? 'user123' : undefined
  };
});

export default function RouteDetail() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const IconComponent = mockRoute.type === 'train' ? Train : Bus;
  const availableSeats = mockSeats.filter(seat => !seat.is_booked).length;

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSeatSelect = (seatNumber: string) => {
    setSelectedSeat(seatNumber === selectedSeat ? null : seatNumber);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSeat) return;

    setIsBooking(true);
    
    // Simulate booking process
    setTimeout(() => {
      toast({
        title: "Booking Confirmed!",
        description: `Your seat ${selectedSeat} has been booked successfully.`,
      });
      setIsBooking(false);
      navigate('/bookings');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Routes
          </Button>
        </div>

        {/* Route Details */}
        <Card className="p-6 mb-8 shadow-medium">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${mockRoute.type === 'train' ? 'transport-train' : 'transport-bus'}`}>
                <IconComponent className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{mockRoute.vehicle_number}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant={mockRoute.type === 'train' ? 'default' : 'secondary'}>
                    {mockRoute.type.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{availableSeats} of {mockRoute.seats_total} available</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-4xl font-bold text-primary">₹{mockRoute.price}</p>
              <p className="text-muted-foreground">per seat</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-lg">Departure</p>
                  <p className="text-2xl font-bold">{mockRoute.origin}</p>
                  <p className="text-muted-foreground">{formatTime(mockRoute.departure_time)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(mockRoute.departure_time)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-lg">Arrival</p>
                  <p className="text-2xl font-bold">{mockRoute.destination}</p>
                  <p className="text-muted-foreground">{formatTime(mockRoute.arrival_time)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(mockRoute.arrival_time)}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Seat Selection */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Select Your Seat</h2>
          <SeatMap
            seats={mockSeats}
            selectedSeat={selectedSeat}
            onSeatSelect={handleSeatSelect}
            onConfirmBooking={handleConfirmBooking}
            isLoading={isBooking}
          />
        </div>
      </div>
    </div>
  );
}