import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Phone, Mail, MapPin, Clock, Calculator, CheckCircle, AlertCircle } from "lucide-react";
import { insertQuoteRequestSchema } from "@shared/schema";
import { z } from "zod";

type QuoteFormData = z.infer<typeof insertQuoteRequestSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteResponse, setQuoteResponse] = useState<any>(null);

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(insertQuoteRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      zipCode: "",
      numberOfDogs: 1,
      serviceFrequency: "weekly",
      lastCleanedTimeframe: "one_month",
      urgency: "within_month",
      preferredContactMethod: "email",
      message: "",
    },
  });

  const submitQuoteMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      return apiRequest("POST", "/api/quote", data);
    },
    onSuccess: (response) => {
      setQuoteResponse(response);
      setIsSubmitted(true);
      
      // Track quote submission
      if (typeof window !== 'undefined') {
        import('../../lib/analytics').then(({ trackEvent }) => {
          trackEvent('quote_request', 'quote_form', 'contact_page');
        });
      }
      
      toast({
        title: "Quote Request Received!",
        description: "We'll get back to you within 24 hours with your custom quote.",
      });
    },
    onError: (error: any) => {
      console.error("Quote submission error:", error);
      toast({
        title: "Oops! Something went wrong",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: QuoteFormData) => {
    console.log("Submitting quote request:", data);
    submitQuoteMutation.mutate(data);
  };

  if (isSubmitted && quoteResponse) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navigation />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="neu-raised bg-white">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
                  Quote Request Received!
                </h1>
                
                <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-gray-800 mb-4">What's Next:</h3>
                  <p className="text-gray-600 mb-4">{quoteResponse.nextSteps}</p>
                  
                  {quoteResponse.emailExistsInSystem && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-blue-800 font-medium">
                          Great news! We found your information in our system.
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {quoteResponse.pricing && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-bold text-green-800 mb-2">
                        <Calculator className="w-5 h-5 inline mr-2" />
                        Estimated Pricing
                      </h4>
                      <p className="text-green-700">
                        <strong>${quoteResponse.pricing.estimatedPrice}/month</strong> for {quoteResponse.pricing.frequency} service
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        *Final pricing may vary based on yard size and specific requirements
                      </p>
                    </div>
                  )}
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
                      setQuoteResponse(null);
                      form.reset();
                    }}
                    variant="outline"
                    className="mr-4"
                  >
                    Submit Another Quote
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
            Get Your Free Quote
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Professional poop scooping with real-time pricing. Tell us about your yard and pups, and we'll give you an instant estimate synced with our scheduling system.
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
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Real-Time Pricing
                </h3>
                <p className="text-gray-700 text-sm">
                  Your quote is calculated instantly using our professional scheduling system. Pricing is based on your zip code, number of dogs, yard size, and service frequency.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quote Form */}
          <div className="lg:col-span-2">
            <Card className="neu-raised bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-gray-800">
                  Get Your Instant Quote
                </CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and we'll provide real-time pricing from our system.
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
                                placeholder="(904) 555-0000"
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

                    {/* Service Location */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold">Service Address</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="neu-input bg-gray-100"
                                  placeholder="123 Main Street, Jacksonville, FL"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">Zip Code</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="neu-input bg-gray-100"
                                placeholder="32256"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Service Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="numberOfDogs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">Number of Dogs</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <FormControl>
                                <SelectTrigger className="neu-input bg-gray-100">
                                  <SelectValue placeholder="Select number of dogs" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">1 Dog</SelectItem>
                                <SelectItem value="2">2 Dogs</SelectItem>
                                <SelectItem value="3">3 Dogs</SelectItem>
                                <SelectItem value="4">4 Dogs</SelectItem>
                                <SelectItem value="5">5+ Dogs</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="serviceFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">Service Frequency</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="neu-input bg-gray-100">
                                  <SelectValue placeholder="How often?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="weekly">Weekly (Recommended)</SelectItem>
                                <SelectItem value="bi_weekly">Bi-Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="lastCleanedTimeframe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">Last Yard Cleanup</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="neu-input bg-gray-100">
                                  <SelectValue placeholder="When was it last cleaned?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="one_week">Last week</SelectItem>
                                <SelectItem value="one_month">Last month</SelectItem>
                                <SelectItem value="three_months">3 months ago</SelectItem>
                                <SelectItem value="six_months">6 months ago</SelectItem>
                                <SelectItem value="one_year">Over a year ago</SelectItem>
                                <SelectItem value="never">Never cleaned professionally</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="urgency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">When Do You Need Service?</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="neu-input bg-gray-100">
                                  <SelectValue placeholder="Timeline?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="asap">ASAP - It's getting bad!</SelectItem>
                                <SelectItem value="this_week">This week</SelectItem>
                                <SelectItem value="next_week">Next week</SelectItem>
                                <SelectItem value="within_month">Within the month</SelectItem>
                                <SelectItem value="planning_ahead">Just planning ahead</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="preferredContactMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Preferred Contact Method</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="neu-input bg-gray-100">
                                <SelectValue placeholder="How should we contact you?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone Call</SelectItem>
                              <SelectItem value="text">Text Message</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Additional Details (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="neu-input bg-gray-100 min-h-[100px]"
                              placeholder="Tell us about your yard, any special requirements, gate codes, etc."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit"
                      disabled={submitQuoteMutation.isPending}
                      className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 text-lg"
                    >
                      {submitQuoteMutation.isPending ? (
                        "Getting Your Quote..."
                      ) : (
                        <>
                          <Calculator className="w-5 h-5 mr-2" />
                          Get My Instant Quote
                        </>
                      )}
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