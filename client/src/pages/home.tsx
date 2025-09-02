import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, Clock, Heart, MapPin, CheckCircle, Users, Star } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import pixelDogImage from "@assets/dog small lower centered_1756833072461.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-screen w-full bg-cover md:bg-contain bg-center bg-no-repeat flex items-center justify-center" style={{backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)), url('${pixelDogImage}')`}}>
        <div className="max-w-6xl mx-auto text-center relative z-20 px-4">
          <h1 className="text-5xl md:text-7xl font-black text-gray-800 mb-6 leading-tight drop-shadow-lg">
            We Fear No Pile.
          </h1>
          <h2 className="text-xl md:text-2xl text-orange-600 mb-8 max-w-3xl mx-auto font-bold">
            We scoop Jacksonville's poop so the First Coast stays fresh.
          </h2>
          <div className="flex justify-center">
            <Link href="/contact">
              <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg">
                Get Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dead Simple Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-8">
            This is dead simple.
          </h2>
          <p className="text-2xl md:text-3xl text-gray-600 font-bold">
            You have poop, we scoop poop.
          </p>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 text-center">
              <Shield className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-800 mb-2">Licensed & Insured</h3>
              <p className="text-gray-600">The only thing risky here is stepping in it—don't worry, we're fully insured.</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 text-center">
              <Clock className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-800 mb-2">Reliable Schedule</h3>
              <p className="text-gray-600">Weekly, bi-weekly, or one-time service. Think of us as your poop fairy, always there</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 text-center">
              <Heart className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-800 mb-2">Pet Safe Methods</h3>
              <p className="text-gray-600">Safe for dogs, safe for lawns, safe for the planet. Now if only it worked on your neighbor's chihuahua.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-6">We Do Things a Lil Different…</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Forget the overwhelming list of add-ons. Our pricing is simple and stress-free. Unless you've got a Great Dane army or a backyard that needs its own zip code, you're covered.
            </p>
          </div>
          
          <div className="text-center">
            <Link href="/contact">
              <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg">
                Get Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* The Dook Scoop 'Em Difference */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-8">
                The Dook Scoop 'Em Difference
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 mb-2">We Actually Show Up</h3>
                    <p className="text-gray-600">Reliable service you can count on. No more wondering if your yard will be clean.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 mb-2">Thorough & Professional</h3>
                    <p className="text-gray-600">We don't just grab the obvious stuff. Every square inch gets checked.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 mb-2">Local Nassau County Business</h3>
                    <p className="text-gray-600">We live here, work here, and care about our community.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 mb-2">Fair Pricing, No Surprises</h3>
                    <p className="text-gray-600">Transparent pricing. What we quote is what you pay.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🐕</div>
              <h3 className="text-2xl font-black text-gray-800 mb-4">We Fear No Pile!</h3>
              <p className="text-gray-600 mb-6">
                From tiny terrier droppings to Great Dane disasters, we handle it all with a smile 
                (hidden behind our professional equipment, of course).
              </p>
              <Link href="/how-we-scoop">
                <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3">
                  See How We Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-6">
            Ready to Reclaim Your Yard?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our waitlist to be among the first to experience professional pet waste removal in Nassau County.
            Founding members get exclusive perks!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg">
                Join Waitlist Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="neu-button border-orange-600 text-orange-600 hover:bg-orange-50 font-bold px-8 py-4 text-lg">
                Ask Questions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}