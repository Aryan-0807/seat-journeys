import { useState } from 'react';
import { useToast } from "@/hooks/use-toast"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { Globe, Key, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PriceData {
  source: string;
  data: any;
  scrapedAt: string;
}

export const PriceScraperForm = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(!!FirecrawlService.getApiKey());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState<'irctc' | 'redbus' | 'makemytrip'>('irctc');
  const [scrapedData, setScrapedData] = useState<PriceData | null>(null);

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const isValid = await FirecrawlService.testApiKey(apiKey);
    
    if (isValid) {
      FirecrawlService.saveApiKey(apiKey);
      setIsKeySet(true);
      setApiKey('');
      toast({
        title: "Success",
        description: "Firecrawl API key set successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid API key. Please check and try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleScrapePrices = async () => {
    setIsLoading(true);
    setScrapedData(null);
    
    try {
      const result = await FirecrawlService.scrapePrices(selectedSource);
      
      if (result.success) {
        const priceData: PriceData = {
          source: selectedSource,
          data: result.data,
          scrapedAt: new Date().toISOString()
        };
        
        setScrapedData(priceData);
        toast({
          title: "Success",
          description: `Successfully scraped data from ${selectedSource.toUpperCase()}`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to scrape prices",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error scraping prices:', error);
      toast({
        title: "Error",
        description: "Failed to scrape prices",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isKeySet) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle>Setup Firecrawl API</CardTitle>
          </div>
          <CardDescription>
            To fetch real-time prices from IRCTC and other booking platforms, you need a Firecrawl API key.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              1. Go to <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">firecrawl.dev</a> and create an account
            </p>
            <p className="text-sm text-muted-foreground">
              2. Get your API key from the dashboard
            </p>
            <p className="text-sm text-muted-foreground">
              3. Enter it below to start scraping
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              Firecrawl API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="fc-..."
            />
          </div>
          
          <Button
            onClick={handleSetApiKey}
            disabled={isLoading || !apiKey.trim()}
            className="w-full"
          >
            {isLoading ? "Validating..." : "Set API Key"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>Real-time Price Scraper</CardTitle>
          </div>
          <CardDescription>
            Scrape current prices from popular Indian booking platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Platform</label>
            <Select value={selectedSource} onValueChange={(value: 'irctc' | 'redbus' | 'makemytrip') => setSelectedSource(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="irctc">IRCTC (Train Bookings)</SelectItem>
                <SelectItem value="redbus">RedBus (Bus Bookings)</SelectItem>
                <SelectItem value="makemytrip">MakeMyTrip (Travel Portal)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={handleScrapePrices}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Scraping..." : `Scrape from ${selectedSource.toUpperCase()}`}
          </Button>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">Note</Badge>
            <span>This will fetch current market prices for reference</span>
          </div>
        </CardContent>
      </Card>

      {scrapedData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                <CardTitle>Scraped Data</CardTitle>
              </div>
              <Badge variant="secondary">
                {scrapedData.source.toUpperCase()}
              </Badge>
            </div>
            <CardDescription>
              Data scraped on {new Date(scrapedData.scrapedAt).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg max-h-96 overflow-auto">
              <pre className="text-sm">
                {JSON.stringify(scrapedData.data, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};