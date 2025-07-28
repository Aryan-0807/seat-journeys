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
    <Card className="p-6 card-hover border-0 shadow-medium bg-gradient-to-br from-white to-gray-50/50 hover:shadow-strong transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl shadow-sm ${route.type === 'train' ? 'transport-train bg-gradient-to-br from-blue-50 to-blue-100' : 'transport-bus bg-gradient-to-br from-orange-50 to-orange-100'} group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-900">{route.vehicle_number}</h3>
            <Badge 
              variant={route.type === 'train' ? 'default' : 'secondary'} 
              className={`mt-1 ${route.type === 'train' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'} border-0`}
            >
              {route.type.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ₹{route.price.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground font-medium">per seat</p>
        </div>
      </div>

      <div className="relative mb-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-bold text-lg text-gray-900">{route.origin}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">{formatTime(route.departure_time)}</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">{formatDate(route.departure_time)}</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
            <div className="mx-4 p-3 rounded-full bg-white shadow-md border border-gray-200 group-hover:shadow-lg transition-shadow duration-300">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
          </div>

          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="font-bold text-lg text-gray-900">{route.destination}</span>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">{formatTime(route.arrival_time)}</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">{formatDate(route.arrival_time)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-gray-700">
            {route.seats_available} of {route.seats_total} seats available
          </span>
        </div>
        
        <Button 
          variant="accent" 
          onClick={() => onBook(route)}
          disabled={route.seats_available === 0}
          className="min-w-[140px] px-6 py-3 font-semibold hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {route.seats_available === 0 ? 'Sold Out' : 'Book Now'}
        </Button>
      </div>

      {route.seats_available <= 5 && route.seats_available > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <p className="text-sm font-semibold text-orange-800">
              Only {route.seats_available} seats left! Book now to secure your journey.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};