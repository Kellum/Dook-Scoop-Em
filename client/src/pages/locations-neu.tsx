import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";

interface Location {
  id: string;
  city: string;
  state: string;
  zipCodes: string[];
  launchDate?: string;
  isActive: string;
}

export default function Locations() {
  const { data: locations = [], isLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="neu-card">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-muted h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="neu-flat sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="logo-container">
              <div className="logo-icon">💩⚒️</div>
              <div>
                <h1 className="text-2xl font-bold text-primary">Dook Scoop 'Em</h1>
                <p className="slogan">We fear no pile.</p>
              </div>
            </div>
            
            <Link href="/">
              <button className="neu-flat px-4 py-2 font-medium text-primary hover:text-accent transition-colors flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-16 fade-in">
          <div className="inline-block neu-flat px-6 py-3 mb-8">
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="vcr-text text-accent font-medium">Service Area Check</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-8">
            Service Areas
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Current service territories where Dook Scoop 'Em operates. 
            Check if we're available in your neighborhood!
          </p>
        </div>

        {/* Locations Grid */}
        {locations.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
            {locations.map((location) => (
              <div key={location.id} className="neu-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 neu-flat rounded-2xl flex items-center justify-center">
                    <span className="text-2xl pixel-art">📍</span>
                  </div>
                  <div className={location.isActive === "true" ? "status-active" : "status-coming-soon"}>
                    {location.isActive === "true" ? "Now Serving" : "Coming Soon"}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-primary mb-4">
                  {location.city}, {location.state}
                </h3>

                {location.launchDate && (
                  <div className="flex items-center mb-6 text-muted-foreground">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span className="font-medium">Launch Date: {location.launchDate}</span>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-primary mb-3">Service Zip Codes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {location.zipCodes.map((zip, index) => (
                      <span 
                        key={index} 
                        className="neu-flat px-3 py-1 text-sm font-medium text-muted-foreground"
                      >
                        {zip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/#waitlist">
                    <button className="neu-button w-full py-3 flex items-center justify-center space-x-2">
                      <MapPin className="w-5 h-5" />
                      <span>Join Waitlist</span>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 fade-in">
            <div className="w-24 h-24 neu-flat rounded-3xl flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl pixel-art">📍</span>
            </div>
            <h3 className="text-3xl font-bold text-primary mb-4">No Service Areas Yet</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're expanding to new areas soon. Join our waitlist to be notified when we launch near you.
            </p>
            <Link href="/#waitlist">
              <button className="neu-button px-8 py-4 text-lg">
                Join Our Waitlist
              </button>
            </Link>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center fade-in">
          <div className="neu-card max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-primary mb-6">
              Want Service in Your Area?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Don't see your area listed? We're always expanding to new neighborhoods. 
              Join our waitlist to be first in line when we come to your area.
            </p>
            <Link href="/#waitlist">
              <button className="neu-button px-8 py-4 text-lg flex items-center space-x-2 mx-auto">
                <span className="pixel-art">⚒️</span>
                <span>Join Our Waitlist</span>
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}