import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, Leaf, Eye, CheckCircle, Zap, RefreshCw } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function ProductsWeUse() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">
            Products We Use
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 font-bold">
            We don't mess around with mystery sprays or harsh chemicals. You deserve to know exactly what's being used in your yard — and more importantly, what your pets are walking (and rolling, and sniffing) through.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything we use is eco-friendly, pet-safe, and already included in your price. No upsells, no "sanitizer add-on," just peace of mind baked in.
          </p>
        </section>

        {/* KennelSol Section */}
        <section className="mb-20">
          <Card className="neu-raised bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-blue-600" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
                KennelSol – The Gold Standard in Clean
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="neu-button bg-blue-50">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-black text-gray-800 mb-3">Veterinary-Grade Safety</h4>
                    <p className="text-gray-600 text-sm">
                      KennelSol is the same EPA-approved disinfectant trusted by veterinarians, shelters, and boarding facilities across the country. It wipes out bacteria, viruses, and odors without harming pets, lawns, or local wildlife. Basically, it's the Lysol of the dog world — minus the harsh fumes and scary warning labels.
                    </p>
                  </CardContent>
                </Card>

                <Card className="neu-button bg-blue-50">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-black text-gray-800 mb-3">Tool & Equipment Sanitizer</h4>
                    <p className="text-gray-600 text-sm">
                      We don't just use KennelSol in your yard — we also soak down our scooping tools, boots, and gear between every job. That means when we show up, we're starting fresh. No germs hitchhiking from one yard to the next. Your neighbor's problems stay your neighbor's problems.
                    </p>
                  </CardContent>
                </Card>

                <Card className="neu-button bg-blue-50">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-black text-gray-800 mb-3">Powerful Yet Safe</h4>
                    <p className="text-gray-600 text-sm">
                      KennelSol delivers hospital-level disinfecting power, but it's non-irritating for pets and people. Tough on germs, gentle on paws — like a bouncer in fuzzy slippers.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Simple Green Section */}
        <section className="mb-20">
          <Card className="neu-raised bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Leaf className="w-12 h-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
                Simple Green Outdoor Pet – Eco-Friendly Fresh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="neu-button bg-green-50">
                  <CardContent className="p-6 text-center">
                    <Leaf className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-black text-gray-800 mb-3">Biodegradable & Safe</h4>
                    <p className="text-gray-600 text-sm">
                      This formula is designed for outdoor use around pets, kids, and plants. It's non-toxic, biodegradable, and won't harm your grass. The only thing it kills is bad smells.
                    </p>
                  </CardContent>
                </Card>

                <Card className="neu-button bg-green-50">
                  <CardContent className="p-6 text-center">
                    <RefreshCw className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-black text-gray-800 mb-3">Odor Neutralizer</h4>
                    <p className="text-gray-600 text-sm">
                      Instead of just masking smells with fake "spring meadow" perfume, Simple Green breaks down odors at the source. Your yard smells fresh, not like a candle shop explosion.
                    </p>
                  </CardContent>
                </Card>

                <Card className="neu-button bg-green-50">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-black text-gray-800 mb-3">Environmentally Responsible</h4>
                    <p className="text-gray-600 text-sm">
                      Safe for runoff, waterways, and local wildlife. When we clean, the First Coast stays green. The dolphins approve.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Why We Share This Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
              Why We Share This
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="neu-raised bg-white">
              <CardContent className="p-6 text-center">
                <Eye className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-black text-gray-800 mb-3">Transparency</h4>
                <p className="text-gray-600 text-sm">
                  Most scoop companies won't tell you what's in the bottle. We do. Because "mystery solution" doesn't sound reassuring.
                </p>
              </CardContent>
            </Card>

            <Card className="neu-raised bg-white">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-black text-gray-800 mb-3">Pet Safety</h4>
                <p className="text-gray-600 text-sm">
                  If it's not safe for dogs, cats, and kids, it doesn't make the cut. Fido can sniff, lick, and roll worry-free.
                </p>
              </CardContent>
            </Card>

            <Card className="neu-raised bg-white">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-black text-gray-800 mb-3">All-Included</h4>
                <p className="text-gray-600 text-sm">
                  Both KennelSol and Simple Green are part of every service. We don't nickel-and-dime with "add-on deodorizer fees." That's just stinky business.
                </p>
              </CardContent>
            </Card>

            <Card className="neu-raised bg-white">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-black text-gray-800 mb-3">Better Than DIY</h4>
                <p className="text-gray-600 text-sm">
                  These aren't dollar-store sprays. These are professional-grade products that actually work.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How We Keep Yards Safe */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
              How We Keep Yards (and Pets) Safe
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="neu-raised bg-orange-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-black text-xl">1</div>
                <h4 className="font-black text-gray-800 mb-3">Scoop It</h4>
                <p className="text-gray-600 text-sm">
                  Heavy-duty tools take care of every pile.
                </p>
              </CardContent>
            </Card>

            <Card className="neu-raised bg-blue-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-black text-xl">2</div>
                <h4 className="font-black text-gray-800 mb-3">Sanitize It</h4>
                <p className="text-gray-600 text-sm">
                  KennelSol eliminates bacteria and viruses at the molecular level.
                </p>
              </CardContent>
            </Card>

            <Card className="neu-raised bg-green-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-black text-xl">3</div>
                <h4 className="font-black text-gray-800 mb-3">Deodorize It</h4>
                <p className="text-gray-600 text-sm">
                  Simple Green neutralizes odors while staying safe for paws, lawns, and kids.
                </p>
              </CardContent>
            </Card>

            <Card className="neu-raised bg-purple-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-black text-xl">4</div>
                <h4 className="font-black text-gray-800 mb-3">Reset & Refresh</h4>
                <p className="text-gray-600 text-sm">
                  Before heading to the next stop, we clean and disinfect all our tools with KennelSol so every yard starts with a clean slate. (Think of it as hitting the "reset" button — but for poop gear.)
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* The Bottom Line */}
        <section className="text-center bg-white rounded-lg p-8 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
            The Bottom Line
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
            Your pets deserve better than mystery chemicals, and your lawn deserves more than a quick scoop-and-go. We use professional, pet-safe, eco-friendly products trusted by veterinarians and pet care pros. And it's all included in your price. No gimmicks. No add-ons. Just safe, clean yards — with a little humor on the side.
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