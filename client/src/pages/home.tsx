import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import { insertWaitlistSubmissionSchema, type InsertWaitlistSubmission } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, MapPin, Shield, Clock, Phone, Mail } from "lucide-react";
import logoImage from "@assets/ChatGPT Image Aug 15, 2025, 06_49_12 PM_1755298579638.png";

type WaitlistForm = InsertWaitlistSubmission;

export default function Home() {
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
        title: "You're on the list! 🎉",
        description: "We'll notify you when we launch in your area. Thanks for joining!",
        variant: "default",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WaitlistForm) => {
    submitMutation.mutate(data);
  };

  const scrollToWaitlist = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('waitlist')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="neu-flat sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="logo-container">
              <img 
                src={logoImage} 
                alt="Dook Scoop 'Em - We Fear No Pile" 
                className="h-16 w-auto pixel-art"
              />
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/locations">
                <button className="text-primary hover:text-accent transition-colors font-medium">
                  Service Areas
                </button>
              </Link>
              <a 
                href="#waitlist" 
                onClick={scrollToWaitlist}
                className="text-primary hover:text-accent transition-colors font-medium"
              >
                Join Waitlist
              </a>
              <button className="neu-button">
                Book My Scoop
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center fade-in">
        <div className="inline-block neu-flat px-6 py-3 mb-8">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-5 h-5 text-accent" />
            <span className="vcr-text text-accent font-medium">Coming Soon</span>
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-primary mb-8 leading-tight">
          Professional
          <br />
          <span className="text-accent">Pet Waste</span>
          <br />
          Removal
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Keep your yard clean and healthy with our reliable, professional pet waste removal service. 
          We're launching soon in your area!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a 
            href="#waitlist" 
            onClick={scrollToWaitlist}
            className="neu-button text-lg px-8 py-4 inline-flex items-center"
          >
            Join Our Waitlist
          </a>
          <Link href="/locations">
            <button className="neu-flat px-8 py-4 text-lg font-medium text-primary hover:text-accent transition-colors">
              View Service Areas
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Why Choose Us?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional, reliable, and affordable pet waste removal services that keep your yard clean.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="neu-card text-center">
            <div className="w-20 h-20 neu-flat rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">Reliable Schedule</h3>
            <p className="text-muted-foreground">
              Weekly, bi-weekly, or monthly service options that fit your needs and budget.
            </p>
          </div>

          <div className="neu-card text-center">
            <div className="w-20 h-20 neu-flat rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">Professional Team</h3>
            <p className="text-muted-foreground">
              Trained specialists who are insured and bonded. Your yard is in expert hands.
            </p>
          </div>

          <div className="neu-card text-center">
            <div className="w-20 h-20 neu-flat rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl pixel-art">⚒️</span>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">Quick Service</h3>
            <p className="text-muted-foreground">
              Fast and efficient cleanup service. Your yard stays healthy and beautiful.
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Join Our Waitlist
          </h2>
          <p className="text-xl text-muted-foreground">
            Be the first to know when we launch in your area. Simple signup, no commitment.
          </p>
        </div>

        <div className="neu-card max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">Your Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your name" 
                          {...field} 
                          className="neu-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your.email@example.com" 
                          {...field} 
                          className="neu-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">Your Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123 Main Street, Austin, TX" 
                        {...field} 
                        className="neu-input"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">Zip Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="78701" 
                          {...field} 
                          className="neu-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="form-label">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(555) 123-4567" 
                          {...field} 
                          className="neu-input"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="numberOfDogs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="form-label">Number of Dogs</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="neu-input">
                          <SelectValue placeholder="Select number of dogs" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="1">1 Dog</SelectItem>
                        <SelectItem value="2">2 Dogs</SelectItem>
                        <SelectItem value="3">3 Dogs</SelectItem>
                        <SelectItem value="4+">4+ Dogs</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full neu-button py-4 text-lg"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? "Joining..." : "Join Waitlist"}
              </Button>
            </form>
          </Form>
        </div>
      </section>

      {/* Footer */}
      <footer className="neu-flat mt-20 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={logoImage} 
              alt="Dook Scoop 'Em - We Fear No Pile" 
              className="h-20 w-auto pixel-art"
            />
          </div>
          
          <p className="text-muted-foreground mb-4">
            Professional pet waste removal services. Licensed, insured, and ready to serve your community.
          </p>
          
          <div className="flex justify-center space-x-6 mb-6">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>contact@dookscoop.com</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>(555) 123-POOP</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2025 Dook Scoop 'Em. Keeping your yard clean and healthy.
          </p>
        </div>
      </footer>
    </div>
  );
}