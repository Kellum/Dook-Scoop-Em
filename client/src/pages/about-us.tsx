import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">
            About Dook Scoop 'Em
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're the people who decided to make a living cleaning up after dogs. And honestly? We couldn't be happier about it.
          </p>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <Card className="neu-raised">
            <CardContent className="p-8">
              <h2 className="text-3xl font-black text-gray-800 mb-6 text-center">Our Story</h2>
              <div className="max-w-4xl mx-auto text-lg text-gray-600 space-y-6">
                <p>
                  It started with a simple realization: people love their dogs, but nobody loves cleaning up after them. And frankly, most people aren't doing it right anyway.
                </p>
                <p>
                  We saw yard after yard that looked "clean" but still smelled terrible. We watched families avoid their own backyards because they were embarrassed by the state of things. We heard horror stories about guests stepping in "hidden surprises" during backyard BBQs.
                </p>
                <p>
                  So we decided to do something about it. Not just picking up poop - anyone can do that. But doing it <em>right</em>. With proper sanitization, complete odor elimination, and the kind of thorough approach that actually makes a difference.
                </p>
                <p className="font-bold text-gray-800">
                  Today, we're proud to be the elite squad that fears no pile. And our customers' yards prove it.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Our Values */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="neu-raised text-center">
            <CardHeader>
              <div className="text-4xl mb-4">🎯</div>
              <CardTitle className="text-xl font-black text-gray-800">We Do It Right</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                No shortcuts, no "good enough" - we clean every yard like it's our own. Because your family deserves better than half-measures.
              </p>
            </CardContent>
          </Card>

          <Card className="neu-raised text-center">
            <CardHeader>
              <div className="text-4xl mb-4">😄</div>
              <CardTitle className="text-xl font-black text-gray-800">We Keep It Fun</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                This job could be gross and depressing. Instead, we choose to find the humor and take pride in solving a real problem for real families.
              </p>
            </CardContent>
          </Card>

          <Card className="neu-raised text-center">
            <CardHeader>
              <div className="text-4xl mb-4">🤝</div>
              <CardTitle className="text-xl font-black text-gray-800">We Build Trust</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your pets, your property, your family's safety - we take it all seriously. Trust is earned through consistency, not promises.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Why We're Different */}
        <section className="bg-white rounded-2xl p-8 neu-raised mb-16">
          <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">Why We're Different</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-black text-gray-800 mb-4">🔬 We Actually Understand the Science</h3>
              <p className="text-gray-600 mb-6">
                Pet waste isn't just gross - it's a health hazard when not handled properly. We know about bacterial contamination, proper sanitization, and environmental impact. This isn't just a service business; it's applied microbiology.
              </p>

              <h3 className="text-xl font-black text-gray-800 mb-4">💼 We Run It Like a Real Business</h3>
              <p className="text-gray-600">
                Licensed, insured, trained staff, proper equipment, systematic processes. We're not just "some guy with a truck" - we're a professional service that happens to specialize in waste management.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-800 mb-4">🎭 We Don't Take Ourselves Too Seriously</h3>
              <p className="text-gray-600 mb-6">
                Yes, we're professional. No, we don't need to be stuffy about it. We clean up poop for a living and we're proud of it. Life's too short not to enjoy what you do.
              </p>

              <h3 className="text-xl font-black text-gray-800 mb-4">🌟 We're Building Something Bigger</h3>
              <p className="text-gray-600">
                This isn't just about waste removal - it's about giving families their outdoor spaces back. It's about kids playing safely in their yards. It's about dignity and quality of life.
              </p>
            </div>
          </div>
        </section>

        {/* Service Area */}
        <section className="mb-16">
          <Card className="neu-raised bg-orange-50 border-2 border-orange-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-black text-gray-800 mb-6">Currently Serving Northeast Florida</h2>
              <p className="text-lg text-gray-600 mb-6">
                Starting in Yulee, Fernandina Beach, Oceanway, and Nassau County. Growing thoughtfully to maintain our quality standards.
              </p>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="font-bold text-gray-800">Yulee</div>
                <div className="font-bold text-gray-800">Fernandina Beach</div>
                <div className="font-bold text-gray-800">Oceanway</div>
                <div className="font-bold text-gray-800">Nassau County</div>
              </div>
              <p className="text-sm text-gray-600 mt-6">
                Not in our service area yet? Join our waitlist and we'll let you know when we're coming to your neighborhood.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">The Squad</h2>
          <Card className="neu-raised">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-6">👷‍♂️👷‍♀️</div>
              <h3 className="text-2xl font-black text-gray-800 mb-4">Professional. Trained. Ready.</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our team is currently small but growing. Every team member is background-checked, trained in our methods, and committed to the same standards that built this company. Quality over quantity, always.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-black text-gray-800 mb-6">Ready to Join the Elite Squad?</h2>
          <p className="text-xl text-gray-600 mb-8">Let us show you what professional poop scooping actually looks like.</p>
          <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg">
            Start Your Service Today
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}