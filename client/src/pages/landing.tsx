import { Dog, Calendar, Shield, Heart, DollarSign, Leaf, Smartphone, Clock, Phone, Mail, Facebook, Instagram } from "lucide-react";
import WaitlistForm from "@/components/waitlist-form";

export default function Landing() {
  const scrollToWaitlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans text-dark bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Dog className="text-2xl text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-primary">Dook Scoop Em</h1>
            </div>
            <a 
              href="#waitlist" 
              onClick={scrollToWaitlist}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-secondary via-white to-secondary min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-block bg-accent text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Coming Soon
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark mb-6 leading-tight">
                  Professional Pet Waste 
                  <span className="text-primary"> Removal Service</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                  Keep your yard clean and healthy with our reliable, professional dog waste removal service. 
                  We're launching soon and taking signups for our waitlist!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a 
                    href="#waitlist" 
                    onClick={scrollToWaitlist}
                    className="bg-primary text-white px-8 py-4 rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg inline-flex items-center justify-center"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Join Our Waitlist
                  </a>
                  <button className="border-2 border-primary text-primary px-8 py-4 rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold text-lg inline-flex items-center justify-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Learn More
                  </button>
                </div>
              </div>
              <div className="order-first lg:order-last">
                <img 
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Happy golden retriever in a clean backyard" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
                Why Choose Dook Scoop Em?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Professional, reliable, and affordable pet waste removal services that keep your yard clean and your dogs healthy.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-xl bg-secondary hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-white text-xl w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-dark mb-3">Reliable Schedule</h3>
                <p className="text-gray-600">
                  Weekly, bi-weekly, or monthly service options that fit your needs and budget.
                </p>
              </div>

              <div className="text-center p-8 rounded-xl bg-secondary hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white text-xl w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-dark mb-3">Trustworthy Service</h3>
                <p className="text-gray-600">
                  Professional and reliable service you can trust with your property.
                </p>
              </div>

              <div className="text-center p-8 rounded-xl bg-secondary hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-white text-xl w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-dark mb-3">Pet Friendly</h3>
                <p className="text-gray-600">
                  Dog lovers who treat your pets like family and respect your property.
                </p>
              </div>

              <div className="text-center p-8 rounded-xl bg-secondary hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="text-white text-xl w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-dark mb-3">Affordable Rates</h3>
                <p className="text-gray-600">
                  Competitive pricing with no hidden fees or surprise charges.
                </p>
              </div>

              <div className="text-center p-8 rounded-xl bg-secondary hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="text-white text-xl w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-dark mb-3">Eco-Friendly</h3>
                <p className="text-gray-600">
                  Environmentally responsible disposal methods and biodegradable supplies.
                </p>
              </div>

              <div className="text-center p-8 rounded-xl bg-secondary hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="text-white text-xl w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-dark mb-3">Easy Booking</h3>
                <p className="text-gray-600">
                  Simple online scheduling and service management through our platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section id="waitlist" className="py-20 bg-gradient-to-br from-primary to-primary/90">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Join Our Waitlist
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Be the first to know when we launch in your area. Early members get exclusive discounts!
              </p>
            </div>

            <WaitlistForm />
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-dark mb-8">
                Trusted by Dog Owners Everywhere
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Dog className="text-xl w-6 h-6" />
                  <span className="font-medium">Pet Lovers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Leaf className="text-xl w-6 h-6" />
                  <span className="font-medium">Eco-Friendly</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Dog className="text-xl text-primary w-6 h-6" />
                <h3 className="text-xl font-bold">Dook Scoop Em</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Professional pet waste removal service launching soon. 
                Keeping your yard clean so you can focus on what matters most.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>kellum.ryan@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>(555) 123-POOP</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                  <Facebook className="text-xl w-6 h-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                  <Instagram className="text-xl w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Dook Scoop Em. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
