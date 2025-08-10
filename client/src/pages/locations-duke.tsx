import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { type ServiceLocation } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Target, Crosshair } from "lucide-react";

export default function Locations() {
  const [, setLocation] = useLocation();

  const { data: locationsData, isLoading, error } = useQuery<{locations: ServiceLocation[]}>({
    queryKey: ["/api/locations"],
    retry: false,
  });

  const locations = locationsData?.locations || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-500 mx-auto mb-6"></div>
          <p className="text-yellow-300 font-mono text-xl">SCANNING COMBAT ZONES...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-6 font-mono text-xl">MISSION FAILED: UNABLE TO LOAD TERRITORIES</p>
          <Button onClick={() => window.location.reload()} className="explosive-button">
            RETRY SCAN
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="metal-panel border-b-2 border-yellow-400 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 explosive-button rounded-sm flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-yellow-300">💥</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold neon-yellow font-serif tracking-wider">DOOK SCOOP EM</h1>
                <p className="text-sm text-yellow-300 font-mono tracking-wide">TACTICAL WASTE ELIMINATION</p>
              </div>
            </div>
            <Link href="/">
              <button className="nuclear-button px-4 py-2 font-mono font-bold tracking-wide">
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                RETURN TO BASE
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-16">
          <div className="inline-block nuclear-button px-6 py-3 font-mono font-bold mb-8">
            <Crosshair className="w-5 h-5 inline mr-2" />
            TACTICAL RECONNAISSANCE
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold neon-red font-serif mb-8 tracking-wider">
            COMBAT ZONES
          </h1>
          <p className="text-xl text-yellow-300 font-mono max-w-3xl mx-auto">
            Current operational territories under Dook Scoop Em jurisdiction. 
            Prepare for strategic waste elimination deployment.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {locations.map((location) => (
            <div key={location.id} className="metal-panel p-8 cyber-border">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 explosive-button rounded-sm flex items-center justify-center">
                  <Target className="text-yellow-300 w-8 h-8" />
                </div>
                <Badge 
                  variant={location.isActive === "true" ? "default" : "secondary"}
                  className={location.isActive === "true" 
                    ? "neon-green bg-green-600 font-mono font-bold" 
                    : "neon-yellow bg-yellow-600 text-black font-mono font-bold"
                  }
                >
                  {location.isActive === "true" ? "ACTIVE ZONE" : "INCOMING"}
                </Badge>
              </div>

              <h3 className="text-2xl font-bold neon-yellow font-serif mb-4 tracking-wide">
                {location.city}, {location.state}
              </h3>

              {location.launchDate && (
                <div className="flex items-center mb-6 text-yellow-300">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span className="font-mono font-bold">DEPLOYMENT: {location.launchDate}</span>
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-lg font-bold neon-green font-mono mb-3">OPERATIONAL SECTORS:</h4>
                <div className="flex flex-wrap gap-2">
                  {location.zipCodes?.slice(0, 6).map((zip) => (
                    <Badge 
                      key={zip} 
                      variant="outline" 
                      className="border-yellow-600 text-yellow-300 font-mono"
                    >
                      {zip}
                    </Badge>
                  ))}
                  {location.zipCodes && location.zipCodes.length > 6 && (
                    <Badge 
                      variant="outline" 
                      className="border-red-600 text-red-400 font-mono"
                    >
                      +{location.zipCodes.length - 6} MORE
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-center">
                <Link href="/#waitlist">
                  <button className="toxic-button w-full py-3 font-mono font-bold text-yellow-300">
                    <MapPin className="w-5 h-5 inline mr-2" />
                    REQUEST DEPLOYMENT
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {locations.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 explosive-button rounded-sm flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-3xl font-bold neon-red font-serif mb-4">NO ACTIVE ZONES</h3>
            <p className="text-xl text-yellow-300 font-mono mb-8">
              Operations are being planned. Stay tuned for deployment announcements.
            </p>
            <Link href="/#waitlist">
              <button className="explosive-button px-8 py-4 font-mono font-bold text-xl text-yellow-300">
                JOIN WAITLIST FOR INTEL
              </button>
            </Link>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="metal-panel p-12 cyber-border max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold neon-yellow font-serif mb-6 tracking-wider">
              READY FOR DEPLOYMENT?
            </h2>
            <p className="text-xl text-yellow-300 font-mono mb-8">
              Don't see your sector listed? Intel suggests new territories are under evaluation. 
              Register for priority deployment notification.
            </p>
            <Link href="/#waitlist">
              <button className="explosive-button px-8 py-4 font-mono font-bold text-xl text-yellow-300">
                <Target className="w-6 h-6 mr-3" />
                ENLIST FOR DUTY
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="metal-panel border-t-2 border-yellow-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-12 h-12 explosive-button rounded-sm flex items-center justify-center">
              <span className="text-2xl font-bold text-yellow-300">💥</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold neon-yellow font-serif">DOOK SCOOP EM</h3>
              <p className="text-sm text-yellow-300 font-mono">TACTICAL WASTE ELIMINATION</p>
            </div>
          </div>
          <p className="text-yellow-300 font-mono">
            Professional biological threat neutralization services. Licensed. Insured. Ready for deployment.
          </p>
          <p className="text-yellow-600 font-mono text-sm mt-4">
            © 2025 Dook Scoop Em. All waste eliminated with extreme prejudice.
          </p>
        </div>
      </footer>
    </div>
  );
}