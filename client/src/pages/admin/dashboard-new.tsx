import { Link } from "wouter";
import { Users, Calendar, DollarSign, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dook Scoop 'Em CRM
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Customers"
            value="0"
            icon={<Users className="h-6 w-6" />}
            testId="stat-total-customers"
          />
          <StatCard
            title="Today's Visits"
            value="0"
            icon={<Calendar className="h-6 w-6" />}
            testId="stat-todays-visits"
          />
          <StatCard
            title="Monthly Revenue"
            value="$0"
            icon={<DollarSign className="h-6 w-6" />}
            testId="stat-monthly-revenue"
          />
          <StatCard
            title="Active Subscriptions"
            value="0"
            icon={<Users className="h-6 w-6" />}
            testId="stat-active-subs"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <AdminCard
            icon={<Users className="h-6 w-6" />}
            title="Customers"
            description="View and manage all customers"
            href="/admin/customers"
            testId="link-customers"
          />
          <AdminCard
            icon={<Calendar className="h-6 w-6" />}
            title="Schedule"
            description="Manage service visits and routes"
            href="/admin/schedule"
            testId="link-schedule"
          />
          <AdminCard
            icon={<Settings className="h-6 w-6" />}
            title="Settings"
            description="Configure business settings"
            href="/admin/settings"
            testId="link-settings"
          />
        </div>

        {/* Welcome Message */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm" data-testid="admin-welcome">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Your CRM
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your customers, schedule service visits, and track your business performance.
          </p>
        </div>
      </main>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  testId: string;
}

function StatCard({ title, value, icon, testId }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm" data-testid={testId}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className="text-orange-600">{icon}</div>
      </div>
    </div>
  );
}

interface AdminCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  testId: string;
}

function AdminCard({ icon, title, description, href, testId }: AdminCardProps) {
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
