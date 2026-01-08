import { Link, useLocation } from "wouter";
import { Package, Calendar, CreditCard, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function CustomerDashboard() {
  const { user, signOut } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const { data: subscriptionData, refetch } = useQuery({
    queryKey: ['/api/customer/subscription'],
    enabled: !!user,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (sessionId) {
      // Just came back from Stripe checkout - webhook will create the record
      window.history.replaceState({}, '', '/dashboard');

      toast({
        title: "Payment Successful!",
        description: "Your subscription is being activated...",
      });

      // Poll for subscription data (webhook creates it within a few seconds)
      setLoading(true);
      let pollCount = 0;

      const pollInterval = setInterval(() => {
        pollCount++;
        refetch().then((result) => {
          if (result.data?.hasSubscription) {
            clearInterval(pollInterval);
            setLoading(false);
            setSyncing(false);
            toast({
              title: "Success!",
              description: "Your subscription is now active!",
            });
          }
        });
      }, 2000); // Check every 2 seconds

      // After 10 seconds (5 polls), try fallback endpoint
      const fallbackTimeout = setTimeout(async () => {
        setSyncing(true);
        toast({
          title: "Syncing your account...",
          description: "This may take a moment for promotional discounts.",
        });

        try {
          const response = await fetch('/api/stripe/complete-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ sessionId }),
          });

          if (response.ok) {
            // Subscription created, refetch will pick it up
            refetch();
          }
        } catch (error) {
          console.error('Fallback endpoint error:', error);
        }
      }, 10000);

      // Stop polling after 30 seconds
      const timeout = setTimeout(() => {
        clearInterval(pollInterval);
        setLoading(false);
        setSyncing(false);
        toast({
          title: "Taking longer than expected",
          description: "Please refresh the page in a moment.",
        });
      }, 30000);

      return () => {
        clearInterval(pollInterval);
        clearTimeout(fallbackTimeout);
        clearTimeout(timeout);
      };
    }
  }, [location, toast, refetch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                Dook Scoop 'Em
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user?.user_metadata?.name || user?.email}!
              </p>
            </div>
            <Button variant="ghost" onClick={() => signOut()} data-testid="button-signout">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Syncing Banner */}
      {(loading || syncing) && !subscriptionData?.hasSubscription && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <div className="text-center">
                <p className="text-lg font-bold">
                  {syncing ? "We see you have a discount! Awesome!" : "Setting up your account..."}
                </p>
                <p className="text-sm">
                  Please wait while we sync your subscription. This will only take a moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardCard
            icon={<Package className="h-6 w-6" />}
            title="My Plan"
            description="View and manage your subscription"
            href="/dashboard/subscription"
            testId="link-subscription"
          />
          <DashboardCard
            icon={<Calendar className="h-6 w-6" />}
            title="Schedule"
            description="See upcoming service visits"
            href="/dashboard/schedule"
            testId="link-schedule"
          />
          <DashboardCard
            icon={<CreditCard className="h-6 w-6" />}
            title="Billing"
            description="View invoices and payments"
            href="/dashboard/billing"
            testId="link-billing"
          />
          <DashboardCard
            icon={<Settings className="h-6 w-6" />}
            title="Settings"
            description="Update your preferences"
            href="/dashboard/settings"
            testId="link-settings"
          />
        </div>

        {/* Welcome / Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm" data-testid="welcome-message">
          {subscriptionData?.hasSubscription ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Your Active Subscription
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Plan:</span> {subscriptionData.subscription?.plan?.replace('_', ' ').toUpperCase()}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Number of Dogs:</span> {subscriptionData.customer?.numberOfDogs || subscriptionData.subscription?.dogCount}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Status:</span> <span className="text-green-600 font-semibold">{subscriptionData.subscription?.status?.toUpperCase()}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Service Address:</span> {subscriptionData.customer?.address}, {subscriptionData.customer?.city}, {subscriptionData.customer?.state} {subscriptionData.customer?.zipCode}
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Getting Started
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Welcome to your Dook Scoop 'Em dashboard! Here you can manage your subscription,
                view your service schedule, and update your account preferences.
              </p>
              <Link href="/onboard">
                <a className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors" data-testid="button-get-started">
                  Get Started - Choose Your Plan
                </a>
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  testId: string;
}

function DashboardCard({ icon, title, description, href, testId }: DashboardCardProps) {
  return (
    <Link href={href}>
      <div
        className="block bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 cursor-pointer"
        data-testid={testId}
      >
        <div className="flex items-center mb-3">
          <div className="text-orange-600">{icon}</div>
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </Link>
  );
}
