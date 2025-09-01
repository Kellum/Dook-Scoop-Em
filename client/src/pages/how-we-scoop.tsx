import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function HowWeScoop() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">
            How We Scoop
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            It's not just about picking up poop (though we're really good at that). It's about creating a system that works.
          </p>
        </section>

        {/* Process Steps */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 text-center">

              <div className="text-4xl mb-4">🚪</div>
            <h3 className="text-xl font-black text-gray-800 mb-4">1. We Arrive</h3>


              <p className="text-gray-600">
                Scheduled service with text notifications. We'll let you know when we're on our way and when we're done.
              </p>

          </div>

          <div className="bg-white rounded-lg p-6 text-center">

              <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-gray-800 mb-4">2. We Search</h3>


              <p className="text-gray-600">
                Thorough yard inspection. We find every pile, even the ones hiding behind bushes or under leaves.
              </p>

          </div>

          <div className="bg-white rounded-lg p-6 text-center">

              <div className="text-4xl mb-4">🧹</div>
            <h3 className="text-xl font-black text-gray-800 mb-4">3. We Clean</h3>


              <p className="text-gray-600">
                Complete removal, sanitization, and deodorizing. We leave your yard cleaner than we found it.
              </p>

          </div>

          <div className="bg-white rounded-lg p-6 text-center">

              <div className="text-4xl mb-4">🚛</div>
            <h3 className="text-xl font-black text-gray-800 mb-4">4. We Haul</h3>


              <p className="text-gray-600">
                Everything gets taken away in our truck. Never left in your trash bins - that's just gross.
              </p>

          </div>
        </section>

        {/* Our Standards */}
        <section className="bg-white rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">Our Standards</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-black text-gray-800 mb-4">Fast & Efficient</h3>
              <p className="text-gray-600">
                Most yards cleaned in 10-15 minutes. We're quick because we're experienced, not because we're cutting corners.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">🧼</div>
              <h3 className="text-xl font-black text-gray-800 mb-4">Always Sanitized</h3>
              <p className="text-gray-600">
                Every surface gets sanitized and deodorized. We use pet-safe products that eliminate odors and bacteria.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-black text-gray-800 mb-4">Secure & Respectful</h3>
              <p className="text-gray-600">
                Gates latched, property respected, and your pets' safety always prioritized. We treat your yard like our own.
              </p>
            </div>
          </div>
        </section>

        {/* Equipment & Tools */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">Professional Equipment</h2>
          <div className="bg-white rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-800 mb-4">What We Bring</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <span className="text-orange-600 font-black mr-3">•</span>
                      <span>Professional-grade scoopers and rakes</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-orange-600 font-black mr-3">•</span>
                      <span>Pet-safe sanitizing solutions</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-orange-600 font-black mr-3">•</span>
                      <span>Heavy-duty waste bags and containers</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-orange-600 font-black mr-3">•</span>
                      <span>Deodorizing sprays and powders</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-800 mb-4">What We Don't Need</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <span className="text-green-600 font-black mr-3">✓</span>
                      <span>Your trash cans (we haul it away)</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 font-black mr-3">✓</span>
                      <span>Your water hose (we bring our own)</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 font-black mr-3">✓</span>
                      <span>Your cleaning supplies (ours are better)</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 font-black mr-3">✓</span>
                      <span>You to be home (we're self-sufficient)</span>
                    </li>
                  </ul>
                </div>
              </div>

          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-black text-gray-800 mb-6">Ready to Experience the Difference?</h2>
          <p className="text-xl text-gray-600 mb-8">Join the elite squad that fears no pile.</p>
          <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg">
            Schedule Your First Scoop
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}