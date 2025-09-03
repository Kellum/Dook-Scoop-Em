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
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  ArrowLeft,
  DollarSign 
} from "lucide-react";
import { insertOnboardingSubmissionSchema } from "@shared/schema";
import { z } from "zod";

// Step 1: Basic quote info
const quoteFormSchema = z.object({
  zipCode: z.string().min(5, "Valid zip code required"),
  numberOfDogs: z.number().min(1).max(10),
  serviceFrequency: z.enum(["once_a_week", "every_two_weeks", "once_a_month"]),
  lastCleanedTimeframe: z.enum(["one_week", "one_month", "three_months", "six_months", "one_year", "never"]),
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
  gateLocation: z.string().optional(),
  contactImmediately: z.boolean().default(false),
  preferredDays: z.string().optional(),
  dogsOnProperty: z.string().optional(),
  notificationPreference: z.string().optional(),
  additionalComments: z.string().optional()
});

// Step 3: Payment info
const paymentInfoSchema = z.object({
  nameOnCard: z.string().min(1, "Name on card required"),
  creditCardNumber: z.string().min(13, "Valid card number required"),
  expiryMonth: z.string().min(2, "Valid month required"),
  expiryYear: z.string().min(2, "Valid year required"),
  cvv: z.string().min(3, "Valid CVV required")
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;
type CustomerInfoData = z.infer<typeof customerInfoSchema>;
type PaymentInfoData = z.infer<typeof paymentInfoSchema>;
type OnboardingFormData = z.infer<typeof insertOnboardingSubmissionSchema>;

export default function Onboard() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState<QuoteFormData | null>(null);
  const [customerData, setCustomerData] = useState<CustomerInfoData | null>(null);
  const [pricingInfo, setPricingInfo] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [onboardingResponse, setOnboardingResponse] = useState<any>(null);

  // Get quote pricing mutation
  const getQuoteMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      // Map frontend values to quote API expected values
      const frequencyMap = {
        "once_a_week": "weekly",
        "every_two_weeks": "bi_weekly", 
        "once_a_month": "monthly"
      } as const;

      return apiRequest("POST", "/api/quote", {
        name: "Onboarding Customer", // Required field
        email: data.email,
        phone: data.cellPhone,
        address: "Will be provided in step 2", // Required field, filled in step 2
        zipCode: data.zipCode,
        numberOfDogs: data.numberOfDogs,
        serviceFrequency: frequencyMap[data.serviceFrequency],
        lastCleanedTimeframe: data.lastCleanedTimeframe,
        urgency: "this_week", // Default urgency for onboarding flow
        preferredContactMethod: "email",
        message: "Customer onboarding quote request"
      });
    },
    onSuccess: (response) => {
      console.log("Quote response:", response);
      setPricingInfo(response);
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

  // Final onboarding submission
  const submitOnboardingMutation = useMutation({
    mutationFn: async (paymentData: PaymentInfoData) => {
      if (!quoteData || !customerData) throw new Error("Missing required data");
      
      const fullOnboardingData = {
        // From quote step
        zipCode: quoteData.zipCode,
        numberOfDogs: quoteData.numberOfDogs,
        serviceFrequency: quoteData.serviceFrequency,
        lastCleanedTimeframe: quoteData.lastCleanedTimeframe,
        email: quoteData.email,
        cellPhone: quoteData.cellPhone,
        
        // From customer info step
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        homeAddress: customerData.homeAddress,
        city: customerData.city,
        state: customerData.state,
        homePhone: customerData.homePhone || "",
        
        // Service details - use defaults for fields not in the flow
        initialCleanupRequired: quoteData.lastCleanedTimeframe === "never" || quoteData.lastCleanedTimeframe === "one_year",
        notificationType: "completed,on_the_way",
        notificationChannel: "sms",
        howHeardAboutUs: "",
        additionalComments: customerData.additionalComments || "",
        
        // Payment info
        nameOnCard: paymentData.nameOnCard,
      };
      
      return apiRequest("POST", "/api/onboard", fullOnboardingData);
    },
    onSuccess: (response) => {
      setOnboardingResponse(response);
      setIsSubmitted(true);
      
      // Track onboarding submission
      if (typeof window !== 'undefined') {
        import('../../lib/analytics').then(({ trackEvent }) => {
          trackEvent('customer_onboarding', 'onboard_form', 'onboarding_page');
        });
      }
      
      toast({
        title: response.success ? "Welcome to Dook Scoop 'Em!" : "Onboarding In Progress",
        description: response.message,
        variant: response.success ? "default" : "destructive"
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
    const form = useForm<QuoteFormData>({
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

    const onSubmitQuote = (data: QuoteFormData) => {
      console.log("Submitting quote request:", data);
      setQuoteData(data);
      getQuoteMutation.mutate(data);
    };

    return (
      <Card className="neu-raised bg-white max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="bg-teal-500 text-white py-4 px-6 rounded-lg mb-4">
            <CardTitle className="text-2xl font-bold">Get Your Free Estimate</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitQuote)} className="space-y-4">
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Zip Code"
                        className="text-center text-lg py-3"
                        data-testid="input-zipCode"
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
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger className="text-gray-500" data-testid="select-numberOfDogs">
                          <SelectValue placeholder="Number Of Dogs*" />
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
                control={form.control}
                name="serviceFrequency"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-gray-500" data-testid="select-serviceFrequency">
                          <SelectValue placeholder="Cleanup Frequency*" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="once_a_week">Weekly</SelectItem>
                        <SelectItem value="every_two_weeks">Bi-Weekly</SelectItem>
                        <SelectItem value="once_a_month">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastCleanedTimeframe"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-gray-500" data-testid="select-lastCleanedTimeframe">
                          <SelectValue placeholder="Last Time Yard Was Thoroughly Cleaned*" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="one_week">Last week</SelectItem>
                        <SelectItem value="one_month">Last month</SelectItem>
                        <SelectItem value="three_months">3 months ago</SelectItem>
                        <SelectItem value="six_months">6 months ago</SelectItem>
                        <SelectItem value="one_year">Over a year ago</SelectItem>
                        <SelectItem value="never">Never cleaned professionally</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        placeholder="Your Email Address*"
                        className="text-gray-500"
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cellPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="tel"
                        placeholder="Cell Phone Number*"
                        className="text-gray-500"
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
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 text-lg"
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
    const form = useForm<CustomerInfoData>({
      resolver: zodResolver(customerInfoSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        homeAddress: "",
        city: "",
        state: "FL",
        homePhone: "",
        gateLocation: "",
        contactImmediately: false,
        preferredDays: "",
        dogsOnProperty: "",
        notificationPreference: "",
        additionalComments: ""
      },
    });

    const onSubmitCustomerInfo = (data: CustomerInfoData) => {
      console.log("Customer info:", data);
      setCustomerData(data);
      setCurrentStep(3);
    };

    return (
      <Card className="neu-raised bg-white max-w-md mx-auto">
        {pricingInfo && (
          <div className="text-center mb-6">
            <div className="bg-teal-500 text-white py-6 px-6 rounded-lg mb-6">
              <h3 className="text-2xl font-bold mb-2">Your Price Per Visit</h3>
              <div className="text-4xl font-black">${pricingInfo.pricePerVisit || '13.86'}</div>
              <div className="text-lg">per cleanup</div>
            </div>
          </div>
        )}

        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Complete Your Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitCustomerInfo)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="First Name*" data-testid="input-firstName" />
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
                      <FormControl>
                        <Input {...field} placeholder="Last Name*" data-testid="input-lastName" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="homeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Home Address*" data-testid="input-homeAddress" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="City*" data-testid="input-city" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-state">
                            <SelectValue placeholder="State*" />
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
                control={form.control}
                name="homePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="tel" placeholder="Phone Number" data-testid="input-homePhone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalComments"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Additional comments (gate codes, special instructions, etc.)"
                        className="min-h-[80px]"
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
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold"
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

  // Step 3 Component - Payment Setup
  const renderStep3 = () => {
    const form = useForm<PaymentInfoData>({
      resolver: zodResolver(paymentInfoSchema),
      defaultValues: {
        nameOnCard: "",
        creditCardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: ""
      },
    });

    const onSubmitPayment = (data: PaymentInfoData) => {
      console.log("Payment info:", data);
      submitOnboardingMutation.mutate(data);
    };

    return (
      <Card className="neu-raised bg-white max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="bg-teal-500 text-white py-4 px-6 rounded-lg mb-4">
            <CardTitle className="text-2xl font-bold">Almost Done... Set Up Auto Pay!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitPayment)} className="space-y-4">
              <FormField
                control={form.control}
                name="nameOnCard"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Name On Card" data-testid="input-nameOnCard" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="creditCardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Card number"
                        data-testid="input-creditCardNumber"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="expiryMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="MM" maxLength={2} data-testid="input-expiryMonth" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiryYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="YY" maxLength={2} data-testid="input-expiryYear" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="CVC"
                        maxLength={4}
                        data-testid="input-cvv"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                * Choose a card to be used for your payments. When you add a card, we will 
                apply $1.50 test charge to verify it. This is a temporary authorization and not 
                an extra charge.
              </div>

              <div className="flex space-x-3">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1"
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  type="submit"
                  disabled={submitOnboardingMutation.isPending}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold"
                  data-testid="button-submit"
                >
                  {submitOnboardingMutation.isPending ? "Processing..." : "SUBMIT"}
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
                <p className="text-blue-700">{onboardingResponse.nextSteps}</p>
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
          
          {/* Progress Indicator */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 1 ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
              1
            </div>
            <div className={`w-8 h-1 ${currentStep >= 2 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 2 ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
              2
            </div>
            <div className={`w-8 h-1 ${currentStep >= 3 ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 3 ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
              3
            </div>
          </div>
        </div>

        {/* Render Current Step */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </main>

      <Footer />
    </div>
  );
}