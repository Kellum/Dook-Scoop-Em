import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { ArrowRight, ArrowLeft, MapPin, Dog, Calendar, CheckCircle2, Check, X } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

// Step 1: Zip Code
const zipSchema = z.object({
  zipCode: z.string().min(5, "Valid zip code required").max(5, "Zip code must be 5 digits"),
});

// Step 2: Dog Count
const dogSchema = z.object({
  numberOfDogs: z.number().min(1).max(10),
});

// Step 3: Service Frequency
const planSchema = z.object({
  plan: z.enum(["weekly", "biweekly", "twice_weekly"]),
});

// Step 4: Personal Info & Signup
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(1, "Street address required"),
  city: z.string().min(1, "City required"),
  state: z.string().min(2, "State required").max(2),
  gateCode: z.string().optional(),
  gateLocation: z.string().optional(),
  gatedCommunity: z.boolean().default(false),
  dogNames: z.string().optional(),
  propertyNotes: z.string().optional(),
});

type ZipData = z.infer<typeof zipSchema>;
type DogData = z.infer<typeof dogSchema>;
type PlanData = z.infer<typeof planSchema>;
type PersonalInfoData = z.infer<typeof personalInfoSchema>;

const planDetails = {
  weekly: {
    label: "Once a Week",
    price: 95,
    frequency: "weekly",
    description: "Perfect for most families",
    includes: [
      "Comprehensive yard inspection",
      "Thorough waste removal",
      "Sanitization & deodorizing spray",
      "Waste haul-away",
      "Service completion notification"
    ]
  },
  biweekly: {
    label: "Every Other Week",
    price: 75,
    frequency: "bi-weekly",
    description: "Great value for smaller yards",
    includes: [
      "Comprehensive yard inspection",
      "Thorough waste removal",
      "Sanitization & deodorizing spray",
      "Waste haul-away",
      "Service completion notification"
    ]
  },
  twice_weekly: {
    label: "Twice a Week",
    price: 116,
    frequency: "twice weekly",
    description: "For busy pups or big yards",
    includes: [
      "Comprehensive yard inspection (2x per week)",
      "Thorough waste removal (2x per week)",
      "Sanitization & deodorizing spray",
      "Waste haul-away",
      "Service completion notification"
    ]
  },
};

