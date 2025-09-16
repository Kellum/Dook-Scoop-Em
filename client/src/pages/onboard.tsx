import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  ArrowLeft,
  Check
} from "lucide-react";
import { insertOnboardingSubmissionSchema } from "@shared/schema";
import { z } from "zod";


// Step 1: Basic quote info
const quoteFormSchema = z.object({
  zipCode: z.string().min(5, "Valid zip code required"),
  numberOfDogs: z.number().min(1).max(10),
  serviceFrequency: z.enum(["once_a_week", "twice_a_week", "one_time"]),
  lastCleanedTimeframe: z.enum(["never", "one_week", "one_month", "three_months", "six_months", "one_year"]),
  email: z.string().email("Valid email required"),
  cellPhone: z.string().min(10, "Valid phone number required")
});

// Step 2: Detailed customer info
const customerInfoSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  homeAddress: z.string().min(1, "Address required"),
  city: z.string().min(1, "City required"),
  state: z.string().min(2, "State required"),
  homePhone: z.string().optional(),
  
  // New Sweep&Go specific fields
  cleanupNotificationType: z.string().default("completed,on_the_way"),
  cleanupNotificationChannel: z.enum(["sms", "email", "call"]).default("sms"),
  gatedCommunity: z.string().optional(),
  gateLocation: z.enum(["left", "right", "alley", "no_gate", "other"]).optional(),
  dogNames: z.array(z.string()).optional(),
  
  // Legacy fields
  contactImmediately: z.boolean().default(false),
  preferredDays: z.string().optional(),
  dogsOnProperty: z.string().optional(),
  notificationPreference: z.string().optional(),
  additionalComments: z.string().optional()
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;
type CustomerInfoData = z.infer<typeof customerInfoSchema>;
type OnboardingFormData = z.infer<typeof insertOnboardingSubmissionSchema>;

