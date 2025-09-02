import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log("Contact form submitted:", formData);
    
    // Track contact form submission
    if (typeof window !== 'undefined') {
      import('../../lib/analytics').then(({ trackEvent }) => {
        trackEvent('contact', 'contact_form', 'contact_page');
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Questions? Comments? Poop emergencies? We're here to help. Seriously, we love talking about this stuff.
          </p>
        </section>

        {/* Contact Info & Form */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-2xl font-black text-gray-800 mb-6">Let's Talk Business</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-bold text-gray-800">Phone</p>
                    <p className="text-gray-600">(904) 312-2422</p>
                    <p className="text-sm text-gray-500">Call or text anytime</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-bold text-gray-800">Email</p>
                    <p className="text-gray-600">ryan@dookscoop.com</p>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-bold text-gray-800">Service Area</p>
                    <p className="text-gray-600">Jacksonville, FL</p>
                    <p className="text-sm text-gray-500">Greater Jacksonville Area</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-bold text-gray-800">Business Hours</p>
                    <p className="text-gray-600">Mon-Fri: 8AM-6PM</p>
                    <p className="text-gray-600">Saturday: 9AM-4PM</p>
                    <p className="text-sm text-gray-500">Emergency service available</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-2xl font-black text-gray-800 mb-2">Send Us a Message</h3>
            <p className="text-gray-600 mb-6">We'll get back to you faster than your dog can make a new mess.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="neu-input bg-gray-100"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="neu-input bg-gray-100"
                      placeholder="(904) 555-0000"
                      type="tel"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="neu-input bg-gray-100"
                    placeholder="your@email.com"
                    type="email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="neu-input bg-gray-100"
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="neu-input bg-gray-100 min-h-[120px]"
                    placeholder="Tell us what's going on..."
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold py-3"
                >
                  Send Message
                </Button>
              </form>
          </div>
        </div>

        {/* Emergency Contact */}
        <section className="text-center">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-black text-red-800 mb-4">🚨 Poop Emergency?</h3>
            <p className="text-red-700 mb-4">
              Unexpected guests coming over? Last-minute party? We offer same-day emergency service for those "oh no" moments.
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white font-bold">
              Call Emergency Line: (904) 312-2422
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}