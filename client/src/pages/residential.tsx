import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { CheckCircle, X, Home, Calendar, Users, Shield } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Residential() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">
            Residential Poop Scooping
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 font-bold">
            We fear no pile in your backyard! Professional service that keeps your lawn pristine and your family happy.
          </p>
          <Link href="/onboard">
            <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg">
              Get Your Quote Today
            </Button>
          </Link>
        </section>

        {/* Pricing Chart */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-6">
              Simple, Honest Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No hidden fees, no surprise charges. Everything included. No seriously.
              <br />
              Just clean yards and happy dogs.
            </p>
          </div>

          {/* Mobile Cards (hidden on desktop) */}
          <div className="block lg:hidden space-y-6 mb-8">
            {/* Weekly Service Card */}
            <Card className="neu-raised">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="flex items-center text-lg font-black text-gray-800">
                  <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                  Once a Week
                </CardTitle>
                <p className="text-sm text-gray-500">Perfect for most families</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-sm font-bold text-gray-600">1 Dog</div>
                    <div className="text-xl font-black text-gray-900">$27.50</div>
                    <div className="text-xs text-gray-500 italic">billed monthly at $110</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-sm font-bold text-gray-600">2 Dogs</div>
                    <div className="text-xl font-black text-gray-900">$32.50</div>
                    <div className="text-xs text-gray-500 italic">billed monthly at $130</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-sm font-bold text-gray-600">3 Dogs</div>
                    <div className="text-xl font-black text-gray-900">$37.50</div>
                    <div className="text-xs text-gray-500 italic">billed monthly at $150</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-sm font-bold text-gray-600">4 Dogs</div>
                    <div className="text-xl font-black text-gray-900">$42.50</div>
                    <div className="text-xs text-gray-500 italic">billed monthly at $170</div>
                  </div>
                </div>
                <div className="text-center mt-4 px-4 pb-4">
                  <button
                    onClick={() => {
                      const section = document.getElementById('comparison-section');
                      if (section) {
                        const yOffset = -100; // Fine-tuned buffer for navbar
                        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                  >
                    with everything included. <span className="underline">Learn more</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Twice Weekly Service Card */}
            <Card className="neu-raised bg-orange-50">
              <CardHeader className="bg-orange-100 rounded-t-lg">
                <CardTitle className="flex items-center text-lg font-black text-gray-800">
                  <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                  Twice a Week
                </CardTitle>
                <p className="text-sm text-gray-500">For busy pups or big yards</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-white rounded">
                    <div className="text-sm font-bold text-gray-600">1 Dog</div>
                    <div className="text-xl font-black text-gray-900">$17.00</div>
                    <div className="text-xs text-gray-500 italic">billed monthly at $136</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded">
                    <div className="text-sm font-bold text-gray-600">2 Dogs</div>
                    <div className="text-xl font-black text-gray-900">$22.00</div>
                    <div className="text-xs text-gray-500 italic">billed monthly at $176</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded">
                    <div className="text-sm font-bold text-gray-600">3 Dogs</div>
                    <div className="text-xl font-black text-gray-900">$27.00</div>
                    <div className="text-xs text-gray-500 italic">billed monthly at $216</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded">
                    <div className="text-sm font-bold text-gray-600">4 Dogs</div>
                    <div className="text-xl font-black text-gray-900">$32.00</div>
                    <div className="text-xs text-gray-500 italic">billed monthly at $256</div>
                  </div>
                </div>
                <div className="text-center mt-4 px-4 pb-4">
                  <button
                    onClick={() => {
                      const section = document.getElementById('comparison-section');
                      if (section) {
                        const yOffset = -100; // Fine-tuned buffer for navbar
                        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                  >
                    with everything included. <span className="underline">Learn more</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Table (hidden on mobile) */}
          <div className="hidden lg:block bg-white rounded-lg shadow-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-black text-gray-800 uppercase tracking-wider">
                      Service Frequency
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-black text-gray-800 uppercase tracking-wider">
                      1 Dog
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-black text-gray-800 uppercase tracking-wider">
                      2 Dogs
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-black text-gray-800 uppercase tracking-wider">
                      3 Dogs
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-black text-gray-800 uppercase tracking-wider">
                      4 Dogs
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-orange-600 mr-3" />
                        <div>
                          <div className="text-lg font-black text-gray-900">Once a Week</div>
                          <div className="text-sm text-gray-500">Perfect for most families</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="text-2xl font-black text-gray-900">$27.50</div>
                      <div className="text-sm text-gray-500 italic">billed monthly at $110</div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="text-2xl font-black text-gray-900">$32.50</div>
                      <div className="text-sm text-gray-500 italic">billed monthly at $130</div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="text-2xl font-black text-gray-900">$37.50</div>
                      <div className="text-sm text-gray-500 italic">billed monthly at $150</div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="text-2xl font-black text-gray-900">$42.50</div>
                      <div className="text-sm text-gray-500 italic">billed monthly at $170</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-orange-50">
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-orange-600 mr-3" />
                        <div>
                          <div className="text-lg font-black text-gray-900">Twice a Week</div>
                          <div className="text-sm text-gray-500">For busy pups or big yards</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="text-2xl font-black text-gray-900">$17.00</div>
                      <div className="text-sm text-gray-500 italic">billed monthly at $136</div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="text-2xl font-black text-gray-900">$22.00</div>
                      <div className="text-sm text-gray-500 italic">billed monthly at $176</div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="text-2xl font-black text-gray-900">$27.00</div>
                      <div className="text-sm text-gray-500 italic">billed monthly at $216</div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="text-2xl font-black text-gray-900">$32.00</div>
                      <div className="text-sm text-gray-500 italic">billed monthly at $256</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-center mt-6 pb-4">
              <button
                onClick={() => {
                  const section = document.getElementById('comparison-section');
                  if (section) {
                    const yOffset = -100; // Fine-tuned buffer for navbar
                    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="text-green-600 hover:text-green-700 font-medium text-lg transition-colors"
              >
                with everything included. <span className="underline">Learn more</span>
              </button>
            </div>
          </div>

          {/* Pricing Notes */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="neu-raised">
              <CardContent className="p-6">
                <h4 className="font-black text-gray-800 mb-3 flex items-center">
                  <Users className="w-5 h-5 text-orange-600 mr-2" />
                  More Dogs? No Problem!
                </h4>
                <p className="text-gray-600">
                  Each additional dog adds just <span className="font-bold text-orange-600">$5 per dog, per visit</span>. 
                  Got a pack? We've got you covered.
                </p>
              </CardContent>
            </Card>

            <Card className="neu-raised">
              <CardContent className="p-6">
                <h4 className="font-black text-gray-800 mb-3 flex items-center">
                  <Shield className="w-5 h-5 text-orange-600 mr-2" />
                  Prepaid Monthly
                </h4>
                <p className="text-gray-600">
                  All pricing is <span className="font-bold">prepaid monthly</span> for consistent service. 
                  Cancel anytime with notice.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* One-Time Services */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
              One-Time Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sometimes you just need a one-and-done. We've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="neu-raised">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-black text-gray-800">
                  One-Time Cleanup
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-black text-orange-600 mb-4">$50</div>
                <p className="text-gray-600 mb-6">
                  Perfect for spring cleaning, pre-party prep, or "oh-god-when-did-it-get-this-bad" emergencies.
                </p>
                <Link href="/contact">
                  <Button className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold">
                    Book One-Time Service
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="neu-raised">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-black text-gray-800">
                  Initial Cleanup
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-black text-green-600 mb-4">FREE*</div>
                <p className="text-gray-600 mb-6">
                  First cleanup is on us! *Unless your yard hasn't been cleaned recently. 
                  <br /><br /><strong>Pricing:</strong><br />
                  • Up to 2 weeks missed: <span className="font-bold text-green-600">FREE</span><br />
                  • 2-4 weeks missed: <span className="font-bold text-orange-600">$25</span><br />
                  • Over 4 weeks missed: <span className="font-bold text-red-600">$50</span>
                </p>
                <Link href="/contact">
                  <Button className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What's Included Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
              Everything's Included
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              No surprise charges, no hidden fees. This is what you get with every single visit.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                <span className="font-bold text-gray-800">Complete yard cleanup</span>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                <span className="font-bold text-gray-800">Sanitization & deodorizing</span>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                <span className="font-bold text-gray-800">Waste haul-away</span>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                <span className="font-bold text-gray-800">Gate latching & security</span>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                <span className="font-bold text-gray-800">Service confirmation</span>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                <span className="font-bold text-gray-800">Multiple area coverage</span>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Chart */}
        <section id="comparison-section" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
              Others Charge Extra. We Don't.
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Here's what most competitors will hit you with as "add-ons." We include it all in your monthly rate.
            </p>
          </div>

          {/* Mobile Comparison Cards (hidden on desktop) */}
          <div className="block lg:hidden space-y-4 mb-8">
            <Card className="neu-raised">
              <CardContent className="p-4">
                <h4 className="font-black text-gray-800 mb-3">Deodorizing Spray</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                    <span className="font-bold text-gray-700">Most Competitors</span>
                    <div className="flex items-center">
                      <X className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-red-600 font-bold">$5-10 extra per visit</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <span className="font-bold text-gray-700">Dook Scoop 'Em</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-green-600 font-bold">FREE</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neu-raised">
              <CardContent className="p-4">
                <h4 className="font-black text-gray-800 mb-3">Sanitization Treatment</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                    <span className="font-bold text-gray-700">Most Competitors</span>
                    <div className="flex items-center">
                      <X className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-red-600 font-bold">$8-15 extra per visit</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <span className="font-bold text-gray-700">Dook Scoop 'Em</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-green-600 font-bold">FREE</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neu-raised">
              <CardContent className="p-4">
                <h4 className="font-black text-gray-800 mb-3">Waste Haul-Away</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                    <span className="font-bold text-gray-700">Most Competitors</span>
                    <div className="flex items-center">
                      <X className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-red-600 font-bold">$3-8 extra per visit</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <span className="font-bold text-gray-700">Dook Scoop 'Em</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-green-600 font-bold">FREE</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neu-raised">
              <CardContent className="p-4">
                <h4 className="font-black text-gray-800 mb-3">Service Confirmations</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                    <span className="font-bold text-gray-700">Most Competitors</span>
                    <div className="flex items-center">
                      <X className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-red-600 font-bold">$2-5 extra per visit</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <span className="font-bold text-gray-700">Dook Scoop 'Em</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-green-600 font-bold">FREE</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neu-raised">
              <CardContent className="p-4">
                <h4 className="font-black text-gray-800 mb-3">Cleaning Other Parts of the Yard</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                    <span className="font-bold text-gray-700">Most Competitors</span>
                    <div className="flex items-center">
                      <X className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-red-600 font-bold">$3-7 extra per visit</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <span className="font-bold text-gray-700">Dook Scoop 'Em</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-green-600 font-bold">FREE</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Comparison Table (hidden on mobile) */}
          <div className="hidden lg:block bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-black uppercase tracking-wider">
                      Most Competitors
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-black uppercase tracking-wider">
                      Dook Scoop 'Em
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                      Deodorizing Spray
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-600 font-bold">$5-10 extra per visit</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-green-600 font-bold">Included FREE</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-orange-50">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                      Sanitization Treatment
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-600 font-bold">$8-15 extra per visit</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-green-600 font-bold">Included FREE</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                      Waste Haul-Away
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-600 font-bold">$3-8 extra per visit</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-green-600 font-bold">Included FREE</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-orange-50">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                      Service Confirmations
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-600 font-bold">$2-5 extra per visit</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-green-600 font-bold">Included FREE</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                      Cleaning Other Parts of the Yard
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <X className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-600 font-bold">$3-7 extra per visit</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-green-600 font-bold">Included FREE</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 p-6 bg-orange-100 rounded-lg text-center">
            <h4 className="text-xl font-black text-gray-800 mb-2">
              Potential Monthly Savings: $18-$77
            </h4>
            <p className="text-gray-600">
              That's what you'd pay extra elsewhere. With us, it's just included. Because why wouldn't it be?
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-white rounded-lg p-8 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
            Ready for a Cleaner Yard?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of happy homeowners who trust us to keep their yards pristine.
          </p>
          <Link href="/onboard">
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