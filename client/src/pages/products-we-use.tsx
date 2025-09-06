import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, Leaf, Eye, CheckCircle, Zap, Star } from "lucide-react";
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
            We're picky about what goes in your yard — and what goes into keeping our tools clean. That's why we use professional-grade products that are pet-safe, eco-friendly, and trusted in the animal care world.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Best of all? It's all included in your service price. No sneaky add-ons, no "extra sanitizer" fees.
          </p>
        </section>

        {/* On Stage: Simple Green Section */}
        <section className="mb-20">
          <Card className="neu-raised bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Star className="w-12 h-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
                In Your Yard: Simple Green Outdoor Pet
              </CardTitle>
              <p className="text-lg text-gray-600 font-bold">
                This is the product your yard sees.
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="neu-button bg-green-50">
                  <CardContent className="p-6 text-center">
                    <Leaf className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-black text-gray-800 mb-3">Eco-Friendly & Biodegradable</h4>
                    <p className="text-gray-600 text-sm">
                      Safe for pets, kids, lawns, and local wildlife. It breaks down naturally without leaving harmful residues.
                    </p>
                  </CardContent>
                </Card>

                <Card className="neu-button bg-green-50">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-black text-gray-800 mb-3">Odor Neutralizer</h4>
                    <p className="text-gray-600 text-sm">
                      It doesn't just cover smells — it breaks down odor-causing compounds at the source. Your yard smells fresh, not perfumed.
                    </p>
                  </CardContent>
                </Card>

                <Card className="neu-button bg-green-50">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-black text-gray-800 mb-3">Designed for Pets</h4>
                    <p className="text-gray-600 text-sm">
                      Specifically made for outdoor pet areas. If your dog sniffs, licks, or rolls in the grass (and let's be honest, they will), it's safe.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Backstage: KennelSol Section */}
        <section className="mb-20">
          <Card className="neu-raised bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-blue-600" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
                For Our Tools: KennelSol
              </CardTitle>
              <p className="text-lg text-gray-600 font-bold">
                This is what keeps our gear spotless between jobs. What we sanitize our tools with.
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="neu-button bg-blue-50">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-black text-gray-800 mb-3">Kennel-Grade Sanitation</h4>
                    <p className="text-gray-600 text-sm">
                      The same disinfectant trusted in veterinary clinics, kennels, and shelters. It destroys bacteria, viruses, and other germs that could spread between yards.
                    </p>
                  </CardContent>
                </Card>

                <Card className="neu-button bg-blue-50">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-black text-gray-800 mb-3">How We Use It</h4>
                    <p className="text-gray-600 text-sm">
                      We don't spray KennelSol in your yard. We use it to sanitize our scoops, boots, and equipment after every job so we arrive clean at the next. Translation: your yard stays yours, and your neighbor's germs stay theirs.
                    </p>
                  </CardContent>
                </Card>

                <Card className="neu-button bg-blue-50">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-black text-gray-800 mb-3">Safe When Used Right</h4>
                    <p className="text-gray-600 text-sm">
                      EPA-approved and formulated for environments where pets live and play. Powerful against germs, but safe for paws once our tools are refreshed and ready.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Sanitizing vs. Deodorizing Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
              Sanitizing vs. Deodorizing: What's the Difference?
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-4">
              Some companies use chlorine-based sanitizers like Wysiwash. We chose Simple Green Yard & Pet Safe instead. Here's why that matters for your yard.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 max-w-4xl mx-auto">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> We LOVE Wysiwash - it's an excellent product and we use it! It's (chlorine-based sanitizers) just not meant for grass, repeatedly, for long-term use if used incorrectly. It has its place in professional cleaning, but backyards need a gentler approach.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Chlorine-Based Sanitizers Column */}
            <Card className="neu-raised bg-red-50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Zap className="w-10 h-10 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-black text-gray-800">
                  Chlorine-Based Sanitizers
                </CardTitle>
                <p className="text-gray-600 font-bold">Like Wysiwash</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">What They Do:</h4>
                  <p className="text-gray-600 text-sm">Kill bacteria on contact using chlorine chemistry (calcium hypochlorite). Originally designed for kennels, pools, and hard surfaces.</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">The Trade-offs: <span className="underline">(if used improperly)</span></h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Can stress grass and cause yellowing</li>
                    <li>• Leaves salt buildup in soil over time</li>
                    <li>• Must be carefully diluted to avoid damage</li>
                    <li>• Effects don't last once chlorine evaporates</li>
                    <li>• Not designed for everyday backyards</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Simple Green Column */}
            <Card className="neu-raised bg-green-50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Leaf className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-black text-gray-800">
                  Odor-Focused Deodorizing
                </CardTitle>
                <p className="text-gray-600 font-bold">Our Simple Green Approach</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">What It Does:</h4>
                  <p className="text-gray-600 text-sm">Breaks down odor-causing compounds at the source using enzymes and surfactants. Purpose-built for pet areas and grass.</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">The Benefits:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Non-toxic and biodegradable</li>
                    <li>• Safe for grass, pets, and families</li>
                    <li>• Ready-to-use, no mixing required</li>
                    <li>• Leaves no harmful residue</li>
                    <li>• Specifically designed for backyards</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* The Truth Section */}
          <Card className="neu-raised bg-orange-50">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-black text-gray-800 mb-4">The Truth About Yard Sanitization</h3>
              <p className="text-lg text-gray-600 mb-4">
                <strong>No outdoor yard spray will sterilize grass for a week.</strong> Chlorine sanitizers kill bacteria on contact, but once the chlorine evaporates, it's gone.
              </p>
              <p className="text-gray-600">
                Simple Green focuses on what really matters in your yard: <span className="font-bold text-orange-600">breaking down pet waste smells and keeping the area pleasant</span>, without promising impossible "long-term sanitization."
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Why It Matters Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
              Why It Matters
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="neu-raised bg-white">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-black text-gray-800 mb-3">Pet-Safe & Family-Friendly</h4>
                <p className="text-gray-600 text-sm">
                  Everything we use is chosen to protect pets, kids, and lawns.
                </p>
              </CardContent>
            </Card>

            <Card className="neu-raised bg-white">
              <CardContent className="p-6 text-center">
                <Leaf className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-black text-gray-800 mb-3">Eco-Responsible</h4>
                <p className="text-gray-600 text-sm">
                  Our in-yard product (Simple Green) is biodegradable and safe for the environment.
                </p>
              </CardContent>
            </Card>

            <Card className="neu-raised bg-white">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-black text-gray-800 mb-3">All Included</h4>
                <p className="text-gray-600 text-sm">
                  You don't pay extra for the "good stuff." It's standard in every visit.
                </p>
              </CardContent>
            </Card>

            <Card className="neu-raised bg-white">
              <CardContent className="p-6 text-center">
                <Eye className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-black text-gray-800 mb-3">Full Transparency</h4>
                <p className="text-gray-600 text-sm">
                  We tell you what we use because trust shouldn't be a mystery.
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
            Simple Green keeps your yard safe, fresh, and eco-friendly. KennelSol keeps our tools clean and disinfected between every visit. Together, it means a yard that's not just poop-free, but safe, sanitary, and paw-approved — with no extra fees or gimmicks.
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