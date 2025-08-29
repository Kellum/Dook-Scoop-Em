import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Residential() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">
            Residential Poop Scooping
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We fear no pile in your backyard! Our residential service keeps your lawn pristine and your shoes clean.
          </p>
          <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg">
            Get Started Today
          </Button>
        </section>

        {/* Services Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="neu-raised">
            <CardHeader>
              <CardTitle className="text-xl font-black text-gray-800">Weekly Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Regular weekly cleanups keep your yard consistently pristine. Perfect for most families with 1-2 dogs.
              </p>
            </CardContent>
          </Card>

          <Card className="neu-raised">
            <CardHeader>
              <CardTitle className="text-xl font-black text-gray-800">Bi-Weekly Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Every other week service for lighter usage yards. Great for single dog households or well-trained pups.
              </p>
            </CardContent>
          </Card>

          <Card className="neu-raised">
            <CardHeader>
              <CardTitle className="text-xl font-black text-gray-800">One-Time Cleanups</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Spring cleaning, pre-party cleanup, or "oh-god-when-did-it-get-this-bad" emergency service.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* What's Included */}
        <section className="bg-white rounded-2xl p-8 neu-raised mb-16">
          <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">What's Included</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-orange-600 font-black mr-3 text-xl">✓</span>
                <span className="font-medium">Complete yard cleanup</span>
              </div>
              <div className="flex items-center">
                <span className="text-orange-600 font-black mr-3 text-xl">✓</span>
                <span className="font-medium">Sanitization & deodorizing</span>
              </div>
              <div className="flex items-center">
                <span className="text-orange-600 font-black mr-3 text-xl">✓</span>
                <span className="font-medium">Waste haul-away (never left in your bin!)</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-orange-600 font-black mr-3 text-xl">✓</span>
                <span className="font-medium">Multiple area coverage</span>
              </div>
              <div className="flex items-center">
                <span className="text-orange-600 font-black mr-3 text-xl">✓</span>
                <span className="font-medium">Gate latching & yard security</span>
              </div>
              <div className="flex items-center">
                <span className="text-orange-600 font-black mr-3 text-xl">✓</span>
                <span className="font-medium">Service confirmation updates</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}