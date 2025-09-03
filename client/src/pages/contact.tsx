import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { z } from "zod";

// Simple contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      
      // Track contact submission
      if (typeof window !== 'undefined') {
        import('../../lib/analytics').then(({ trackEvent }) => {
          trackEvent('contact_form', 'contact_form', 'contact_page');
        });
      }
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
    },
    onError: (error: any) => {
      console.error("Contact submission error:", error);
      toast({
        title: "Oops! Something went wrong",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Submitting contact form:", data);
    submitContactMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navigation />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="neu-raised bg-white text-center">
              <CardContent className="p-8">
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
                  Message Sent Successfully!
                </h1>
                
                <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-gray-800 mb-4">What's Next:</h3>
                  <p className="text-gray-600 mb-4">
                    Thank you for reaching out! We'll review your message and get back to you within 24 hours.
                  </p>
                  <p className="text-gray-600">
                    For urgent matters, feel free to call us directly at <strong>(904) 312-2422</strong>.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      (904) 312-2422
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      ryan@dookscoop.com
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      setIsSubmitted(false);
                      form.reset();
                    }}
                    variant="outline"
                    className="mr-4"
                  >
                    Send Another Message
                  </Button>
                  
                  <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold">
                    <a href="tel:9043122422">Call Us Now</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Have questions about our services? Need to schedule a cleanup? We're here to help! Send us a message and we'll get back to you within 24 hours.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="neu-raised bg-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-black text-gray-800 mb-4">Contact Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-bold text-gray-800">(904) 312-2422</p>
                      <p className="text-sm text-gray-500">Call or text anytime</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-bold text-gray-800">ryan@dookscoop.com</p>
                      <p className="text-sm text-gray-500">24-hour response</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-bold text-gray-800">Northeast Florida</p>
                      <p className="text-sm text-gray-500">Jacksonville & surrounding areas</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-bold text-gray-800">Mon-Sat: 8AM-6PM</p>
                      <p className="text-sm text-gray-500">Emergency service available</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neu-raised bg-orange-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-black text-gray-800 mb-3">
                  Need a Quote?
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  For instant pricing and to get started with service, visit our quote page where you can see real-time pricing and sign up immediately.
                </p>
                <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold">
                  <a href="/onboard">Get Your Quote</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="neu-raised bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-gray-800">
                  Send Us a Message
                </CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Contact Information */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="neu-input bg-gray-100"
                                placeholder="John Doe"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="tel"
                                className="neu-input bg-gray-100"
                                placeholder="(904) 555-0123"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email"
                              className="neu-input bg-gray-100"
                              placeholder="john@example.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Subject</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="neu-input bg-gray-100"
                              placeholder="How can we help you?"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="neu-input bg-gray-100 min-h-[120px]"
                              placeholder="Tell us about your needs, ask questions, or schedule a service..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={submitContactMutation.isPending}
                      className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 text-lg"
                    >
                      {submitContactMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Contact */}
        <section className="text-center">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-black text-red-800 mb-4">
              <AlertCircle className="w-6 h-6 inline mr-2" />
              Poop Emergency?
            </h3>
            <p className="text-red-700 mb-4">
              Unexpected guests coming over? Last-minute party? We offer same-day emergency service for those "oh no" moments.
            </p>
            <Button className="bg-red-600 hover:bg-red-700 text-white font-bold">
              <a href="tel:9043122422">Call Emergency Line: (904) 312-2422</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}