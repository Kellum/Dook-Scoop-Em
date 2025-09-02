import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Clock, PenTool } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Coming Soon Section */}
        <section className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <Clock className="w-16 h-16 text-orange-600 mx-auto mb-6" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-8">
            The Blog Is on Duval Time
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 font-bold">
            We'd be writing posts already, but the dogs of Jacksonville keep us busy. Don't worry — fresh content is coming soon, right after we finish this route.
          </p>

          <div className="bg-white rounded-lg p-8 shadow-xl max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center mb-4">
              <PenTool className="w-6 h-6 text-orange-600 mr-2" />
              <h3 className="text-lg font-black text-gray-800">What's Coming</h3>
            </div>
            <p className="text-gray-600 mb-6">
              We're planning posts about pet care tips, yard maintenance secrets, Jacksonville dog park reviews, and probably way too many poop jokes. Stay tuned!
            </p>
            <p className="text-sm text-gray-500 italic">
              In the meantime, we'll be out there keeping First Coast yards clean.
            </p>
          </div>

          <Link href="/contact">
            <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg">
              Get Your Service Started
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}