import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  DollarSign 
} from "lucide-react";
import { insertOnboardingSubmissionSchema } from "@shared/schema";
import { z } from "zod";

type OnboardingFormData = z.infer<typeof insertOnboardingSubmissionSchema>;

export default function Onboard() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [onboardingResponse, setOnboardingResponse] = useState<any>(null);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(insertOnboardingSubmissionSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      homeAddress: "",
      city: "",
      state: "FL",
      zipCode: "",
      homePhone: "",
      cellPhone: "",
      numberOfDogs: 1,
      serviceFrequency: "once_a_week",
      lastCleanedTimeframe: "one_month",
      initialCleanupRequired: true,
      notificationType: "completed,on_the_way",
      notificationChannel: "sms",
      howHeardAboutUs: "",
      additionalComments: "",
      nameOnCard: "",
    },
  });

  const submitOnboardingMutation = useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      return apiRequest("POST", "/api/onboard", data);
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

  const onSubmit = (data: OnboardingFormData) => {
    console.log("Submitting onboarding request:", data);
    submitOnboardingMutation.mutate(data);
  };

  if (isSubmitted && onboardingResponse) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navigation />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="neu-raised bg-white">
              <CardContent className="p-8 text-center">
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
                
                <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
                  <p className="text-gray-700 mb-4">{onboardingResponse.message}</p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-bold text-blue-800 mb-2">What's Next:</h4>
                    <p className="text-blue-700">{onboardingResponse.nextSteps}</p>
                  </div>
                  
                  {onboardingResponse.sweepAndGoClientId && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">
                          Your customer ID: {onboardingResponse.sweepAndGoClientId}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      (904) 312-2422
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      ryan@dookscoop.com
                    </div>
                  </div>
                  
                  <Button className="neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold">
                    <a href="tel:9043122422">Call Us: (904) 312-2422</a>
                  </Button>
                </div>
              </CardContent>
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
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-6">
            Join the Scoop Squad!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Ready to reclaim your yard? Complete our onboarding form to set up your regular poop scooping service. We'll handle the cleanup so you can enjoy your outdoor space worry-free.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              Secure Payment
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              Flexible Scheduling
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 text-purple-600 mr-2" />
              Local Jacksonville Service
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto">
          <Card className="neu-raised bg-white">
            <CardHeader>
              <CardTitle className="text-3xl font-black text-gray-800 text-center">
                Customer Onboarding
              </CardTitle>
              <p className="text-gray-600 text-center">
                Fill out your information below to get started with your regular poop scooping service.
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Personal Information
                    </h3>
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
                                className="neu-input bg-gray-100"
                                placeholder="John"
                                data-testid="input-firstName"
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
                                className="neu-input bg-gray-100"
                                placeholder="Doe"
                                data-testid="input-lastName"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="email"
                                className="neu-input bg-gray-100"
                                placeholder="john@example.com"
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
                            <FormLabel className="font-bold">Cell Phone</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="tel"
                                className="neu-input bg-gray-100"
                                placeholder="(904) 555-0000"
                                data-testid="input-cellPhone"
                              />
                            </FormControl>
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
                          <FormLabel className="font-bold">Home Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="tel"
                              className="neu-input bg-gray-100"
                              placeholder="(904) 555-0000"
                              data-testid="input-homePhone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Service Address */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Service Address
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="homeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Full Home Address</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="neu-input bg-gray-100"
                              placeholder="123 Main Street"
                              data-testid="input-homeAddress"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">City</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="neu-input bg-gray-100"
                                placeholder="Jacksonville"
                                data-testid="input-city"
                              />
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
                            <FormLabel className="font-bold">State</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="neu-input bg-gray-100"
                                placeholder="FL"
                                maxLength={2}
                                data-testid="input-state"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">Zip Code</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="neu-input bg-gray-100"
                                placeholder="32256"
                                data-testid="input-zipCode"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Service Details */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Service Details
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="numberOfDogs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">Number of Dogs</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <FormControl>
                                <SelectTrigger className="neu-input bg-gray-100" data-testid="select-numberOfDogs">
                                  <SelectValue placeholder="Select number of dogs" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">1 Dog</SelectItem>
                                <SelectItem value="2">2 Dogs</SelectItem>
                                <SelectItem value="3">3 Dogs</SelectItem>
                                <SelectItem value="4">4 Dogs</SelectItem>
                                <SelectItem value="5">5 Dogs</SelectItem>
                                <SelectItem value="6">6 Dogs</SelectItem>
                                <SelectItem value="7">7 Dogs</SelectItem>
                                <SelectItem value="8">8 Dogs</SelectItem>
                                <SelectItem value="9">9 Dogs</SelectItem>
                                <SelectItem value="10">10 Dogs</SelectItem>
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
                            <FormLabel className="font-bold">Service Frequency</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="neu-input bg-gray-100" data-testid="select-serviceFrequency">
                                  <SelectValue placeholder="How often?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="once_a_week">Weekly (Recommended)</SelectItem>
                                <SelectItem value="every_two_weeks">Bi-Weekly</SelectItem>
                                <SelectItem value="once_a_month">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="lastCleanedTimeframe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">Last Professional Cleanup</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="neu-input bg-gray-100" data-testid="select-lastCleanedTimeframe">
                                  <SelectValue placeholder="When was it last cleaned?" />
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
                        name="notificationChannel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">Preferred Contact Method</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="neu-input bg-gray-100" data-testid="select-notificationChannel">
                                  <SelectValue placeholder="How should we contact you?" />
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
                    </div>

                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="initialCleanupRequired"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-initialCleanupRequired"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-bold">
                                Initial Deep Clean Required
                              </FormLabel>
                              <p className="text-sm text-gray-600">
                                Check this if your yard hasn't been cleaned recently and needs an initial deep clean before regular service.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Information */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Information
                    </h3>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-blue-600 mr-2" />
                        <p className="text-blue-800 text-sm">
                          Your payment information is securely processed through our integrated payment system. Your card will be charged automatically based on your service frequency.
                        </p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="nameOnCard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Name on Card</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="neu-input bg-gray-100"
                              placeholder="John Doe"
                              data-testid="input-nameOnCard"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>Note:</strong> Credit card details will be securely collected through our payment processor during the final step of onboarding. We never store your payment information on our servers.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="howHeardAboutUs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">How did you hear about us? (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="neu-input bg-gray-100"
                              placeholder="Google, Facebook, friend recommendation, etc."
                              data-testid="input-howHeardAboutUs"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalComments"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel className="font-bold">Special Instructions or Comments (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="neu-input bg-gray-100 min-h-[100px]"
                              placeholder="Gate codes, special yard access instructions, aggressive dogs, fenced areas to avoid, etc."
                              data-testid="textarea-additionalComments"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="text-center pt-6">
                    <Button 
                      type="submit"
                      disabled={submitOnboardingMutation.isPending}
                      className="w-full md:w-auto neu-button bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 text-lg"
                      data-testid="button-submit"
                    >
                      {submitOnboardingMutation.isPending ? (
                        "Setting Up Your Service..."
                      ) : (
                        <>
                          <DollarSign className="w-5 h-5 mr-2" />
                          Complete Onboarding & Set Up Service
                        </>
                      )}
                    </Button>
                    
                    <p className="text-sm text-gray-600 mt-4">
                      By clicking submit, you agree to our terms of service and authorize us to charge your payment method for the agreed-upon services.
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Trust Footer */}
        <section className="text-center mt-16">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-black text-green-800 mb-4">
              <Shield className="w-6 h-6 inline mr-2" />
              100% Satisfaction Guaranteed
            </h3>
            <p className="text-green-700 mb-4">
              We're so confident you'll love our service that if you're not completely satisfied after your first cleanup, we'll refund your money and clean it again for free.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-green-600">
              <span>✓ Licensed & Insured</span>
              <span>✓ Local Jacksonville Business</span>
              <span>✓ Eco-Friendly Products</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}