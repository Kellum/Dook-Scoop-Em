import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Camera, Gamepad2, User, Heart, MapPin } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">
            About Dook Scoop 'Em
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-bold">
            Hey, I'm Ryan — the human behind Dook Scoop 'Em.
          </p>
        </section>

        {/* Ryan's Story */}
        <section className="mb-20">
          <Card className="neu-raised bg-white max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <User className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-black text-gray-800">Meet Ryan</h2>
              </div>
              
              <div className="text-lg text-gray-600 space-y-6 max-w-3xl mx-auto">
                <p>
                  I'm a Jacksonville local through and through. When I'm not out scooping, you'll probably catch me skating around town, chasing the sunrise with my camera at Jax Beach, or button-mashing through some 90's retro games. (Yes, the name and the pixel art are a nod to that era — and to my questionable high score skills.)
                </p>
                
                <p>
                  My love for animals is baked into everything I do. Dogs (and the people who love them) deserve clean, safe yards. That's why I started this company — not because scooping is glamorous, but because pets are family, and family deserves care.
                </p>
                
                <p>
                  I'm not a franchise, I'm your neighbor. I live here, I work here, and I want to make life easier for fellow First Coasters who'd rather spend time walking their dogs than dodging backyard landmines.
                </p>
                
                <p className="font-bold text-gray-800 text-xl text-center border-l-4 border-orange-600 pl-6">
                  Clean yards, happy pets, and more time for you — that's the mission. Everything else (skating, photography, retro gaming, and the occasional bad joke) just comes along for the ride.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

      </main>

      <Footer />
    </div>
  );
}