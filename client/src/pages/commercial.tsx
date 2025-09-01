import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Commercial() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">
            Commercial Poop Scooping
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Keep your business property professional and pristine. We handle everything from apartment complexes to office parks.
          </p>
          <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg">
            Get Commercial Quote
          </Button>
        </section>

        {/* Commercial Services */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6">

            <h3 className="text-xl font-black text-gray-800 mb-4">Apartment Complexes</h3>


              <p className="text-gray-600">
                Keep common areas clean and tenant-friendly. Regular service schedules that work with your property management.
              </p>

          </div>

          <div className="bg-white rounded-lg p-6">

            <h3 className="text-xl font-black text-gray-800 mb-4">Office Buildings</h3>


              <p className="text-gray-600">
                Professional appearance for your business property. Early morning or after-hours service available.
              </p>

          </div>

          <div className="bg-white rounded-lg p-6">

            <h3 className="text-xl font-black text-gray-800 mb-4">HOA Communities</h3>


              <p className="text-gray-600">
                Maintain property values and community standards. Flexible scheduling for common areas and walking paths.
              </p>

          </div>

          <div className="bg-white rounded-lg p-6">

            <h3 className="text-xl font-black text-gray-800 mb-4">Dog Parks & Facilities</h3>


              <p className="text-gray-600">
                Specialized service for high-traffic dog areas. We know how to handle the heavy-duty situations.
              </p>

          </div>

          <div className="bg-white rounded-lg p-6">

            <h3 className="text-xl font-black text-gray-800 mb-4">Retail Centers</h3>


              <p className="text-gray-600">
                Keep shopping areas welcoming for customers. Regular maintenance that doesn't disrupt business operations.
              </p>

          </div>

          <div className="bg-white rounded-lg p-6">

            <h3 className="text-xl font-black text-gray-800 mb-4">Special Events</h3>


              <p className="text-gray-600">
                Dog shows, outdoor festivals, farmers markets - we'll make sure your event stays clean and professional.
              </p>

          </div>
        </section>

        {/* Why Choose Us for Commercial */}
        <section className="bg-white rounded-2xl p-8 neu-raised mb-16">
          <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">Why Businesses Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-gray-800 mb-2">Reliable & Professional</h3>
                <p className="text-gray-600">Licensed, insured, and trained staff who understand commercial property needs.</p>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-800 mb-2">Flexible Scheduling</h3>
                <p className="text-gray-600">Early morning, after hours, or during low-traffic times - we work around your business.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-gray-800 mb-2">Custom Solutions</h3>
                <p className="text-gray-600">Every property is different. We create service plans that fit your specific needs and budget.</p>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-800 mb-2">No Long-Term Contracts</h3>
                <p className="text-gray-600">Month-to-month service agreements. If we're not exceeding expectations, you're free to leave.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}