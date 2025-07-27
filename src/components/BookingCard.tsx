import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Train, Bus, MapPin, Clock, Ticket, Calendar, X } from "lucide-react";
import { DownloadTicketButton } from "./TicketPDF";

export interface Booking {
  id: string;
  route: {
    type: 'train' | 'bus';
    origin: string;
    destination: string;
    departure_time: string;
    arrival_time: string;
    vehicle_number: string;
  };
  seat_number: string;
  status: 'booked' | 'cancelled';
  booked_at: string;
  price: number;
}

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
  isLoading?: boolean;
}

export const BookingCard = ({ booking, onCancel, isLoading }: BookingCardProps) => {
  const IconComponent = booking.route.type === 'train' ? Train : Bus;
  const isCancelled = booking.status === 'cancelled';

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isUpcoming = new Date(booking.route.departure_time) > new Date();

  return (
    <Card className={`p-6 border ${isCancelled ? 'bg-muted/30 border-muted' : 'shadow-soft card-hover'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${booking.route.type === 'train' ? 'transport-train' : 'transport-bus'} ${isCancelled ? 'opacity-50' : ''}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <h3 className={`font-semibold text-lg ${isCancelled ? 'line-through text-muted-foreground' : ''}`}>
              {booking.route.vehicle_number}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={booking.route.type === 'train' ? 'default' : 'secondary'} className={isCancelled ? 'opacity-50' : ''}>
                {booking.route.type.toUpperCase()}
              </Badge>
              <Badge variant={isCancelled ? 'destructive' : isUpcoming ? 'default' : 'secondary'}>
                {isCancelled ? 'CANCELLED' : isUpcoming ? 'UPCOMING' : 'COMPLETED'}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className={`text-2xl font-bold ${isCancelled ? 'text-muted-foreground' : 'text-primary'}`}>
            ₹{booking.price}
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Ticket className="h-3 w-3" />
            <span>Seat {booking.seat_number}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{booking.route.origin}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatTime(booking.route.departure_time)}</span>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="h-px bg-border flex-1"></div>
          <div className="mx-4 p-2 rounded-full bg-muted">
            <IconComponent className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-px bg-border flex-1"></div>
        </div>

        <div className="text-center">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{booking.route.destination}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatTime(booking.route.arrival_time)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Booked on {formatDate(booking.booked_at)}</span>
        </div>
        
        <div className="flex gap-2">
          {!isCancelled && (
            <DownloadTicketButton
              booking={{
                id: booking.id,
                routeId: booking.id, // Using booking id as route id
                seatNumber: booking.seat_number,
                route: {
                  type: booking.route.type,
                  origin: booking.route.origin,
                  destination: booking.route.destination,
                  departureTime: booking.route.departure_time,
                  arrivalTime: booking.route.arrival_time,
                  vehicleNumber: booking.route.vehicle_number,
                  price: booking.price
                },
                bookedAt: booking.booked_at
              }}
              size="sm"
              variant="outline"
            />
          )}
          
          {!isCancelled && isUpcoming && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onCancel(booking.id)}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};