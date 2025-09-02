import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, Clock, Heart, MapPin, CheckCircle, Users, Star } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import pixelDogImage from "@assets/dog small lower centered_1756833072461.png";
import heroImage from "@assets/transp_BG_1756840650946.png";

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
              <h3 className="text-xl font-black text-gray-800 mb-2">Insured</h3>
              <p className="text-gray-600">The only thing risky here is stepping in it—don't worry, we're fully insured.</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 text-center">
              <Clock className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-800 mb-2">Reliable</h3>
              <p className="text-gray-600">Weekly, bi-weekly, or one-time service. Think of us as your poop fairy, always there</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 text-center">
              <Heart className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-800 mb-2">Pet Safe</h3>
              <p className="text-gray-600">Safe for dogs, safe for lawns, safe for the planet, fairies, chupacabras, bigfoot, etc.</p>
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
              Forget the overwhelming list of add-ons. Our pricing is simple and stress-free. Unless you've got a Great Dane army, a backyard with its own zip code, or a yard that hasn't been cleaned since the Jags' last playoff run.
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
      <section className="py-20 px-4 bg-gray-50">
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
                    <p className="text-gray-600">No ghosting, no excuses. Just a clean yard, every time. This isn't Craigslist.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 mb-2">Thorough</h3>
                    <p className="text-gray-600">Other guys might do a "drive-by scoop." We hunt down every pile like it owes us money.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 mb-2">Local to Jax</h3>
                    <p className="text-gray-600">Born and raised right here. We clean yards, cheer for the Jags, and dodge the same potholes you do.</p>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="bg-white rounded-lg p-8 text-center">
              <img src={heroImage} alt="We Fear No Pile Hero" className="w-24 h-24 mx-auto mb-4" />
              <p className="text-gray-600 mb-6">
                It's dirty work, sure. But from terrier sprinkles to Dane dumps, we're the ones who actually show up and do it.
              </p>
              <Link href="/contact">
                <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3">
                  Get Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Haiku Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-8">
            A Poop Scoop Haiku
          </h2>
          <div className="text-2xl md:text-3xl text-gray-600 mb-8 italic leading-relaxed">
            <p>From Fernandina,</p>
            <p>Down to Nocatee we scoop,</p>
            <p>Duval stays cleaner.</p>
          </div>
          <div className="flex justify-center">
            <Link href="/contact">
              <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg">
                Send Us Your Own Haiku
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}