export default function OnboardSurvey() {
  const [step, setStep] = useState(1);
  const [zipData, setZipData] = useState<ZipData | null>(null);
  const [dogData, setDogData] = useState<DogData | null>(null);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(undefined);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();

  const zipForm = useForm<ZipData>({
    resolver: zodResolver(zipSchema),
    defaultValues: { zipCode: "" },
  });

  const dogForm = useForm<DogData>({
    resolver: zodResolver(dogSchema),
    defaultValues: { numberOfDogs: 1 },
  });

  const planForm = useForm<PlanData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      plan: undefined
    }
  });

  const personalForm = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      gateCode: "",
      gateLocation: "",
      gatedCommunity: false,
      dogNames: "",
      propertyNotes: "",
    },
  });

  // Sync selectedPlan with planData when returning to step 3
  useEffect(() => {
    if (step === 3) {
      // If we have planData from a previous visit to step 3, restore it
      if (planData) {
        setSelectedPlan(planData.plan);
      } else {
        // If no planData, make sure everything is cleared
        setSelectedPlan(undefined);
      }
    }
  }, [step, planData]);

  // Step 1: Validate Zip Code
  const handleZipSubmit = async (data: ZipData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/validate-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zipCode: data.zipCode }),
      });

      const result = await response.json();

      if (!result.isValid) {
        toast({
          title: "Service Area Not Available",
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: result.message,
      });

      setZipData(data);
      setStep(2);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate zip code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Dog Count
  const handleDogSubmit = (data: DogData) => {
    setDogData(data);
    setStep(3);
  };

  // Step 3: Service Plan
  const handlePlanSubmit = (data: PlanData) => {
    setPlanData(data);
    setStep(4);
  };

  // Step 4: Personal Info & Checkout
  const handlePersonalInfoSubmit = async (data: PersonalInfoData) => {
    if (!zipData || !dogData || !planData) return;

    setLoading(true);
    try {
      // Step 1: Create Supabase account
      const { data: authData, error: authError } = await signUp(data.email, data.password);

      if (authError || !authData?.user) {
        toast({
          title: "Error",
          description: authError?.message || "Failed to create account",
          variant: "destructive",
        });
        return;
      }

      // Step 2: Create Stripe checkout session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseUserId: authData.user.id,
          email: data.email,
          plan: planData.plan,
          dogCount: dogData.numberOfDogs,
          customerData: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: zipData.zipCode,
            gateCode: data.gateCode || "",
            gateLocation: data.gateLocation || "",
            gatedCommunity: data.gatedCommunity,
            dogNames: data.dogNames || "",
            propertyNotes: data.propertyNotes || "",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionUrl } = await response.json();

      // Redirect to Stripe checkout
      if (sessionUrl) {
        window.location.href = sessionUrl;
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate price
  const calculatePrice = () => {
    if (!dogData || !planData) return 0;
    const basePrice = planDetails[planData.plan].price;
    const extraDogs = (dogData.numberOfDogs - 1) * 20;
    const total = basePrice + extraDogs;
    console.log('Price calculation:', { dogCount: dogData.numberOfDogs, basePrice, extraDogs, total });
    return total;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= num
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`h-1 w-20 mx-2 ${
                      step > num ? "bg-orange-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600 px-2">
            <span>Location</span>
            <span>Dogs</span>
            <span>Plan</span>
            <span>Details</span>
          </div>
        </div>

        {/* Step 1: Zip Code */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
          <Card className="neumorphic">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-orange-600" />
                <div>
                  <CardTitle className="text-2xl font-black">Where are you located?</CardTitle>
                  <CardDescription>Enter your zip code to see if we service your area</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={zipForm.handleSubmit(handleZipSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    {...zipForm.register("zipCode")}
                    placeholder="32256"
                    maxLength={5}
                    data-testid="input-zip-code"
                    className="text-lg"
                  />
                  {zipForm.formState.errors.zipCode && (
                    <p className="text-sm text-red-600 mt-1">{zipForm.formState.errors.zipCode.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black"
                  disabled={loading}
                  data-testid="button-next-zip"
                >
                  {loading ? "Checking..." : "Next"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
          </div>
        )}

        {/* Step 2: Dog Count */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
          <Card className="neumorphic">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Dog className="w-6 h-6 text-orange-600" />
                <div>
                  <CardTitle className="text-2xl font-black">How many dogs do you have?</CardTitle>
                  <CardDescription>Each additional dog is $20/month</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={dogForm.handleSubmit(handleDogSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="numberOfDogs">Number of Dogs</Label>
                  <Input
                    id="numberOfDogs"
                    type="number"
                    min="1"
                    max="10"
                    {...dogForm.register("numberOfDogs", { valueAsNumber: true })}
                    data-testid="input-number-of-dogs"
                    className="text-lg"
                  />
                  {dogForm.formState.errors.numberOfDogs && (
                    <p className="text-sm text-red-600 mt-1">{dogForm.formState.errors.numberOfDogs.message}</p>
                  )}
                </div>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                    data-testid="button-back-to-zip"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-black"
                    data-testid="button-next-dogs"
                  >
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          </div>
        )}

        {/* Step 3: Service Plan */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            {/* Empty space on left */}
            <div className="hidden lg:block lg:col-span-1"></div>

            {/* Main Form */}
            <Card className="neumorphic lg:col-span-4 relative">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-orange-600" />
                  <div>
                    <CardTitle className="text-2xl font-black">Choose your service plan</CardTitle>
                    <CardDescription>How often would you like us to scoop?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={planForm.handleSubmit(handlePlanSubmit)} className="space-y-3">
                <div
                  role="radiogroup"
                  aria-label="Service plan selection"
                  className="space-y-3"
                  onKeyDown={(e) => {
                    const plans = Object.keys(planDetails);
                    const currentIndex = selectedPlan ? plans.indexOf(selectedPlan) : -1;

                    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                      e.preventDefault();
                      const nextIndex = (currentIndex + 1) % plans.length;
                      const nextPlan = plans[nextIndex];
                      setSelectedPlan(nextPlan);
                      planForm.setValue("plan", nextPlan as any);
                      document.getElementById(`plan-${nextPlan}`)?.focus();
                    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                      e.preventDefault();
                      const prevIndex = currentIndex <= 0 ? plans.length - 1 : currentIndex - 1;
                      const prevPlan = plans[prevIndex];
                      setSelectedPlan(prevPlan);
                      planForm.setValue("plan", prevPlan as any);
                      document.getElementById(`plan-${prevPlan}`)?.focus();
                    }
                  }}
                >
                  {Object.entries(planDetails).map(([key, details]) => (
                    <div
                      key={key}
                      id={`plan-${key}`}
                      role="radio"
                      aria-checked={key === selectedPlan}
                      aria-labelledby={`label-${key}`}
                      tabIndex={key === selectedPlan ? 0 : -1}
                      className={`border-2 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
                        key === selectedPlan
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-600'
                      }`}
                      data-testid={`option-plan-${key}`}
                      onClick={() => {
                        if (key === selectedPlan) {
                          // Deselect
                          setSelectedPlan(undefined);
                          planForm.setValue("plan", undefined as any);
                        } else {
                          // Select
                          setSelectedPlan(key);
                          planForm.setValue("plan", key as any);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          if (key === selectedPlan) {
                            setSelectedPlan(undefined);
                            planForm.setValue("plan", undefined as any);
                          } else {
                            setSelectedPlan(key);
                            planForm.setValue("plan", key as any);
                          }
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3 p-4">
                        {/* Custom checkmark indicator */}
                        <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all ${
                          key === selectedPlan
                            ? 'border-orange-600 bg-orange-600'
                            : 'border-gray-300'
                        }`}>
                          {key === selectedPlan && (
                            <Check className="h-3 w-3 text-white" strokeWidth={3} />
                          )}
                        </div>
                        <div id={`label-${key}`} className="flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-bold text-lg block">{details.label}</span>
                              <span className="text-sm text-gray-500">{details.description}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-black text-orange-600">
                                ${dogData ? details.price + ((dogData.numberOfDogs - 1) * 20) : details.price}/mo
                              </span>
                              {dogData && dogData.numberOfDogs > 1 && (
                                <div className="text-xs text-gray-500">
                                  (${details.price} + ${(dogData.numberOfDogs - 1) * 20})
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {planForm.formState.errors.plan && (
                  <p className="text-sm text-red-600">{planForm.formState.errors.plan.message}</p>
                )}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1"
                    data-testid="button-back-to-dogs"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-black"
                    data-testid="button-next-plan"
                  >
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>

                {/* Mobile: "What's Included" Button */}
                <button
                  type="button"
                  onClick={() => setShowBenefitsModal(true)}
                  className="lg:hidden w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 mt-3"
                  aria-label="View what's included in every plan"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  What's included
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Desktop: What's Included Sidebar */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-black text-gray-900 mb-2">What's Included in Every Plan</h3>
                <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  No Upsells - EVER!
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Comprehensive yard inspection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Thorough waste removal</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Sanitization & deodorizing spray</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Waste haul-away</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Service completion notification</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile: Benefits Modal */}
          {showBenefitsModal && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0"
                onClick={() => setShowBenefitsModal(false)}
                aria-label="Close modal"
              />
              <div className="bg-white rounded-lg p-6 max-w-md w-full relative z-10 shadow-xl">
                {/* Close button */}
                <button
                  onClick={() => setShowBenefitsModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <h3 className="text-xl font-black text-gray-900 mb-2">What's Included in Every Plan</h3>
                <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  No Upsells - EVER!
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Comprehensive yard inspection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Thorough waste removal</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Sanitization & deodorizing spray</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Waste haul-away</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Service completion notification</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Step 4: Personal Info */}
        {step === 4 && (
          <div className="max-w-4xl mx-auto">
          <Card className="neumorphic">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-orange-600" />
                <div>
                  <CardTitle className="text-2xl font-black">Almost there!</CardTitle>
                  <CardDescription>Create your account and complete payment</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Price Summary */}
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
                <h3 className="font-black text-lg mb-2">Your Plan Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>{planData && planDetails[planData.plan].label} (includes 1 dog)</span>
                    <span>${planData && planDetails[planData.plan].price}</span>
                  </div>
                  {dogData && dogData.numberOfDogs > 1 && (
                    <div className="flex justify-between">
                      <span>{dogData.numberOfDogs - 1} Extra Dog{dogData.numberOfDogs > 2 ? 's' : ''} (+$20/mo each)</span>
                      <span>+${(dogData.numberOfDogs - 1) * 20}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-orange-300 pt-1 mt-2 flex justify-between font-black text-lg">
                    <span>Total Monthly</span>
                    <span className="text-orange-600">${calculatePrice()}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={personalForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...personalForm.register("firstName")} data-testid="input-first-name" />
                    {personalForm.formState.errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">{personalForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...personalForm.register("lastName")} data-testid="input-last-name" />
                    {personalForm.formState.errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">{personalForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...personalForm.register("email")} data-testid="input-email" />
                    {personalForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">{personalForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...personalForm.register("password")} data-testid="input-password" />
                    {personalForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">{personalForm.formState.errors.password.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...personalForm.register("phone")} data-testid="input-phone" />
                  {personalForm.formState.errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{personalForm.formState.errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" {...personalForm.register("address")} data-testid="input-address" />
                  {personalForm.formState.errors.address && (
                    <p className="text-sm text-red-600 mt-1">{personalForm.formState.errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...personalForm.register("city")} data-testid="input-city" />
                    {personalForm.formState.errors.city && (
                      <p className="text-sm text-red-600 mt-1">{personalForm.formState.errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" {...personalForm.register("state")} maxLength={2} placeholder="FL" data-testid="input-state" />
                    {personalForm.formState.errors.state && (
                      <p className="text-sm text-red-600 mt-1">{personalForm.formState.errors.state.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Zip Code</Label>
                    <Input value={zipData?.zipCode || ""} disabled className="bg-gray-100" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gateCode">Gate Code (Optional)</Label>
                  <Input id="gateCode" {...personalForm.register("gateCode")} data-testid="input-gate-code" />
                </div>

                <div>
                  <Label htmlFor="dogNames">Dog Names (Optional)</Label>
                  <Input id="dogNames" {...personalForm.register("dogNames")} placeholder="Max, Bella, Charlie" data-testid="input-dog-names" />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(3)}
                    className="flex-1"
                    data-testid="button-back-to-plan"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-black"
                    disabled={loading}
                    data-testid="button-complete-signup"
                  >
                    {loading ? "Processing..." : "Complete Signup & Pay"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
