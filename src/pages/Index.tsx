import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { SearchForm } from "@/components/SearchForm";
import { RouteCard } from "@/components/RouteCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train, Bus, MapPin, Star, Users, Clock, ArrowRight } from "lucide-react";

// Mock data - replace with Supabase queries
const mockRoutes = [
  {
    id: '1',
    type: 'train' as const,
    origin: 'Mumbai',
    destination: 'Delhi',
    departure_time: '2024-07-28T14:30:00',
    arrival_time: '2024-07-29T06:30:00',
    vehicle_number: 'RAJ-2024',
    seats_total: 72,
    seats_available: 23,
    price: 1250
  },
  {
    id: '2',
    type: 'bus' as const,
    origin: 'Pune',
    destination: 'Mumbai',
    departure_time: '2024-07-28T09:00:00',
    arrival_time: '2024-07-28T12:30:00',
    vehicle_number: 'MH-12-BUS-1234',
    seats_total: 45,
    seats_available: 12,
    price: 450
  },
  {
    id: '3',
    type: 'train' as const,
    origin: 'Delhi',
    destination: 'Bangalore',
    departure_time: '2024-07-28T22:15:00',
    arrival_time: '2024-07-30T04:45:00',
    vehicle_number: 'KTK-EXP',
    seats_total: 72,
    seats_available: 45,
    price: 2100
  },
  {
    id: '4',
    type: 'bus' as const,
    origin: 'Chennai',
    destination: 'Hyderabad',
    departure_time: '2024-07-28T20:00:00',
    arrival_time: '2024-07-29T06:00:00',
    vehicle_number: 'TN-09-BUS-5678',
    seats_total: 40,
    seats_available: 3,
    price: 850
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState(mockRoutes);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState(null); // Replace with Supabase auth

  const handleSearch = async (filters: any) => {
    setIsSearching(true);
    
    // Simulate search
    setTimeout(() => {
      // Filter routes based on search criteria
      let filteredRoutes = mockRoutes;
      
      if (filters.origin) {
        filteredRoutes = filteredRoutes.filter(route => 
          route.origin.toLowerCase().includes(filters.origin.toLowerCase())
        );
      }
      
      if (filters.destination) {
        filteredRoutes = filteredRoutes.filter(route => 
          route.destination.toLowerCase().includes(filters.destination.toLowerCase())
        );
      }
      
      if (filters.type !== 'all') {
        filteredRoutes = filteredRoutes.filter(route => route.type === filters.type);
      }
      
      setRoutes(filteredRoutes);
      setIsSearching(false);
    }, 1000);
  };

  const handleBookRoute = (route: any) => {
    navigate(`/route/${route.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onLogout={() => setUser(null)} />
      
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Your Journey Starts Here
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Book train and bus tickets seamlessly. Choose your perfect seat and travel in comfort.
          </p>
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Train className="h-6 w-6" />
              <span className="text-lg">Trains</span>
            </div>
            <div className="flex items-center gap-2">
              <Bus className="h-6 w-6" />
              <span className="text-lg">Buses</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6" />
              <span className="text-lg">Comfort</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-8 relative z-10 mb-12">
        <SearchForm onSearch={handleSearch} isLoading={isSearching} />
      </div>

      {/* Routes Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Available Routes</h2>
            <p className="text-muted-foreground">
              {routes.length} routes found for your journey
            </p>
          </div>
          
          <Button variant="outline" onClick={() => navigate('/bookings')}>
            My Bookings
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {isSearching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : routes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {routes.map(route => (
              <RouteCard
                key={route.id}
                route={route}
                onBook={handleBookRoute}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="p-4 rounded-full bg-muted w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No routes found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or check back later for new routes.
            </p>
            <Button variant="accent" onClick={() => setRoutes(mockRoutes)}>
              View All Routes
            </Button>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1M+</div>
              <div className="text-muted-foreground">Happy Travelers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Cities Connected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Customer Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99%</div>
              <div className="text-muted-foreground">On-Time Performance</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
