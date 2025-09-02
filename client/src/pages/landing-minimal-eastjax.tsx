import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Facebook, Instagram, ChevronDown, ChevronUp } from "lucide-react";
import heroLogoImage from "@assets/transp_BG_1755778985315.png";

// Enhanced waitlist form schema
const waitlistFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  zipCode: z.string().min(5, "Please enter a valid zip code"),
  numberOfDogs: z.number().min(1).max(4),
  referralSource: z.string().min(1, "Please tell us how you heard about us"),
  urgency: z.string().min(1, "Please let us know your timing needs"),
  lastCleanup: z.string().min(1, "Please let us know when your last cleanup was"),
  preferredPlan: z.string().min(1, "Please select your preferred plan"),
  canText: z.boolean().default(false),
});

type WaitlistFormData = z.infer<typeof waitlistFormSchema>;

export default function LandingMinimalEastJax() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [numberOfDogs, setNumberOfDogs] = useState([2]);
  const [submitted, setSubmitted] = useState(false);
  
  // State for mobile pricing card expansion
  const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});
  
  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      zipCode: "",
      numberOfDogs: 2,
      referralSource: "",
      urgency: "",
      lastCleanup: "",
      preferredPlan: "",
      canText: false,
    },
  });

  const joinWaitlistMutation = useMutation({
    mutationFn: async (data: WaitlistFormData) => {
      // Create the full address and name fields for backend compatibility
      const submitData = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        address: `Zip: ${data.zipCode}`, // Simple address format
        zipCode: data.zipCode,
        numberOfDogs: data.numberOfDogs.toString(),
        referralSource: data.referralSource,
        urgency: data.urgency,
        preferredPlan: data.preferredPlan,
        lastCleanup: data.lastCleanup,
        canText: data.canText,
      };

      return apiRequest("POST", "/api/waitlist", submitData);
    },
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/waitlist"] });
      
      // Track successful waitlist signup
      if (typeof window !== 'undefined') {
        // Import analytics functions dynamically to avoid SSR issues
        import('../../lib/analytics').then(({ trackEvent, trackConversion }) => {
          trackEvent('sign_up', 'waitlist', 'waitlist_form');
          trackConversion('Lead', {
            content_name: 'Waitlist Signup',
            value: 1
          });
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Oops! Something went wrong",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WaitlistFormData) => {
    joinWaitlistMutation.mutate({ ...data, numberOfDogs: numberOfDogs[0] });
  };

  const scrollToPerks = () => {
    const perksSection = document.getElementById('perks');
    if (perksSection) {
      const elementPosition = perksSection.offsetTop;
      const offsetPosition = elementPosition - 50; // 50px buffer from top
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToWaitlistForm = () => {
    const waitlistForm = document.getElementById('waitlist-form');
    if (waitlistForm) {
      const elementPosition = waitlistForm.offsetTop;
      const offsetPosition = elementPosition - 50; // 50px buffer from top
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll to success message when form is submitted
  useEffect(() => {
    if (submitted) {
      const waitlistCard = document.getElementById('waitlist-form');
      if (waitlistCard) {
        const elementPosition = waitlistCard.offsetTop;
        const offsetPosition = elementPosition - 50; // 50px below viewport top
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [submitted]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="w-full py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Company Name */}
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-gray-800"
            style={{ fontFamily: 'var(--font-90s)', letterSpacing: '0.05em' }}
          >
            DOOK SCOOP 'EM
          </h1>
          
          {/* Hero Pixel Art Logo */}
          <div className="mb-6">
            <img 
              src={heroLogoImage} 
              alt="Dook Scoop Em Hero Logo" 
              className="w-80 h-80 md:w-96 md:h-96 mx-auto object-contain pixel-perfect"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          
          <div className="inline-block bg-gradient-to-b from-orange-100 to-orange-200 px-6 py-3 rounded-lg mb-4 shadow-sm">
            <p className="text-xl md:text-2xl text-gray-800 font-black">
              Professional Pet Waste Removal Service
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-gray-700 mb-4 font-bold">
            Starting in East Jacksonville, Neptune Beach, Atlantic Beach & Jacksonville Beach. Founding members get perks.
          </p>
          
          <Button 
            onClick={scrollToPerks}
            className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 mb-6 transition-all duration-200 transform hover:scale-105"
          >
            View Perks
          </Button>
          
          <p className="text-base md:text-lg text-gray-500 mb-8 font-medium italic">
            coming to the rest of North East Florida very soon...
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pb-16">
        {/* Waitlist Form / Success State */}
        <Card id="waitlist-form" className="neu-raised shadow-2xl">
          {!submitted ? (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl md:text-3xl font-black text-gray-800">
                  Join Our Waitlist
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  We may already be scooping in your area!
                </p>
              </CardHeader>
              <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">First Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="neu-input font-medium bg-gray-100"
                            placeholder="John"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="neu-input font-medium bg-gray-100"
                            placeholder="Doe"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email"
                            className="neu-input font-medium bg-gray-100"
                            placeholder="john@example.com"
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
                        <FormLabel className="font-bold">Phone</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="tel"
                            className="neu-input font-medium bg-gray-100"
                            placeholder="(555) 123-4567"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Text Permission Checkbox */}
                <FormField
                  control={form.control}
                  name="canText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Can we text you?</FormLabel>
                      <div className="flex items-start space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label className="text-sm font-medium leading-none cursor-pointer select-none">
                          I accept your texts of destiny, no spam please
                        </label>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Zip Code */}
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Zip Code</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="neu-input font-medium bg-gray-100"
                          placeholder="32233"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Number of Dogs Slider */}
                <FormField
                  control={form.control}
                  name="numberOfDogs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        Number of Dogs: {numberOfDogs[0] === 4 ? "4+" : numberOfDogs[0]}
                      </FormLabel>
                      <FormControl>
                        <div className="px-4">
                          <Slider
                            value={numberOfDogs}
                            onValueChange={(value) => {
                              setNumberOfDogs(value);
                              field.onChange(value[0]);
                            }}
                            max={4}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-2">
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4+</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Referral Source */}
                <FormField
                  control={form.control}
                  name="referralSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">How did you hear about us?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="neu-input bg-gray-100">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="google">Google Search</SelectItem>
                          <SelectItem value="friend_family">Friend or Family</SelectItem>
                          <SelectItem value="neighbor">Neighbor</SelectItem>
                          <SelectItem value="nextdoor">Nextdoor</SelectItem>
                          <SelectItem value="flyer">Flyer/Door Hanger</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Service Urgency */}
                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">How soon do you need service?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="neu-input bg-gray-100">
                            <SelectValue placeholder="Select your urgency level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yesterday">Yesterday! 😅</SelectItem>
                          <SelectItem value="asap">ASAP - It's getting bad out there!</SelectItem>
                          <SelectItem value="this_week">This week would be great</SelectItem>
                          <SelectItem value="next_week">Next week is fine</SelectItem>
                          <SelectItem value="within_month">Within the month</SelectItem>
                          <SelectItem value="whenever">Whenever - no rush</SelectItem>
                          <SelectItem value="planning_ahead">Just planning ahead</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preferred Plan */}
                <FormField
                  control={form.control}
                  name="preferredPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Which plan interests you most?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="neu-input bg-gray-100">
                            <SelectValue placeholder="Select your preferred plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="regular" disabled className="text-gray-400 italic">Regular - $100/mo (Not available for founding members)</SelectItem>
                          <SelectItem value="founding_monthly">Founding Monthly - $90/mo (Popular)</SelectItem>
                          <SelectItem value="founding_annual">Founding Annual - $85/mo (Best Value)</SelectItem>
                          <SelectItem value="unsure">Not sure yet</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Cleanup */}
                <FormField
                  control={form.control}
                  name="lastCleanup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">When was your last clean up?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="neu-input bg-gray-100">
                            <SelectValue placeholder="Select your last cleanup timeframe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yesterday">Yesterday (impressive!)</SelectItem>
                          <SelectItem value="last_week">Last week</SelectItem>
                          <SelectItem value="last_month">Last month</SelectItem>
                          <SelectItem value="few_months">A few months ago</SelectItem>
                          <SelectItem value="long_time">Oh God, it's been forever</SelectItem>
                          <SelectItem value="what_cleanup">What's a cleanup? 😅</SelectItem>
                          <SelectItem value="new_dog">Just got my dog(s)</SelectItem>
                          <SelectItem value="never">Never (we fear no pile!)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={joinWaitlistMutation.isPending}
                  className="w-full neu-button text-lg font-black py-6"
                >
                  {joinWaitlistMutation.isPending ? "Joining the Pack..." : "Join Waitlist"}
                </Button>
              </form>
            </Form>
              </CardContent>
            </>
          ) : (
            /* Success State */
            <div className="success-appear p-8 text-center">
              {/* Animated Checkmark */}
              <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{background: 'hsl(29 100% 64%)'}}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M20 6L9 17L4 12" 
                      stroke="white" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="checkmark-animate"
                    />
                  </svg>
                </div>
              </div>

              {/* Success Content */}
              <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
                🚀 Nice Scoop! You're In.
              </h2>
              
              <div className="text-gray-700 text-lg mb-8 space-y-4">
                <p className="font-medium">
                  We'll be reaching out soon to confirm your details and set you up.
                </p>
                
                <p className="text-gray-600 text-base">
                  📧 We just sent you an email — it may take a few minutes to show up.
                </p>
                
                <p className="font-bold">
                  Because you joined the Founding Members Waitlist, you've unlocked:
                </p>
                
                <ul className="text-left max-w-md mx-auto space-y-2 text-base">
                  <li className="flex items-center">
                    <span className="text-orange-600 font-black mr-3">✓</span>
                    Special perks built for early supporters
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-600 font-black mr-3">✓</span>
                    Locked-in pricing for your first 12 months
                  </li>
                  <li className="flex items-center">
                    <span className="text-orange-600 font-black mr-3">✓</span>
                    Priority onboarding when routes open in your area
                  </li>
                </ul>
              </div>
              
              <p className="text-gray-600 font-medium italic mb-4">
                Consider yourself part of the elite squad that fears no pile. 🐾
              </p>
              
              <p className="text-gray-600 font-medium mb-8">
                Talk Soon,<br />
                Team Dook Scoop 'Em
              </p>
            </div>
          )}
        </Card>

        {/* CTA Button */}
        {!submitted && (
          <div className="text-center mt-8">
            <Button 
              onClick={scrollToWaitlistForm}
              className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3 text-lg transition-all duration-200 transform hover:scale-105"
            >
              Join Waitlist Now
            </Button>
          </div>
        )}

        {/* Pricing Section */}
        <section id="perks" className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
              Founding Member Perks
            </h2>
            <p className="text-gray-600 font-medium">
              Be among our first customers and lock in exclusive benefits
            </p>
          </div>

          {/* Mobile-Optimized Pricing Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Regular Plan - Not Available */}
            <Card className="neu-raised opacity-60 relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-300 bg-opacity-20"></div>
              <CardHeader className="text-center relative">
                <CardTitle className="text-xl font-black text-gray-500">Regular Plan</CardTitle>
                <div className="text-3xl font-black text-gray-500 mb-2">$100<span className="text-lg">/mo</span></div>
                <p className="text-gray-400 font-medium italic">Not available for founding members</p>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-3 text-gray-400">
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-gray-300 mr-3 flex-shrink-0"></span>
                    <span>Weekly yard cleanup</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-gray-300 mr-3 flex-shrink-0"></span>
                    <span>Standard equipment</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-gray-300 mr-3 flex-shrink-0"></span>
                    <span>Basic service guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Founding Monthly - Popular */}
            <Card 
              className="neu-raised relative border-2 border-orange-500 shadow-xl transform hover:scale-105 transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, hsl(29 100% 96%) 0%, hsl(29 100% 92%) 100%)' }}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-black">
                  POPULAR
                </span>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-black text-gray-800">Founding Monthly</CardTitle>
                <div className="text-3xl font-black text-orange-600 mb-2">$90<span className="text-lg">/mo</span></div>
                <p className="text-gray-600 font-medium">Save $10/month forever</p>
              </CardHeader>
              <CardContent>
                {/* Mobile Expandable Section */}
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    onClick={() => toggleCardExpansion('founding-monthly')}
                    className="w-full flex items-center justify-between p-2 mb-4 bg-white bg-opacity-50 rounded-lg"
                  >
                    <span className="font-bold">View Benefits</span>
                    {expandedCards['founding-monthly'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  
                  {expandedCards['founding-monthly'] && (
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-orange-600 mr-3 flex-shrink-0"></span>
                        <span>Weekly yard cleanup</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-orange-600 mr-3 flex-shrink-0"></span>
                        <span>Premium equipment & eco-friendly products</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-orange-600 mr-3 flex-shrink-0"></span>
                        <span>Priority scheduling</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-orange-600 mr-3 flex-shrink-0"></span>
                        <span>Locked-in pricing for 12 months</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-orange-600 mr-3 flex-shrink-0"></span>
                        <span>Free service customization</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-orange-600 mr-3 flex-shrink-0"></span>
                        <span>Founding member recognition</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Always Visible */}
                <div className="hidden md:block space-y-3">
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-orange-600 mr-3 flex-shrink-0"></span>
                    <span>Weekly yard cleanup</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-orange-600 mr-3 flex-shrink-0"></span>
                    <span>Premium equipment & eco-friendly products</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-orange-600 mr-3 flex-shrink-0"></span>
                    <span>Priority scheduling</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-orange-600 mr-3 flex-shrink-0"></span>
                    <span>Locked-in pricing for 12 months</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-orange-600 mr-3 flex-shrink-0"></span>
                    <span>Free service customization</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-orange-600 mr-3 flex-shrink-0"></span>
                    <span>Founding member recognition</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Founding Annual - Best Value */}
            <Card className="neu-raised relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-black">
                  BEST VALUE
                </span>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-black text-gray-800">Founding Annual</CardTitle>
                <div className="text-3xl font-black text-green-600 mb-2">$85<span className="text-lg">/mo</span></div>
                <p className="text-gray-600 font-medium">Save $15/month + 2 months free</p>
              </CardHeader>
              <CardContent>
                {/* Mobile Expandable Section */}
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    onClick={() => toggleCardExpansion('founding-annual')}
                    className="w-full flex items-center justify-between p-2 mb-4 bg-white bg-opacity-50 rounded-lg"
                  >
                    <span className="font-bold">View Benefits</span>
                    {expandedCards['founding-annual'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  
                  {expandedCards['founding-annual'] && (
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-green-600 mr-3 flex-shrink-0"></span>
                        <span>Everything in Founding Monthly</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-green-600 mr-3 flex-shrink-0"></span>
                        <span>Extra 2 months free (14 months total)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-green-600 mr-3 flex-shrink-0"></span>
                        <span>Exclusive founding member benefits</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-green-600 mr-3 flex-shrink-0"></span>
                        <span>Holiday season priority service</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-green-600 mr-3 flex-shrink-0"></span>
                        <span>Free deep clean once per year</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 rounded-full bg-green-600 mr-3 flex-shrink-0"></span>
                        <span>VIP customer support</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Always Visible */}
                <div className="hidden md:block space-y-3">
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-600 mr-3 flex-shrink-0"></span>
                    <span>Everything in Founding Monthly</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-600 mr-3 flex-shrink-0"></span>
                    <span>Extra 2 months free (14 months total)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-600 mr-3 flex-shrink-0"></span>
                    <span>Exclusive founding member benefits</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-600 mr-3 flex-shrink-0"></span>
                    <span>Holiday season priority service</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-600 mr-3 flex-shrink-0"></span>
                    <span>Free deep clean once per year</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-600 mr-3 flex-shrink-0"></span>
                    <span>VIP customer support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Section */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-black text-gray-800 mb-8">
              We Fear No Pile Because We're Professionals
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-black text-gray-800">Licensed & Insured</h4>
                <p className="text-gray-600">Fully licensed business with comprehensive insurance coverage for your peace of mind</p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-black text-gray-800">Reliable Schedule</h4>
                <p className="text-gray-600">Consistent weekly service you can count on. We show up when we say we will</p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-black text-gray-800">Pet Safe Products</h4>
                <p className="text-gray-600">Only eco-friendly, pet-safe cleaning products that protect your furry family members</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-black mb-4">DOOK SCOOP 'EM</h3>
              <p className="text-gray-300 mb-4">We Fear No Pile!</p>
              <p className="text-gray-400 text-sm">Professional pet waste removal service coming to East Jacksonville & Beaches</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Service Areas</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>East Jacksonville</li>
                <li>Neptune Beach</li>
                <li>Atlantic Beach</li>
                <li>Jacksonville Beach</li>
                <li>More areas coming soon...</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>Email: <a href="mailto:hello@dookscoopem.com" className="text-orange-400 hover:underline">hello@dookscoopem.com</a></p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Dook Scoop 'Em. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}