import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowLeftRight } from "lucide-react";
import { useState } from "react";

interface SearchFilters {
  origin: string;
  destination: string;
  date: string;
  type: 'all' | 'train' | 'bus';
}

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    origin: '',
    destination: '',
    date: new Date().toISOString().split('T')[0],
    type: 'all'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const swapLocations = () => {
    setFilters(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  const popularRoutes = [
    { origin: 'Mumbai', destination: 'Delhi' },
    { origin: 'Delhi', destination: 'Bangalore' },
    { origin: 'Chennai', destination: 'Hyderabad' },
    { origin: 'Pune', destination: 'Mumbai' },
  ];

  return (
    <Card className="p-6 shadow-medium">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Origin */}
          <div className="space-y-2">
            <Label htmlFor="origin">From</Label>
            <Input
              id="origin"
              placeholder="Origin city"
              value={filters.origin}
              onChange={(e) => setFilters(prev => ({ ...prev, origin: e.target.value }))}
              className="h-12"
            />
          </div>

          {/* Swap Button */}
          <div className="flex items-end">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={swapLocations}
              className="h-12 w-full md:w-12"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination">To</Label>
            <Input
              id="destination"
              placeholder="Destination city"
              value={filters.destination}
              onChange={(e) => setFilters(prev => ({ ...prev, destination: e.target.value }))}
              className="h-12"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Travel Date</Label>
            <Input
              id="date"
              type="date"
              value={filters.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="h-12"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Transport Type */}
          <div className="space-y-2 flex-1">
            <Label htmlFor="type">Transport Type</Label>
            <Select value={filters.type} onValueChange={(value: any) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="train">Train Only</SelectItem>
                <SelectItem value="bus">Bus Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button type="submit" className="h-12 px-8" disabled={isLoading}>
            <Search className="h-4 w-4" />
            Search Routes
          </Button>
        </div>
      </form>

      {/* Popular Routes */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Popular Routes</h4>
        <div className="flex flex-wrap gap-2">
          {popularRoutes.map((route, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setFilters(prev => ({ 
                ...prev, 
                origin: route.origin, 
                destination: route.destination 
              }))}
            >
              {route.origin} → {route.destination}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};