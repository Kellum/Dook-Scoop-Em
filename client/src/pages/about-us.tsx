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

        {/* Ryan's Interests */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
              When I'm Not Scooping
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jacksonville keeps me busy, but here's what else you might catch me doing around town:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="neu-raised bg-white text-center">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛹</span>
                </div>
                <h3 className="font-black text-gray-800 mb-3">Skating Around Town</h3>
                <p className="text-gray-600">
                  You'll find me cruising through Jacksonville's streets and parks on four wheels.
                </p>
              </CardContent>
            </Card>

            <Card className="neu-raised bg-white text-center">
              <CardContent className="p-8">
                <Camera className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-black text-gray-800 mb-3">Sunrise Photography</h3>
                <p className="text-gray-600">
                  Chasing the perfect sunrise shot at Jax Beach - because our coastline is unbeatable.
                </p>
              </CardContent>
            </Card>

            <Card className="neu-raised bg-white text-center">
              <CardContent className="p-8">
                <Gamepad2 className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-black text-gray-800 mb-3">90's Retro Gaming</h3>
                <p className="text-gray-600">
                  Button-mashing through classic games (and yes, this explains the pixel art branding).
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why This Matters */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="neu-raised bg-orange-50">
              <CardContent className="p-8">
                <Heart className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-2xl font-black text-gray-800 mb-4">Pets Are Family</h3>
                <p className="text-gray-600">
                  My love for animals drives everything I do. Dogs deserve clean, safe spaces, and their families deserve to enjoy their yards without worry.
                </p>
              </CardContent>
            </Card>

            <Card className="neu-raised bg-blue-50">
              <CardContent className="p-8">
                <MapPin className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-black text-gray-800 mb-4">Your Neighbor, Not a Franchise</h3>
                <p className="text-gray-600">
                  I live and work right here in Jacksonville. This isn't some corporate operation - it's your local neighbor helping fellow pet families.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Service Area */}
        <section className="mb-20">
          <Card className="neu-raised bg-white">
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-gray-800 mb-6">Serving Northeast Florida</h2>
              <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
                From Amelia Island to Riverside, we're keeping First Coast yards clean. Currently serving Jacksonville, Yulee, Fernandina, Jacksonville Beach, Neptune Beach, Atlantic Beach, and Ponte Vedra.
              </p>
              <div className="grid md:grid-cols-4 gap-4 text-center max-w-2xl mx-auto">
                <div className="font-bold text-gray-800">Jacksonville</div>
                <div className="font-bold text-gray-800">Yulee</div>
                <div className="font-bold text-gray-800">Fernandina</div>
                <div className="font-bold text-gray-800">Jax Beach</div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
            Ready to Get Your Yard Back?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's give you more time for the good stuff — like actually enjoying your yard with your pets.
          </p>
          <Link href="/contact">
            <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg">
              Get Your Free Quote
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}