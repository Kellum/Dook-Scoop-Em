import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
              Choose Your Area
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-gray-700 mb-8 font-bold">
            Select your service area to join the waitlist
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pb-16">
        <div className="space-y-6">
          {/* North Area */}
          <Card className="neu-raised shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-black text-gray-800 mb-2">
                North Jacksonville, Yulee & Fernandina
              </CardTitle>
              <p className="text-gray-600 font-medium">
                Nassau County and surrounding areas
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => handleAreaClick('/waitlist/northJax-yulee-dina')}
                className="w-full neu-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg transition-all duration-200"
              >
                Join North Area Waitlist
              </Button>
            </CardContent>
          </Card>

          {/* East Area */}
          <Card className="neu-raised shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-black text-gray-800 mb-2">
                East Jacksonville & Beaches
              </CardTitle>
              <p className="text-gray-600 font-medium">
                Jacksonville Beach, Neptune Beach, Atlantic Beach areas
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => handleAreaClick('/waitlist/eastJax-beaches')}
                className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 text-lg transition-all duration-200"
              >
                Join East Area Waitlist
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Not Sure Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 font-medium mb-6">
            Not sure which area? Pick the one closest to you - we'll sort it out when we launch!
          </p>
          
          <p className="text-sm text-gray-500 font-medium italic">
            We Fear No Pile, wherever you are in Northeast Florida 🐾
          </p>
        </div>
      </main>
    </div>
  );
}