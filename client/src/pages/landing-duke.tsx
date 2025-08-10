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
import { Calendar, Shield, Heart, MapPin, Clock, Target, Zap, Bomb } from "lucide-react";

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
        title: "TARGET ACQUIRED!",
        description: "Your coordinates have been logged. Prepare for tactical cleanup deployment!",
        variant: "default",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
    onError: (error) => {
      toast({
        title: "MISSION FAILED",
        description: error.message || "Strategic error encountered. Retry mission.",
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
              <div className="w-14 h-14 explosive-button rounded-sm flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-yellow-300">💥</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold neon-yellow font-serif tracking-wider">DOOK SCOOP EM</h1>
                <p className="text-sm text-yellow-300 font-mono tracking-wide">TACTICAL WASTE ELIMINATION</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/locations">
                <button className="nuclear-button px-4 py-2 font-mono font-bold tracking-wide">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  COMBAT ZONES
                </button>
              </Link>
              <a 
                href="#waitlist" 
                onClick={scrollToWaitlist}
                className="explosive-button px-4 py-2 font-mono font-bold tracking-wide text-yellow-300"
              >
                <Target className="w-4 h-4 inline mr-2" />
                JOIN SQUAD
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
              <div className="inline-block nuclear-button px-6 py-3 font-mono font-bold mb-8">
                <Clock className="w-5 h-5 inline mr-2" />
                MISSION BRIEFING: LAUNCHING SOON
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold neon-red font-serif mb-8 leading-tight tracking-wider">
                ELIMINATE 
                <span className="neon-yellow block"> DOG WASTE</span>
                <span className="neon-green text-4xl sm:text-5xl lg:text-6xl"> WITH EXTREME PREJUDICE</span>
              </h1>
              <p className="text-xl sm:text-2xl text-yellow-300 mb-12 leading-relaxed max-w-4xl mx-auto font-mono">
                Professional tactical cleanup operations for your yard perimeter. 
                Zero tolerance for biological hazards. ENLIST TODAY!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a 
                  href="#waitlist" 
                  onClick={scrollToWaitlist}
                  className="explosive-button px-8 py-5 font-mono font-bold text-xl text-yellow-300 inline-flex items-center justify-center"
                >
                  <Bomb className="w-6 h-6 mr-3" />
                  DEPLOY TO WAITLIST
                </a>
                <Link href="/locations">
                  <button className="nuclear-button px-8 py-5 font-mono font-bold text-xl inline-flex items-center justify-center">
                    <MapPin className="w-6 h-6 mr-3" />
                    RECON TERRITORIES
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
              <h2 className="text-4xl sm:text-5xl font-bold neon-yellow font-serif mb-6 tracking-wider">
                TACTICAL ADVANTAGES
              </h2>
              <p className="text-xl text-yellow-300 max-w-3xl mx-auto font-mono">
                Military-grade waste elimination protocols. No mess left behind. Maximum efficiency guaranteed.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="metal-panel p-8 cyber-border">
                <div className="w-20 h-20 explosive-button rounded-sm flex items-center justify-center mx-auto mb-6">
                  <Calendar className="text-yellow-300 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold neon-red font-serif mb-4 text-center">SCHEDULED RAIDS</h3>
                <p className="text-yellow-300 font-mono text-center">
                  Weekly, bi-weekly, or monthly tactical strikes. Your yard stays clean. Mission guaranteed.
                </p>
              </div>

              <div className="metal-panel p-8 cyber-border">
                <div className="w-20 h-20 toxic-button rounded-sm flex items-center justify-center mx-auto mb-6">
                  <Shield className="text-yellow-300 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold neon-green font-serif mb-4 text-center">ELITE OPERATORS</h3>
                <p className="text-yellow-300 font-mono text-center">
                  Professional cleanup specialists. Insured and bonded. Ready for any biological threat.
                </p>
              </div>

              <div className="metal-panel p-8 cyber-border">
                <div className="w-20 h-20 nuclear-button rounded-sm flex items-center justify-center mx-auto mb-6">
                  <Zap className="text-gray-900 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold neon-yellow font-serif mb-4 text-center">RAPID RESPONSE</h3>
                <p className="text-yellow-300 font-mono text-center">
                  Fast deployment. Quick extraction. Your yard perimeter secured within hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section id="waitlist" className="py-20 bg-gradient-to-br from-gray-900 to-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold neon-red font-serif mb-6 tracking-wider">
                ENLIST FOR DUTY
              </h2>
              <p className="text-xl text-yellow-300 font-mono">
                Register your coordinates. Be first in line for tactical waste elimination deployment.
              </p>
            </div>

            <div className="metal-panel p-8 cyber-border max-w-2xl mx-auto">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-yellow-300 font-mono font-bold">OPERATIVE NAME</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Duke" 
                              {...field} 
                              className="bg-gray-900 border-yellow-600 text-yellow-300 font-mono cyber-border"
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
                          <FormLabel className="text-yellow-300 font-mono font-bold">COMM CHANNEL</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="duke@battlefield.com" 
                              {...field} 
                              className="bg-gray-900 border-yellow-600 text-yellow-300 font-mono cyber-border"
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
                        <FormLabel className="text-yellow-300 font-mono font-bold">TARGET COORDINATES</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123 Main Street, Austin, TX" 
                            {...field} 
                            className="bg-gray-900 border-yellow-600 text-yellow-300 font-mono cyber-border"
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
                          <FormLabel className="text-yellow-300 font-mono font-bold">SECTOR CODE</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="78701" 
                              {...field} 
                              className="bg-gray-900 border-yellow-600 text-yellow-300 font-mono cyber-border"
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
                          <FormLabel className="text-yellow-300 font-mono font-bold">TACTICAL PHONE</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(555) 123-4567" 
                              {...field} 
                              className="bg-gray-900 border-yellow-600 text-yellow-300 font-mono cyber-border"
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
                        <FormLabel className="text-yellow-300 font-mono font-bold">BIOLOGICAL THREATS COUNT</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-900 border-yellow-600 text-yellow-300 font-mono cyber-border">
                              <SelectValue placeholder="Select threat level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-900 border-yellow-600">
                            <SelectItem value="1" className="text-yellow-300 font-mono">1 DOG</SelectItem>
                            <SelectItem value="2" className="text-yellow-300 font-mono">2 DOGS</SelectItem>
                            <SelectItem value="3" className="text-yellow-300 font-mono">3 DOGS</SelectItem>
                            <SelectItem value="4+" className="text-yellow-300 font-mono">4+ DOGS (HIGH THREAT)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full explosive-button py-4 text-xl font-mono font-bold text-yellow-300"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? "DEPLOYING..." : "ENLIST FOR CLEANUP DUTY"}
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
              <div className="w-12 h-12 explosive-button rounded-sm flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-300">💥</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold neon-yellow font-serif">DOOK SCOOP EM</h3>
                <p className="text-sm text-yellow-300 font-mono">TACTICAL WASTE ELIMINATION</p>
              </div>
            </div>
            <p className="text-yellow-300 font-mono">
              Professional biological threat neutralization services. Licensed. Insured. Ready for deployment.
            </p>
            <p className="text-yellow-600 font-mono text-sm mt-4">
              © 2025 Dook Scoop Em. All waste eliminated with extreme prejudice.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}