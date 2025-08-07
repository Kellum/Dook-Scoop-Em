import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertWaitlistSubmissionSchema, type InsertWaitlistSubmission } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2 } from "lucide-react";

export default function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertWaitlistSubmission>({
    resolver: zodResolver(insertWaitlistSubmissionSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
      numberOfDogs: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertWaitlistSubmission) => {
      const response = await apiRequest("POST", "/api/waitlist", data);
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Success!",
        description: "Thanks for joining our waitlist! We'll be in touch soon.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertWaitlistSubmission) => {
    submitMutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-white text-xl w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-dark mb-2">Thanks for joining our waitlist!</h3>
          <p className="text-gray-600">We'll be in touch soon with updates about our launch in your area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-dark">
                    Full Name *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your full name" 
                      {...field}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-dark">
                    Email Address *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="your@email.com" 
                      {...field}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-dark">
                  Service Address *
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your full address" 
                    {...field}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-dark">
                    Phone Number *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="tel"
                      placeholder="(555) 123-4567" 
                      {...field}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
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
                  <FormLabel className="block text-sm font-medium text-dark">
                    Number of Dogs *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors">
                        <SelectValue placeholder="Select number of dogs" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 Dog</SelectItem>
                      <SelectItem value="2">2 Dogs</SelectItem>
                      <SelectItem value="3">3 Dogs</SelectItem>
                      <SelectItem value="4">4 Dogs</SelectItem>
                      <SelectItem value="5+">5+ Dogs</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={submitMutation.isPending}
              className="w-full bg-primary text-white px-8 py-4 rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Join Waitlist"
              )}
            </Button>
          </div>

          <p className="text-sm text-gray-600 text-center">
            * Required fields. We respect your privacy and won't share your information.
          </p>
        </form>
      </Form>
    </div>
  );
}
