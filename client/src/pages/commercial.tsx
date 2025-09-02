import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { Building, Users, MapPin, Clock, Mail } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Commercial() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">
            Commercial Scooping: Coming Soon to the First Coast
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 font-bold">
            We're gearing up to bring poop-free peace to apartments, HOAs, office parks, breweries, and more. Full launch is on the horizon, but if your property can't wait, don't sweat it—reach out and we'll see if we can sneak you in early.
          </p>
          <Link href="/contact">
            <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg mb-4">
              Contact Us About Commercial Service
            </Button>
          </Link>
          <p className="text-sm text-gray-500 italic">
            Soft-opening vibes. Big shovel energy.
          </p>
        </section>

        {/* HOAs & Apartments Section */}
        <section className="mb-16">
          <Card className="neu-raised bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Building className="w-12 h-12 text-orange-600" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
                HOAs & Apartments
              </CardTitle>
              <p className="text-xl md:text-2xl text-orange-600 font-bold">
                Because your tenants deserve clean grass, not landmines.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From neighborhood HOAs to sprawling apartment complexes, we'll keep shared spaces safe, clean, and walkable. Coming soon, but we may be able to help now—especially if residents are tired of dodging surprise piles.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Businesses & Offices Section */}
        <section className="mb-16">
          <Card className="neu-raised bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-orange-600" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
                Businesses & Offices
              </CardTitle>
              <p className="text-xl md:text-2xl text-orange-600 font-bold">
                Nobody wants to step in it on the way to a meeting.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Dog-friendly offices, storefronts, and breweries—your customers and employees will thank you. Even if we're not officially live for businesses yet, you can still reach out. We'll try to get you scooped in.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Parks & Community Spaces Section */}
        <section className="mb-16">
          <Card className="neu-raised bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <MapPin className="w-12 h-12 text-orange-600" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
                Parks & Community Spaces
              </CardTitle>
              <p className="text-xl md:text-2xl text-orange-600 font-bold">
                Public space, not poop space.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Whether it's a local park, dog run, or community lawn, we'll help keep First Coast green spaces actually green. Coming soon—but message us if your space is already in need.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Local Flavor Callout */}
        <section className="mb-20">
          <div className="bg-orange-100 rounded-lg p-8 text-center border-l-4 border-orange-600">
            <p className="text-xl md:text-2xl font-black text-gray-800">
              Duval, we got you. From Amelia Island to Riverside—if it looks like Lot J after a Jags game, tap that button.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
              Tell Us About Your Property
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Commercial services are almost here. If you're ready now, we might be able to sneak you into the lineup early.
            </p>
          </div>

          <Card className="neu-raised bg-white max-w-2xl mx-auto">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-bold">Name *</Label>
                    <Input 
                      id="name" 
                      name="name"
                      required 
                      className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-bold">Email *</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      required 
                      className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-bold">Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      type="tel" 
                      className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="propertyType" className="text-gray-700 font-bold">Property Type *</Label>
                    <Select required data-testid="select-property-type">
                      <SelectTrigger className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hoa">HOA</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="office">Office/Business</SelectItem>
                        <SelectItem value="brewery">Brewery</SelectItem>
                        <SelectItem value="park">Park/Community Space</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-gray-700 font-bold">Address/Area</Label>
                  <Input 
                    id="address" 
                    name="address"
                    placeholder="General area or full address"
                    className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    data-testid="input-address"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700 font-bold">Message</Label>
                  <Textarea 
                    id="message" 
                    name="message"
                    rows={4}
                    placeholder="Tell us about your property, current situation, timeline, or any questions..."
                    className="mt-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    data-testid="textarea-message"
                  />
                </div>

                <div className="text-center">
                  <Button 
                    type="submit" 
                    className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3 w-full md:w-auto"
                    data-testid="button-submit"
                  >
                    Request Commercial Service
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Coming Soon Note */}
        <section className="text-center">
          <div className="bg-gray-100 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-orange-600 mr-2" />
              <h3 className="text-lg font-black text-gray-800">Commercial Services Status</h3>
            </div>
            <p className="text-gray-600">
              We're putting the finishing touches on our commercial operations. Current timeline: launching Q2 2025. 
              But hey, if you need us now, we'll see what we can do!
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}