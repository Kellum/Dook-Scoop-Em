import { Link, useLocation } from "wouter";
import { Package, Calendar, CreditCard, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CustomerDashboard() {
  const { user, signOut } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    
    if (sessionId) {
      setLoading(true);
      fetch('/api/stripe/complete-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            toast({
              title: "Success!",
              description: "Your subscription is now active!",
            });
            // Remove session_id from URL
            window.history.replaceState({}, '', '/dashboard');
          }
        })
        .catch(error => {
          console.error('Error completing checkout:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [location, toast]);

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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Getting Started
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Welcome to your Dook Scoop 'Em dashboard! Here you can manage your subscription,
            view your service schedule, and update your account preferences.
          </p>
          {!user?.user_metadata?.hasSubscription && (
            <Link href="/pricing">
              <a className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors" data-testid="button-get-started">
                Get Started - Choose Your Plan
              </a>
            </Link>
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
      <a 
        className="block bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
        data-testid={testId}
      >
        <div className="flex items-center mb-3">
          <div className="text-orange-600">{icon}</div>
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </a>
    </Link>
  );
}
