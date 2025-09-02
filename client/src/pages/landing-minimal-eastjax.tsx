import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, MapPin, Clock, Shield, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { insertWaitlistSubmissionSchema, type InsertWaitlistSubmission } from "@shared/schema";

const formSchema = insertWaitlistSubmissionSchema.extend({
  address: z.string().min(5, "Please enter a valid address"),
});

type FormData = z.infer<typeof formSchema>;

export default function LandingMinimalEastJax() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      numberOfDogs: 1,
      additionalInfo: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertWaitlistSubmission) => {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit waitlist entry");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist"] });
      toast({
        title: "Welcome to the pack! 🐕",
        description: "You're on our waitlist! We'll contact you soon with service details.",
      });
    },
    onError: (error) => {
      console.error("Submission error:", error);
      toast({
        title: "Oops! Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const submissionData: InsertWaitlistSubmission = {
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      address: data.address,
      numberOfDogs: data.numberOfDogs,
      additionalInfo: data.additionalInfo || "",
    };
    
    submitMutation.mutate(submissionData);
  };

  const isLoading = submitMutation.isPending;

  // Auto-scroll to success message when form is submitted
  useEffect(() => {
    if (submitted) {
      const waitlistCard = document.getElementById('waitlist-form');
      if (waitlistCard) {
        waitlistCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [submitted]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl md:text-2xl font-black text-gray-800">
              DOOK SCOOP 'EM
            </div>
            <div className="text-sm text-gray-600 font-medium">
              East Jacksonville & Beaches Area
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Content */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-4 leading-tight">
              We Fear No Pile
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-6">
              Professional pet waste removal coming to <span className="font-bold text-orange-600">East Jacksonville & Beaches</span>
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>East Jacksonville, Neptune Beach, Atlantic Beach, Jacksonville Beach</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>Launching Spring 2025</span>
              </div>
            </div>
          </div>

          {/* Waitlist Card */}
          <Card id="waitlist-form" className="max-w-md mx-auto neu-card bg-white shadow-2xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-black text-gray-800">
                {submitted ? "You're In! 🎉" : "Join Our Waitlist"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {submitted 
                  ? "Welcome to the Dook Scoop 'Em family! We'll be in touch soon with launch details and exclusive founding member perks."
                  : "Be among the first to experience professional pet waste removal in East Jacksonville and the Beaches. Founding members get exclusive perks!"
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              {submitted ? (
                <div className="space-y-4 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                  <div className="space-y-2">
                    <p className="font-bold text-gray-800">What happens next?</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• We'll email you launch updates</li>
                      <li>• Priority booking when we launch</li>
                      <li>• Founding member discounts</li>
                      <li>• Free initial consultation</li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      Questions? Email us at <a href="mailto:hello@dookscoopem.com" className="text-orange-600 hover:underline">hello@dookscoopem.com</a>
                    </p>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-gray-700">Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your full name" 
                              {...field} 
                              className="neu-input"
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-gray-700">Email *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="your.email@example.com" 
                              {...field} 
                              className="neu-input"
                              data-testid="input-email"
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
                          <FormLabel className="font-bold text-gray-700">Phone</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="(904) 555-0123" 
                              {...field} 
                              className="neu-input"
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-gray-700">Service Address *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Street address (East Jax/Beaches area)" 
                              {...field} 
                              className="neu-input"
                              data-testid="input-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="numberOfDogs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-gray-700">Number of Dogs *</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="neu-input" data-testid="select-dogs">
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
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-gray-700">Additional Info</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Yard size, special requirements, questions..." 
                              {...field} 
                              className="neu-input min-h-[80px]"
                              data-testid="textarea-info"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 text-lg mt-6"
                      disabled={isLoading}
                      data-testid="button-submit"
                    >
                      {isLoading ? "Joining..." : "Join Waitlist"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <Shield className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Licensed & Insured</h3>
              <p className="text-sm text-gray-600">Professional service you can trust</p>
            </div>
            
            <div className="text-center">
              <Clock className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Reliable Schedule</h3>
              <p className="text-sm text-gray-600">Weekly, bi-weekly, or one-time service</p>
            </div>
            
            <div className="text-center">
              <Heart className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Pet Safe Methods</h3>
              <p className="text-sm text-gray-600">Eco-friendly products safe for your pets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-black mb-2">DOOK SCOOP 'EM</div>
          <p className="text-gray-300 mb-4">We Fear No Pile!</p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Professional Pet Waste Removal | East Jacksonville & Beaches</p>
            <p>Email: <a href="mailto:hello@dookscoopem.com" className="text-orange-400 hover:underline">hello@dookscoopem.com</a></p>
            <p className="pt-4 border-t border-gray-700">© 2025 Dook Scoop 'Em. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}