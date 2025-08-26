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
import { Facebook, Instagram } from "lucide-react";
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
  canText: z.boolean().default(false),
});

type WaitlistFormData = z.infer<typeof waitlistFormSchema>;

export default function LandingMinimal() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [numberOfDogs, setNumberOfDogs] = useState([2]);
  const [submitted, setSubmitted] = useState(false);

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
        lastCleanup: data.lastCleanup,
        canText: data.canText,
      };

      return apiRequest("POST", "/api/waitlist", submitData);
    },
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/waitlist"] });
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
      perksSection.scrollIntoView({ behavior: 'smooth' });
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
          
          <p className="text-lg md:text-xl text-gray-700 mb-2 font-bold">
            Starting in Yulee, Fernandina, Oceanway & Nassau County. Founding members <a href="#perks" className="text-orange-600 hover:text-orange-700 font-bold transition-colors">get perks</a>.
          </p>
          
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
                          placeholder="12345"
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                {/* Last Cleanup */}
                <FormField
                  control={form.control}
                  name="lastCleanup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">When was your last clean up?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              
              <p className="text-gray-600 font-medium italic mb-8">
                Consider yourself part of the elite squad that fears no pile. 🐾
              </p>
              
              <Button 
                onClick={scrollToPerks}
                className="neu-button text-lg font-black py-4 px-8"
              >
                See Your Founding Member Perks ↓
              </Button>
            </div>
          )}
        </Card>
      </main>

      {/* Founding Member Perks Section */}
      <section id="perks" className="mt-20 mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
              Dook Scoop 'Em Pricing Comparison
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              This chart shows how Dook Scoop 'Em stacks up against the biggest competitor. By bundling sanitization + deodorizing, hauling, and multiple areas into every package, founding members don't just get a discount — they get far more value for their money.
            </p>
          </div>

          {/* Comparison Table */}
          <Card className="neu-raised shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3 md:p-4 font-black text-gray-800 min-w-[140px]">Feature</th>
                    <th className="text-center p-3 md:p-4 font-black text-gray-600 min-w-[120px]">
                      <div className="flex flex-col">
                        <span className="text-base md:text-lg">Competitors</span>
                        <span className="text-xs font-bold text-gray-500">(Them)</span>
                      </div>
                    </th>
                    <th className="text-center p-3 md:p-4 font-black text-gray-600 min-w-[120px]">
                      <div className="flex flex-col">
                        <span className="text-base md:text-lg">Regular</span>
                        <span className="text-xs font-bold text-gray-500">(Us)</span>
                      </div>
                    </th>
                    <th className="text-center p-3 md:p-4 font-black text-blue-600 bg-blue-50 min-w-[140px]">
                      <div className="flex flex-col">
                        <span className="text-base md:text-lg">Founding Monthly</span>
                        <span className="text-xs font-bold text-blue-700">(Us - 10% off)</span>
                      </div>
                    </th>
                    <th className="text-center p-3 md:p-4 font-black text-orange-600 bg-orange-50 min-w-[140px]">
                      <div className="flex flex-col">
                        <span className="text-base md:text-lg">Founding Annual</span>
                        <span className="text-xs font-bold text-orange-700">(Us - 15% off)</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 md:p-4 font-bold text-gray-800">Weekly 1-dog Rate</td>
                    <td className="p-3 md:p-4 text-center font-bold text-gray-600">$95–115/mo<br/><span className="text-xs">(realistic all-in)</span></td>
                    <td className="p-3 md:p-4 text-center font-bold text-gray-600">$100/mo</td>
                    <td className="p-3 md:p-4 text-center bg-blue-50 font-black text-blue-600">$90/mo</td>
                    <td className="p-3 md:p-4 text-center bg-orange-50 font-black text-orange-600">$85/mo</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-3 md:p-4 font-bold text-gray-800">Approx. Cost Per Visit</td>
                    <td className="p-3 md:p-4 text-center font-bold text-gray-600">$22–27</td>
                    <td className="p-3 md:p-4 text-center font-bold text-gray-600">~$23</td>
                    <td className="p-3 md:p-4 text-center bg-blue-50 font-black text-blue-600">~$20.77</td>
                    <td className="p-3 md:p-4 text-center bg-orange-50 font-black text-orange-600">~$19.62</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 md:p-4 font-bold text-gray-800">Rate Lock</td>
                    <td className="p-3 md:p-4 text-center font-bold text-gray-600">–</td>
                    <td className="p-3 md:p-4 text-center font-bold text-gray-600">–</td>
                    <td className="p-3 md:p-4 text-center bg-blue-50 font-black text-blue-600">12 months</td>
                    <td className="p-3 md:p-4 text-center bg-orange-50 font-black text-orange-600">12 months</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-3 md:p-4 font-bold text-gray-800">Free Month Credit</td>
                    <td className="p-3 md:p-4 text-center font-bold text-gray-600">–</td>
                    <td className="p-3 md:p-4 text-center font-bold text-gray-600">–</td>
                    <td className="p-3 md:p-4 text-center bg-blue-50 font-black text-blue-600">Month 4</td>
                    <td className="p-3 md:p-4 text-center bg-orange-50 font-black text-orange-600">Month 13<br/><span className="text-xs">(bonus)</span></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 md:p-4 font-bold text-gray-800">Add'l Dog Fee</td>
                    <td className="p-3 md:p-4 text-center font-bold text-gray-600">$5–7 per visit</td>
                    <td className="p-3 md:p-4 text-center font-bold text-gray-600">+$10/mo</td>
                    <td className="p-3 md:p-4 text-center bg-blue-50 font-bold text-gray-700">+$10/mo</td>
                    <td className="p-3 md:p-4 text-center bg-orange-50 font-bold text-gray-700">+$10/mo</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-3 md:p-4 font-bold text-gray-800">Sanitization + Deodorizing</td>
                    <td className="p-3 md:p-4 text-center font-bold text-gray-600">Paid add-on<br/><span className="text-xs">(+$10/visit)</span></td>
                    <td className="p-3 md:p-4 text-center">
                      <span className="text-green-600 font-black">Included</span>
                    </td>
                    <td className="p-3 md:p-4 text-center bg-blue-50">
                      <span className="text-green-600 font-black">Included</span>
                    </td>
                    <td className="p-3 md:p-4 text-center bg-orange-50">
                      <span className="text-green-600 font-black">Included</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 md:p-4 font-bold text-gray-800">Waste Haul-Away</td>
                    <td className="p-3 md:p-4 text-center font-bold text-gray-600">Often left in your bin 🤢</td>
                    <td className="p-3 md:p-4 text-center">
                      <span className="text-green-600 font-black">Included</span>
                    </td>
                    <td className="p-3 md:p-4 text-center bg-blue-50">
                      <span className="text-green-600 font-black">Included</span>
                    </td>
                    <td className="p-3 md:p-4 text-center bg-orange-50">
                      <span className="text-green-600 font-black">Included</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-3 md:p-4 font-bold text-gray-800">Multiple Areas<br/><span className="text-xs font-normal">(front, side, back, garden, etc.)</span></td>
                    <td className="p-3 md:p-4 text-center font-bold text-gray-600">+$3–5 each</td>
                    <td className="p-3 md:p-4 text-center">
                      <span className="text-green-600 font-black">Included</span>
                    </td>
                    <td className="p-3 md:p-4 text-center bg-blue-50">
                      <span className="text-green-600 font-black">Included</span>
                    </td>
                    <td className="p-3 md:p-4 text-center bg-orange-50">
                      <span className="text-green-600 font-black">Included</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 md:p-4 font-bold text-gray-800">Priority Scheduling</td>
                    <td className="p-3 md:p-4 text-center font-bold text-gray-600">?</td>
                    <td className="p-3 md:p-4 text-center">
                      <span className="text-green-600 font-black text-xl">✓</span>
                    </td>
                    <td className="p-3 md:p-4 text-center bg-blue-50">
                      <span className="text-green-600 font-black text-xl">✓</span>
                    </td>
                    <td className="p-3 md:p-4 text-center bg-orange-50">
                      <span className="text-green-600 font-black text-xl">✓</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* CTA Button */}
          <div className="text-center mt-8">
            <a 
              href="#waitlist-form" 
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-black py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Join the Founding Members!
            </a>
          </div>
        </div>
      </section>

      {/* Social Media Footer */}
      <footer className="mt-16 pb-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600 font-bold mb-4">Follow Us</p>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-600 transition-colors"
              >
                <Facebook size={32} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-600 transition-colors"
              >
                <Instagram size={32} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}