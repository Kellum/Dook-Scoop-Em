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

        {/* Interactive Google Map Section */}
        <Card className="neu-raised shadow-2xl overflow-hidden mb-12">
          <CardHeader className="text-center bg-gray-100">
            <CardTitle className="text-2xl font-black text-gray-800">
              Jacksonville Area Service Map
            </CardTitle>
            <p className="text-gray-600 font-medium">
              Explore our service areas and find your zip code
            </p>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Google Maps Embed */}
            <div className="relative w-full h-96 md:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.48295625535!2d-81.8371373!3d30.3321838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e5b716f1ceafeb%3A0xc4cd7d3896fcc7e2!2sJacksonville%2C%20FL!5e0!3m2!1sen!2sus!4v1694886543210!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jacksonville Service Areas Map"
              ></iframe>
            </div>
            
            {/* Map Legend & Instructions */}
            <div className="p-6 bg-gray-50">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-black text-gray-800 mb-3 flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                    North Area - Zip Codes
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">32097</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">32034</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">32226</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">32218</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">32234</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Yulee, Fernandina Beach, Oceanway, Nassau County</p>
                </div>
                
                <div>
                  <h4 className="font-black text-gray-800 mb-3 flex items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                    East Area - Zip Codes
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-bold">32233</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-bold">32266</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-bold">32250</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-bold">32224</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-bold">32225</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">East Jacksonville, Neptune Beach, Atlantic Beach, Jacksonville Beach</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg border-2 border-orange-200">
                <p className="text-sm font-bold text-gray-800 mb-2">
                  💡 How to use this map:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Search for your address or zip code in the map above</li>
                  <li>• Check which service area (North or East) your location falls into</li>
                  <li>• Click the appropriate area card above to join that waitlist</li>
                  <li>• Not sure? Contact us and we'll help you find the right area!</li>
                </ul>
              </div>
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