import React from "react";
import { PriceScraperForm } from "@/components/PriceScraperForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PricingTools() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-4">Pricing Tools</h1>
            <p className="text-muted-foreground">
              Real-time price scraping from popular Indian booking platforms
            </p>
          </div>

          <Tabs defaultValue="scraper" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scraper">Price Scraper</TabsTrigger>
              <TabsTrigger value="analysis">Price Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scraper" className="mt-6">
              <PriceScraperForm />
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Price Analysis Dashboard</CardTitle>
                  <CardDescription>
                    Compare prices across different platforms and routes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Price analysis features coming soon! This will include:
                    </p>
                    <ul className="list-disc list-inside mt-4 text-sm text-muted-foreground space-y-2">
                      <li>Historical price trends</li>
                      <li>Cross-platform price comparison</li>
                      <li>Best time to book recommendations</li>
                      <li>Dynamic pricing insights</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}