export default function Onboard() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState<QuoteFormData | null>(null);
  const [customerData, setCustomerData] = useState<CustomerInfoData | null>(null);
  const [pricingInfo, setPricingInfo] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [onboardingResponse, setOnboardingResponse] = useState<any>(null);

  // All form instances at top level to fix React hook errors
  const quoteForm = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      zipCode: "",
      numberOfDogs: 1,
      serviceFrequency: "once_a_week",
      lastCleanedTimeframe: "one_month",
      email: "",
      cellPhone: ""
    },
  });

  const customerForm = useForm<CustomerInfoData>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      homeAddress: "",
      city: "",
      state: "FL",
      homePhone: "",
      
      // New Sweep&Go fields
      cleanupNotificationType: "completed,on_the_way",
      cleanupNotificationChannel: "sms" as const,
      gatedCommunity: "",
      gateLocation: undefined as any,
      dogNames: [] as string[],
      
      // Legacy fields
      contactImmediately: false,
      preferredDays: "",
      dogsOnProperty: "",
      notificationPreference: "",
      additionalComments: ""
    },
  });



  // Get quote pricing mutation
  const getQuoteMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      // Map frontend values to quote API expected values
      const frequencyMap = {
        "once_a_week": "weekly",
        "twice_a_week": "twice_weekly", 
        "one_time": "one_time"
      } as const;

      return apiRequest("POST", "/api/quote", {
        name: "Onboarding Customer", // Required field
        email: data.email,
        phone: data.cellPhone,
        address: "Will be provided in step 2", // Required field, filled in step 2
        zipCode: data.zipCode,
        numberOfDogs: data.numberOfDogs,
        serviceFrequency: frequencyMap[data.serviceFrequency],
        urgency: "this_week", // Default urgency for onboarding flow
        preferredContactMethod: "email",
        message: "Customer onboarding quote request"
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      console.log("Quote response:", data);
      setPricingInfo(data);
      setCurrentStep(2);
    },
    onError: (error: any) => {
      console.error("Quote error:", error);
      toast({
        title: "Unable to get quote",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  // Final onboarding submission - simplified to just customer info
  const submitOnboardingMutation = useMutation({
    mutationFn: async (customerData: CustomerInfoData) => {
      if (!quoteData || !customerData) throw new Error("Missing required data");
      
      const fullOnboardingData = {
        // From quote step
        zipCode: quoteData.zipCode,
        numberOfDogs: quoteData.numberOfDogs,
        serviceFrequency: quoteData.serviceFrequency,
        email: quoteData.email,
        cellPhone: quoteData.cellPhone,
        
        // From customer info step
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        homeAddress: customerData.homeAddress,
        city: customerData.city,
        state: customerData.state,
        homePhone: customerData.homePhone || "",
        
        // Service details - use new Sweep&Go specific fields
        initialCleanupRequired: false, // Disabled last cleaned check per user request
        lastCleanedTimeframe: quoteData?.lastCleanedTimeframe || "one_month", // Add missing field from step 1
        
        // New Sweep&Go API fields
        cleanupNotificationType: customerData.cleanupNotificationType || "completed,on_the_way",
        cleanupNotificationChannel: customerData.cleanupNotificationChannel || "sms",
        gatedCommunity: customerData.gatedCommunity || "",
        gateLocation: customerData.gateLocation || "",
        dogNames: customerData.dogNames || [],
        
        // Legacy fields for compatibility
        notificationType: "completed,on_the_way",
        notificationChannel: "sms",
        howHeardAboutUs: "",
        additionalComments: customerData.additionalComments || "",
      };
      
      return apiRequest("POST", "/api/onboard", fullOnboardingData);
    },
    onSuccess: async (response) => {
      // Parse the JSON response data
      const data = await response.json();
      setOnboardingResponse(data);
      setIsSubmitted(true);
      
      // Track onboarding submission
      if (typeof window !== 'undefined') {
        import('../../lib/analytics').then(({ trackEvent }) => {
          trackEvent('customer_onboarding', 'onboard_form', 'onboarding_page');
        });
      }
      
      toast({
        title: "Thanks! We'll be in touch soon.",
        description: "We'll contact you within 24 hours to finalize your service setup.",
        variant: "default"
      });
    },
    onError: (error: any) => {
      console.error("Onboarding submission error:", error);
      toast({
        title: "Oops! Something went wrong",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Step 1 Component - Get Your Free Estimate
  const renderStep1 = () => {
    const onSubmitQuote = (data: QuoteFormData) => {
      console.log("Submitting quote request:", data);
      setQuoteData(data);
      getQuoteMutation.mutate(data);
    };

    return (
      <Card className="neu-raised bg-white max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="bg-orange-600 text-white py-4 px-6 rounded-lg mb-4">
            <CardTitle className="text-2xl font-bold">Get Your Free Estimate</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...quoteForm}>
            <form onSubmit={quoteForm.handleSubmit(onSubmitQuote)} className="space-y-4">
              <FormField
                control={quoteForm.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-sm font-bold text-black mb-2">YOUR ZIP CODE</div>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="32226"
                        className="text-center text-lg py-3 bg-orange-50/30 border-orange-100 focus:border-orange-200"
                        data-testid="input-zipCode"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={quoteForm.control}
                name="numberOfDogs"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-sm font-bold text-black mb-2">HOW MANY DOGS?</div>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger className="text-gray-500 bg-orange-50/30 border-orange-100 focus:border-orange-200" data-testid="select-numberOfDogs">
                          <SelectValue placeholder="Select number of dogs" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num} Dog{num > 1 ? 's' : ''}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={quoteForm.control}
                name="serviceFrequency"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-sm font-bold text-black mb-2">CLEANUP FREQUENCY</div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-gray-500 bg-orange-50/30 border-orange-100 focus:border-orange-200" data-testid="select-serviceFrequency">
                          <SelectValue placeholder="Choose frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="once_a_week">Once a Week</SelectItem>
                        <SelectItem value="twice_a_week">Twice a Week</SelectItem>
                        <SelectItem value="one_time">One Time Cleanup</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={quoteForm.control}
                name="lastCleanedTimeframe"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-sm font-bold text-black mb-2">WHEN WAS YOUR YARD LAST THOROUGHLY CLEANED?</div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-gray-500 bg-orange-50/30 border-orange-100 focus:border-orange-200" data-testid="select-lastCleanedTimeframe">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="never">Never / First time service</SelectItem>
                        <SelectItem value="one_week">1 week ago</SelectItem>
                        <SelectItem value="one_month">1 month ago</SelectItem>
                        <SelectItem value="three_months">3 months ago</SelectItem>
                        <SelectItem value="six_months">6 months ago</SelectItem>
                        <SelectItem value="one_year">1 year ago or more</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={quoteForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-sm font-bold text-black mb-2">EMAIL ADDRESS</div>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        placeholder="john@example.com"
                        className="text-gray-500 bg-orange-50/30 border-orange-100 focus:border-orange-200"
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={quoteForm.control}
                name="cellPhone"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-sm font-bold text-black mb-2">CELL PHONE</div>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="tel"
                        placeholder="904-555-1234"
                        className="text-gray-500 bg-orange-50/30 border-orange-100 focus:border-orange-200"
                        data-testid="input-cellPhone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit"
                disabled={getQuoteMutation.isPending}
                className="w-full neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 text-lg"
                data-testid="button-getQuote"
              >
                {getQuoteMutation.isPending ? "Getting Quote..." : "GET FREE QUOTE"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };

  // Step 2 Component - Pricing + Customer Details
  const renderStep2 = () => {
    const onSubmitCustomerInfo = (data: CustomerInfoData) => {
      console.log("Customer info:", data);
      setCustomerData(data);
      // Submit the final onboarding form with the form data directly 
      submitOnboardingMutation.mutate(data);
    };

    return (
      <Card className="neu-raised bg-white max-w-md mx-auto shadow-lg">
        {pricingInfo && (
          <div className="text-center mb-6">
            <div className="bg-orange-600 text-white py-6 px-6 rounded-lg mb-6">
              <h3 className="text-2xl font-bold mb-2">{quoteData?.serviceFrequency === 'one_time' ? 'Your One-Time Cleanup Price' : 'Your Price Per Visit'}</h3>
              <div className="text-4xl font-black">{(() => {
                // Get price from Sweep&Go response - use the processed estimatedPrice
                const apiPriceValue = pricingInfo?.pricing?.estimatedPrice;
                const frequency = quoteData?.serviceFrequency || 'once_a_week';
                
                if (frequency === 'one_time') {
                  return apiPriceValue ? `$${apiPriceValue}` : 'Price TBD';
                } else {
                  // For recurring services, calculate per-visit from monthly price
                  if (apiPriceValue) {
                    const monthlyPrice = parseFloat(apiPriceValue);
                    const visitsPerMonth = frequency === 'once_a_week' ? 4 : 
                                         frequency === 'twice_a_week' ? 8 : 1;
                    return `$${(monthlyPrice / visitsPerMonth).toFixed(2)}`;
                  }
                  return 'Price TBD';
                }
              })()}</div>
              <div className="text-lg">per cleanup</div>
              
              {/* Florida-themed rotating quotes */}
              {(() => {
                const apiPriceValue = pricingInfo?.pricing?.estimatedPrice;
                const displayPrice = apiPriceValue ? `$${apiPriceValue}` : 'Price TBD';
                
                // 10 rotating Florida-themed quotes
                const floridaQuotes = [
                  "Costs less than the sunglasses you swore you wouldn't lose… and did.",
                  "Cheaper than the ice you bought just to keep more ice from melting.",
                  "Less than the therapy session you needed after I-95 construction season.",
                  "Friendlier than the gator you spotted sunbathing by the ditch.",
                  "Costs less than the carnival game you lost in three seconds.",
                  "Cheaper than the bottled water you panic-grabbed before a storm.",
                  "Less than the fireworks you impulse-bought on the drive back from Georgia.",
                  "Costs less than the fried shrimp basket you couldn't resist at a roadside shack.",
                  "Cheaper than the pair of flops you sacrificed to the ocean.",
                  "Friendlier than the line you sat through at Buc-ee's for beaver nuggets."
                ];

                // Randomly select one quote (using index 0 to prevent re-renders)
                const selectedQuote = floridaQuotes[0];

                return (
                  <div className="text-sm mt-3 opacity-90">
                    <div className="italic mb-1">{selectedQuote}</div>
                    <div className="text-xs">{displayPrice} {quoteData?.serviceFrequency === 'one_time' ? 'one-time payment' : 'billed monthly'}. We fear no pile.</div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Complete Your Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...customerForm}>
            <form onSubmit={customerForm.handleSubmit(onSubmitCustomerInfo)} className="space-y-4">
              <div className="text-sm font-bold text-black mb-2">YOUR NAME</div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={customerForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="First" className="bg-orange-50/30 border-orange-100 focus:border-orange-200" data-testid="input-firstName" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={customerForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Last" className="bg-orange-50/30 border-orange-100 focus:border-orange-200" data-testid="input-lastName" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={customerForm.control}
                name="homeAddress"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-sm font-bold text-black mb-2">HOME ADDRESS</div>
                    <FormControl>
                      <Input {...field} placeholder="123 Main St" className="bg-orange-50/30 border-orange-100 focus:border-orange-200" data-testid="input-homeAddress" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-sm font-bold text-black mb-2">CITY & STATE</div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={customerForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Jacksonville" className="bg-orange-50/30 border-orange-100 focus:border-orange-200" data-testid="input-city" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={customerForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-orange-50/30 border-orange-100 focus:border-orange-200" data-testid="select-state">
                            <SelectValue placeholder="FL" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="GA">Georgia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={customerForm.control}
                name="homePhone"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-sm font-bold text-black mb-2">PHONE NUMBER</div>
                    <FormControl>
                      <Input {...field} type="tel" placeholder="904-555-1234" className="bg-orange-50/30 border-orange-100 focus:border-orange-200" data-testid="input-homePhone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cleanup Notifications */}
              <FormField
                control={customerForm.control}
                name="cleanupNotificationChannel"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-sm font-bold text-black mb-2">HOW WOULD YOU LIKE TO BE NOTIFIED?</div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-gray-500 bg-orange-50/30 border-orange-100 focus:border-orange-200" data-testid="select-cleanupNotificationChannel">
                          <SelectValue placeholder="Choose notification method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sms">Text Message (SMS)</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="call">Phone Call</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gated Community */}
              <FormField
                control={customerForm.control}
                name="gatedCommunity"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-sm font-bold text-black mb-2">GATED COMMUNITY NAME (if applicable)</div>
                    <FormControl>
                      <Input {...field} placeholder="Enter community name" className="bg-orange-50/30 border-orange-100 focus:border-orange-200" data-testid="input-gatedCommunity" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gate Location */}
              <FormField
                control={customerForm.control}
                name="gateLocation"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-sm font-bold text-black mb-2">GATE LOCATION</div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-gray-500 bg-orange-50/30 border-orange-100 focus:border-orange-200" data-testid="select-gateLocation">
                          <SelectValue placeholder="Select gate location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="no_gate">No Gate</SelectItem>
                        <SelectItem value="left">Left Side</SelectItem>
                        <SelectItem value="right">Right Side</SelectItem>
                        <SelectItem value="alley">Back Alley</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dog Names */}
              <div className="space-y-2">
                <div className="text-sm font-bold text-black mb-2">DOG NAMES (optional)</div>
                <div className="text-xs text-gray-600 mb-2">Add your dog's names to help our crew provide personalized service</div>
                <FormField
                  control={customerForm.control}
                  name="dogNames"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Enter dog names separated by commas (e.g., Max, Bella, Charlie)"
                          value={field.value?.join(", ") || ""} 
                          onChange={(e) => {
                            // Allow user to type freely, including commas
                            const inputValue = e.target.value;
                            // Update field with raw string first to allow typing commas
                            if (inputValue.includes(",") || inputValue.trim() === "") {
                              const names = inputValue.split(",").map(name => name.trim()).filter(name => name.length > 0);
                              field.onChange(names);
                            } else {
                              // Single name - store as single item array
                              field.onChange(inputValue.trim() ? [inputValue.trim()] : []);
                            }
                          }}
                          className="bg-orange-50/30 border-orange-100 focus:border-orange-200"
                          data-testid="input-dogNames"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={customerForm.control}
                name="additionalComments"
                render={({ field }) => (
                  <FormItem>
                    <div className="text-sm font-bold text-black mb-2">SPECIAL INSTRUCTIONS & AREAS TO CLEAN</div>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Gate code, dog behavior notes, specific yard areas to focus on, etc."
                        className="min-h-[80px] bg-orange-50/30 border-orange-100 focus:border-orange-200"
                        data-testid="textarea-additionalComments"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-3">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold"
                  data-testid="button-continue"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };




  // Success Page
  if (isSubmitted && onboardingResponse) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="neu-raised bg-white p-8">
              <div className="mb-6">
                {onboardingResponse.success ? (
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                ) : (
                  <AlertCircle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-6">
                {onboardingResponse.success ? "Welcome to the Family!" : "Almost There!"}
              </h1>
              
              <p className="text-gray-700 mb-6">{onboardingResponse.message}</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-blue-800 mb-2">What's Next:</h4>
                <div className="text-blue-700 whitespace-pre-line">{onboardingResponse.nextSteps}</div>
              </div>
              
              {onboardingResponse.sweepAndGoClientId && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      Your customer ID: {onboardingResponse.sweepAndGoClientId}
                    </span>
                  </div>
                </div>
              )}
              
              <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold">
                <a href="tel:9043122422">Call Us: (904) 312-2422</a>
              </Button>
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
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
              DOOK SCOOP 'EM
            </h1>
            
            {/* Progress Indicator - 2 Steps Only */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                1
              </div>
              <div className={`w-8 h-1 ${currentStep >= 2 ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
            </div>
          </div>

          {/* Render Current Step */}
          <div className={currentStep === 1 ? 'block' : 'hidden'}>
            {renderStep1()}
          </div>
          <div className={currentStep === 2 ? 'block' : 'hidden'}>
            {renderStep2()}
          </div>
        </main>

        <Footer />
      </div>
  );
}