import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { insertWaitlistSubmissionSchema, type InsertWaitlistSubmission } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, Shield, Heart, MapPin, Clock, Target, Zap } from "lucide-react";

type WaitlistForm = InsertWaitlistSubmission;

export default function Landing() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<WaitlistForm>({
    resolver: zodResolver(insertWaitlistSubmissionSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      zipCode: "",
      phone: "",
      numberOfDogs: "1",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: WaitlistForm) => {
      const response = await apiRequest("POST", "/api/waitlist", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to the Team!",
        description: "You've been added to our waitlist. We'll notify you when we launch in your area!",
        variant: "default",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
    onError: (error) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WaitlistForm) => {
    submitMutation.mutate(data);
  };

  const scrollToWaitlist = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="metal-panel border-b-2 border-yellow-400 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 action-button rounded-sm flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-yellow-300">🐕</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold glow-yellow font-serif tracking-wider">Dook Scoop Em</h1>
                <p className="text-sm text-yellow-300 font-mono tracking-wide">Professional Pet Waste Removal</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/locations">
                <button className="bright-button px-4 py-2 font-mono font-bold tracking-wide">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Service Areas
                </button>
              </Link>
              <a 
                href="#waitlist" 
                onClick={scrollToWaitlist}
                className="action-button px-4 py-2 font-mono font-bold tracking-wide text-yellow-300"
              >
                <Target className="w-4 h-4 inline mr-2" />
                Join Waitlist
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-50"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            <div className="text-center">
              <div className="inline-block bright-button px-6 py-3 font-mono font-bold mb-8">
                <Clock className="w-5 h-5 inline mr-2" />
                Coming Soon - Launch Date TBD
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold glow-red font-serif mb-8 leading-tight tracking-wider">
                Professional 
                <span className="glow-yellow block"> Dog Waste</span>
                <span className="glow-green text-4xl sm:text-5xl lg:text-6xl"> Removal Service</span>
              </h1>
              <p className="text-xl sm:text-2xl text-yellow-300 mb-12 leading-relaxed max-w-4xl mx-auto font-mono">
                Keep your yard clean and healthy with our reliable pet waste removal service. 
                We're launching soon in your area!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a 
                  href="#waitlist" 
                  onClick={scrollToWaitlist}
                  className="action-button px-8 py-5 font-mono font-bold text-xl text-yellow-300 inline-flex items-center justify-center"
                >
                  <Heart className="w-6 h-6 mr-3" />
                  Join Our Waitlist
                </a>
                <Link href="/locations">
                  <button className="bright-button px-8 py-5 font-mono font-bold text-xl inline-flex items-center justify-center">
                    <MapPin className="w-6 h-6 mr-3" />
                    View Service Areas
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 metal-panel">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold glow-yellow font-serif mb-6 tracking-wider">
                Why Choose Us?
              </h2>
              <p className="text-xl text-yellow-300 max-w-3xl mx-auto font-mono">
                Professional, reliable, and affordable pet waste removal services that keep your yard clean.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="metal-panel p-8 retro-border">
                <div className="w-20 h-20 action-button rounded-sm flex items-center justify-center mx-auto mb-6">
                  <Calendar className="text-yellow-300 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold glow-red font-serif mb-4 text-center">Reliable Schedule</h3>
                <p className="text-yellow-300 font-mono text-center">
                  Weekly, bi-weekly, or monthly service options that fit your needs and budget.
                </p>
              </div>

              <div className="metal-panel p-8 retro-border">
                <div className="w-20 h-20 success-button rounded-sm flex items-center justify-center mx-auto mb-6">
                  <Shield className="text-yellow-300 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold glow-green font-serif mb-4 text-center">Professional Team</h3>
                <p className="text-yellow-300 font-mono text-center">
                  Trained specialists who are insured and bonded. Your yard is in expert hands.
                </p>
              </div>

              <div className="metal-panel p-8 retro-border">
                <div className="w-20 h-20 bright-button rounded-sm flex items-center justify-center mx-auto mb-6">
                  <Zap className="text-gray-900 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold glow-yellow font-serif mb-4 text-center">Quick Service</h3>
                <p className="text-yellow-300 font-mono text-center">
                  Fast and efficient cleanup service. Your yard stays healthy and beautiful.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section id="waitlist" className="py-20 bg-gradient-to-br from-gray-900 to-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold glow-red font-serif mb-6 tracking-wider">
                Join Our Waitlist
              </h2>
              <p className="text-xl text-yellow-300 font-mono">
                Be the first to know when we launch in your area. Simple signup, no commitment.
              </p>
            </div>

            <div className="metal-panel p-8 retro-border max-w-2xl mx-auto">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-yellow-300 font-mono font-bold">Your Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your name" 
                              {...field} 
                              className="bg-gray-900 border-yellow-600 text-yellow-300 font-mono retro-border"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-yellow-300 font-mono font-bold">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="your.email@example.com" 
                              {...field} 
                              className="bg-gray-900 border-yellow-600 text-yellow-300 font-mono retro-border"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-300 font-mono font-bold">Your Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123 Main Street, Austin, TX" 
                            {...field} 
                            className="bg-gray-900 border-yellow-600 text-yellow-300 font-mono retro-border"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-yellow-300 font-mono font-bold">Zip Code</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="78701" 
                              {...field} 
                              className="bg-gray-900 border-yellow-600 text-yellow-300 font-mono retro-border"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-yellow-300 font-mono font-bold">Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(555) 123-4567" 
                              {...field} 
                              className="bg-gray-900 border-yellow-600 text-yellow-300 font-mono retro-border"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="numberOfDogs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-yellow-300 font-mono font-bold">Number of Dogs</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-900 border-yellow-600 text-yellow-300 font-mono retro-border">
                              <SelectValue placeholder="Select number of dogs" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-900 border-yellow-600">
                            <SelectItem value="1" className="text-yellow-300 font-mono">1 Dog</SelectItem>
                            <SelectItem value="2" className="text-yellow-300 font-mono">2 Dogs</SelectItem>
                            <SelectItem value="3" className="text-yellow-300 font-mono">3 Dogs</SelectItem>
                            <SelectItem value="4+" className="text-yellow-300 font-mono">4+ Dogs</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full action-button py-4 text-xl font-mono font-bold text-yellow-300"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? "Joining..." : "Join Waitlist"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="metal-panel border-t-2 border-yellow-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-12 action-button rounded-sm flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-300">🐕</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold glow-yellow font-serif">Dook Scoop Em</h3>
                <p className="text-sm text-yellow-300 font-mono">Professional Pet Waste Removal</p>
              </div>
            </div>
            <p className="text-yellow-300 font-mono">
              Professional pet waste removal services. Licensed, insured, and ready to serve your community.
            </p>
            <p className="text-yellow-600 font-mono text-sm mt-4">
              © 2025 Dook Scoop Em. Keeping your yard clean and healthy.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}