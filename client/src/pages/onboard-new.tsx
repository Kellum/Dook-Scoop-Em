import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { z } from "zod";
import { DollarSign, CheckCircle, Dog, Calendar } from "lucide-react";

// Step 1: Quote form
const quoteSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(1, "Address required"),
  city: z.string().min(1, "City required"),
  state: z.string().min(2, "State required"),
  zipCode: z.string().min(5, "Valid zip code required"),
  numberOfDogs: z.number().min(1).max(10),
  plan: z.enum(["weekly", "biweekly", "twice_weekly"]),
  gateCode: z.string().optional(),
  gatedCommunity: z.string().optional(),
  gateLocation: z.string().optional(),
  dogNames: z.string().optional(), // Comma-separated
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const PLANS = {
  weekly: { name: "Once a Week", price: 110, pricePerVisit: 27.50 },
  biweekly: { name: "Every Two Weeks", price: 90, pricePerVisit: 22.50 },
  twice_weekly: { name: "Twice a Week", price: 136, pricePerVisit: 17 },
};

export default function OnboardNew() {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [step, setStep] = useState<"form" | "quote" | "processing">("form");
  const [quoteData, setQuoteData] = useState<QuoteFormData | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      numberOfDogs: 1,
      plan: "weekly",
    },
  });

  const handleGetQuote = (data: QuoteFormData) => {
    setQuoteData(data);
    
    // Calculate pricing
    const basePlan = PLANS[data.plan];
    const extraDogCharge = (data.numberOfDogs - 1) * 20; // $20 per extra dog
    const total = basePlan.price + extraDogCharge;
    setTotalPrice(total);
    
    setStep("quote");
  };

  const handleSignUpAndPay = async () => {
    if (!quoteData) return;
    
    setStep("processing");

    try {
      // Step 1: Create Supabase account
      const { data: authData, error: authError } = await signUp(quoteData.email, quoteData.password);
      
      if (authError) {
        toast({
          title: "Signup Error",
          description: authError.message,
          variant: "destructive",
        });
        setStep("quote");
        return;
      }

      if (!authData?.user) {
        toast({
          title: "Error",
          description: "Failed to create account",
          variant: "destructive",
        });
        setStep("quote");
        return;
      }

      // Step 2: Create Stripe checkout session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseUserId: authData.user.id,
          email: quoteData.email,
          plan: quoteData.plan,
          dogCount: quoteData.numberOfDogs,
          customerData: {
            email: quoteData.email,
            firstName: quoteData.firstName,
            lastName: quoteData.lastName,
            phone: quoteData.phone,
            address: quoteData.address,
            city: quoteData.city,
            state: quoteData.state,
            zipCode: quoteData.zipCode,
            gateCode: quoteData.gateCode,
            gatedCommunity: quoteData.gatedCommunity,
            gateLocation: quoteData.gateLocation,
            dogNames: quoteData.dogNames?.split(",").map(n => n.trim()).filter(Boolean),
            notificationPreference: "email",
          },
        }),
      });

      const { sessionUrl, error } = await response.json();

      if (error || !sessionUrl) {
        toast({
          title: "Error",
          description: error || "Failed to create checkout session",
          variant: "destructive",
        });
        setStep("quote");
        return;
      }

      // Step 3: Redirect to Stripe Checkout
      window.location.href = sessionUrl;
    } catch (error) {
      console.error("Onboarding error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setStep("quote");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {step === "form" && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
                Get Started Today
              </h1>
              <p className="text-xl text-gray-600">
                Fill out the form below to get your quote and sign up
              </p>
            </div>

            <Card className="neu-raised">
              <CardHeader>
                <CardTitle className="text-2xl font-black">Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(handleGetQuote)} className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" {...form.register("firstName")} data-testid="input-first-name" />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" {...form.register("lastName")} data-testid="input-last-name" />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...form.register("email")} data-testid="input-email" />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" {...form.register("password")} data-testid="input-password" />
                      {form.formState.errors.password && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.password.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...form.register("phone")} data-testid="input-phone" />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.phone.message}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" {...form.register("address")} data-testid="input-address" />
                    {form.formState.errors.address && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" {...form.register("city")} data-testid="input-city" />
                      {form.formState.errors.city && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" {...form.register("state")} placeholder="FL" data-testid="input-state" />
                      {form.formState.errors.state && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.state.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input id="zipCode" {...form.register("zipCode")} data-testid="input-zip" />
                      {form.formState.errors.zipCode && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="plan">Service Frequency</Label>
                      <Select 
                        onValueChange={(value) => form.setValue("plan", value as any)} 
                        defaultValue={form.watch("plan")}
                      >
                        <SelectTrigger data-testid="select-plan">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Once a Week - $110/month</SelectItem>
                          <SelectItem value="biweekly">Every Two Weeks - $90/month</SelectItem>
                          <SelectItem value="twice_weekly">Twice a Week - $136/month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="numberOfDogs">Number of Dogs</Label>
                      <Input 
                        id="numberOfDogs" 
                        type="number" 
                        min={1} 
                        max={10}
                        {...form.register("numberOfDogs", { valueAsNumber: true })}
                        data-testid="input-dog-count"
                      />
                      {form.formState.errors.numberOfDogs && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.numberOfDogs.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Optional Property Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gatedCommunity">Gated Community (optional)</Label>
                      <Input id="gatedCommunity" {...form.register("gatedCommunity")} data-testid="input-gated-community" />
                    </div>
                    <div>
                      <Label htmlFor="gateCode">Gate Code (optional)</Label>
                      <Input id="gateCode" {...form.register("gateCode")} data-testid="input-gate-code" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dogNames">Dog Names (optional, comma-separated)</Label>
                    <Input id="dogNames" {...form.register("dogNames")} placeholder="Max, Buddy, Luna" data-testid="input-dog-names" />
                  </div>

                  <Button type="submit" className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold" data-testid="button-get-quote">
                    Get Your Quote
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "quote" && quoteData && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-4xl font-black text-gray-800 mb-2">Your Quote is Ready!</h1>
              <p className="text-xl text-gray-600">Review and complete your signup</p>
            </div>

            <Card className="neu-raised mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-black">
                  <DollarSign className="mr-2 text-orange-600" />
                  Your Monthly Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="font-bold">{PLANS[quoteData.plan].name}</span>
                  </div>
                  <span className="font-black text-xl">${PLANS[quoteData.plan].price}</span>
                </div>
                {quoteData.numberOfDogs > 1 && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <div className="flex items-center">
                      <Dog className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="font-bold">{quoteData.numberOfDogs - 1} Extra Dog{quoteData.numberOfDogs > 2 ? 's' : ''}</span>
                    </div>
                    <span className="font-black text-xl">${(quoteData.numberOfDogs - 1) * 20}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 bg-orange-50 rounded-lg px-4">
                  <span className="text-lg font-black">Total Monthly</span>
                  <span className="text-2xl font-black text-orange-600">${totalPrice}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="neu-raised mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-black">Service Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold">{quoteData.firstName} {quoteData.lastName}</p>
                <p>{quoteData.address}</p>
                <p>{quoteData.city}, {quoteData.state} {quoteData.zipCode}</p>
                {quoteData.gatedCommunity && <p className="mt-2 text-sm text-gray-600">Gated Community: {quoteData.gatedCommunity}</p>}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setStep("form")} 
                className="flex-1 neu-button" 
                data-testid="button-back"
              >
                Back to Edit
              </Button>
              <Button 
                onClick={handleSignUpAndPay} 
                className="flex-1 neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold"
                data-testid="button-signup-pay"
              >
                Sign Up & Pay Now
              </Button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="max-w-md mx-auto text-center">
            <div className="animate-pulse mb-4">
              <DollarSign className="w-16 h-16 text-orange-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Creating Your Account...</h2>
            <p className="text-gray-600">You'll be redirected to checkout in a moment</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
