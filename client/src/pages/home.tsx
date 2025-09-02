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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg">
                Join Our Waitlist
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="neu-button border-orange-600 text-orange-600 hover:bg-orange-50 font-bold px-8 py-4 text-lg">
                Get Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 text-center">
              <Shield className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-800 mb-2">Licensed & Insured</h3>
              <p className="text-gray-600">Professional service you can trust with full liability coverage.</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 text-center">
              <Clock className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-800 mb-2">Reliable Schedule</h3>
              <p className="text-gray-600">Weekly, bi-weekly, or one-time cleanups. Always on time.</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 text-center">
              <Heart className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-800 mb-2">Pet Safe Methods</h3>
              <p className="text-gray-600">Eco-friendly products that are safe for your furry family.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nassau County Service Area */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-6">
                Nassau County Pet Waste Removal Services
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Starting strong in Yulee, Fernandina Beach, and Oceanway. We're bringing professional, 
                reliable pet waste removal to Nassau County with plans to expand throughout North East Florida.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                  <span className="text-gray-700 font-medium">Weekly & bi-weekly service plans</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                  <span className="text-gray-700 font-medium">One-time cleanup available</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                  <span className="text-gray-700 font-medium">Commercial property services</span>
                </div>
              </div>
              <Link href="/residential">
                <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3">
                  View Residential Services
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-8">
              <MapPin className="w-20 h-20 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-gray-800 text-center mb-4">Current Service Areas</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 text-center">
                  <span className="font-bold text-gray-800">Yulee</span>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <span className="font-bold text-gray-800">Fernandina Beach</span>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <span className="font-bold text-gray-800">Oceanway</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center mt-4 italic">
                More Nassau County areas coming soon!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-6">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional pet waste removal for homes and businesses. No pile too big, no yard too small.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-black text-gray-800 mb-4">Weekly Service</h3>
              <p className="text-gray-600 mb-4">Perfect for busy pet parents. We'll keep your yard clean every week.</p>
              <div className="text-2xl font-black text-orange-600 mb-4">Starting at $15/visit</div>
              <Link href="/residential">
                <Button className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-black text-gray-800 mb-4">Bi-Weekly Service</h3>
              <p className="text-gray-600 mb-4">Great value option for smaller dogs or less frequent needs.</p>
              <div className="text-2xl font-black text-orange-600 mb-4">Starting at $18/visit</div>
              <Link href="/residential">
                <Button className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-black text-gray-800 mb-4">One-Time Cleanup</h3>
              <p className="text-gray-600 mb-4">Moving in? Spring cleaning? We'll get your yard pristine.</p>
              <div className="text-2xl font-black text-orange-600 mb-4">Starting at $75</div>
              <Link href="/contact">
                <Button className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold">
                  Get Quote
                </Button>
              </Link>
            </div>
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