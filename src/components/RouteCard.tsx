import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Train, Bus, MapPin, Clock, Users } from "lucide-react";

interface Route {
  id: string;
  type: 'train' | 'bus';
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  vehicle_number: string;
  seats_total: number;
  seats_available: number;
  price: number;
}

interface RouteCardProps {
  route: Route;
  onBook: (route: Route) => void;
}

export const RouteCard = ({ route, onBook }: RouteCardProps) => {
  const IconComponent = route.type === 'train' ? Train : Bus;
  const typeColor = route.type === 'train' ? 'train' : 'bus';

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="p-6 card-hover border shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${route.type === 'train' ? 'transport-train' : 'transport-bus'}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{route.vehicle_number}</h3>
            <Badge variant={route.type === 'train' ? 'default' : 'secondary'} className="mt-1">
              {route.type.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">₹{route.price}</p>
          <p className="text-sm text-muted-foreground">per seat</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{route.origin}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatTime(route.departure_time)}</span>
            </div>
            <p className="text-xs text-muted-foreground">{formatDate(route.departure_time)}</p>
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
              <span className="font-semibold">{route.destination}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatTime(route.arrival_time)}</span>
            </div>
            <p className="text-xs text-muted-foreground">{formatDate(route.arrival_time)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {route.seats_available} of {route.seats_total} seats available
          </span>
        </div>
        
        <Button 
          variant="accent" 
          onClick={() => onBook(route)}
          disabled={route.seats_available === 0}
          className="min-w-[120px]"
        >
          {route.seats_available === 0 ? 'Sold Out' : 'Book Seat'}
        </Button>
      </div>

      {route.seats_available <= 5 && route.seats_available > 0 && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-sm text-warning-foreground">
            ⚡ Only {route.seats_available} seats left! Book now.
          </p>
        </div>
      )}
    </Card>
  );
};