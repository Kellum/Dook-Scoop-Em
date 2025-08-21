import React, { useState } from "react";
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
import heroLogoImage from "@assets/a-pixel-art-logo-depicting-a-heroic-figu_G2-wk3h-RHK0S_WbYEP9fQ_PgM67temTW2i1pqE1QU24A_1755776704851.png";

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
  canText: z.boolean().default(false),
});

type WaitlistFormData = z.infer<typeof waitlistFormSchema>;

export default function LandingMinimal() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [numberOfDogs, setNumberOfDogs] = useState([2]);

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
        canText: data.canText,
      };

      return apiRequest("POST", "/api/waitlist", submitData);
    },
    onSuccess: () => {
      toast({
        title: "Welcome to the pack!",
        description: "You've successfully joined our waitlist. We'll be in touch soon!",
      });
      form.reset();
      setNumberOfDogs([2]);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 scroll-smooth">
      {/* Header */}
      <header className="w-full py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Company Name */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-gray-800">
            Dook Scoop 'Em
          </h1>
          
          {/* Hero Pixel Art Logo */}
          <div className="mb-6">
            <img 
              src={heroLogoImage} 
              alt="Dook Scoop Em Hero Logo" 
              className="w-64 h-64 mx-auto object-contain pixel-perfect"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-4 font-black">
            Professional Pet Waste Removal Service
          </p>
          
          <p className="text-lg md:text-xl text-gray-700 mb-2 font-bold">
            Starting in Yulee, Fernandina & Nassau County. Founding members <a href="#perks" className="text-orange-600 hover:text-orange-700 font-bold transition-colors scroll-smooth">get perks</a>.
          </p>
          
          <p className="text-base md:text-lg text-gray-500 mb-8 font-medium italic">
            coming to the rest of North East Florida very soon...
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pb-16">
        {/* Waitlist Form */}
        <Card id="waitlist-form" className="neu-raised shadow-2xl">
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
        </Card>
      </main>

      {/* Founding Member Perks Section */}
      <section id="perks" className="mt-20 mb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
              Founding Member Perks
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Thanks for jumping in early! Here's how the Founders deal works—simple, transparent, and built to reward early supporters.
            </p>
          </div>

          {/* Comparison Table */}
          <Card className="neu-raised shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-4 font-black text-gray-800"></th>
                    <th className="text-center p-4 font-black text-blue-600 bg-blue-50">
                      <div className="flex flex-col">
                        <span className="text-lg">Founders</span>
                        <span className="text-sm font-bold text-blue-700">(Recommended)</span>
                        <span className="text-xl font-black">$85/mo</span>
                        <span className="text-xs">for first 12 months</span>
                      </div>
                    </th>
                    <th className="text-center p-4 font-black text-gray-600">
                      <div className="flex flex-col">
                        <span className="text-lg">Typical</span>
                        <span className="text-xl font-black">$100/mo</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-bold text-gray-800">Monthly Rate</td>
                    <td className="p-4 text-center bg-blue-50 font-black text-blue-600">$85</td>
                    <td className="p-4 text-center font-bold text-gray-600">$100</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">Approx. Cost per Visit</td>
                    <td className="p-4 text-center bg-blue-50 font-black text-blue-600">~$19.62</td>
                    <td className="p-4 text-center font-bold text-gray-600">~$23.08</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-bold text-gray-800">First Month Free*</td>
                    <td className="p-4 text-center bg-blue-50">
                      <span className="text-green-600 font-black text-xl">✓</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-red-500 font-black text-xl">✗</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">Rate Lock</td>
                    <td className="p-4 text-center bg-blue-50 font-black text-blue-600">12 months</td>
                    <td className="p-4 text-center font-bold text-gray-600">—</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-bold text-gray-800">Add'l Dog Fee</td>
                    <td className="p-4 text-center bg-blue-50 font-bold text-gray-700">+$5/visit/dog</td>
                    <td className="p-4 text-center font-bold text-gray-600">+$5/visit/dog</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">Sanitization Add-On</td>
                    <td className="p-4 text-center bg-blue-50">
                      <span className="text-green-600 font-black">Included</span>
                    </td>
                    <td className="p-4 text-center font-bold text-gray-600">Paid add-on</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-bold text-gray-800">Waste Haul-Away</td>
                    <td className="p-4 text-center bg-blue-50">
                      <span className="text-green-600 font-black">Always free</span>
                    </td>
                    <td className="p-4 text-center font-bold text-gray-600">Varies by company</td>
                  </tr>

                </tbody>
              </table>
            </div>
          </Card>

          {/* CTA Button */}
          <div className="text-center mt-8">
            <a 
              href="#waitlist-form" 
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-black py-4 px-8 rounded-lg text-lg transition-colors scroll-smooth"
            >
              Let's Do It!
            </a>
          </div>

          {/* Terms Details */}
          <div className="mt-8 text-sm text-gray-600 space-y-2">
            <p><strong>*</strong> "First month free" is delivered as a credit on month 4 after 3 consecutive paid months.</p>
            <p>Cancellation takes effect next billing cycle; cancelling before 3 months forfeits the credit.</p>
            <p>Rate lock lasts 12 months from first paid service date.</p>
            <p>Weekly service assumed (~4.33 visits/month).</p>
            <p className="font-bold text-gray-800 mt-4">Small print, big clarity: we keep it fair, and we keep it clean—literally.</p>
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