import { Link } from "wouter";
import { ArrowLeft, Package, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

export default function Subscription() {
  const { user } = useAuth();
  
  const { data: subscriptionData, isLoading } = useQuery<any>({
    queryKey: ['/api/customer/subscription'],
    enabled: !!user,
  });

  const planDetails = {
    weekly: { name: "Weekly", price: "$110/month", frequency: "Once per week" },
    biweekly: { name: "Bi-weekly", price: "$90/month", frequency: "Every two weeks" },
    twice_weekly: { name: "Twice Weekly", price: "$136/month", frequency: "Twice per week" }
  };

  const plan = subscriptionData?.subscription?.plan || '';
  const details = planDetails[plan as keyof typeof planDetails] || { name: plan, price: "Contact us", frequency: "Custom" };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-6 w-6 text-orange-600" />
              My Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading subscription details...</p>
              </div>
            ) : subscriptionData?.hasSubscription ? (
              <div className="space-y-6">
                {/* Plan Details */}
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{details.name} Plan</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service Frequency:</span>
                      <span className="font-semibold text-gray-900">{details.frequency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly Price:</span>
                      <span className="font-semibold text-gray-900">{details.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Number of Dogs:</span>
                      <span className="font-semibold text-gray-900">{subscriptionData.customer?.numberOfDogs || subscriptionData.subscription?.dogCount}</span>
                    </div>
                    {(subscriptionData.customer?.numberOfDogs > 1 || subscriptionData.subscription?.dogCount > 1) && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Extra Dog Fee:</span>
                        <span className="font-semibold text-gray-900">+${((subscriptionData.customer?.numberOfDogs || subscriptionData.subscription?.dogCount) - 1) * 20}/month</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-orange-200">
                      <span className="text-gray-600">Status:</span>
                      <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                        <Check className="h-4 w-4" />
                        {subscriptionData.subscription?.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Service Address */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Service Address</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      {subscriptionData.customer?.address}<br />
                      {subscriptionData.customer?.city}, {subscriptionData.customer?.state} {subscriptionData.customer?.zipCode}
                    </p>
                  </div>
                </div>

                {/* What's Included */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">What's Included</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Professional pet waste removal {details.frequency.toLowerCase()}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">All waste properly bagged and disposed of</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Yard deodorizer spray included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Service notification alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Gate code access available</span>
                    </li>
                  </ul>
                </div>

                {/* Manage Subscription */}
                <div className="pt-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Need to make changes to your subscription? Contact us for assistance.
                  </p>
                  <Link href="/contact">
                    <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  You don't have an active subscription yet.
                </p>
                <Link href="/onboard">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    Choose a Plan
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
