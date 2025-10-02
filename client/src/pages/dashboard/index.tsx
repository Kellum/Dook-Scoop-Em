import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "wouter";
import { Package, Calendar, CreditCard, Settings } from "lucide-react";

export default function CustomerDashboard() {
  const { user } = useUser();

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
                Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
              </p>
            </div>
            <UserButton afterSignOutUrl="/" />
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
          {!user?.publicMetadata?.hasSubscription && (
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
