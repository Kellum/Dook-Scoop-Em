import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, MapPin, Calendar, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ServiceLocation } from "@shared/schema";

export default function Locations() {
  const { data: locationsData, isLoading } = useQuery<{locations: ServiceLocation[]}>({
    queryKey: ["/api/locations"],
  });

  const locations = locationsData?.locations || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading service areas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Service Areas
            </h1>
            <p className="text-lg text-muted-foreground">
              We're expanding throughout Central Texas! Check out the areas where Dook Scoop Em will be launching soon.
            </p>
          </div>
        </div>
      </div>

      {/* Service Areas Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Card key={location.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">
                      {location.city}, {location.state}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    Coming Soon
                  </Badge>
                </div>
                <CardDescription>
                  Professional pet waste removal service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Launch Date */}
                {location.launchDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">Expected Launch:</span>
                    <span className="text-muted-foreground">{location.launchDate}</span>
                  </div>
                )}

                {/* Zip Codes */}
                <div>
                  <p className="text-sm font-medium mb-2">Service Zip Codes:</p>
                  <div className="flex flex-wrap gap-1">
                    {location.zipCodes?.slice(0, 3).map((zipCode) => (
                      <Badge key={zipCode} variant="outline" className="text-xs">
                        {zipCode}
                      </Badge>
                    ))}
                    {location.zipCodes && location.zipCodes.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{location.zipCodes.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Join Waitlist Button */}
                <Link href="/">
                  <Button className="w-full gap-2" size="sm">
                    <Mail className="h-4 w-4" />
                    Join Waitlist for {location.city}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Don't See Your Area?</CardTitle>
              <CardDescription className="text-lg">
                We're constantly expanding to serve more communities in Texas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Join our waitlist and we'll notify you as soon as we start serving your area. 
                Your interest helps us prioritize new locations!
              </p>
              <Link href="/">
                <Button size="lg" className="gap-2">
                  <Mail className="h-5 w-5" />
                  Join the Waitlist
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}