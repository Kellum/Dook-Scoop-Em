import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";

interface WaitlistArea {
  id: string;
  name: string;
  description: string;
  zipCodes: string[];
  route: string;
  color: string;
  hoverColor: string;
}

const waitlistAreas: WaitlistArea[] = [
  {
    id: "north-jax",
    name: "North Jax, Yulee & Fernandina",
    description: "Yulee, Fernandina Beach, Oceanway, Nassau County",
    zipCodes: ["32097", "32034", "32226", "32218", "32234"],
    route: "/waitlist/northJax-yulee-dina",
    color: "bg-blue-100 border-blue-300",
    hoverColor: "hover:bg-blue-200"
  },
  {
    id: "east-jax",
    name: "East Jax & Beaches",
    description: "East Jacksonville, Neptune Beach, Atlantic Beach, Jacksonville Beach",
    zipCodes: ["32233", "32266", "32250", "32224", "32225"],
    route: "/waitlist/eastJax-beaches",
    color: "bg-orange-100 border-orange-300",
    hoverColor: "hover:bg-orange-200"
  }
];

export default function WaitlistMap() {
  const [, setLocation] = useLocation();

  const handleAreaClick = (route: string) => {
    setLocation(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="w-full py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-gray-800"
            style={{ fontFamily: 'var(--font-90s)', letterSpacing: '0.05em' }}
          >
            DOOK SCOOP 'EM
          </h1>
          
          <div className="inline-block bg-gradient-to-b from-orange-100 to-orange-200 px-6 py-3 rounded-lg mb-4 shadow-sm">
            <p className="text-xl md:text-2xl text-gray-800 font-black">
              Choose Your Service Area
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-gray-700 mb-4 font-bold">
            Select your area below to join the waitlist for your neighborhood
          </p>
          
          <p className="text-base md:text-lg text-gray-500 mb-8 font-medium italic">
            We Fear No Pile, wherever you are in Northeast Florida!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* Interactive Area Map */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {waitlistAreas.map((area) => (
            <Card 
              key={area.id}
              className={`neu-raised cursor-pointer transition-all duration-200 transform hover:scale-105 ${area.color} ${area.hoverColor} border-2`}
              onClick={() => handleAreaClick(area.route)}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-700" />
                </div>
                <CardTitle className="text-2xl font-black text-gray-800 mb-2">
                  {area.name}
                </CardTitle>
                <p className="text-gray-700 font-medium">
                  {area.description}
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Zip Codes Covered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {area.zipCodes.map((zip) => (
                        <span 
                          key={zip}
                          className="bg-white bg-opacity-60 px-3 py-1 rounded-full text-sm font-bold text-gray-800"
                        >
                          {zip}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 text-lg transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAreaClick(area.route);
                    }}
                  >
                    Join Waitlist for This Area
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visual Map Section */}
        <Card className="neu-raised shadow-2xl overflow-hidden mb-12">
          <CardHeader className="text-center bg-gray-100">
            <CardTitle className="text-2xl font-black text-gray-800">
              Jacksonville Area Service Map
            </CardTitle>
            <p className="text-gray-600 font-medium">
              Click on your area to join the waitlist
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Simplified SVG Map */}
            <div className="relative max-w-2xl mx-auto">
              <svg viewBox="0 0 400 300" className="w-full h-auto">
                {/* Background */}
                <rect width="400" height="300" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
                
                {/* North Area (Yulee, Fernandina, Nassau County) */}
                <g 
                  className="cursor-pointer transition-all duration-200 hover:opacity-80"
                  onClick={() => handleAreaClick('/waitlist/northJax-yulee-dina')}
                >
                  <rect x="50" y="30" width="300" height="100" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="8" />
                  <text x="200" y="65" textAnchor="middle" className="font-black text-lg" fill="#1e40af">
                    North Jax, Yulee & Fernandina
                  </text>
                  <text x="200" y="85" textAnchor="middle" className="font-medium text-sm" fill="#1e40af">
                    32097, 32034, 32226, 32218, 32234
                  </text>
                  <text x="200" y="105" textAnchor="middle" className="font-bold text-xs" fill="#1e40af">
                    Click to Join Waitlist
                  </text>
                </g>
                
                {/* East Area (East Jax & Beaches) */}
                <g 
                  className="cursor-pointer transition-all duration-200 hover:opacity-80"
                  onClick={() => handleAreaClick('/waitlist/eastJax-beaches')}
                >
                  <rect x="50" y="170" width="300" height="100" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" rx="8" />
                  <text x="200" y="205" textAnchor="middle" className="font-black text-lg" fill="#c2410c">
                    East Jax & Beaches
                  </text>
                  <text x="200" y="225" textAnchor="middle" className="font-medium text-sm" fill="#c2410c">
                    32233, 32266, 32250, 32224, 32225
                  </text>
                  <text x="200" y="245" textAnchor="middle" className="font-bold text-xs" fill="#c2410c">
                    Click to Join Waitlist
                  </text>
                </g>
                
                {/* Decorative elements */}
                <circle cx="370" cy="50" r="8" fill="#22c55e" opacity="0.6" />
                <text x="370" y="30" textAnchor="middle" className="text-xs font-bold" fill="#16a34a">Available</text>
                
                <circle cx="370" cy="250" r="8" fill="#22c55e" opacity="0.6" />
                <text x="370" y="270" textAnchor="middle" className="text-xs font-bold" fill="#16a34a">Available</text>
                
                {/* Coming Soon indicator */}
                <text x="200" y="290" textAnchor="middle" className="text-xs font-medium italic" fill="#6b7280">
                  More areas coming soon...
                </text>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Not Sure Section */}
        <Card className="neu-raised max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-black text-gray-800">
              Not Sure Which Area?
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 font-medium">
              Can't find your zip code above? We're expanding rapidly across Northeast Florida!
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                onClick={() => handleAreaClick('/waitlist/northJax-yulee-dina')}
                className="neu-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
              >
                North/West Areas
              </Button>
              
              <Button 
                onClick={() => handleAreaClick('/waitlist/eastJax-beaches')}
                className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold py-3"
              >
                East/Beach Areas
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 font-medium italic">
              Don't worry - we'll match you to the right service area when we launch!
            </p>
          </CardContent>
        </Card>

        {/* Service Info */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-black text-gray-800 mb-8">
            Professional Pet Waste Removal Coming Soon
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-black text-gray-800">Licensed & Insured</h4>
              <p className="text-gray-600">Fully licensed business with comprehensive insurance coverage</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-black text-gray-800">Weekly Service</h4>
              <p className="text-gray-600">Consistent weekly cleanup you can count on</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-black text-gray-800">Pet Safe</h4>
              <p className="text-gray-600">Only eco-friendly products safe for your pets</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}