import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function ProductsWeUse() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">
            Products We Use
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We don't mess around with cheap tools or harsh chemicals. Here's exactly what we use to keep your yard pristine and your pets safe.
          </p>
        </section>

        {/* Product Categories */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6">

            <h3 className="text-xl font-black text-gray-800 mb-4">🛠️ Cleanup Tools</h3>


              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-orange-600 font-black mr-3 mt-1">•</span>
                  <div>
                    <strong>Professional Pooper Scoopers</strong>
                    <p className="text-sm text-gray-600">Heavy-duty metal construction, not those flimsy plastic ones</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-black mr-3 mt-1">•</span>
                  <div>
                    <strong>Specialized Rakes</strong>
                    <p className="text-sm text-gray-600">Fine-tined rakes for picking up even the smallest remnants</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-black mr-3 mt-1">•</span>
                  <div>
                    <strong>Industrial Waste Bags</strong>
                    <p className="text-sm text-gray-600">Triple-reinforced, leak-proof, and odor-containing</p>
                  </div>
                </li>
              </ul>

          </div>

          <div className="bg-white rounded-lg p-6">

            <h3 className="text-xl font-black text-gray-800 mb-4">🧼 Sanitizers</h3>


              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-orange-600 font-black mr-3 mt-1">•</span>
                  <div>
                    <strong>Pet-Safe Disinfectants</strong>
                    <p className="text-sm text-gray-600">EPA-approved, non-toxic formulas that actually work</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-black mr-3 mt-1">•</span>
                  <div>
                    <strong>Enzyme Cleaners</strong>
                    <p className="text-sm text-gray-600">Break down organic matter at the molecular level</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-black mr-3 mt-1">•</span>
                  <div>
                    <strong>Antimicrobial Sprays</strong>
                    <p className="text-sm text-gray-600">Long-lasting protection against bacteria and viruses</p>
                  </div>
                </li>
              </ul>

          </div>

          <div className="bg-white rounded-lg p-6">

            <h3 className="text-xl font-black text-gray-800 mb-4">🌿 Deodorizers</h3>


              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-orange-600 font-black mr-3 mt-1">•</span>
                  <div>
                    <strong>Natural Odor Eliminators</strong>
                    <p className="text-sm text-gray-600">Not just masking - actually neutralizing odors</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-black mr-3 mt-1">•</span>
                  <div>
                    <strong>Grass-Safe Treatments</strong>
                    <p className="text-sm text-gray-600">Won't harm your lawn or landscaping</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-black mr-3 mt-1">•</span>
                  <div>
                    <strong>Seasonal Formulas</strong>
                    <p className="text-sm text-gray-600">Different products for different weather conditions</p>
                  </div>
                </li>
              </ul>

          </div>
        </section>

        {/* Why These Products Matter */}
        <section className="bg-white rounded-2xl p-8 neu-raised mb-16">
          <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">Why These Products Matter</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-black text-gray-800 mb-4">🐕 Pet Safety First</h3>
              <p className="text-gray-600 mb-6">
                Every product we use is specifically chosen to be safe around your pets. No harsh chemicals that could harm paws, noses, or curious tongues. We research every ingredient because your dog's safety is non-negotiable.
              </p>

              <h3 className="text-xl font-black text-gray-800 mb-4">🌱 Environmentally Responsible</h3>
              <p className="text-gray-600">
                Biodegradable formulas that won't harm local wildlife, water systems, or soil. We're cleaning up after dogs, not creating environmental problems.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-800 mb-4">💪 Actually Effective</h3>
              <p className="text-gray-600 mb-6">
                We've tested dozens of products to find what actually works. No snake oil or marketing gimmicks - just proven formulas that eliminate odors and sanitize thoroughly.
              </p>

              <h3 className="text-xl font-black text-gray-800 mb-4">💰 Worth the Investment</h3>
              <p className="text-gray-600">
                Professional-grade products cost more upfront but deliver better results and last longer. You're getting commercial-quality service, not DIY shortcuts.
              </p>
            </div>
          </div>
        </section>

        {/* The Science Behind It */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">The Science Behind Clean</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-black text-gray-800 mb-4">Step 1: Physical Removal</h3>
              <p className="text-gray-600">
                Complete waste removal using precision tools. You can't sanitize what's still there, so we get everything first.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-black text-gray-800 mb-4">Step 2: Biological Breakdown</h3>
              <p className="text-gray-600">
                Enzyme cleaners break down remaining organic matter at the molecular level, eliminating the source of odors.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-black text-gray-800 mb-4">Step 3: Sanitization & Protection</h3>
              <p className="text-gray-600">
                Antimicrobial treatment kills harmful bacteria and creates a protective barrier that lasts between visits.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-black text-gray-800 mb-6">Professional Products, Professional Results</h2>
          <p className="text-xl text-gray-600 mb-8">Experience the difference quality makes.</p>
          <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg">
            See Our Service in Action
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}